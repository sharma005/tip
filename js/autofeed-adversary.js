/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: adversary. Hand-updated via an interactive
   Claude session (WebSearch) — see lib/intel/schemas.mjs
   (ADVERSARY_SCHEMA) and lib/intel/contentTypes.mjs (cap 60) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_ADVERSARY = [
  {
    "id": "auto-adv-armored-likho",
    "name": "Armored Likho",
    "aliases": [
      "Sticky Werewolf"
    ],
    "type": "apt",
    "origin": "Unknown",
    "motivation": "Espionage",
    "sectors": [
      "Government",
      "Energy",
      "Critical Infrastructure"
    ],
    "ttps": [
      "T1566.001",
      "T1204.002",
      "T1059.001",
      "T1203"
    ],
    "campaigns": [
      "2026 spear-phishing campaign against government and electric-power operators in Russia, Kazakhstan and Brazil"
    ],
    "iocs": [],
    "notes": "Kaspersky attributes a 2026 campaign targeting government agencies and power operators via spear-phishing that exploits the Windows LNK vulnerability CVE-2025-9491. Notably, the group used a large language model to generate its first-stage loader, complicating attribution.",
    "active": true,
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-adv-muddywater",
    "name": "MuddyWater",
    "aliases": [
      "Mango Sandstorm",
      "Static Kitten",
      "Seedworm"
    ],
    "type": "apt",
    "origin": "Iran",
    "motivation": "Espionage",
    "sectors": [
      "Government",
      "Telecommunications",
      "Energy"
    ],
    "ttps": [
      "T1566.001",
      "T1078",
      "T1556",
      "T1219"
    ],
    "campaigns": [
      "2026 false-flag intrusion initiated via Microsoft Teams screen-sharing social engineering"
    ],
    "iocs": [],
    "notes": "Rapid7 tied an early-2026 intrusion to MuddyWater, an actor affiliated with Iran's Ministry of Intelligence and Security. The operation began with social engineering over Microsoft Teams screen sharing, followed by credential harvesting, MFA manipulation, and pivoting to legitimate accounts for internal access.",
    "active": true,
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-adv-fortibleed",
    "name": "FortiBleed",
    "aliases": [],
    "type": "criminal",
    "origin": "Unknown",
    "motivation": "Financial / Extortion",
    "sectors": [
      "Manufacturing",
      "Healthcare",
      "Technology"
    ],
    "ttps": [
      "T1078",
      "T1110",
      "T1190",
      "T1486"
    ],
    "campaigns": [
      "FortiBleed ransomware campaign leveraging ~74,000 stolen Fortinet credentials"
    ],
    "iocs": [],
    "notes": "SOCRadar tracks FortiBleed as a group of roughly 20 operators that weaponizes previously stolen Fortinet credentials, brute force, and configuration dumping to breach firewalls and deploy ransomware, with at least 12 confirmed infections reported in mid-2026.",
    "active": true,
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-adv-shinyhunters",
    "name": "ShinyHunters",
    "aliases": [],
    "type": "criminal",
    "origin": "Unknown",
    "motivation": "Financial / Extortion",
    "sectors": [
      "Retail",
      "Healthcare",
      "Manufacturing"
    ],
    "ttps": [
      "T1190",
      "T1078",
      "T1567.002"
    ],
    "campaigns": [
      "Kodak 2.2M-record breach (June 2026)",
      "DentaQuest 234GB / 2.6M-record leak (June 2026)"
    ],
    "iocs": [],
    "notes": "A prolific data-extortion crew that steals large customer/corporate datasets and pressures victims via dark-web leak-site postings and deadlines. June 2026 activity includes confirmed breaches at Kodak (2.2M records) and DentaQuest (234GB archive, 2.6M unique emails verified by Have I Been Pwned).",
    "active": true,
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  }
];
