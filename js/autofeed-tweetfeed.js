/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: tweetfeed. Hand-updated via an interactive
   Claude session (WebSearch) — see lib/intel/schemas.mjs
   (TWEETFEED_SCHEMA) and lib/intel/contentTypes.mjs (cap 150) as the
   source of truth. Checks the accounts tracked in
   js/tweetfeed-accounts.js. Append new items deduped by id, drop the
   oldest by fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_TWEETFEED = [
  {
    "id": "auto-tweet-huntio-2034329120398594201",
    "username": "Huntio",
    "url": "https://x.com/Huntio/status/2034329120398594201",
    "date": "2026-07-03",
    "text": "🚀 Hunting C2 Infrastructure by Country with Hunt. Threat actors rely on C2 infrastructure to run their campaigns. Thanks to our C2 Infrastructure tool, analysts can quickly explore high-confidence malicious servers discovered through our global scanning. Results can be filtered.",
    "summary": "Hunt.io promotes country-level filtering of high-confidence malicious C2 servers from its global scanning — useful for analysts building geo-targeted blocklists and infrastructure hunts.",
    "severity": "Medium",
    "tags": [
      "huntio",
      "c2",
      "infrastructure",
      "hunting"
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  }
];
