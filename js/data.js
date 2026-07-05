/* ═══════════════════════════════════════════════════════════════════
   TIP — Data Layer
   All sample data, CRUD operations, localStorage persistence
   ═══════════════════════════════════════════════════════════════════ */

const TIP_DATA = {
  /* ── Categories ── */
  categories: {
    kev:         { label: 'Actively Exploited', short: 'KEV',          color: 'kev' },
    zeroday:     { label: 'Zero-Day',           short: '0-DAY',        color: 'zeroday' },
    supplychain: { label: 'Supply Chain',       short: 'SUPPLY CHAIN', color: 'supplychain' },
    ransomware:  { label: 'Ransomware',         short: 'RANSOMWARE',   color: 'ransomware' },
    rce:         { label: 'Critical RCE',       short: 'RCE',          color: 'rce' },
    darkweb:     { label: 'Dark Web',           short: 'DARK WEB',     color: 'darkweb' }
  },

  /* ── Severity ranking ── */
  sevRank: { Critical: 4, High: 3, Medium: 2, Low: 1 },

  /* ── Feed Items (seeded with real-world data from ThreatFeed ref) ── */
  feedItems: [
    {
      id: 'cve-2026-35273',
      title: 'Oracle PeopleSoft PeopleTools Zero-Day Exploited by ShinyHunters (SSRF → RCE)',
      category: 'zeroday',
      severity: 'Critical',
      cve: 'CVE-2026-35273',
      cvss: 9.8,
      date: '2026-06-10',
      actor: 'ShinyHunters (UNC6240)',
      source: 'Rapid7',
      url: 'https://www.rapid7.com/blog/post/etr-active-exploitation-of-oracle-peoplesoft-zero-day-cve-2026-35273/',
      summary: 'Critical unauthenticated SSRF-to-RCE flaw (CVSS 9.8) in PeopleSoft Enterprise PeopleTools 8.61/8.62. Mandiant confirmed zero-day exploitation by ShinyHunters (UNC6240) against the higher-education sector between May 27 and June 9, 2026.',
      tags: ['oracle', 'peoplesoft', 'ssrf', 'rce'],
      status: 'published'
    },
    {
      id: 'cve-2026-11645',
      title: 'Google Chrome V8 Zero-Day (Out-of-Bounds R/W) Exploited in the Wild',
      category: 'zeroday',
      severity: 'High',
      cve: 'CVE-2026-11645',
      cvss: 8.8,
      date: '2026-06-08',
      actor: null,
      source: 'The Hacker News',
      url: 'https://thehackernews.com/2026/06/chrome-v8-zero-day-cve-2026-11645.html',
      summary: 'High-severity out-of-bounds read/write in the V8 JavaScript engine with an exploit in the wild. Google shipped an emergency Chrome update on June 8. CISA added it to the KEV catalog on June 9.',
      tags: ['chrome', 'v8', 'browser', 'kev'],
      status: 'published'
    },
    {
      id: 'cve-2026-41091',
      title: 'Microsoft Defender Elevation-of-Privilege Zero-Day Actively Exploited',
      category: 'zeroday',
      severity: 'High',
      cve: 'CVE-2026-41091',
      cvss: 7.8,
      date: '2026-06-09',
      actor: null,
      source: 'The Hacker News',
      url: 'https://thehackernews.com/2026/06/microsoft-patches-record-206-flaws.html',
      summary: 'Elevation-of-privilege flaw in Microsoft Defender, exploited in the wild and patched in the record-breaking June 2026 Patch Tuesday (206 CVEs). Flagged as the most urgent of the month\'s zero-days.',
      tags: ['microsoft', 'defender', 'eop', 'patch-tuesday'],
      status: 'published'
    },
    {
      id: 'rogueplanet-defender',
      title: '"RoguePlanet" Microsoft Defender Zero-Day — Patch In Progress',
      category: 'zeroday',
      severity: 'High',
      cve: null,
      cvss: null,
      date: '2026-06-15',
      actor: null,
      source: 'BleepingComputer',
      url: 'https://www.bleepingcomputer.com/news/microsoft/microsoft-working-on-defender-patch-for-rogueplanet-zero-day/',
      summary: 'Microsoft confirmed it is developing an out-of-band patch for the "RoguePlanet" Defender zero-day following reports of exploitation. Mitigations recommended until the fix ships.',
      tags: ['microsoft', 'defender', 'ongoing'],
      status: 'published'
    },
    {
      id: 'cve-2026-12569',
      title: 'PTC Windchill & FlexPLM Improper Input Validation Added to CISA KEV',
      category: 'kev',
      severity: 'High',
      cve: 'CVE-2026-12569',
      cvss: 8.6,
      date: '2026-06-25',
      actor: null,
      source: 'CISA',
      url: 'https://www.cisa.gov/news-events/alerts/2026/06/25/cisa-adds-two-known-exploited-vulnerabilities-catalog',
      summary: 'Improper input validation in PTC Windchill and FlexPLM. Added to the CISA Known Exploited Vulnerabilities catalog on June 25, 2026 based on evidence of active exploitation.',
      tags: ['ptc', 'windchill', 'plm', 'kev'],
      status: 'published'
    },
    {
      id: 'cve-2026-20230',
      title: 'Cisco Unified Communications Manager SSRF Added to CISA KEV',
      category: 'kev',
      severity: 'High',
      cve: 'CVE-2026-20230',
      cvss: 8.2,
      date: '2026-06-25',
      actor: null,
      source: 'CISA',
      url: 'https://www.cisa.gov/news-events/alerts/2026/06/25/cisa-adds-two-known-exploited-vulnerabilities-catalog',
      summary: 'Server-Side Request Forgery in Cisco Unified Communications Manager. Added to the CISA KEV catalog on June 25, 2026 on evidence of active exploitation.',
      tags: ['cisco', 'cucm', 'ssrf', 'kev'],
      status: 'published'
    },
    {
      id: 'cve-2026-20245',
      title: 'Cisco Catalyst SD-WAN Manager — 7th SD-WAN Zero-Day Exploited in 2026',
      category: 'kev',
      severity: 'Critical',
      cve: 'CVE-2026-20245',
      cvss: 9.8,
      date: '2026-06-09',
      actor: null,
      source: 'SecurityWeek',
      url: 'https://www.securityweek.com/cisco-warns-of-7th-sd-wan-zero-day-exploited-in-2026/',
      summary: 'Improper output encoding in Cisco Catalyst SD-WAN Manager allowing arbitrary command execution as root — the seventh Cisco SD-WAN zero-day exploited in 2026.',
      tags: ['cisco', 'sd-wan', 'rce', 'kev'],
      status: 'published'
    },
    {
      id: 'miasma-worm',
      title: 'Miasma: Self-Spreading npm Worm Hooks 13 AI Coding Tools (TeamPCP / UNC6780)',
      category: 'supplychain',
      severity: 'Critical',
      cve: null,
      cvss: null,
      date: '2026-06-01',
      actor: 'TeamPCP (UNC6780)',
      source: 'GitGuardian',
      url: 'https://blog.gitguardian.com/three-supply-chain-campaigns-hit-npm-pypi-and-docker-hub-in-48-hours/',
      summary: 'A self-spreading worm that injects into the SessionStart hooks of 13 AI coding tools, forges SLSA provenance to pass npm audit, uses GitHub as a C2 channel, and ships a DEADMAN_SWITCH that wipes developer machines if tokens are revoked.',
      tags: ['npm', 'worm', 'ai-tools', 'slsa'],
      status: 'published'
    },
    {
      id: 'miasma-azure-pypi',
      title: 'Miasma Crosses Ecosystems: 73 Azure Repos Disabled, 37 Malicious PyPI Wheels',
      category: 'supplychain',
      severity: 'Critical',
      cve: null,
      cvss: null,
      date: '2026-06-02',
      actor: 'TeamPCP (UNC6780)',
      source: 'Phoenix Security',
      url: 'https://phoenix.security/miasma-azure-hades-pypi-supply-chain-worm-2026/',
      summary: 'GitHub automated enforcement disabled 73 Microsoft Azure repositories in 105 seconds after AI coding-agent hooks were planted. The worm then dropped 37 malicious PyPI wheels across 19 packages.',
      tags: ['azure', 'pypi', 'worm', 'credential-theft'],
      status: 'published'
    },
    {
      id: 'cve-2026-50751-qilin',
      title: 'Qilin Ransomware Affiliate Exploits Check Point VPN Flaw (CVE-2026-50751)',
      category: 'ransomware',
      severity: 'Critical',
      cve: 'CVE-2026-50751',
      cvss: 9.1,
      date: '2026-06-25',
      actor: 'Qilin affiliate',
      source: 'CYFIRMA',
      url: 'https://www.cyfirma.com/news/weekly-intelligence-report-26-jun-2026/',
      summary: 'A Qilin ransomware affiliate is exploiting CVE-2026-50751 in Check Point VPNs for initial access, with a focus on network-infrastructure and supply chain vulnerabilities.',
      tags: ['qilin', 'checkpoint', 'vpn'],
      status: 'published'
    },
    {
      id: 'the-gentlemen-ransomware',
      title: 'The Gentlemen Ransomware Leads June Activity — 9 New Victims',
      category: 'ransomware',
      severity: 'High',
      cve: null,
      cvss: null,
      date: '2026-06-26',
      actor: 'The Gentlemen',
      source: 'PurpleOps',
      url: 'https://purple-ops.io/blog/ransomware-tracker-2026',
      summary: 'The Gentlemen ransomware group posted 9 new victims, heavily impacting healthcare and professional-services sectors globally.',
      tags: ['ransomware', 'the-gentlemen', 'healthcare'],
      status: 'published'
    },
    {
      id: 'world-leaks-ransomware',
      title: 'World Leaks Posts 6 New Victims in 24 Hours',
      category: 'ransomware',
      severity: 'High',
      cve: null,
      cvss: null,
      date: '2026-06-26',
      actor: 'World Leaks',
      source: 'PurpleOps',
      url: 'https://purple-ops.io/blog/ransomware-tracker-2026',
      summary: 'The World Leaks data-extortion group led recent activity with 6 new victims disclosed within 24 hours, alongside active groups PEAR and Akira.',
      tags: ['ransomware', 'world-leaks', 'data-extortion'],
      status: 'published'
    },
    {
      id: 'cve-2026-45657',
      title: 'Windows Kernel Wormable RCE (CVSS 9.8) — Unauthenticated, No User Interaction',
      category: 'rce',
      severity: 'Critical',
      cve: 'CVE-2026-45657',
      cvss: 9.8,
      date: '2026-06-09',
      actor: null,
      source: 'Zero Day Initiative',
      url: 'https://www.thezdi.com/blog/2026/6/9/the-june-2026-security-update-review',
      summary: 'A Windows Kernel remote code execution flaw allowing remote, unauthenticated attackers to execute code at SYSTEM level with no user interaction. Rated wormable — prioritize patching.',
      tags: ['windows', 'kernel', 'wormable', 'patch-tuesday'],
      status: 'published'
    },
    {
      id: 'cve-2026-47291',
      title: 'Windows HTTP.sys Unauthenticated RCE (CVSS 9.8)',
      category: 'rce',
      severity: 'Critical',
      cve: 'CVE-2026-47291',
      cvss: 9.8,
      date: '2026-06-09',
      actor: null,
      source: 'Zero Day Initiative',
      url: 'https://www.thezdi.com/blog/2026/6/9/the-june-2026-security-update-review',
      summary: 'Remote, unauthenticated code execution in HTTP.sys with no user interaction. Any internet-facing Windows host running the HTTP protocol stack is at risk.',
      tags: ['windows', 'http.sys', 'rce', 'patch-tuesday'],
      status: 'published'
    },
    {
      id: 'cve-2026-41089',
      title: 'Windows Netlogon RCE (CVSS 9.8) Under Active Exploitation',
      category: 'rce',
      severity: 'Critical',
      cve: 'CVE-2026-41089',
      cvss: 9.8,
      date: '2026-06-24',
      actor: null,
      source: 'Threat-Modeling.com',
      url: 'https://threat-modeling.com/vulnerability-intelligence-report-june-25-2026/',
      summary: 'A critical Windows Netlogon remote code execution vulnerability (CVSS 9.8) now under active exploitation in the wild. Domain controllers are the primary target — patch immediately.',
      tags: ['windows', 'netlogon', 'rce', 'actively-exploited'],
      status: 'published'
    },
    {
      id: 'pending-1',
      title: 'SolarWinds Orion New Supply Chain Implant Detected by CrowdStrike',
      category: 'supplychain',
      severity: 'Critical',
      cve: null,
      cvss: null,
      date: '2026-07-01',
      actor: 'Unknown APT',
      source: 'CrowdStrike',
      url: 'https://www.crowdstrike.com/blog/',
      summary: 'CrowdStrike Falcon detected a new implant in SolarWinds Orion update packages distributed between June 28–July 1, 2026. The implant uses DNS-over-HTTPS for C2 communication.',
      tags: ['solarwinds', 'supply-chain', 'dns-doh', 'c2'],
      status: 'published'
    },
    {
      id: 'pending-2',
      title: 'Fortinet FortiGate SSL VPN Unauthenticated RCE — Actively Exploited',
      category: 'kev',
      severity: 'Critical',
      cve: 'CVE-2026-48821',
      cvss: 9.6,
      date: '2026-07-01',
      actor: null,
      source: 'CISA',
      url: 'https://www.cisa.gov/news-events/alerts/',
      summary: 'An unauthenticated remote code execution vulnerability in Fortinet FortiGate SSL VPN has been added to the CISA KEV catalog after evidence of mass exploitation.',
      tags: ['fortinet', 'vpn', 'rce', 'kev'],
      status: 'published'
    },
    {
      id: 'pending-3',
      title: 'LockBit 4.0 Ransomware Builder Leaked on Dark Web Forums',
      category: 'ransomware',
      severity: 'High',
      cve: null,
      cvss: null,
      date: '2026-07-01',
      actor: 'LockBit 4.0',
      source: 'Recorded Future',
      url: 'https://www.recordedfuture.com/',
      summary: 'The LockBit 4.0 ransomware builder has been leaked on multiple dark web forums, enabling script kiddies and low-sophistication actors to deploy ransomware at scale.',
      tags: ['lockbit', 'ransomware', 'builder-leak'],
      status: 'published'
    }
  ],

  /* ── Adversaries ── */
  adversaries: [
    {
      id: 'adv-1',
      name: 'ShinyHunters',
      aliases: ['UNC6240', 'SH Group'],
      type: 'criminal',
      origin: 'France',
      motivation: 'Financial',
      sectors: ['Higher Education', 'Technology', 'E-Commerce'],
      ttps: ['T1190', 'T1133', 'T1078', 'T1041'],
      campaigns: ['PeopleSoft SSRF Campaign (Jun 2026)', 'Snowflake Data Theft (2024)'],
      iocs: ['185.220.101.xx', 'shinyhunters[.]cx'],
      lastSeen: '2026-06-10',
      notes: 'Prolific data theft group known for large-scale breaches. Shifted to zero-day exploitation in 2026.'
    },
    {
      id: 'adv-2',
      name: 'TeamPCP',
      aliases: ['UNC6780', 'Miasma Group'],
      type: 'criminal',
      origin: 'Unknown',
      motivation: 'Financial / Disruption',
      sectors: ['Software Development', 'DevOps', 'AI/ML'],
      ttps: ['T1195.002', 'T1059', 'T1071.001', 'T1485'],
      campaigns: ['Miasma npm Worm (Jun 2026)', 'PyPI Wheel Poisoning (Jun 2026)'],
      iocs: ['github.com/teampcp-*', '@redhat-cloud-services malicious pkgs'],
      lastSeen: '2026-06-02',
      notes: 'Supply chain attack specialists targeting developer tools and AI coding assistants.'
    },
    {
      id: 'adv-3',
      name: 'Qilin',
      aliases: ['Agenda Ransomware'],
      type: 'criminal',
      origin: 'Russia',
      motivation: 'Financial',
      sectors: ['Healthcare', 'Manufacturing', 'Critical Infrastructure'],
      ttps: ['T1190', 'T1486', 'T1490', 'T1027'],
      campaigns: ['Check Point VPN Exploitation (Jun 2026)'],
      iocs: ['qilin[.]onion', 'Various Check Point exploit payloads'],
      lastSeen: '2026-06-25',
      notes: 'Ransomware-as-a-Service operation actively exploiting VPN appliances for initial access.'
    },
    {
      id: 'adv-4',
      name: 'The Gentlemen',
      aliases: [],
      type: 'criminal',
      origin: 'Unknown',
      motivation: 'Financial',
      sectors: ['Healthcare', 'Professional Services', 'Legal'],
      ttps: ['T1486', 'T1489', 'T1070'],
      campaigns: ['June 2026 Healthcare Wave'],
      iocs: [],
      lastSeen: '2026-06-26',
      notes: 'Emerging ransomware group with 9 victims posted in a single week, primarily targeting healthcare.'
    },
    {
      id: 'adv-5',
      name: 'World Leaks',
      aliases: ['WL Group'],
      type: 'criminal',
      origin: 'Unknown',
      motivation: 'Financial / Extortion',
      sectors: ['Finance', 'Government', 'Technology'],
      ttps: ['T1567', 'T1048', 'T1530'],
      campaigns: ['Data Extortion Sprint (Jun 2026)'],
      iocs: ['worldleaks[.]onion'],
      lastSeen: '2026-06-26',
      notes: 'Data-extortion group that does not encrypt — purely steals and threatens to leak data.'
    }
  ],

  /* ── Hypotheses ── */
  hypotheses: [
    {
      id: 'hypo-1',
      title: 'Detect ShinyHunters SSRF-to-RCE Chain Against PeopleSoft',
      description: 'Hunt for indicators of ShinyHunters (UNC6240) exploiting CVE-2026-35273 in Oracle PeopleSoft environments. Look for unauthenticated SSRF requests followed by code execution patterns.',
      mitreTactic: 'Initial Access',
      mitreTechnique: 'T1190 - Exploit Public-Facing Application',
      dataSources: ['Web Proxy Logs', 'WAF Logs', 'Application Server Logs'],
      priority: 'P1',
      status: 'active',
      linkedAdversary: 'adv-1',
      linkedFeedItem: 'cve-2026-35273',
      createdAt: '2026-06-11',
      queries: [
        {
          name: 'PeopleSoft SSRF Detection',
          query: 'source logs\n| filter $d.url contains "PeopleSoft" && $d.url contains "redirect"\n| filter $d.http_method == "GET" || $d.http_method == "POST"\n| filter $d.response_code >= 200 && $d.response_code < 400\n| filter $d.url matches /\\/(pspc|psp|psc)\\//\n| groupby $d.source_ip\n| count() as request_count\n| filter request_count > 10\n| sort -request_count'
        }
      ]
    },
    {
      id: 'hypo-2',
      title: 'Detect Miasma npm Worm AI Tool Hook Injection',
      description: 'Hunt for evidence of the Miasma worm injecting into AI coding tool SessionStart hooks. Look for suspicious npm package installations from @redhat-cloud-services and GitHub-based C2 communication.',
      mitreTactic: 'Persistence',
      mitreTechnique: 'T1195.002 - Supply Chain Compromise: Software Supply Chain',
      dataSources: ['EDR Logs', 'DNS Logs', 'Process Creation Logs'],
      priority: 'P1',
      status: 'active',
      linkedAdversary: 'adv-2',
      linkedFeedItem: 'miasma-worm',
      createdAt: '2026-06-03',
      queries: [
        {
          name: 'Miasma C2 via GitHub',
          query: 'source logs\n| filter $d.process_name in ["node", "npm", "npx"]\n| filter $d.dns_query contains "raw.githubusercontent.com"\n| filter $d.command_line contains "@redhat-cloud-services"\n| groupby $d.hostname, $d.user\n| count() as hits\n| filter hits > 3\n| sort -hits'
        }
      ]
    },
    {
      id: 'hypo-3',
      title: 'Windows Kernel Wormable RCE Exploitation Attempts',
      description: 'Hunt for network-based exploitation attempts targeting CVE-2026-45657 (Windows Kernel wormable RCE). Look for unusual SMB and RPC traffic patterns indicative of lateral movement.',
      mitreTactic: 'Lateral Movement',
      mitreTechnique: 'T1210 - Exploitation of Remote Services',
      dataSources: ['Network Flow Logs', 'IDS/IPS Logs', 'Windows Event Logs'],
      priority: 'P1',
      status: 'draft',
      linkedAdversary: null,
      linkedFeedItem: 'cve-2026-45657',
      createdAt: '2026-06-10',
      queries: []
    }
  ],

  /* ── Dark Web Intel ── */
  darkwebItems: [
    {
      id: 'dw-1',
      title: 'LockBit 4.0 Builder Shared on BreachForums Successor',
      type: 'ransomware',
      source: 'BreachForums v3',
      date: '2026-07-01',
      snippet: 'Full LockBit 4.0 ransomware builder with config generator and affiliate dashboard code posted by user "xR00tSnake". Includes ESXi, Linux, and Windows payloads.',
      relevance: 92,
      flagged: true,
      tags: ['lockbit', 'builder', 'ransomware']
    },
    {
      id: 'dw-2',
      title: 'Fortune 500 Employee Credentials — 2.3M Records',
      type: 'credential',
      source: 'Russian Market',
      date: '2026-06-30',
      snippet: 'Listing of 2.3 million corporate email/password pairs from Fortune 500 companies, sourced from info-stealer logs (Raccoon, Vidar). Priced at $15,000 BTC.',
      relevance: 88,
      flagged: true,
      tags: ['credentials', 'infostealer', 'fortune-500']
    },
    {
      id: 'dw-3',
      title: 'Check Point VPN 0-Day Exploit for Sale — $80K',
      type: 'exploit',
      source: 'Exploit.in',
      date: '2026-06-28',
      snippet: 'Authenticated seller offering a pre-auth RCE exploit for Check Point VPN appliances. Claims to bypass all current patches. Asking $80,000 in Monero.',
      relevance: 95,
      flagged: true,
      tags: ['checkpoint', 'vpn', '0day', 'exploit']
    },
    {
      id: 'dw-4',
      title: 'Healthcare Sector Targeting Discussion — Qilin Affiliates',
      type: 'chatter',
      source: 'RAMP Forum',
      date: '2026-06-27',
      snippet: 'Multiple Qilin affiliate accounts discussing healthcare sector targeting strategies. Mention of VPN exploitation toolkits and data exfiltration playbooks being shared among affiliates.',
      relevance: 78,
      flagged: false,
      tags: ['qilin', 'healthcare', 'ransomware']
    },
    {
      id: 'dw-5',
      title: 'US Government Agency Database Leak — 450K Records',
      type: 'leak',
      source: 'Telegram Channel',
      date: '2026-06-29',
      snippet: 'A threat actor posted sample data (450K records) from a US government agency database, including PII (names, SSNs, addresses). Full dump being auctioned.',
      relevance: 90,
      flagged: true,
      tags: ['government', 'pii', 'data-leak']
    },
    {
      id: 'dw-6',
      title: 'Azure AD Token Stealer Malware Kit — $500',
      type: 'exploit',
      source: 'XSS Forum',
      date: '2026-06-26',
      snippet: 'New malware kit for stealing Azure AD/Entra ID refresh tokens via phishing. Includes Evilginx2 profiles and automated token replay scripts. Seller has 95% positive feedback.',
      relevance: 82,
      flagged: false,
      tags: ['azure', 'token-theft', 'phishing']
    }
  ],

  /* ── Connector Intel (MISP, OTX, Pulsedive, YETI, Cortex) ── */
  connectorIntel: [
    {
      id: 'conn-1',
      connector: 'misp',
      title: 'MISP Community Feed Flags New Cobalt Strike C2 Infrastructure Cluster',
      date: '2026-06-30',
      severity: 'High',
      summary: 'A shared MISP event from the CIRCL community links a cluster of 40+ IPs to active Cobalt Strike beacon traffic, cross-referenced against three ransomware intrusion cases reported this month.',
      tags: ['misp', 'cobalt-strike', 'c2'],
      iocs: [{ type: 'IP', value: '193.42.33.71' }, { type: 'IP', value: '193.42.33.88' }]
    },
    {
      id: 'conn-2',
      connector: 'misp',
      title: 'MISP Galaxy Update Adds TTPs for Qilin Ransomware Affiliate Activity',
      date: '2026-06-24',
      severity: 'Medium',
      summary: 'A MISP galaxy cluster update maps newly observed Qilin affiliate TTPs, including VPN appliance exploitation and living-off-the-land binaries used for lateral movement.',
      tags: ['misp', 'qilin', 'ttp'],
      iocs: []
    },
    {
      id: 'conn-3',
      connector: 'otx',
      title: 'OTX Pulse: Mass Scanning Campaign Targeting Exposed Fortinet Management Interfaces',
      date: '2026-06-29',
      severity: 'High',
      summary: 'A widely-subscribed OTX pulse documents a scanning wave against internet-facing FortiGate management panels, correlating with the CVE-2026-48821 KEV disclosure this week.',
      tags: ['otx', 'fortinet', 'scanning'],
      iocs: [{ type: 'IP', value: '45.155.205.14' }]
    },
    {
      id: 'conn-4',
      connector: 'otx',
      title: 'OTX Community Tracks Phishing Kit Reusing Evilginx2 Templates for M365',
      date: '2026-06-21',
      severity: 'Medium',
      summary: 'Multiple OTX contributors independently reported the same adversary-in-the-middle phishing kit targeting Microsoft 365 credentials, sharing overlapping domain infrastructure.',
      tags: ['otx', 'phishing', 'm365'],
      iocs: [{ type: 'Domain', value: 'login-secure-m365[.]com' }]
    },
    {
      id: 'conn-5',
      connector: 'pulsedive',
      title: 'Pulsedive Risk Score Spike on Newly Registered Domains Mimicking PyPI',
      date: '2026-06-27',
      severity: 'Medium',
      summary: 'Pulsedive automated scans flagged a batch of typosquat domains impersonating PyPI package pages, several already resolving to credential-harvesting pages.',
      tags: ['pulsedive', 'typosquat', 'pypi'],
      iocs: [{ type: 'Domain', value: 'pypi-mirror-cdn[.]net' }]
    },
    {
      id: 'conn-6',
      connector: 'pulsedive',
      title: 'Pulsedive Feed Correlates LockBit 4.0 Builder Leak with New Affiliate Infrastructure',
      date: '2026-07-01',
      severity: 'High',
      summary: 'Following the LockBit 4.0 builder leak, Pulsedive OSINT feeds show a rapid uptick in newly indexed IPs hosting ransomware negotiation portals built from the leaked template.',
      tags: ['pulsedive', 'lockbit', 'ransomware'],
      iocs: []
    },
    {
      id: 'conn-7',
      connector: 'yeti',
      title: 'YETI Observable Graph Links Miasma npm Worm to Prior Supply-Chain Incident',
      date: '2026-06-15',
      severity: 'High',
      summary: "Analysts using YETI to pivot on the Miasma worm's GitHub-based C2 infrastructure found reused hosting patterns from an npm supply-chain incident investigated earlier this year.",
      tags: ['yeti', 'supply-chain', 'npm'],
      iocs: [{ type: 'Hash', value: '8f14e45fceea167a5a36dedd4bea2543' }]
    },
    {
      id: 'conn-8',
      connector: 'yeti',
      title: 'YETI DFIQ Playbook Updated for PeopleSoft SSRF-to-RCE Triage',
      date: '2026-06-12',
      severity: 'Medium',
      summary: 'The YETI community published an updated forensic artifact definition set for triaging PeopleSoft SSRF exploitation, aligned with the ShinyHunters campaign disclosed this month.',
      tags: ['yeti', 'peoplesoft', 'dfir'],
      iocs: []
    },
    {
      id: 'conn-9',
      connector: 'cortex',
      title: 'Cortex Analyzer Bulk Run Confirms Malicious Classification for LSHIY IPv6 Range',
      date: '2026-07-03',
      severity: 'Critical',
      summary: 'A bulk Cortex analyzer job run by SOC teams responding to the LSHIY password-spray advisory confirmed malicious reputation scoring across the full 2a0a:d683::/32 range.',
      tags: ['cortex', 'lshiy', 'reputation'],
      iocs: [{ type: 'IPv6 Range', value: '2a0a:d683::/32' }]
    },
    {
      id: 'conn-10',
      connector: 'cortex',
      title: 'Cortex Responder Playbook Added for Automated ROPC Sign-in Blocking',
      date: '2026-07-02',
      severity: 'Medium',
      summary: 'A new Cortex active-response playbook automates Conditional Access Policy remediation when responders confirm ROPC-based sign-ins from flagged infrastructure.',
      tags: ['cortex', 'automation', 'entra-id'],
      iocs: []
    },
    {
      id: 'conn-11',
      connector: 'misp',
      title: 'MISP Feed Cross-Links Dark Web Check Point VPN Exploit Broker Listing',
      date: '2026-06-26',
      severity: 'Critical',
      summary: 'A MISP sharing group correlated a dark-web exploit-broker listing for a Check Point VPN pre-authentication RCE with telemetry already logged by three member organizations, suggesting exploitation predates public disclosure.',
      tags: ['misp', 'checkpoint', 'vpn'],
      iocs: []
    },
    {
      id: 'conn-12',
      connector: 'misp',
      title: 'MISP Taxonomy Update Adds Tags for World Leaks Extortion-Only Operations',
      date: '2026-06-20',
      severity: 'Medium',
      summary: 'The MISP community published new taxonomy tags distinguishing extortion-only data-theft groups (no encryption) from traditional ransomware, citing World Leaks as the reference case.',
      tags: ['misp', 'world-leaks', 'taxonomy'],
      iocs: []
    },
    {
      id: 'conn-13',
      connector: 'misp',
      title: 'MISP Event Warns of Azure AD Token-Replay Kit Reuse Across Campaigns',
      date: '2026-06-18',
      severity: 'High',
      summary: 'A MISP event links Evilginx2-based Azure AD token-theft infrastructure to at least two unrelated phishing campaigns, indicating shared criminal tooling rather than a single actor.',
      tags: ['misp', 'azure', 'phishing'],
      iocs: [{ type: 'Domain', value: 'aad-secure-portal[.]net' }]
    },
    {
      id: 'conn-14',
      connector: 'otx',
      title: 'OTX Pulse Tracks Qilin Affiliate Infrastructure Reuse Across Healthcare Intrusions',
      date: '2026-06-25',
      severity: 'High',
      summary: 'An OTX pulse maps overlapping C2 infrastructure across three healthcare-sector Qilin ransomware intrusions, suggesting a single affiliate is responsible for the recent wave.',
      tags: ['otx', 'qilin', 'healthcare'],
      iocs: [{ type: 'IP', value: '185.220.101.42' }]
    },
    {
      id: 'conn-15',
      connector: 'otx',
      title: 'OTX Contributors Flag Malicious npm Packages Mimicking Redhat Cloud Tooling',
      date: '2026-06-14',
      severity: 'Medium',
      summary: "Multiple OTX contributors independently reported npm packages impersonating @redhat-cloud-services libraries, consistent with the Miasma worm's known distribution pattern.",
      tags: ['otx', 'npm', 'supply-chain'],
      iocs: []
    },
    {
      id: 'conn-16',
      connector: 'otx',
      title: 'OTX Pulse Documents Fresh Wave of World Leaks Extortion Notices',
      date: '2026-06-28',
      severity: 'Medium',
      summary: 'An actively updated OTX pulse tracks new extortion-notice domains stood up by World Leaks affiliates within 24 hours of prior takedowns.',
      tags: ['otx', 'world-leaks', 'extortion'],
      iocs: [{ type: 'Domain', value: 'wl-notice-portal[.]cc' }]
    },
    {
      id: 'conn-17',
      connector: 'pulsedive',
      title: 'Pulsedive Enrichment Links Gentlemen Ransomware Payment Portals to Shared Hosting',
      date: '2026-06-27',
      severity: 'High',
      summary: 'Pulsedive scans found several Gentlemen ransomware negotiation portals hosted on the same bulletproof provider, enabling faster network-wide blocking.',
      tags: ['pulsedive', 'gentlemen', 'ransomware'],
      iocs: [{ type: 'IP', value: '194.180.48.23' }]
    },
    {
      id: 'conn-18',
      connector: 'pulsedive',
      title: 'Pulsedive Risk Scoring Flags Resurgence in ShinyHunters-Linked Infrastructure',
      date: '2026-06-13',
      severity: 'High',
      summary: 'Automated Pulsedive scans detected renewed activity on IP ranges previously associated with ShinyHunters, shortly before the PeopleSoft SSRF campaign became public.',
      tags: ['pulsedive', 'shinyhunters', 'peoplesoft'],
      iocs: [{ type: 'IP', value: '185.220.101.55' }]
    },
    {
      id: 'conn-19',
      connector: 'pulsedive',
      title: 'Pulsedive Feed Adds Bulk IOCs from Fortinet KEV Exploitation Wave',
      date: '2026-07-02',
      severity: 'High',
      summary: 'Following the CVE-2026-48821 KEV addition, Pulsedive ingested a bulk IOC submission covering scanning and post-exploitation infrastructure targeting FortiGate SSL VPN.',
      tags: ['pulsedive', 'fortinet', 'kev'],
      iocs: [{ type: 'IP', value: '45.155.205.90' }]
    },
    {
      id: 'conn-20',
      connector: 'yeti',
      title: 'YETI Case Graph Connects LockBit 4.0 Builder Leak to Prior Affiliate Dispute',
      date: '2026-07-02',
      severity: 'Medium',
      summary: 'Analysts using YETI to pivot on LockBit 4.0 builder metadata traced the leak back to an internal affiliate dispute referenced in earlier forum chatter.',
      tags: ['yeti', 'lockbit', 'ransomware'],
      iocs: []
    },
    {
      id: 'conn-21',
      connector: 'yeti',
      title: 'YETI Sigma Rule Pack Updated for Check Point VPN Exploitation Patterns',
      date: '2026-06-29',
      severity: 'Medium',
      summary: 'The YETI community contributed a Sigma rule pack targeting authentication-bypass patterns consistent with the Check Point VPN exploit broker listing.',
      tags: ['yeti', 'checkpoint', 'sigma'],
      iocs: []
    },
    {
      id: 'conn-22',
      connector: 'yeti',
      title: 'YETI Observable Import Adds Confirmed IOCs from Qilin Healthcare Intrusions',
      date: '2026-06-23',
      severity: 'High',
      summary: 'A bulk YETI import added confirmed indicators from recent Qilin ransomware intrusions across the healthcare sector, cross-referenced with OTX pulse data.',
      tags: ['yeti', 'qilin', 'healthcare'],
      iocs: [{ type: 'Hash', value: '44d88612fea8a8f36de82e1278abb02f' }]
    },
    {
      id: 'conn-23',
      connector: 'cortex',
      title: 'Cortex Analyzer Chain Automates Triage for World Leaks Extortion Domains',
      date: '2026-06-30',
      severity: 'Medium',
      summary: 'A new Cortex analyzer chain automatically enriches and scores newly registered domains matching World Leaks extortion-notice naming patterns.',
      tags: ['cortex', 'world-leaks', 'automation'],
      iocs: []
    },
    {
      id: 'conn-24',
      connector: 'cortex',
      title: 'Cortex Bulk Reputation Run Confirms Malicious Scoring for Gentlemen Ransomware Infrastructure',
      date: '2026-06-28',
      severity: 'High',
      summary: 'SOC teams running Cortex bulk analyzer jobs confirmed malicious reputation scoring across hosting infrastructure tied to Gentlemen ransomware negotiation portals.',
      tags: ['cortex', 'gentlemen', 'reputation'],
      iocs: [{ type: 'IP', value: '194.180.48.23' }]
    },
    {
      id: 'conn-25',
      connector: 'cortex',
      title: 'Cortex Responder Playbook Added for Fortinet KEV Post-Exploitation Indicators',
      date: '2026-07-03',
      severity: 'High',
      summary: 'A new Cortex active-response playbook automates containment actions when analyzers confirm post-exploitation indicators tied to the Fortinet FortiGate KEV entry.',
      tags: ['cortex', 'fortinet', 'automation'],
      iocs: []
    }
  ],

  /* ── Snowbit Advisories ── */
  snowbitAdvisories: [
    {
      id: 'snowbit-1',
      title: 'LSHIY Password Spray: Azure CLI ROPC Attack Bypasses MFA at Scale',
      source: 'Snowbit by Coralogix',
      severity: 'Critical',
      date: '2026-07-03',
      actor: 'LSHIY LLC (AS32167 / AS955)',
      pdfUrl: 'assets/advisories/lshiy-password-spray-advisory.pdf',
      tags: ['azure', 'entra-id', 'oauth-ropc', 'mfa-bypass', 'password-spray'],
      summary: 'An automated password spray campaign has executed over 81 million login attempts against Microsoft 365 tenants since June 12, 2026, abusing the deprecated OAuth 2.0 ROPC flow to bypass MFA entirely when Conditional Access Policies aren’t explicitly scoped to cover it.',
      execSummary: [
        'An automated, large-scale password spray campaign has been actively targeting Microsoft Azure CLI environments since at least June 12, 2026. The threat actor, operating from an IPv6 address range controlled by internet hosting provider LSHIY LLC (AS32167), executed over 81 million login attempts against Microsoft 365 tenants in a 14-day window.',
        'The distinguishing element of this campaign is the abuse of the OAuth 2.0 Resource Owner Password Credentials (ROPC) flow, a deprecated grant type that submits credentials directly to the /token endpoint without triggering an interactive authentication prompt. Because Conditional Access Policies (CAPs) are evaluated at the authorization endpoint, ROPC sign-ins bypass MFA enforcement entirely when policies are not explicitly scoped to cover it. This allowed the actor to compromise accounts at organizations that believed MFA was fully protecting them.',
        'Credential material consists of previously breached username/password pairs that victims had never rotated. Targeting is indiscriminate, driven entirely by credential prevalence in leaked combo lists, not industry or company size. Organizations with MFA enabled are not automatically protected — businesses who were compromised had MFA in place; none were configured to block this attack vector.'
      ],
      howItWorks: [
        { phase: 'STEP 1', title: 'Credential Acquisition', description: 'The actor sources validated username/password pairs from previously breached combo lists. Accounts where credentials were never rotated post-breach are the exclusive target population.' },
        { phase: 'STEP 2', title: 'ROPC Spray via Azure CLI', description: 'Automated tooling originating from IPv6 range 2a0a:d683::/32 (LSHIY LLC, AS32167) submits credentials directly to the Microsoft Entra ID /token endpoint using the OAuth 2.0 ROPC grant type — the same flow used by the Azure CLI for non-interactive authentication.' },
        { phase: 'STEP 3', title: 'MFA Bypass via Protocol Gap', description: 'ROPC is non-interactive. It does not redirect through the authorization endpoint where Conditional Access Policies fire. MFA prompts are injected at the authorization stage; ROPC calls to /token skip that stage entirely. Misconfigured CAPs (scoped by app, group, or trusted location) fail to intercept these sign-ins.' },
        { phase: 'STEP 4', title: 'Token Issuance & Account Access', description: 'On successful credential validation, Entra ID mints a user-delegated access token. The actor receives a valid session with no MFA challenge, granting full access to Exchange Online, Teams, SharePoint, and OneDrive for the compromised account.' }
      ],
      mfaGaps: [
        'Enforced for specific apps only (e.g., Admin Portals) — Azure CLI excluded',
        'Scoped to specific groups (e.g., Admins) — standard user accounts exposed',
        'Trusted-location exclusions — attacker IPs mislabeled as US by geolocation',
        'Report-only mode — policy logging enabled but never enforced'
      ],
      timeline: [
        { date: '2021-06-14', event: 'LSHIY LLC registers AS32167' },
        { date: '2022-06-22', event: 'LSHIY LLC registers AS955 (secondary ASN)' },
        { date: '2026-06-11', event: 'IPv6 range maintainer entry created for 2a0a:d683::/32 (per RIPE records)' },
        { date: '2026-06-12', event: 'Earliest confirmed campaign activity; 2-4 account compromises per day' },
        { date: '2026-06-19', event: 'Single-day spike: 12 user accounts compromised' },
        { date: '2026-06-22', event: 'Major surge: 30 accounts compromised across 23 businesses in one day' },
        { date: '2026-06-12 – 2026-06-26', event: 'Campaign window: 81M+ login attempts' }
      ],
      affectedComponents: [
        { component: 'Microsoft Entra ID / Azure AD', vulnerable: 'ROPC not blocked by CAP; MFA scoped to apps/groups/locations only', protectedConfig: 'CAP with userStrongAuthClientAuthNRequired enforced for All Users, All Cloud Apps' },
        { component: 'Azure CLI', vulnerable: 'All versions — ROPC is a protocol-level auth flow, not a CLI bug', protectedConfig: 'Restrict Azure CLI to admin accounts; block for standard users via CAP' },
        { component: 'Conditional Access Policies', vulnerable: 'Policies missing All Client App types coverage; report-only mode', protectedConfig: 'All Users / All Cloud Apps / All Client App Types, enforced' }
      ],
      remediation: [
        'Audit Conditional Access Policies: verify at least one policy enforces MFA (or block) for All Users, All Cloud Apps, and All Client App Types. Any scope exclusion — app, group, or location — creates an attack surface for ROPC.',
        'Enable userStrongAuthClientAuthNRequired: apply this CAP setting to enforce strong authentication at the client level. It causes ROPC-based flows to fail before token issuance, blocking this attack class entirely.',
        'Block ‘Other clients’ client app type: create a CAP targeting the ‘Other clients’ app type for non-admin users. If Azure CLI is required for admin workflows, create a separate scoped policy restricting it to privileged accounts.',
        'Force password resets for breached accounts: cross-reference user credentials against breach databases (Microsoft Entra ID Protection leaked credentials signals, HIBP Enterprise API). Reset any account appearing in breach datasets immediately.',
        'Review non-interactive sign-in logs: in Entra ID / your SIEM, query NonInteractiveUserSignInLogs for clientAppUsed = ‘Other clients’ or authenticationProtocol = ‘ropc’ from IPv6 ranges. Look for resultType = 0 (success) with no MFA claim.',
        'Block the LSHIY IPv6 range: block 2a0a:d683::/32 at firewall/proxy/CAP network location level. Geolocation of these IPs is inconsistent (resolves to both China and US Nebraska) — do not rely on location-only controls.',
        'Deploy phishing-resistant MFA: FIDO2 passkeys and certificate-based auth are immune to credential stuffing since the credential is never shared with the identity provider. Migrate high-value accounts as priority.'
      ],
      iocs: [
        { type: 'IPV6 RANGE', value: '2a0a:d683::/32', context: 'Primary source range for ROPC spray traffic' },
        { type: 'ASN', value: 'AS32167', context: 'LSHIY LLC — primary autonomous system' },
        { type: 'ASN', value: 'AS955', context: 'LSHIY LLC — secondary autonomous system' },
        { type: 'INFRASTRUCTURE', value: 'LSHIY LLC', context: 'Registered addresses in Hong Kong, Wuhan (China), and 42 Broadway NY (shared office)' },
        { type: 'AUTH PROTOCOL', value: 'OAuth 2.0 ROPC → /token', context: 'clientAppUsed: ‘Other clients’' },
        { type: 'SIGN-IN SIGNAL', value: 'authenticationProtocol: ‘ropc’', context: 'isInteractive: false · resultType: 0 (success)' },
        { type: 'MFA SIGNAL', value: 'singleFactorAuthentication', context: 'No mfa claim present in the amr claim' }
      ],
      dataprimeQueries: [
        { name: 'Detect ROPC Sign-ins from LSHIY ASNs (AS32167 + AS955)', description: 'Identifies all ROPC sign-in events originating from LSHIY LLC ASNs. resultType ‘0’ = success (immediate triage priority); non-zero = failed spray attempt.', query: 'source logs\n| filter $d.properties.authenticationProtocol:string == \'ropc\'\n| filter $d.cx_security.source_ip_geoip.asn.number ~ \'32167\'\n   || $d.cx_security.source_ip_geoip.asn.number ~ \'955\'\n| choose $m.timestamp, $d.properties.userPrincipalName, $d.callerIpAddress,\n    $d.resultType:string, $d.cx_security.source_ip, $l.applicationname\n| orderby $m.timestamp desc | limit 200' },
        { name: 'Detect Successful Single-Factor Auth from LSHIY ASNs', description: 'Finds successful password-only authentications from both LSHIY ASNs; these are confirmed compromised accounts requiring immediate response.', query: 'source logs\n| filter $d.resultType:string == \'0\'\n| filter $d.properties.authenticationRequirement:string == \'singleFactorAuthentication\'\n| filter $d.cx_security.source_ip_geoip.asn.number ~ \'32167\'\n   || $d.cx_security.source_ip_geoip.asn.number ~ \'955\'\n| choose $m.timestamp, $d.properties.userPrincipalName, $d.callerIpAddress,\n    $d.properties.appDisplayName, $d.cx_security.source_ip\n| orderby $m.timestamp desc | limit 100' },
        { name: 'Tenant-Wide ROPC Spray Volume by Account', description: 'Surfaces all spray-targeted accounts across the tenant regardless of ASN — useful for detecting campaign activity from infrastructure not yet attributed to LSHIY.', query: 'source logs\n| filter $d.properties.authenticationProtocol:string == \'ropc\'\n| groupby $d.properties.userPrincipalName, $d.callerIpAddress as attempts count()\n| filter attempts > 5\n| orderby attempts desc | limit 100' },
        { name: 'Hourly Spray Spike Detection (Last 30 Days)', description: 'ROPC attempts per user per hour. Spikes above 100/hour per account indicate active spray targeting. Tune threshold based on tenant baseline.', query: 'source logs\n| filter $d.properties.authenticationProtocol:string == \'ropc\'\n| filter $d.resultType:string != \'0\'\n| timechart count() by $d.properties.userPrincipalName span 1h\n| filter count > 100' }
      ],
      snowbitResponse: [
        'Immediate IOC enrichment: the LSHIY IPv6 range 2a0a:d683::/32 and associated ASNs (AS32167, AS955) have been ingested into the Snowbit threat intelligence platform.',
        'Customer environment scanning: Snowbit has initiated proactive sweeps across customer Coralogix environments for ROPC sign-in events, successful single-factor authentications from these IPv6 ranges, and NonInteractiveUser log entries with missing MFA claims.',
        'Advisory distribution: this advisory has been distributed to all Snowbit managed customers via the threat intelligence notification channel. Customers are advised to complete the CAP audit in Remediation within 24 hours.'
      ]
    }
  ],

  /* ── Tweetfeed (tracked Twitter/X accounts) ── */
  twitterAccounts: [],

  tweetfeedItems: [
    {
      id: 'tweet-huntio-1',
      username: 'Huntio',
      url: 'https://x.com/Huntio/status/1938214077213851648',
      date: '2026-07-02',
      text: 'New Cobalt Strike team server identified: 185.220.101.47:443, self-signed cert impersonating update.microsoft-cdn[.]net. Still live as of this morning. #C2 #ThreatIntel',
      summary: 'Hunt.io flagged a live Cobalt Strike team server spoofing a Microsoft CDN hostname via a self-signed certificate, still active at time of posting.',
      severity: 'High',
      tags: ['c2', 'cobaltstrike', 'infrastructure']
    },
    {
      id: 'tweet-huntio-2',
      username: 'Huntio',
      url: 'https://x.com/Huntio/status/1936988341027594240',
      date: '2026-06-28',
      text: 'Tracking a cluster of ~40 lookalike domains standing up phishing kits targeting regional banking customers, all resolving to the same /24 hosted with a bulletproof provider. IOCs in thread.',
      summary: 'Hunt.io is tracking a cluster of ~40 lookalike phishing domains targeting regional banking customers, hosted on shared bulletproof infrastructure.',
      severity: 'Medium',
      tags: ['phishing', 'banking', 'infrastructure']
    }
  ],

  /* ── DataPrime Query Templates ── */
  queryTemplates: [
    {
      id: 'qt-1',
      name: 'Suspicious Network Connections',
      category: 'network',
      template: 'source logs\n| filter $d.event_type == "network_connection"\n| filter $d.destination_port in [${PORTS}]\n| filter $d.destination_ip not in [${WHITELIST_IPS}]\n| groupby $d.source_ip, $d.destination_ip, $d.destination_port\n| count() as connection_count\n| filter connection_count > ${THRESHOLD}\n| sort -connection_count'
    },
    {
      id: 'qt-2',
      name: 'Suspicious Process Execution',
      category: 'endpoint',
      template: 'source logs\n| filter $d.event_type == "process_creation"\n| filter $d.process_name in [${SUSPICIOUS_PROCESSES}]\n| filter $d.parent_process not in [${NORMAL_PARENTS}]\n| groupby $d.hostname, $d.user, $d.process_name, $d.command_line\n| count() as exec_count\n| sort -exec_count'
    },
    {
      id: 'qt-3',
      name: 'Failed Authentication Spray',
      category: 'identity',
      template: 'source logs\n| filter $d.event_type == "authentication"\n| filter $d.auth_result == "failure"\n| groupby $d.source_ip, $d.target_user\n| count() as fail_count\n| filter fail_count > ${THRESHOLD}\n| sort -fail_count'
    },
    {
      id: 'qt-4',
      name: 'Cloud API Anomalous Activity',
      category: 'cloud',
      template: 'source logs\n| filter $d.cloud_provider == "${PROVIDER}"\n| filter $d.event_type in ["CreateUser", "AttachPolicy", "AssumeRole", "PutBucketPolicy"]\n| filter $d.source_ip not in [${KNOWN_IPS}]\n| groupby $d.source_ip, $d.event_type, $d.user_identity\n| count() as api_calls\n| filter api_calls > ${THRESHOLD}\n| sort -api_calls'
    },
    {
      id: 'qt-5',
      name: 'DNS Exfiltration Detection',
      category: 'network',
      template: 'source logs\n| filter $d.event_type == "dns_query"\n| filter $d.query_length > 50\n| filter $d.query_type in ["TXT", "CNAME", "MX"]\n| groupby $d.source_ip, $d.query_domain\n| count() as query_count\n| filter query_count > ${THRESHOLD}\n| sort -query_count'
    }
  ],

  /* ── Metadata ── */
  meta: {
    lastBuilt: new Date().toISOString(),
    lastFetch: '2026-07-01T09:00:00Z',
    fetchInterval: '6h',
    totalPublished: 18
  }
};


/* ═══════════════════════════════════════════════════════════════════
   Data Manager — localStorage CRUD
   ═══════════════════════════════════════════════════════════════════ */
const DataManager = {
  STORAGE_KEY: 'tip_data',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved data with defaults (keep structure, override with saved)
        Object.assign(TIP_DATA.feedItems, parsed.feedItems || []);
        if (parsed.adversaries) TIP_DATA.adversaries = parsed.adversaries;
        if (parsed.hypotheses) TIP_DATA.hypotheses = parsed.hypotheses;
        if (parsed.darkwebItems) TIP_DATA.darkwebItems = parsed.darkwebItems;
        if (parsed.connectorIntel) TIP_DATA.connectorIntel = parsed.connectorIntel;
        if (parsed.snowbitAdvisories) TIP_DATA.snowbitAdvisories = parsed.snowbitAdvisories;
        if (parsed.twitterAccounts) TIP_DATA.twitterAccounts = parsed.twitterAccounts;
        if (parsed.tweetfeedItems) TIP_DATA.tweetfeedItems = parsed.tweetfeedItems;
        if (parsed.meta) Object.assign(TIP_DATA.meta, parsed.meta);
      } catch (e) {
        console.warn('Failed to load saved data, using defaults');
      }
    }
    // Seed the tracked-account list from the repo-committed config (only if
    // nothing was restored from localStorage above) — see js/tweetfeed-accounts.js
    // for why this can't just live in the TIP_DATA literal.
    if (!TIP_DATA.twitterAccounts || !TIP_DATA.twitterAccounts.length) {
      TIP_DATA.twitterAccounts = (typeof TWEETFEED_ACCOUNTS !== 'undefined' && Array.isArray(TWEETFEED_ACCOUNTS))
        ? TWEETFEED_ACCOUNTS.slice()
        : ['Huntio'];
    }
    this.mergeAutoFetched();
    this.mergeAutoFetchedHypotheses();
    this.mergeAutoFetchedAdversaries();
    this.mergeAutoFetchedDarkweb();
    this.mergeAutoFetchedConnectors();
    this.mergeAutoFetchedTweetfeed();
    this.save();
  },

  // Validates one TIP_AUTOFEED entry before it's allowed anywhere near
  // feedItems. autofeed.js is generated by scripts/fetch-intel.mjs from LLM
  // output derived from arbitrary web pages — this is the actual trust
  // boundary in the shipped app, so re-check everything here even though the
  // generator script already validates. Returns null (drop) on any failure
  // rather than trying to repair a bad field.
  _sanitizeAutoFetchedItem(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.id !== 'string' || !raw.id.startsWith('auto-')) return null;
    if (!TIP_DATA.categories[raw.category]) return null;
    if (!(raw.severity in TIP_DATA.sevRank)) return null;
    if (typeof raw.url !== 'string' || !/^https?:\/\//i.test(raw.url.trim())) return null;
    if (typeof raw.title !== 'string' || !raw.title.trim()) return null;
    if (typeof raw.summary !== 'string' || !raw.summary.trim()) return null;

    const cve = typeof raw.cve === 'string' && /^CVE-\d{4}-\d{4,7}$/i.test(raw.cve.trim()) ? raw.cve.trim().toUpperCase() : null;
    const cvss = typeof raw.cvss === 'number' && raw.cvss >= 0 && raw.cvss <= 10 ? raw.cvss : null;
    const tags = Array.isArray(raw.tags) ? raw.tags.filter(t => typeof t === 'string' && /^[\w.-]{1,32}$/.test(t)).slice(0, 8) : [];

    return {
      id: raw.id,
      title: raw.title.trim().slice(0, 200),
      category: raw.category,
      severity: raw.severity,
      cve,
      cvss,
      date: typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date.trim()) ? raw.date.trim() : new Date().toISOString().slice(0, 10),
      actor: typeof raw.actor === 'string' && raw.actor.trim() ? raw.actor.trim().slice(0, 120) : null,
      source: (typeof raw.source === 'string' && raw.source.trim() ? raw.source.trim() : 'Unknown').slice(0, 100),
      url: raw.url.trim(),
      summary: raw.summary.trim().slice(0, 800),
      tags,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  // Merges TIP_AUTOFEED (js/autofeed.js, regenerated by scripts/fetch-intel.mjs
  // every 6 hours) directly into the live, published feed — same as
  // mergeAutoFetchedHypotheses/Adversaries/Darkweb, no pending/approval gate.
  // Dedupes by id against feedItems so already-seen items from a prior fetch
  // aren't re-added.
  mergeAutoFetched() {
    if (typeof TIP_AUTOFEED === 'undefined' || !Array.isArray(TIP_AUTOFEED) || !TIP_AUTOFEED.length) return;
    const knownIds = new Set(TIP_DATA.feedItems.map(i => i.id));
    const fresh = TIP_AUTOFEED
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedItem(item))
      .filter(Boolean);
    if (!fresh.length) return;
    fresh.forEach(item => {
      TIP_DATA.feedItems.unshift({ ...item, status: 'published' });
    });
    TIP_DATA.meta.totalPublished = TIP_DATA.feedItems.length;
    TIP_DATA.meta.lastFetch = new Date().toISOString();
  },

  // Best-effort name/ref -> id resolution for auto-fetched hypotheses, which
  // can't know internal ids. Returns null rather than guessing on no match.
  _resolveAdversaryIdByName(name) {
    if (typeof name !== 'string' || !name.trim()) return null;
    const needle = name.trim().toLowerCase();
    const match = TIP_DATA.adversaries.find(a =>
      a.name.toLowerCase() === needle ||
      (Array.isArray(a.aliases) && a.aliases.some(al => al.toLowerCase() === needle))
    );
    return match ? match.id : null;
  },

  _resolveFeedItemIdByRef(ref) {
    if (typeof ref !== 'string' || !ref.trim()) return null;
    const needle = ref.trim().toLowerCase();
    const match = TIP_DATA.feedItems.find(i =>
      (i.cve && i.cve.toLowerCase() === needle) ||
      i.title.toLowerCase().includes(needle) ||
      needle.includes(i.title.toLowerCase())
    );
    return match ? match.id : null;
  },

  // Same trust-boundary posture as _sanitizeAutoFetchedItem above: this is LLM
  // output derived from arbitrary web pages, re-validate everything even
  // though the generator (lib/intel/schemas.mjs) already sanitized it.
  _sanitizeAutoFetchedHypothesis(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.id !== 'string' || !raw.id.startsWith('auto-hypo-')) return null;
    const title = typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim().slice(0, 200) : null;
    const description = typeof raw.description === 'string' && raw.description.trim() ? raw.description.trim().slice(0, 800) : null;
    const mitreTactic = typeof raw.mitreTactic === 'string' && raw.mitreTactic.trim() ? raw.mitreTactic.trim().slice(0, 80) : null;
    const mitreTechnique = typeof raw.mitreTechnique === 'string' && raw.mitreTechnique.trim() ? raw.mitreTechnique.trim().slice(0, 120) : null;
    if (!title || !description || !mitreTactic || !mitreTechnique) return null;
    if (!['P1', 'P2', 'P3', 'P4'].includes(raw.priority)) return null;

    const dataSources = Array.isArray(raw.dataSources)
      ? raw.dataSources.filter(s => typeof s === 'string' && s.trim()).slice(0, 6).map(s => s.trim().slice(0, 60))
      : [];
    const queries = Array.isArray(raw.queries)
      ? raw.queries
        .filter(q => q && typeof q.name === 'string' && q.name.trim() && typeof q.query === 'string' && q.query.trim())
        .slice(0, 3)
        .map(q => ({ name: q.name.trim().slice(0, 100), query: q.query.trim().slice(0, 2000) }))
      : [];

    return {
      id: raw.id,
      title,
      description,
      mitreTactic,
      mitreTechnique,
      dataSources,
      priority: raw.priority,
      status: 'active',
      linkedAdversary: this._resolveAdversaryIdByName(raw.linkedAdversaryName),
      linkedFeedItem: this._resolveFeedItemIdByRef(raw.linkedFeedItemRef),
      createdAt: new Date().toISOString().split('T')[0],
      queries,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  _sanitizeAutoFetchedAdversary(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.id !== 'string' || !raw.id.startsWith('auto-adv-')) return null;
    const name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim().slice(0, 120) : null;
    const notes = typeof raw.notes === 'string' && raw.notes.trim() ? raw.notes.trim().slice(0, 800) : null;
    if (!name || !notes) return null;
    if (!['apt', 'criminal', 'hacktivist'].includes(raw.type)) return null;

    const strArr = (v, max, len) => Array.isArray(v)
      ? v.filter(s => typeof s === 'string' && s.trim()).slice(0, max).map(s => s.trim().slice(0, len))
      : [];

    return {
      id: raw.id,
      name,
      aliases: strArr(raw.aliases, 8, 60),
      type: raw.type,
      origin: typeof raw.origin === 'string' && raw.origin.trim() ? raw.origin.trim().slice(0, 60) : 'Unknown',
      motivation: typeof raw.motivation === 'string' && raw.motivation.trim() ? raw.motivation.trim().slice(0, 60) : 'Unknown',
      sectors: strArr(raw.sectors, 10, 60),
      ttps: strArr(raw.ttps, 15, 20).filter(t => /^T\d{4}(\.\d{3})?$/i.test(t)).map(t => t.toUpperCase()),
      campaigns: strArr(raw.campaigns, 10, 150),
      iocs: strArr(raw.iocs, 20, 120),
      notes,
      active: true,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  _sanitizeAutoFetchedDarkweb(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.id !== 'string' || !raw.id.startsWith('auto-dw-')) return null;
    if (!['leak', 'credential', 'exploit', 'ransomware', 'chatter'].includes(raw.type)) return null;
    const title = typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim().slice(0, 200) : null;
    const snippet = typeof raw.snippet === 'string' && raw.snippet.trim() ? raw.snippet.trim().slice(0, 600) : null;
    if (!title || !snippet) return null;

    const relevance = typeof raw.relevance === 'number' ? Math.max(0, Math.min(100, Math.round(raw.relevance))) : 50;
    const tags = Array.isArray(raw.tags) ? raw.tags.filter(t => typeof t === 'string' && /^[\w.-]{1,32}$/.test(t)).slice(0, 8) : [];

    return {
      id: raw.id,
      title,
      type: raw.type,
      source: typeof raw.source === 'string' && raw.source.trim() ? raw.source.trim().slice(0, 100) : 'Unknown',
      date: typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date.trim()) ? raw.date.trim() : new Date().toISOString().slice(0, 10),
      snippet,
      relevance,
      flagged: false,
      tags,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  _sanitizeAutoFetchedConnectorIntel(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.id !== 'string' || !raw.id.startsWith('auto-conn-')) return null;
    if (!['misp', 'otx', 'pulsedive', 'yeti', 'cortex'].includes(raw.connector)) return null;
    if (!(raw.severity in TIP_DATA.sevRank)) return null;
    const title = typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim().slice(0, 200) : null;
    const summary = typeof raw.summary === 'string' && raw.summary.trim() ? raw.summary.trim().slice(0, 600) : null;
    if (!title || !summary) return null;

    const tags = Array.isArray(raw.tags) ? raw.tags.filter(t => typeof t === 'string' && /^[\w.-]{1,32}$/.test(t)).slice(0, 8) : [];
    const iocs = Array.isArray(raw.iocs)
      ? raw.iocs.filter(i => i && typeof i.type === 'string' && i.type.trim() && typeof i.value === 'string' && i.value.trim())
        .slice(0, 10)
        .map(i => ({ type: i.type.trim().slice(0, 40), value: i.value.trim().slice(0, 200) }))
      : [];

    return {
      id: raw.id,
      connector: raw.connector,
      title,
      date: typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date.trim()) ? raw.date.trim() : new Date().toISOString().slice(0, 10),
      severity: raw.severity,
      summary,
      tags,
      iocs,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  _sanitizeAutoFetchedTweetfeedItem(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.id !== 'string' || !raw.id.startsWith('auto-tweet-')) return null;
    if (typeof raw.username !== 'string' || !/^\w{1,15}$/.test(raw.username.trim())) return null;
    if (typeof raw.url !== 'string' || !/^https:\/\/(x|twitter)\.com\/\w{1,15}\/status\/\d+/i.test(raw.url.trim())) return null;
    if (!(raw.severity in TIP_DATA.sevRank)) return null;
    const text = typeof raw.text === 'string' && raw.text.trim() ? raw.text.trim().slice(0, 500) : null;
    const summary = typeof raw.summary === 'string' && raw.summary.trim() ? raw.summary.trim().slice(0, 300) : null;
    if (!text || !summary) return null;

    const tags = Array.isArray(raw.tags) ? raw.tags.filter(t => typeof t === 'string' && /^[\w.-]{1,32}$/.test(t)).slice(0, 6) : [];

    return {
      id: raw.id,
      username: raw.username.trim(),
      url: raw.url.trim(),
      date: typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date.trim()) ? raw.date.trim() : new Date().toISOString().slice(0, 10),
      text,
      summary,
      severity: raw.severity,
      tags,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  // Auto-fetched hypotheses/adversaries/dark-web/connector/tweetfeed items
  // publish directly into their live arrays — unlike feed items, there's no
  // pending queue for these sections (manual adds don't go through one
  // either). Only the existing admin-only edit/delete controls gate them
  // after the fact.
  mergeAutoFetchedHypotheses() {
    if (typeof TIP_AUTOFEED_HUNTLAB === 'undefined' || !Array.isArray(TIP_AUTOFEED_HUNTLAB) || !TIP_AUTOFEED_HUNTLAB.length) return;
    const knownIds = new Set(TIP_DATA.hypotheses.map(h => h.id));
    TIP_AUTOFEED_HUNTLAB
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedHypothesis(item))
      .filter(Boolean)
      .forEach(item => TIP_DATA.hypotheses.push(item));
  },

  mergeAutoFetchedAdversaries() {
    if (typeof TIP_AUTOFEED_ADVERSARY === 'undefined' || !Array.isArray(TIP_AUTOFEED_ADVERSARY) || !TIP_AUTOFEED_ADVERSARY.length) return;
    const knownIds = new Set(TIP_DATA.adversaries.map(a => a.id));
    TIP_AUTOFEED_ADVERSARY
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedAdversary(item))
      .filter(Boolean)
      .forEach(item => TIP_DATA.adversaries.push(item));
  },

  mergeAutoFetchedDarkweb() {
    if (typeof TIP_AUTOFEED_DARKWEB === 'undefined' || !Array.isArray(TIP_AUTOFEED_DARKWEB) || !TIP_AUTOFEED_DARKWEB.length) return;
    const knownIds = new Set(TIP_DATA.darkwebItems.map(d => d.id));
    TIP_AUTOFEED_DARKWEB
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedDarkweb(item))
      .filter(Boolean)
      .forEach(item => TIP_DATA.darkwebItems.unshift(item));
  },

  mergeAutoFetchedConnectors() {
    if (typeof TIP_AUTOFEED_CONNECTORS === 'undefined' || !Array.isArray(TIP_AUTOFEED_CONNECTORS) || !TIP_AUTOFEED_CONNECTORS.length) return;
    const knownIds = new Set(TIP_DATA.connectorIntel.map(c => c.id));
    TIP_AUTOFEED_CONNECTORS
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedConnectorIntel(item))
      .filter(Boolean)
      .forEach(item => TIP_DATA.connectorIntel.unshift(item));
  },

  mergeAutoFetchedTweetfeed() {
    if (typeof TIP_AUTOFEED_TWEETFEED === 'undefined' || !Array.isArray(TIP_AUTOFEED_TWEETFEED) || !TIP_AUTOFEED_TWEETFEED.length) return;
    const knownIds = new Set(TIP_DATA.tweetfeedItems.map(t => t.id));
    TIP_AUTOFEED_TWEETFEED
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedTweetfeedItem(item))
      .filter(Boolean)
      .forEach(item => TIP_DATA.tweetfeedItems.unshift(item));
  },

  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        feedItems: TIP_DATA.feedItems,
        adversaries: TIP_DATA.adversaries,
        hypotheses: TIP_DATA.hypotheses,
        darkwebItems: TIP_DATA.darkwebItems,
        connectorIntel: TIP_DATA.connectorIntel,
        snowbitAdvisories: TIP_DATA.snowbitAdvisories,
        twitterAccounts: TIP_DATA.twitterAccounts,
        tweetfeedItems: TIP_DATA.tweetfeedItems,
        meta: TIP_DATA.meta
      }));
    } catch (e) {
      console.warn('Failed to save data to localStorage');
    }
  },

  // Feed items — auto-fetched and manually-added items publish directly (no
  // approval gate); admin can only add or delete.
  getPublishedItems() {
    return TIP_DATA.feedItems.filter(i => i.status === 'published');
  },

  addManualItem(item) {
    item.id = 'manual-' + Date.now();
    item.status = 'published';
    item.date = item.date || new Date().toISOString().split('T')[0];
    TIP_DATA.feedItems.unshift(item);
    TIP_DATA.meta.totalPublished = TIP_DATA.feedItems.length;
    this.save();
    return item;
  },

  deleteFeedItem(id) {
    TIP_DATA.feedItems = TIP_DATA.feedItems.filter(i => i.id !== id);
    TIP_DATA.meta.totalPublished = TIP_DATA.feedItems.length;
    this.save();
    return true;
  },

  // Adversaries
  getAdversaries() {
    return TIP_DATA.adversaries;
  },

  addAdversary(adv) {
    adv.id = 'adv-' + Date.now();
    TIP_DATA.adversaries.push(adv);
    this.save();
    return adv;
  },

  updateAdversary(id, updates) {
    const idx = TIP_DATA.adversaries.findIndex(a => a.id === id);
    if (idx === -1) return false;
    Object.assign(TIP_DATA.adversaries[idx], updates);
    this.save();
    return true;
  },

  deleteAdversary(id) {
    TIP_DATA.adversaries = TIP_DATA.adversaries.filter(a => a.id !== id);
    this.save();
    return true;
  },

  // Hypotheses
  getHypotheses() {
    return TIP_DATA.hypotheses;
  },

  addHypothesis(hypo) {
    hypo.id = 'hypo-' + Date.now();
    hypo.createdAt = new Date().toISOString().split('T')[0];
    hypo.queries = hypo.queries || [];
    TIP_DATA.hypotheses.push(hypo);
    this.save();
    return hypo;
  },

  updateHypothesis(id, updates) {
    const idx = TIP_DATA.hypotheses.findIndex(h => h.id === id);
    if (idx === -1) return false;
    Object.assign(TIP_DATA.hypotheses[idx], updates);
    this.save();
    return true;
  },

  deleteHypothesis(id) {
    TIP_DATA.hypotheses = TIP_DATA.hypotheses.filter(h => h.id !== id);
    this.save();
    return true;
  },

  // Dark web
  getDarkwebItems() {
    return TIP_DATA.darkwebItems;
  },

  addDarkwebItem(item) {
    item.id = 'dw-' + Date.now();
    TIP_DATA.darkwebItems.unshift(item);
    this.save();
    return item;
  },

  // Connector intel (MISP, OTX, Pulsedive, YETI, Cortex)
  getConnectorIntel() {
    return TIP_DATA.connectorIntel;
  },

  deleteConnectorIntel(id) {
    TIP_DATA.connectorIntel = TIP_DATA.connectorIntel.filter(c => c.id !== id);
    this.save();
    return true;
  },

  // Snowbit advisories
  getSnowbitAdvisories() {
    return TIP_DATA.snowbitAdvisories;
  },

  addSnowbitAdvisory(advisory) {
    advisory.id = 'snowbit-' + Date.now();
    TIP_DATA.snowbitAdvisories.unshift(advisory);
    this.save();
    return advisory;
  },

  updateSnowbitAdvisory(id, updates) {
    const idx = TIP_DATA.snowbitAdvisories.findIndex(a => a.id === id);
    if (idx === -1) return false;
    Object.assign(TIP_DATA.snowbitAdvisories[idx], updates);
    this.save();
    return true;
  },

  deleteSnowbitAdvisory(id) {
    TIP_DATA.snowbitAdvisories = TIP_DATA.snowbitAdvisories.filter(a => a.id !== id);
    this.save();
    return true;
  },

  // Tweetfeed
  getTweetfeedItems() {
    return TIP_DATA.tweetfeedItems;
  },

  deleteTweetfeedItem(id) {
    TIP_DATA.tweetfeedItems = TIP_DATA.tweetfeedItems.filter(t => t.id !== id);
    this.save();
    return true;
  },

  // Tracked Twitter/X accounts — the live copy here is browser-local (like
  // every other admin mutation in this app); js/tweetfeed-accounts.js is the
  // copy the scheduled fetch actually reads, since this is a static site
  // with no backend to receive a write from the browser. TweetfeedView's
  // "Manage Accounts" modal walks the admin through committing changes there.
  getTwitterAccounts() {
    return TIP_DATA.twitterAccounts;
  },

  addTwitterAccount(username) {
    const clean = typeof username === 'string' ? username.trim().replace(/^@/, '') : '';
    if (!/^\w{1,15}$/.test(clean)) return false;
    if (TIP_DATA.twitterAccounts.some(a => a.toLowerCase() === clean.toLowerCase())) return false;
    TIP_DATA.twitterAccounts.push(clean);
    this.save();
    return true;
  },

  removeTwitterAccount(username) {
    const before = TIP_DATA.twitterAccounts.length;
    TIP_DATA.twitterAccounts = TIP_DATA.twitterAccounts.filter(a => a.toLowerCase() !== String(username).toLowerCase());
    if (TIP_DATA.twitterAccounts.length === before) return false;
    this.save();
    return true;
  },

  // Category counts
  getCategoryCounts() {
    const counts = {};
    this.getPublishedItems().forEach(i => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  },

  // Meta
  getMeta() {
    return TIP_DATA.meta;
  },

  updateMeta(updates) {
    Object.assign(TIP_DATA.meta, updates);
    this.save();
  }
};
