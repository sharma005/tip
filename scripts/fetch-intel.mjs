#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   TIP — Automated threat intel fetch (runs 4x/day via GitHub Actions)

   Calls Claude with the web_search tool to research real, current
   cyber threats, forces strict JSON output, then regenerates
   js/autofeed.js wholesale. DataManager.mergeAutoFetched() (data.js)
   merges new items into the live pendingItems queue on page load —
   everything still goes through the existing admin approval flow.
   ═══════════════════════════════════════════════════════════════════ */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ANTHROPIC_API_KEY is not set. In CI, set it as a GitHub Actions secret; locally, put it in .env and source it.');
  process.exit(1);
}

const client = new Anthropic({ apiKey });

const CATEGORIES = ['kev', 'zeroday', 'supplychain', 'ransomware', 'rce', 'darkweb'];
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];

const FEED_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          category: { type: 'string', enum: CATEGORIES },
          severity: { type: 'string', enum: SEVERITIES },
          cve: { type: ['string', 'null'], description: 'Real CVE ID if one exists, otherwise null. Never invent one.' },
          cvss: { type: ['number', 'null'] },
          date: { type: 'string', description: 'YYYY-MM-DD — when this was disclosed/confirmed' },
          actor: { type: ['string', 'null'], description: 'Named threat actor/group if attributed, otherwise null' },
          source: { type: 'string', description: "Publisher name, e.g. 'CISA', 'The Hacker News', 'Rapid7'" },
          url: { type: 'string', description: 'Direct URL to the real source article/advisory found via web search' },
          summary: { type: 'string', description: '2-4 sentences, analyst-facing' },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['title', 'category', 'severity', 'cve', 'cvss', 'date', 'actor', 'source', 'url', 'summary', 'tags'],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You are a threat-intelligence curator for a security dashboard. Search the web for real, currently ongoing or very recent (last 48 hours) cybersecurity threats: CISA KEV additions, actively exploited zero-days, major ransomware campaigns, supply-chain compromises, and critical unauthenticated RCEs.

Hard rules:
- Only include items you actually found via web search, each with a real, working source URL from a reputable outlet (CISA, a named vendor advisory, or a major security news outlet).
- Never invent a CVE ID, CVSS score, date, or URL. If a detail isn't confirmed by your search results, set it to null rather than guessing.
- If you cannot verify an item is real, omit it entirely — under-reporting is fine, fabricating is not.
- Return at most 8 items, most severe first.
- If nothing genuinely new turned up in the last 48 hours, return an empty items array. Do not pad with older or speculative items.`;

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

function stableId(item) {
  return item.cve ? `auto-${item.cve.toLowerCase()}` : `auto-${slugify(item.title)}`;
}

const CVE_RE = /^CVE-\d{4}-\d{4,7}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TAG_RE = /^[\w.-]{1,32}$/;

// Model output is text an LLM read from arbitrary web pages while searching —
// validate/clamp every field before it's ever written to disk. Reject rather
// than repair fields we can't verify (a real threat item always has a real
// http(s) source URL; one without one is dropped, not "fixed").
function sanitizeItem(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (!CATEGORIES.includes(raw.category)) return null;
  if (!SEVERITIES.includes(raw.severity)) return null;
  if (typeof raw.url !== 'string' || !/^https?:\/\//i.test(raw.url.trim())) return null;
  if (typeof raw.title !== 'string' || !raw.title.trim()) return null;
  if (typeof raw.summary !== 'string' || !raw.summary.trim()) return null;

  const cve = typeof raw.cve === 'string' && CVE_RE.test(raw.cve.trim()) ? raw.cve.trim().toUpperCase() : null;
  const cvss = typeof raw.cvss === 'number' && raw.cvss >= 0 && raw.cvss <= 10 ? raw.cvss : null;
  const date = typeof raw.date === 'string' && DATE_RE.test(raw.date.trim()) ? raw.date.trim() : new Date().toISOString().slice(0, 10);
  const actor = typeof raw.actor === 'string' && raw.actor.trim() ? raw.actor.trim().slice(0, 120) : null;
  const tags = Array.isArray(raw.tags) ? raw.tags.filter((t) => typeof t === 'string' && TAG_RE.test(t)).slice(0, 8) : [];

  return {
    title: raw.title.trim().slice(0, 200),
    category: raw.category,
    severity: raw.severity,
    cve,
    cvss,
    date,
    actor,
    source: (typeof raw.source === 'string' && raw.source.trim() ? raw.source.trim() : 'Unknown').slice(0, 100),
    url: raw.url.trim(),
    summary: raw.summary.trim().slice(0, 800),
    tags,
  };
}

async function main() {
  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 8 }],
    output_config: { format: { type: 'json_schema', schema: FEED_SCHEMA } },
    messages: [
      { role: 'user', content: 'Research and report the most significant ongoing cyber threats right now.' },
    ],
  });

  if (response.stop_reason === 'refusal') {
    console.error('Request declined by safety classifiers — no update this run.');
    process.exit(0); // not a hard failure; just skip this cycle
  }

  const textBlocks = response.content.filter((b) => b.type === 'text');
  const finalText = textBlocks.at(-1)?.text;
  if (!finalText) {
    console.error('No text block in response:', JSON.stringify(response.content));
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(finalText);
  } catch (e) {
    console.error('Failed to parse model output as JSON:', finalText);
    process.exit(1);
  }

  const rawItems = Array.isArray(parsed.items) ? parsed.items : [];
  const sanitized = rawItems.map(sanitizeItem).filter(Boolean);
  if (sanitized.length < rawItems.length) {
    console.warn(`Dropped ${rawItems.length - sanitized.length} item(s) that failed validation (bad url/category/severity/etc).`);
  }

  const now = new Date().toISOString();
  const autoFeedItems = sanitized.map((item) => ({
    id: stableId(item),
    ...item,
    fetchedAt: now,
  }));

  const outPath = fileURLToPath(new URL('../js/autofeed.js', import.meta.url));
  const fileContents = `/* ═══════════════════════════════════════════════════════════════════
   Auto-generated by scripts/fetch-intel.mjs on a 6-hour schedule.
   Do not hand-edit — changes are overwritten on the next run.
   Last run: ${now}
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED = ${JSON.stringify(autoFeedItems, null, 2)};
`;

  writeFileSync(outPath, fileContents);
  console.log(`Wrote ${autoFeedItems.length} item(s) to js/autofeed.js`);
}

main().catch((err) => {
  console.error('fetch-intel failed:', err);
  process.exit(1);
});
