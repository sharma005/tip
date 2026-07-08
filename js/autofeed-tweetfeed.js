/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: tweetfeed. Hand-updated via an interactive
   Claude session (WebSearch) — see lib/intel/schemas.mjs
   (TWEETFEED_SCHEMA) and lib/intel/contentTypes.mjs (cap 150) as the
   source of truth. Checks the accounts tracked in
   js/tweetfeed-accounts.js. Append new items deduped by id, drop the
   oldest by fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_TWEETFEED = [];
