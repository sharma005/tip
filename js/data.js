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
    }
  ],

  /* ── Pending Items (awaiting admin approval) ── */
  pendingItems: [
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
      status: 'pending',
      fetchedAt: '2026-07-01T09:00:00Z'
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
      status: 'pending',
      fetchedAt: '2026-07-01T09:00:00Z'
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
      status: 'pending',
      fetchedAt: '2026-07-01T09:00:00Z'
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
    totalPublished: 15,
    totalPending: 3,
    totalRejected: 0
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
        if (parsed.pendingItems) TIP_DATA.pendingItems = parsed.pendingItems;
        if (parsed.adversaries) TIP_DATA.adversaries = parsed.adversaries;
        if (parsed.hypotheses) TIP_DATA.hypotheses = parsed.hypotheses;
        if (parsed.darkwebItems) TIP_DATA.darkwebItems = parsed.darkwebItems;
        if (parsed.meta) Object.assign(TIP_DATA.meta, parsed.meta);
      } catch (e) {
        console.warn('Failed to load saved data, using defaults');
      }
    }
    this.save();
  },

  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        feedItems: TIP_DATA.feedItems,
        pendingItems: TIP_DATA.pendingItems,
        adversaries: TIP_DATA.adversaries,
        hypotheses: TIP_DATA.hypotheses,
        darkwebItems: TIP_DATA.darkwebItems,
        meta: TIP_DATA.meta
      }));
    } catch (e) {
      console.warn('Failed to save data to localStorage');
    }
  },

  // Feed items
  getPublishedItems() {
    return TIP_DATA.feedItems.filter(i => i.status === 'published');
  },

  getPendingItems() {
    return TIP_DATA.pendingItems.filter(i => i.status === 'pending');
  },

  approveItem(id) {
    const idx = TIP_DATA.pendingItems.findIndex(i => i.id === id);
    if (idx === -1) return false;
    const item = { ...TIP_DATA.pendingItems[idx], status: 'published' };
    TIP_DATA.feedItems.unshift(item);
    TIP_DATA.pendingItems[idx].status = 'approved';
    TIP_DATA.meta.totalPublished++;
    TIP_DATA.meta.totalPending = this.getPendingItems().length;
    this.save();
    return true;
  },

  rejectItem(id) {
    const idx = TIP_DATA.pendingItems.findIndex(i => i.id === id);
    if (idx === -1) return false;
    TIP_DATA.pendingItems[idx].status = 'rejected';
    TIP_DATA.meta.totalRejected++;
    TIP_DATA.meta.totalPending = this.getPendingItems().length;
    this.save();
    return true;
  },

  addManualItem(item) {
    item.id = 'manual-' + Date.now();
    item.status = 'published';
    item.date = item.date || new Date().toISOString().split('T')[0];
    TIP_DATA.feedItems.unshift(item);
    TIP_DATA.meta.totalPublished++;
    this.save();
    return item;
  },

  addPendingItem(item) {
    item.id = 'pending-' + Date.now();
    item.status = 'pending';
    item.fetchedAt = new Date().toISOString();
    TIP_DATA.pendingItems.unshift(item);
    TIP_DATA.meta.totalPending = this.getPendingItems().length;
    this.save();
    return item;
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
