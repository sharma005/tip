/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: adversary. Hand-updated via an interactive
   Claude session (WebSearch) — see lib/intel/schemas.mjs
   (ADVERSARY_SCHEMA) and lib/intel/contentTypes.mjs (cap 60) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_ADVERSARY = [
  {
    "id": "auto-adv-storm-2603",
    "name": "Storm-2603",
    "aliases": [
      "GOLD SALEM"
    ],
    "type": "apt",
    "origin": "China",
    "motivation": "Espionage / Ransomware",
    "sectors": [
      "Government",
      "Critical Infrastructure",
      "Education",
      "Healthcare"
    ],
    "ttps": [
      "T1190",
      "T1505.003",
      "T1562.001",
      "T1021.002",
      "T1046",
      "T1486"
    ],
    "campaigns": [
      "ToolShell SharePoint exploitation deploying Warlock and LockBit ransomware",
      "On-prem SharePoint RCE (CVE-2026-45659) ransomware intrusions"
    ],
    "iocs": [
      "ServiceMouse.sys (vulnerable driver used for BYOVD)",
      "VMToolsEng.exe (BYOVD loader)"
    ],
    "notes": "China-linked actor tracked by Microsoft that pairs espionage with financially motivated ransomware, exploiting on-prem Microsoft SharePoint (the ToolShell chain and, more recently, CVE-2026-45659) to drop web shells and steal ASP.NET machine keys. Post-exploitation it uses BYOVD (ServiceMouse.sys loaded via VMToolsEng.exe) to kill AV, then PsExec and masscan for lateral movement and discovery before deploying Warlock/LockBit ransomware.",
    "active": true,
    "fetchedAt": "2026-07-08T23:38:49.000Z"
  },
  {
    "id": "auto-adv-vect",
    "name": "Vect",
    "aliases": [
      "VECT"
    ],
    "type": "criminal",
    "origin": "Russia",
    "motivation": "Financial",
    "sectors": [
      "Technology",
      "Software Supply Chain",
      "Multiple"
    ],
    "ttps": [
      "T1195.002",
      "T1078",
      "T1486",
      "T1567"
    ],
    "campaigns": [
      "Vect + TeamPCP supply-chain ransomware (Trivy, LiteLLM)",
      "Vect 2.0 RaaS affiliate operations"
    ],
    "iocs": [],
    "notes": "Russian-language ransomware-as-a-service operation that surfaced on the Rehub forum in late December 2025 and launched Vect 2.0 in early 2026. Under a formal March 2026 partnership with data-theft crew TeamPCP, Vect deploys ransomware into organizations compromised through TeamPCP's software supply-chain attacks (e.g. Trivy and LiteLLM), reusing stolen CI/CD credentials for access — an 'industrialized' RaaS model flagged by Sophos in July 2026.",
    "active": true,
    "fetchedAt": "2026-07-08T23:38:49.000Z"
  },
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
