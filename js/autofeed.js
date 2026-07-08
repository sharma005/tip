/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: feed. Hand-updated via an interactive Claude
   session (WebSearch) — see lib/intel/schemas.mjs (FEED_SCHEMA) and
   lib/intel/contentTypes.mjs (cap 200) as the source of truth. Append
   new items deduped by id, drop the oldest by fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED = [
  {
    "title": "Adobe ColdFusion path traversal (CVE-2026-48282) added to CISA KEV amid active exploitation",
    "category": "kev",
    "severity": "Critical",
    "cve": "CVE-2026-48282",
    "cvss": 10,
    "date": "2026-07-08",
    "actor": null,
    "source": "The Hacker News",
    "url": "https://thehackernews.com/2026/07/cisa-adds-4-actively-exploited-adobe.html",
    "summary": "CISA added CVE-2026-48282, a critical path traversal flaw in Adobe ColdFusion (CVSS 10.0), to its Known Exploited Vulnerabilities catalog on evidence of active exploitation. The flaw lets attackers read or write arbitrary files on affected servers, enabling further compromise. Federal agencies were given a remediation deadline; internet-facing ColdFusion should be patched immediately.",
    "tags": [
      "coldfusion",
      "adobe",
      "kev",
      "path-traversal"
    ],
    "id": "auto-cve-2026-48282",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  },
  {
    "title": "JoomShaper SP Page Builder unrestricted file upload (CVE-2026-48908) exploited in the wild",
    "category": "kev",
    "severity": "Critical",
    "cve": "CVE-2026-48908",
    "cvss": 10,
    "date": "2026-07-08",
    "actor": null,
    "source": "The Hacker News",
    "url": "https://thehackernews.com/2026/07/cisa-adds-4-actively-exploited-adobe.html",
    "summary": "CISA added CVE-2026-48908 (CVSS 10.0), an unrestricted file upload vulnerability in the JoomShaper SP Page Builder Joomla extension, to the KEV catalog after confirming active exploitation. Successful abuse allows attackers to upload web shells and achieve remote code execution on affected Joomla sites.",
    "tags": [
      "joomla",
      "sp-page-builder",
      "kev",
      "file-upload"
    ],
    "id": "auto-cve-2026-48908",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  },
  {
    "title": "Joomlack Page Builder improper access control (CVE-2026-56290) actively exploited",
    "category": "kev",
    "severity": "Critical",
    "cve": "CVE-2026-56290",
    "cvss": 10,
    "date": "2026-07-08",
    "actor": null,
    "source": "The Hacker News",
    "url": "https://thehackernews.com/2026/07/cisa-adds-4-actively-exploited-adobe.html",
    "summary": "CVE-2026-56290 (CVSS 10.0), an improper access control flaw in the Joomlack Page Builder Joomla extension, was added to CISA KEV on evidence of active exploitation. The weakness lets unauthenticated attackers reach privileged functionality and take over vulnerable sites.",
    "tags": [
      "joomla",
      "page-builder",
      "kev",
      "access-control"
    ],
    "id": "auto-cve-2026-56290",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  },
  {
    "title": "Microsoft SharePoint Server deserialization RCE (CVE-2026-45659) added to CISA KEV",
    "category": "rce",
    "severity": "High",
    "cve": "CVE-2026-45659",
    "cvss": 8.8,
    "date": "2026-07-01",
    "actor": null,
    "source": "The Hacker News",
    "url": "https://thehackernews.com/2026/07/sharepoint-rce-cve-2026-45659-added-to.html",
    "summary": "CISA added CVE-2026-45659, a deserialization-of-untrusted-data remote code execution flaw in Microsoft SharePoint Server (CVSS 8.8), to its KEV catalog after confirming active exploitation. An authenticated attacker can execute arbitrary code on the SharePoint server. Organizations running on-prem SharePoint should apply Microsoft updates and hunt for post-exploitation activity.",
    "tags": [
      "sharepoint",
      "microsoft",
      "rce",
      "deserialization"
    ],
    "id": "auto-cve-2026-45659",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  },
  {
    "title": "Ransomware crews adopt Citrix Bleed 2, BYOVD and stolen supply-chain credentials",
    "category": "ransomware",
    "severity": "High",
    "cve": null,
    "cvss": null,
    "date": "2026-07-08",
    "actor": null,
    "source": "The Hacker News",
    "url": "https://thehackernews.com/2026/07/ransomware-groups-turn-to-citrix-bleed.html",
    "summary": "Researchers report ransomware affiliates are increasingly chaining Citrix Bleed 2 session hijacking, bring-your-own-vulnerable-driver (BYOVD) techniques and credentials harvested from supply-chain intrusions to gain and escalate access. Sophos flagged the pairing of large-scale supply-chain credential theft with ransomware-as-a-service as a meaningful shift in the threat landscape.",
    "tags": [
      "ransomware",
      "citrix-bleed",
      "byovd",
      "supply-chain"
    ],
    "id": "auto-ransomware-crews-adopt-citrix-bleed-2-byovd-and-stolen-suppl",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  },
  {
    "title": "Langflow authorization bypass (CVE-2026-55255) added to CISA KEV",
    "category": "kev",
    "severity": "Medium",
    "cve": "CVE-2026-55255",
    "cvss": 6.1,
    "date": "2026-07-08",
    "actor": null,
    "source": "The Hacker News",
    "url": "https://thehackernews.com/2026/07/cisa-adds-4-actively-exploited-adobe.html",
    "summary": "CVE-2026-55255 (CVSS 6.1), an authorization bypass in the Langflow low-code AI framework, was added to CISA KEV on evidence of active exploitation. Exploitation can let attackers reach functionality that should require authentication, exposing AI application backends. Operators of internet-facing Langflow instances should update promptly.",
    "tags": [
      "langflow",
      "ai",
      "kev",
      "auth-bypass"
    ],
    "id": "auto-cve-2026-55255",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  }
];
