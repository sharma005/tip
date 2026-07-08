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
    "username": "Huntio",
    "url": "https://x.com/Huntio/status/2074539049918791911",
    "date": "2026-07-07",
    "text": "The Hunt.io MCP Server Is Now Live\n\nHunt 3.0 adds a remote MCP server at mcp.hunt[.]io, making it easier to connect AI tools directly to our databases.\n\nThe attached video shows ChatGPT 5.5 using Hunt data to dig into Kimsuky-linked infrastructure, pick a high-confidence IOC, enrich it, follow related host pivots, and summarize what it found.\n\nNo custom integration needed. OAuth is supported, existing API keys work, scoped MCP keys are available, and browser clients can use PKCE S256.",
    "summary": "Hunt.io launched a remote MCP server (Hunt 3.0) that lets AI tools query its threat-intel datasets directly; the demo shows an LLM pivoting on Kimsuky-linked infrastructure. Analyst-tooling update rather than an active threat.",
    "severity": "Low",
    "tags": [
      "hunt-io",
      "mcp",
      "threat-intel",
      "ai",
      "tooling"
    ],
    "id": "auto-tweet-huntio-2074539049918791911",
    "fetchedAt": "2026-07-08T23:19:55.007Z"
  },
  {
    "username": "Huntio",
    "url": "https://x.com/Huntio/status/2074905161315549419",
    "date": "2026-07-08",
    "text": "Hunt 3.0 Adds Visual Netblock Browsing\n\nHunt 3.0 makes netblock hunting a lot more visual.\n\nIn this clip, a single CIDR opens into an interactive /24 map, making it easier to move from one IP to nearby infrastructure without losing context.\n\nYou can spot malicious neighbors, compare risk signals across the block, and open an IP for deeper context like ports, software, tags, IOCs, and related signals.",
    "summary": "Hunt.io announced a visual netblock-browsing feature in Hunt 3.0 that maps a CIDR into an interactive /24 view for pivoting across adjacent malicious infrastructure. Product/tooling update for threat hunters.",
    "severity": "Low",
    "tags": [
      "hunt-io",
      "netblock",
      "threat-hunting",
      "infrastructure",
      "tooling"
    ],
    "id": "auto-tweet-huntio-2074905161315549419",
    "fetchedAt": "2026-07-08T23:19:55.007Z"
  }
];
