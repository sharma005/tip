/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: feed. Hand-updated via an interactive Claude
   session (WebSearch) — see lib/intel/schemas.mjs (FEED_SCHEMA) and
   lib/intel/contentTypes.mjs (cap 200) as the source of truth. Append
   new items deduped by id, drop the oldest by fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED = [
  {
    "id": "auto-rogueplanet-windows-defender-zero-day-abuses-quarantine-pipe",
    "title": "RoguePlanet Windows Defender zero-day abuses quarantine pipeline for SYSTEM code execution",
    "category": "zeroday",
    "severity": "Critical",
    "cve": null,
    "cvss": null,
    "date": "2026-07-08",
    "actor": null,
    "source": "BleepingComputer",
    "url": "https://www.bleepingcomputer.com/news/microsoft/microsoft-patches-rogueplanet-defender-zero-day-vulnerability/",
    "summary": "RoguePlanet is a Windows local privilege escalation zero-day that abuses Microsoft Defender's real-time scan and quarantine pipeline together with NTFS directory junctions, opportunistic locks, Volume Shadow Copy, and the WER QueueReporting scheduled task to run an attacker payload as SYSTEM. Proof-of-concept code was published on GitHub on June 10, 2026 with no coordinated disclosure, no CVE and no patch, leaving millions of machines exposed. Microsoft shipped a fix roughly 29 days later, in early July 2026. Prioritize patching and hunt for anomalous SYSTEM-level processes spawned via the WER QueueReporting task.",
    "tags": [
      "windows",
      "defender",
      "zero-day",
      "privilege-escalation",
      "lpe",
      "rogueplanet"
    ],
    "fetchedAt": "2026-07-11T00:41:28.000Z"
  },
  {
    "id": "auto-cve-2026-35273",
    "title": "Oracle PeopleSoft PeopleTools unauthenticated RCE (CVE-2026-35273) exploited by ShinyHunters",
    "category": "zeroday",
    "severity": "Critical",
    "cve": "CVE-2026-35273",
    "cvss": 9.8,
    "date": "2026-06-10",
    "actor": "ShinyHunters (UNC6240)",
    "source": "Rapid7",
    "url": "https://www.rapid7.com/blog/post/etr-active-exploitation-of-oracle-peoplesoft-zero-day-cve-2026-35273/",
    "summary": "CVE-2026-35273 is a critical (CVSS 9.8) unauthenticated remote code execution flaw in the Updates Environment Management component of Oracle PeopleSoft PeopleTools (versions 8.61 and 8.62), addressed in an out-of-band Oracle security alert on June 10, 2026. Mandiant reports the flaw was exploited in the wild as a zero-day between May 27 and June 9, 2026, ahead of the advisory, and attributes the data-theft and extortion campaign to UNC6240 (ShinyHunters). Roughly 68% of the 100-plus notified organizations were universities and colleges. Apply Oracle's out-of-band fix immediately and hunt for exploitation of internet-facing PeopleSoft instances.",
    "tags": [
      "oracle",
      "peoplesoft",
      "shinyhunters",
      "exploited",
      "rce"
    ],
    "fetchedAt": "2026-07-11T00:41:28.000Z"
  },
  {
    "id": "auto-cve-2026-33825",
    "title": "Windows Defender 'BlueHammer' EoP (CVE-2026-33825) now exploited by ransomware gangs",
    "category": "kev",
    "severity": "High",
    "cve": "CVE-2026-33825",
    "cvss": null,
    "date": "2026-07-07",
    "actor": null,
    "source": "BleepingComputer",
    "url": "https://www.bleepingcomputer.com/news/security/cisa-windows-bluehammer-flaw-now-exploited-by-ransomware-gangs/",
    "summary": "CISA has updated its KEV entry for CVE-2026-33825, a Microsoft Defender privilege-escalation flaw dubbed 'BlueHammer', to note that it is now being leveraged in ransomware campaigns. The bug was leaked with PoC code in early April 2026 by a researcher using the 'Nightmare Eclipse' handle, exploited in the wild as a zero-day before Microsoft patched it on April 14, 2026, and added to the KEV catalog on April 22. An authenticated attacker can abuse it for privilege escalation; ensure the April 2026 Defender/Windows updates are deployed and monitor for post-compromise escalation.",
    "tags": [
      "windows",
      "defender",
      "bluehammer",
      "ransomware",
      "privilege-escalation",
      "kev"
    ],
    "fetchedAt": "2026-07-11T00:41:28.000Z"
  },
  {
    "id": "auto-cve-2026-46817",
    "title": "Oracle E-Business Suite Payments unauthenticated takeover (CVE-2026-46817) exploited in the wild",
    "category": "rce",
    "severity": "Critical",
    "cve": "CVE-2026-46817",
    "cvss": 9.8,
    "date": "2026-06-30",
    "actor": null,
    "source": "BleepingComputer",
    "url": "https://www.bleepingcomputer.com/news/security/new-oracle-e-business-suite-flaw-now-exploited-in-attacks/",
    "summary": "CVE-2026-46817 is a critical (CVSS 9.8) flaw in the File Transmission component of Oracle Payments within Oracle E-Business Suite (EBS 12.2.3-12.2.15), caused by improper/missing authentication for a critical function. Unauthenticated attackers with HTTP access abuse the ibytransmit endpoint to read arbitrary files and take over vulnerable instances. First in-the-wild exploitation was recorded on June 27, 2026 - about six weeks after Oracle's May 2026 patch and before any public PoC - with Shadowserver logging hundreds of attempts and roughly 950 EBS instances still exposed. Apply Oracle's May 2026 Critical Patch Update immediately.",
    "tags": [
      "oracle",
      "ebs",
      "rce",
      "exploited",
      "cvss-9-8"
    ],
    "fetchedAt": "2026-07-10T09:30:00.000Z"
  },
  {
    "id": "auto-cve-2026-8037",
    "title": "Progress Kemp LoadMaster pre-auth root RCE (CVE-2026-8037) actively exploited",
    "category": "rce",
    "severity": "Critical",
    "cve": "CVE-2026-8037",
    "cvss": 9.6,
    "date": "2026-07-06",
    "actor": null,
    "source": "The Hacker News",
    "url": "https://thehackernews.com/2026/07/latest-progress-kemp-loadmaster-pre.html",
    "summary": "CVE-2026-8037 is a critical (CVSS 9.6) OS command injection flaw in Progress Kemp LoadMaster (also affecting ECS Connection Manager, ObjectScale Connection Manager and MOVEit WAF), reachable pre-authentication via the /accessv2 API endpoint when the API is enabled. It stems from improper handling of user input in the escape_quotes() function and lets an unauthenticated attacker run arbitrary commands as root. eSentire observed exploitation attempts starting June 29, 2026, the same day watchTowr Labs published a technical write-up. Fixed in GA v7.2.63.2 and LTSF v7.2.54.18.",
    "tags": [
      "progress",
      "kemp",
      "loadmaster",
      "rce",
      "cvss-9-6"
    ],
    "fetchedAt": "2026-07-10T09:30:00.000Z"
  },
  {
    "id": "auto-cve-2026-20045",
    "title": "Cisco Unified Communications Manager zero-day RCE (CVE-2026-20045) exploited for root access",
    "category": "zeroday",
    "severity": "Critical",
    "cve": "CVE-2026-20045",
    "cvss": 8.2,
    "date": "2026-07-08",
    "actor": null,
    "source": "BleepingComputer",
    "url": "https://www.bleepingcomputer.com/news/security/cisco-fixes-unified-communications-rce-zero-day-exploited-in-attacks/",
    "summary": "Cisco disclosed CVE-2026-20045, a remote code execution flaw in Cisco Unified Communications Manager (Unified CM/CUCM) and related voice products that is being actively exploited in the wild. Attackers send crafted HTTP requests to the web-based management interface to gain user-level access and then escalate to root. Cisco PSIRT confirmed exploitation attempts and urges immediate, version-specific patching; the flaw also affects Unified CM SME, IM & Presence, Unity Connection, and Webex Calling Dedicated Instance.",
    "tags": [
      "cisco",
      "unified-cm",
      "rce",
      "zero-day",
      "root"
    ],
    "fetchedAt": "2026-07-08T23:38:49.000Z"
  },
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
