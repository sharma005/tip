/* ═══════════════════════════════════════════════════════════════════
   TIP — Wires each content type's schema/prompt/sanitizer/output name
   into one config that scripts/fetch-intel.mjs iterates over, so it
   doesn't have to hand-roll the per-type plumbing.
   ═══════════════════════════════════════════════════════════════════ */

import { fileURLToPath } from 'node:url';
import { fetchContent } from './fetchContent.mjs';
import {
  FEED_SCHEMA, sanitizeFeedItem, stableFeedId,
  HYPOTHESIS_SCHEMA, sanitizeHypothesis, stableHypothesisId,
  ADVERSARY_SCHEMA, sanitizeAdversary, stableAdversaryId,
  DARKWEB_SCHEMA, sanitizeDarkwebItem, stableDarkwebId,
  CONNECTOR_SCHEMA, sanitizeConnectorIntel, stableConnectorId,
  TWEETFEED_SCHEMA, sanitizeTweetfeedItem, stableTweetfeedId,
} from './schemas.mjs';
import {
  FEED_SYSTEM_PROMPT, HYPOTHESIS_SYSTEM_PROMPT, ADVERSARY_SYSTEM_PROMPT, DARKWEB_SYSTEM_PROMPT, CONNECTOR_SYSTEM_PROMPT, TWEETFEED_SYSTEM_PROMPT,
} from './prompts.mjs';
import { readTrackedAccounts } from './pool.mjs';

const TWEETFEED_ACCOUNTS_PATH = fileURLToPath(new URL('../../js/tweetfeed-accounts.js', import.meta.url));

// Built fresh on every run (not a static string like the other content
// types') so a newly admin-added account is picked up without a code
// change. Returns null — meaning "skip this content type, don't even call
// Claude" — when there's nothing to check.
function buildTweetfeedUserPrompt() {
  const accounts = readTrackedAccounts(TWEETFEED_ACCOUNTS_PATH, ['Huntio']);
  if (!accounts.length) return null;
  return `Check these X/Twitter accounts for real posts from the last 7 days: ${accounts.join(', ')}. Only report posts discussing cybersecurity threats, research, advisories, vulnerabilities, or intel — skip unrelated posts.`;
}

export const CONTENT_TYPES = [
  {
    key: 'feed',
    label: 'feed',
    schema: FEED_SCHEMA,
    systemPrompt: FEED_SYSTEM_PROMPT,
    userPrompt: 'Research and report the most significant ongoing cyber threats right now.',
    sanitize: sanitizeFeedItem,
    stableId: stableFeedId,
    globalVar: 'TIP_AUTOFEED',
    fileName: 'autofeed.js',
    maxPoolSize: 200,
  },
  {
    key: 'hypothesis',
    label: 'hunt-lab',
    schema: HYPOTHESIS_SCHEMA,
    systemPrompt: HYPOTHESIS_SYSTEM_PROMPT,
    userPrompt: 'Research recent real attack campaigns and produce hunting hypotheses for them.',
    sanitize: sanitizeHypothesis,
    stableId: stableHypothesisId,
    globalVar: 'TIP_AUTOFEED_HUNTLAB',
    fileName: 'autofeed-huntlab.js',
    maxPoolSize: 80,
  },
  {
    key: 'adversary',
    label: 'adversary',
    schema: ADVERSARY_SCHEMA,
    systemPrompt: ADVERSARY_SYSTEM_PROMPT,
    userPrompt: 'Research threat actors with real, recently reported activity or attribution.',
    sanitize: sanitizeAdversary,
    stableId: stableAdversaryId,
    globalVar: 'TIP_AUTOFEED_ADVERSARY',
    fileName: 'autofeed-adversary.js',
    maxPoolSize: 60,
  },
  {
    key: 'darkweb',
    label: 'darkweb',
    schema: DARKWEB_SCHEMA,
    systemPrompt: DARKWEB_SYSTEM_PROMPT,
    userPrompt: 'Research recently reported dark web / underground forum activity.',
    sanitize: sanitizeDarkwebItem,
    stableId: stableDarkwebId,
    globalVar: 'TIP_AUTOFEED_DARKWEB',
    fileName: 'autofeed-darkweb.js',
    maxPoolSize: 80,
  },
  {
    key: 'connector',
    label: 'connectors',
    schema: CONNECTOR_SCHEMA,
    systemPrompt: CONNECTOR_SYSTEM_PROMPT,
    userPrompt: 'Research recent threat intelligence activity discussed across open-source threat-intel community platforms (MISP, OTX, Pulsedive, YETI, Cortex).',
    sanitize: sanitizeConnectorIntel,
    stableId: stableConnectorId,
    globalVar: 'TIP_AUTOFEED_CONNECTORS',
    fileName: 'autofeed-connectors.js',
    maxPoolSize: 100,
  },
  {
    key: 'tweetfeed',
    label: 'tweetfeed',
    schema: TWEETFEED_SCHEMA,
    systemPrompt: TWEETFEED_SYSTEM_PROMPT,
    userPrompt: buildTweetfeedUserPrompt,
    sanitize: sanitizeTweetfeedItem,
    stableId: stableTweetfeedId,
    globalVar: 'TIP_AUTOFEED_TWEETFEED',
    fileName: 'autofeed-tweetfeed.js',
    maxPoolSize: 150,
  },
];

// Runs one content type end-to-end: Claude + web_search -> sanitize -> stamp id/fetchedAt.
// `model` lets callers route retries to a different model (e.g. to work
// around a model-specific 529 overload) without touching this function.
export async function runContentType(client, type, model) {
  // tweetfeed's userPrompt is a function of the current tracked-account
  // list rather than a fixed string (see buildTweetfeedUserPrompt above); a
  // null result means there's nothing to check this run, so skip the
  // Claude call entirely instead of asking it to search for nothing.
  const userPrompt = typeof type.userPrompt === 'function' ? type.userPrompt() : type.userPrompt;
  if (!userPrompt) {
    console.log(`[${type.label}] no tracked accounts/nothing to check — skipping this run.`);
    return [];
  }

  const { items } = await fetchContent(client, {
    label: type.label,
    schema: type.schema,
    systemPrompt: type.systemPrompt,
    userPrompt,
    model,
  });
  const sanitized = items.map(type.sanitize).filter(Boolean);
  if (sanitized.length < items.length) {
    console.warn(`[${type.label}] dropped ${items.length - sanitized.length} item(s) that failed validation.`);
  }
  const now = new Date().toISOString();
  return sanitized.map((item) => ({ id: type.stableId(item), ...item, fetchedAt: now }));
}

export function renderAutofeedFile(type, records) {
  return `/* ═══════════════════════════════════════════════════════════════════
   Auto-generated by the TIP fetch-intel pipeline on a 6-hour schedule.
   Do not hand-edit — changes are overwritten on the next run.
   Content type: ${type.key}
   Last run: ${new Date().toISOString()}
   ═══════════════════════════════════════════════════════════════════ */
const ${type.globalVar} = ${JSON.stringify(records, null, 2)};
`;
}
