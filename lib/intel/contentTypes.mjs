/* ═══════════════════════════════════════════════════════════════════
   TIP — Reference spec for each content type's schema/prompt/sanitizer/
   output name. Originally consumed by an automated fetch script (now
   removed); content is now researched and written by hand in an
   interactive Claude session ("Claude cowork") using the WebSearch tool.
   Re-read this file — plus schemas.mjs and prompts.mjs — as the source
   of truth for field names, output filenames, and pool caps before
   writing/updating any js/autofeed*.js file.
   ═══════════════════════════════════════════════════════════════════ */

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
    // Check the accounts tracked in js/tweetfeed-accounts.js — if that
    // list is empty, skip this content type this round.
    userPrompt: 'Check the accounts listed in js/tweetfeed-accounts.js for real posts from the last 7 days discussing cybersecurity threats, research, advisories, vulnerabilities, or intel. Only report posts you can verify with a real x.com/twitter.com status URL and real wording — skip unrelated posts and anything unverifiable.',
    sanitize: sanitizeTweetfeedItem,
    stableId: stableTweetfeedId,
    globalVar: 'TIP_AUTOFEED_TWEETFEED',
    fileName: 'autofeed-tweetfeed.js',
    maxPoolSize: 150,
  },
];
