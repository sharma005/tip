/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: feed. Hand-updated via an interactive Claude
   session (WebSearch) — see lib/intel/schemas.mjs (FEED_SCHEMA) and
   lib/intel/contentTypes.mjs (cap 200) as the source of truth. Append
   new items deduped by id, drop the oldest by fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED = [
  {
    "id": "auto-cve-2026-20182",
    "title": "Cisco Catalyst SD-WAN Controller authentication bypass exploited in zero-day attacks",
    "category": "zeroday",
    "severity": "Critical",
    "cve": "CVE-2026-20182",
    "cvss": 10.0,
    "date": "2026-06-24",
    "actor": null,
    "source": "BleepingComputer",
    "url": "https://www.bleepingcomputer.com/news/security/cisco-warns-of-new-critical-sd-wan-flaw-exploited-in-zero-day-attacks/",
    "summary": "Cisco disclosed a maximum-severity (CVSS 10.0) authentication bypass in the Catalyst SD-WAN Controller that is being actively exploited in zero-day attacks. Successful exploitation grants an unauthenticated attacker full administrative control of the controller and the managed WAN fabric. Patches are available and immediate upgrade is advised.",
    "tags": [
      "cisco",
      "sd-wan",
      "auth-bypass",
      "zeroday"
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-cve-2026-35616",
    "title": "Fortinet FortiClient EMS improper access control actively exploited",
    "category": "zeroday",
    "severity": "Critical",
    "cve": "CVE-2026-35616",
    "cvss": 9.1,
    "date": "2026-06-30",
    "actor": null,
    "source": "Dark Reading",
    "url": "https://www.darkreading.com/vulnerabilities-threats/fortinet-emergency-patch-forticlient-zero-day",
    "summary": "Fortinet issued an emergency patch for an improper access-control flaw (CVSS 9.1) in FortiClient Endpoint Management Server that the vendor confirmed is being exploited in the wild. The bug allows unauthorized access to managed endpoints and can be chained for lateral movement. Administrators should patch EMS immediately.",
    "tags": [
      "fortinet",
      "forticlient",
      "ems",
      "zeroday"
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-cve-2026-8451",
    "title": "CitrixBleed 2 (CVE-2026-8451) exploited within 24 hours of disclosure",
    "category": "kev",
    "severity": "Critical",
    "cve": "CVE-2026-8451",
    "cvss": null,
    "date": "2026-06-30",
    "actor": null,
    "source": "Arete",
    "url": "https://areteir.com/resources/ransomware-trends-data-insights-june-2026",
    "summary": "A new Citrix NetScaler information-disclosure flaw dubbed CitrixBleed was reported exploited within 24 hours of its June 30 disclosure. Attackers use leaked session material to hijack authenticated sessions and bypass MFA, a pattern previously abused to stage ransomware intrusions. Organizations should patch NetScaler ADC/Gateway and terminate active sessions.",
    "tags": [
      "citrix",
      "netscaler",
      "citrixbleed",
      "session-hijack"
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-cve-2026-45659",
    "title": "SharePoint Server RCE (CVE-2026-45659) added to CISA KEV after active exploitation",
    "category": "kev",
    "severity": "High",
    "cve": "CVE-2026-45659",
    "cvss": 8.8,
    "date": "2026-07-01",
    "actor": null,
    "source": "The Hacker News",
    "url": "https://thehackernews.com/2026/07/sharepoint-rce-cve-2026-45659-added-to.html",
    "summary": "CISA added a Microsoft SharePoint Server remote code execution flaw (CVSS 8.8) arising from deserialization of untrusted data to its Known Exploited Vulnerabilities catalog after evidence of active exploitation. FCEB agencies were directed to remediate by July 4, 2026. On-prem SharePoint operators should apply the fix and hunt for post-exploitation web shells.",
    "tags": [
      "sharepoint",
      "microsoft",
      "rce",
      "kev",
      "deserialization"
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-cve-2026-11645",
    "title": "Google patches actively exploited Chrome V8 zero-day (CVE-2026-11645)",
    "category": "zeroday",
    "severity": "High",
    "cve": "CVE-2026-11645",
    "cvss": null,
    "date": "2026-06-08",
    "actor": null,
    "source": "SOC Prime",
    "url": "https://socprime.com/blog/cve-2026-11645-chrome-zero-day-vulnerability-exploited-in-the-wild/",
    "summary": "Google shipped an emergency Chrome update for an actively exploited out-of-bounds read/write flaw in the V8 JavaScript engine, likely paired with a sandbox escape in real-world attacks. Stable builds 149.0.7827.102/.103 address the issue. Users and managed fleets should force-update Chrome immediately.",
    "tags": [
      "chrome",
      "v8",
      "browser",
      "zeroday"
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-node-ipc-npm-supply-chain-compromise",
    "title": "node-ipc npm package poisoned with credential-stealing payload",
    "category": "supplychain",
    "severity": "High",
    "cve": null,
    "cvss": null,
    "date": "2026-05-14",
    "actor": null,
    "source": "StepSecurity",
    "url": "https://www.stepsecurity.io/blog/node-ipc-npm-supply-chain-attack",
    "summary": "Three malicious versions of node-ipc (9.1.6, 9.2.3, 12.0.1) — a library with over 10 million weekly downloads — were published to npm carrying an identical obfuscated credential-stealing payload. The compromise is part of a broader wave of self-propagating npm supply-chain attacks. Teams should pin known-good versions and audit CI/CD secrets.",
    "tags": [
      "npm",
      "node-ipc",
      "supply-chain",
      "credential-theft"
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-fortibleed-ransomware-campaign",
    "title": "FortiBleed campaign turns compromised Fortinet firewalls into ransomware entry points",
    "category": "ransomware",
    "severity": "High",
    "cve": null,
    "cvss": null,
    "date": "2026-06-20",
    "actor": "FortiBleed",
    "source": "CM-Alliance",
    "url": "https://www.cm-alliance.com/cybersecurity-blog/june-2026-biggest-cyber-attacks-data-breaches-ransomware-attacks",
    "summary": "A sustained campaign tracked as FortiBleed uses roughly 74,000 stolen Fortinet credentials — combined with brute force and config dumping — to deploy ransomware, with at least 12 confirmed infections. SOCRadar links the activity to a group of about 20 operators. Rotate Fortinet credentials, enforce MFA, and review VPN logs for anomalous logins.",
    "tags": [
      "fortinet",
      "ransomware",
      "credential-abuse",
      "vpn"
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-npm-dependency-confusion-corporate-namespaces",
    "title": "Malicious npm packages abuse dependency confusion to profile corporate developer environments",
    "category": "supplychain",
    "severity": "Medium",
    "cve": null,
    "cvss": null,
    "date": "2026-05-29",
    "actor": null,
    "source": "Microsoft Security",
    "url": "https://www.microsoft.com/en-us/security/blog/2026/05/29/33-malicious-npm-packages-abuse-dependency-confusion-profile-developer-environments/",
    "summary": "Microsoft Threat Intelligence uncovered malicious npm packages registered under scopes mirroring real internal corporate namespaces across nine organizations, using dependency confusion to profile developer environments. The packages exfiltrate host and environment metadata on install. Enforce scoped registries and block public resolution of internal package names.",
    "tags": [
      "npm",
      "dependency-confusion",
      "supply-chain",
      "microsoft"
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  }
];
