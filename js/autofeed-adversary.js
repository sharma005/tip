/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: adversary. Hand-updated via an interactive
   Claude session (WebSearch) — see lib/intel/schemas.mjs
   (ADVERSARY_SCHEMA) and lib/intel/contentTypes.mjs (cap 60) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_ADVERSARY = [
  {
    "name": "ShinyHunters",
    "aliases": [
      "ShinyCorp"
    ],
    "type": "criminal",
    "origin": "Unknown",
    "motivation": "Financial",
    "sectors": [
      "Higher Education",
      "Retail",
      "Manufacturing"
    ],
    "ttps": [
      "T1190"
    ],
    "campaigns": [
      "Oracle PeopleSoft zero-day (CVE-2026-35273) exploitation targeting higher education, May-June 2026",
      "Data-theft extortion listings on dark web leak sites"
    ],
    "iocs": [],
    "notes": "Financially motivated data-theft and extortion crew. Mandiant attributed exploitation of the Oracle PeopleSoft zero-day CVE-2026-35273 against the higher-education sector between late May and early June 2026 to ShinyHunters, and the group listed victims such as Kodak and DentaQuest on its leak site in June 2026. Operates a public extortion/leak model.",
    "active": true,
    "id": "auto-adv-shinyhunters",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  },
  {
    "name": "TeamPCP",
    "aliases": [],
    "type": "criminal",
    "origin": "Unknown",
    "motivation": "Financial",
    "sectors": [
      "Software Development",
      "Technology"
    ],
    "ttps": [
      "T1195.002",
      "T1552.001"
    ],
    "campaigns": [
      "\"Mini Shai-Hulud\" TanStack/npm supply-chain compromise",
      "VECT ransomware-as-a-service partnership (announced March 2026)"
    ],
    "iocs": [],
    "notes": "Supply-chain-focused actor that distributes trojanized npm/open-source packages to steal GitHub credentials, cloud secrets, SSH keys and CI/CD tokens from developers. In July 2026 Sophos warned that TeamPCP had partnered with the VECT ransomware-as-a-service operation, allowing ransomware to be deployed across organizations compromised through its supply-chain intrusions.",
    "active": true,
    "id": "auto-adv-teampcp",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  }
];
