/* ═══════════════════════════════════════════════════════════════════
   TIP — Shared JSON schemas + sanitizers for the auto-fetch pipeline.
   Used by scripts/fetch-intel.mjs, run on a schedule via GitHub Actions
   (.github/workflows/fetch-intel.yml). Keep in sync with the
   client-side re-validation in js/data.js (_sanitizeAutoFetched*) —
   that's a separate trust boundary and intentionally duplicates these
   checks rather than trusting this output blindly.
   ═══════════════════════════════════════════════════════════════════ */

export const CATEGORIES = ['kev', 'zeroday', 'supplychain', 'ransomware', 'rce', 'darkweb'];
export const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];
export const PRIORITIES = ['P1', 'P2', 'P3', 'P4'];
export const ADVERSARY_TYPES = ['apt', 'criminal', 'hacktivist'];
export const DARKWEB_TYPES = ['leak', 'credential', 'exploit', 'ransomware', 'chatter'];
export const CONNECTOR_KEYS = ['misp', 'otx', 'pulsedive', 'yeti', 'cortex'];

const CVE_RE = /^CVE-\d{4}-\d{4,7}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TAG_RE = /^[\w.-]{1,32}$/;

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

const today = () => new Date().toISOString().slice(0, 10);
const cleanStr = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
const cleanArr = (v, re, max) => (Array.isArray(v) ? v.filter((t) => typeof t === 'string' && (!re || re.test(t))).slice(0, max) : []);

/* ── Feed items ── */

export const FEED_SCHEMA = {
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

export function stableFeedId(item) {
  return item.cve ? `auto-${item.cve.toLowerCase()}` : `auto-${slugify(item.title)}`;
}

export function sanitizeFeedItem(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (!CATEGORIES.includes(raw.category)) return null;
  if (!SEVERITIES.includes(raw.severity)) return null;
  if (typeof raw.url !== 'string' || !/^https?:\/\//i.test(raw.url.trim())) return null;
  const title = cleanStr(raw.title, 200);
  const summary = cleanStr(raw.summary, 800);
  if (!title || !summary) return null;

  const cve = typeof raw.cve === 'string' && CVE_RE.test(raw.cve.trim()) ? raw.cve.trim().toUpperCase() : null;
  const cvss = typeof raw.cvss === 'number' && raw.cvss >= 0 && raw.cvss <= 10 ? raw.cvss : null;
  const date = typeof raw.date === 'string' && DATE_RE.test(raw.date.trim()) ? raw.date.trim() : today();
  const actor = cleanStr(raw.actor, 120);
  const tags = cleanArr(raw.tags, TAG_RE, 8);

  return {
    title,
    category: raw.category,
    severity: raw.severity,
    cve,
    cvss,
    date,
    actor,
    source: cleanStr(raw.source, 100) || 'Unknown',
    url: raw.url.trim(),
    summary,
    tags,
  };
}

/* ── Hunt Lab hypotheses ── */

export const HYPOTHESIS_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string', description: '2-4 sentences describing what to hunt for and why, tied to a real recent campaign' },
          mitreTactic: { type: 'string', description: "MITRE ATT&CK tactic name, e.g. 'Initial Access'" },
          mitreTechnique: { type: 'string', description: "MITRE ATT&CK technique id + name, e.g. 'T1190 - Exploit Public-Facing Application'" },
          dataSources: { type: 'array', items: { type: 'string' }, description: "e.g. 'EDR Logs', 'DNS Logs', 'Web Proxy Logs'" },
          priority: { type: 'string', enum: PRIORITIES },
          linkedAdversaryName: { type: ['string', 'null'], description: 'Name of a known threat actor this hypothesis relates to, if any, otherwise null' },
          linkedFeedItemRef: { type: ['string', 'null'], description: 'A CVE ID or short title fragment this hypothesis relates to, if any, otherwise null' },
          queries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                query: { type: 'string', description: 'A DataPrime query in the house style (see system prompt)' },
              },
              required: ['name', 'query'],
              additionalProperties: false,
            },
          },
        },
        required: ['title', 'description', 'mitreTactic', 'mitreTechnique', 'dataSources', 'priority', 'linkedAdversaryName', 'linkedFeedItemRef', 'queries'],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
};

export function stableHypothesisId(item) {
  return `auto-hypo-${slugify(item.title)}`;
}

export function sanitizeHypothesis(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const title = cleanStr(raw.title, 200);
  const description = cleanStr(raw.description, 800);
  const mitreTactic = cleanStr(raw.mitreTactic, 80);
  const mitreTechnique = cleanStr(raw.mitreTechnique, 120);
  if (!title || !description || !mitreTactic || !mitreTechnique) return null;
  if (!PRIORITIES.includes(raw.priority)) return null;

  const dataSources = cleanArr(raw.dataSources, null, 6).map((s) => s.slice(0, 60));
  const queries = (Array.isArray(raw.queries) ? raw.queries : [])
    .filter((q) => q && typeof q.name === 'string' && q.name.trim() && typeof q.query === 'string' && q.query.trim())
    .slice(0, 3)
    .map((q) => ({ name: q.name.trim().slice(0, 100), query: q.query.trim().slice(0, 2000) }));

  return {
    title,
    description,
    mitreTactic,
    mitreTechnique,
    dataSources,
    priority: raw.priority,
    status: 'active',
    linkedAdversaryName: cleanStr(raw.linkedAdversaryName, 120),
    linkedFeedItemRef: cleanStr(raw.linkedFeedItemRef, 120),
    queries,
  };
}

/* ── Adversary profiles ── */

export const ADVERSARY_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          aliases: { type: 'array', items: { type: 'string' } },
          type: { type: 'string', enum: ADVERSARY_TYPES },
          origin: { type: 'string', description: "Country/region if attributed, otherwise 'Unknown'" },
          motivation: { type: 'string', description: "e.g. 'Financial', 'Espionage', 'Hacktivism'" },
          sectors: { type: 'array', items: { type: 'string' } },
          ttps: { type: 'array', items: { type: 'string' }, description: 'MITRE ATT&CK technique IDs, e.g. T1190' },
          campaigns: { type: 'array', items: { type: 'string' } },
          iocs: { type: 'array', items: { type: 'string' } },
          notes: { type: 'string', description: '2-4 sentences, analyst-facing' },
        },
        required: ['name', 'aliases', 'type', 'origin', 'motivation', 'sectors', 'ttps', 'campaigns', 'iocs', 'notes'],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
};

export function stableAdversaryId(item) {
  return `auto-adv-${slugify(item.name)}`;
}

const TTP_RE = /^T\d{4}(\.\d{3})?$/i;

export function sanitizeAdversary(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = cleanStr(raw.name, 120);
  const notes = cleanStr(raw.notes, 800);
  if (!name || !notes) return null;
  if (!ADVERSARY_TYPES.includes(raw.type)) return null;

  return {
    name,
    aliases: cleanArr(raw.aliases, null, 8).map((s) => s.slice(0, 60)),
    type: raw.type,
    origin: cleanStr(raw.origin, 60) || 'Unknown',
    motivation: cleanStr(raw.motivation, 60) || 'Unknown',
    sectors: cleanArr(raw.sectors, null, 10).map((s) => s.slice(0, 60)),
    ttps: cleanArr(raw.ttps, TTP_RE, 15).map((s) => s.toUpperCase()),
    campaigns: cleanArr(raw.campaigns, null, 10).map((s) => s.slice(0, 150)),
    iocs: cleanArr(raw.iocs, null, 20).map((s) => s.slice(0, 120)),
    notes,
    active: true,
  };
}

/* ── Dark web items ── */

export const DARKWEB_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          type: { type: 'string', enum: DARKWEB_TYPES },
          source: { type: 'string', description: "Forum/market name, e.g. 'BreachForums v3', 'Russian Market'" },
          date: { type: 'string', description: 'YYYY-MM-DD' },
          snippet: { type: 'string', description: '1-3 sentences describing the listing/post' },
          relevance: { type: 'number', description: '0-100 analyst relevance score' },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['title', 'type', 'source', 'date', 'snippet', 'relevance', 'tags'],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
};

export function stableDarkwebId(item) {
  return `auto-dw-${slugify(item.title)}`;
}

export function sanitizeDarkwebItem(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (!DARKWEB_TYPES.includes(raw.type)) return null;
  const title = cleanStr(raw.title, 200);
  const snippet = cleanStr(raw.snippet, 600);
  if (!title || !snippet) return null;

  const relevance = typeof raw.relevance === 'number' ? Math.max(0, Math.min(100, Math.round(raw.relevance))) : 50;
  const date = typeof raw.date === 'string' && DATE_RE.test(raw.date.trim()) ? raw.date.trim() : today();

  return {
    title,
    type: raw.type,
    source: cleanStr(raw.source, 100) || 'Unknown',
    date,
    snippet,
    relevance,
    flagged: false,
    tags: cleanArr(raw.tags, TAG_RE, 8),
  };
}

/* ── Connector intel (MISP, OTX, Pulsedive, YETI, Cortex) ── */

export const CONNECTOR_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          connector: { type: 'string', enum: CONNECTOR_KEYS, description: 'Which community/platform this intel is most associated with' },
          title: { type: 'string' },
          date: { type: 'string', description: 'YYYY-MM-DD' },
          severity: { type: 'string', enum: SEVERITIES },
          summary: { type: 'string', description: '2-3 sentences, analyst-facing' },
          tags: { type: 'array', items: { type: 'string' } },
          iocs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', description: "e.g. 'IP', 'Domain', 'Hash', 'URL'" },
                value: { type: 'string' },
              },
              required: ['type', 'value'],
              additionalProperties: false,
            },
          },
        },
        required: ['connector', 'title', 'date', 'severity', 'summary', 'tags', 'iocs'],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
};

export function stableConnectorId(item) {
  return `auto-conn-${item.connector}-${slugify(item.title)}`;
}

const IOC_TYPE_RE = /^[\w.\- ]{1,40}$/;

export function sanitizeConnectorIntel(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (!CONNECTOR_KEYS.includes(raw.connector)) return null;
  if (!SEVERITIES.includes(raw.severity)) return null;
  const title = cleanStr(raw.title, 200);
  const summary = cleanStr(raw.summary, 600);
  if (!title || !summary) return null;

  const date = typeof raw.date === 'string' && DATE_RE.test(raw.date.trim()) ? raw.date.trim() : today();
  const tags = cleanArr(raw.tags, TAG_RE, 8);
  const iocs = Array.isArray(raw.iocs)
    ? raw.iocs
      .filter((i) => i && typeof i.type === 'string' && IOC_TYPE_RE.test(i.type.trim()) && typeof i.value === 'string' && i.value.trim())
      .slice(0, 10)
      .map((i) => ({ type: i.type.trim().slice(0, 40), value: i.value.trim().slice(0, 200) }))
    : [];

  return {
    connector: raw.connector,
    title,
    date,
    severity: raw.severity,
    summary,
    tags,
    iocs,
  };
}

/* ── Tweetfeed (tracked Twitter/X accounts) ── */

export const TWEETFEED_HANDLE_RE = /^\w{1,15}$/;
export const TWEETFEED_URL_RE = /^https:\/\/(x|twitter)\.com\/\w{1,15}\/status\/\d+/i;

export const TWEETFEED_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          username: { type: 'string', description: 'Handle without the @, exactly matching one of the accounts you were asked to check' },
          url: { type: 'string', description: 'Real, working x.com or twitter.com status permalink you found via web search' },
          date: { type: 'string', description: 'YYYY-MM-DD — when the post was made' },
          text: { type: 'string', description: "The post's actual wording as found, not a paraphrase" },
          summary: { type: 'string', description: '1-2 sentences, analyst-facing paraphrase of why this matters' },
          severity: { type: 'string', enum: SEVERITIES },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['username', 'url', 'date', 'text', 'summary', 'severity', 'tags'],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
};

export function stableTweetfeedId(item) {
  const statusId = item.url.match(/status\/(\d+)/)?.[1];
  return `auto-tweet-${slugify(item.username)}-${statusId || slugify(item.text)}`;
}

export function sanitizeTweetfeedItem(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.username !== 'string' || !TWEETFEED_HANDLE_RE.test(raw.username.trim())) return null;
  if (typeof raw.url !== 'string' || !TWEETFEED_URL_RE.test(raw.url.trim())) return null;
  if (!SEVERITIES.includes(raw.severity)) return null;
  const text = cleanStr(raw.text, 500);
  const summary = cleanStr(raw.summary, 300);
  if (!text || !summary) return null;

  const date = typeof raw.date === 'string' && DATE_RE.test(raw.date.trim()) ? raw.date.trim() : today();
  const tags = cleanArr(raw.tags, TAG_RE, 6);

  return {
    username: raw.username.trim(),
    url: raw.url.trim(),
    date,
    text,
    summary,
    severity: raw.severity,
    tags,
  };
}
