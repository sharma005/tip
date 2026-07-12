/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: connector. Hand-updated via an interactive
   Claude session (WebSearch) — see lib/intel/schemas.mjs
   (CONNECTOR_SCHEMA) and lib/intel/contentTypes.mjs (cap 100) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_CONNECTORS = [
  {
    "id": "auto-conn-otx-citrixbleed-netscaler-memory-overread-cve-2026-8451-actively",
    "connector": "otx",
    "title": "CitrixBleed NetScaler memory overread (CVE-2026-8451) actively exploited",
    "date": "2026-07-09",
    "severity": "High",
    "summary": "CVE-2026-8451 ('CitrixBleed') is a pre-auth memory overread in Citrix NetScaler ADC/Gateway SAML IdP endpoints (CVSS 8.8), disclosed with patches on June 30, 2026 and exploited in the wild within 24 hours. Honeypot/decoy networks observed coordinated scanning of NetScaler SAML IdP appliances following watchTowr's detection-artifact release. Treat exposed, unpatched NetScaler SAML IdP instances as high priority.",
    "tags": [
      "citrix",
      "netscaler",
      "citrixbleed",
      "cve-2026-8451"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-12T18:43:39.365Z"
  },
  {
    "id": "auto-conn-misp-malicious-npm-pypi-payment-sdk-packages-exfiltrating-develop",
    "connector": "misp",
    "title": "Malicious npm/PyPI payment-SDK packages exfiltrating developer and CI secrets",
    "date": "2026-07-07",
    "severity": "High",
    "summary": "A cluster of ~17 typosquatted npm and PyPI packages impersonating PaySafe/Skrill/Neteller SDKs was detected on July 7, 2026, stealing credentials and tokens from developer machines and CI runners. The malware routes stolen data to Ngrok-hosted infrastructure through a multi-stage XOR/shift/reverse decoding routine and includes sandbox-evasion and anti-analysis checks. Packages were flagged within minutes of publication.",
    "tags": [
      "supply-chain",
      "npm",
      "pypi",
      "credential-theft",
      "ci-cd"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-12T18:43:39.365Z"
  },
  {
    "id": "auto-conn-otx-gitea-docker-auth-bypass-cve-2026-20896",
    "connector": "otx",
    "title": "Gitea Docker image authentication bypass (CVE-2026-20896) under active exploitation",
    "date": "2026-07-10",
    "severity": "Critical",
    "summary": "CVE-2026-20896 (CVSS 9.8) is an authentication bypass in the official Gitea Docker image, which defaults to REVERSE_PROXY_TRUSTED_PROXIES=*. With reverse-proxy auth enabled, Gitea trusts the X-WEBAUTH-USER header from any source IP, letting an unauthenticated client impersonate any user including admins. Sysdig detected in-the-wild exploitation ~13 days after disclosure; ~6,200 instances are exposed online. Patched in 1.26.3/1.26.4.",
    "tags": [
      "gitea",
      "auth-bypass",
      "cve-2026-20896",
      "docker"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-12T00:44:48.538Z"
  },
  {
    "id": "auto-conn-misp-progress-sharefile-storage-zone-controller-threat",
    "connector": "misp",
    "title": "Progress ShareFile Storage Zone Controllers shut down over credible external threat",
    "date": "2026-07-10",
    "severity": "Critical",
    "summary": "Progress Software told ShareFile customers running on-premises Storage Zone Controllers to manually power off the hosting Windows servers in response to a 'credible external security threat.' Cloud-only ShareFile accounts are unaffected and disabling cloud access alone is insufficient. No CVE or threat details were disclosed; the same component had critical auth-bypass/RCE flaws (CVE-2026-2699, CVE-2026-2701) disclosed in April 2026.",
    "tags": [
      "sharefile",
      "progress",
      "file-sharing",
      "incident"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-12T00:44:48.538Z"
  },
  {
    "id": "auto-conn-otx-uat-7810-longleash-dogleash-orb-network",
    "connector": "otx",
    "title": "China-nexus UAT-7810 expands ORB network with new LONGLEASH/DOGLEASH malware",
    "date": "2026-07-08",
    "severity": "High",
    "summary": "Cisco Talos reported that China-nexus UAT-7810, which builds ORB (Operational Relay Box) networks for secondary APTs such as UAT-5918, has expanded its malware arsenal with LONGLEASH (a SHORTLEASH successor) and two new backdoors: C-based DOGLEASH and Java-based JARLEASH. New servers host MIPS/ARM/x64 payloads pulled by shell scripts. Initial access uses n-day router vulns in Ruckus (CVE-2020-22653/22658, CVE-2023-25717) and ASUS AiCloud (CVE-2025-2492).",
    "tags": [
      "uat-7810",
      "orb",
      "longleash",
      "china"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-12T00:44:48.538Z"
  },
  {
    "id": "auto-conn-pulsedive-cavern-manticore-iran-c2-framework",
    "connector": "pulsedive",
    "title": "Iran-nexus Cavern Manticore deploys modular Cavern C2 framework against Israeli orgs",
    "date": "2026-07-06",
    "severity": "High",
    "summary": "Check Point Research detailed Cavern Manticore, an Iran-nexus (MOIS-affiliated) APT using a previously undocumented modular .NET C2 framework dubbed Cavern (aka Cav3rn) against Israeli IT providers and government, plus aviation/energy/public-sector targets across the Middle East. The framework spans .NET Framework, mixed-mode C++/CLI and NativeAOT builds, using DLL side-loading and AppDomain unloading with low VirusTotal detection. Tactical overlaps noted with MuddyWater and Lyceum.",
    "tags": [
      "cavern-manticore",
      "iran",
      "c2",
      "israel"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-12T00:44:48.538Z"
  },
  {
    "id": "auto-conn-otx-jadepuffer-agentic-ransomware-langflow-cve-2025-3248",
    "connector": "otx",
    "title": "JADEPUFFER agentic ransomware exploiting Langflow (CVE-2025-3248)",
    "date": "2026-07-08",
    "severity": "Critical",
    "summary": "Sysdig reported JADEPUFFER, an AI-agent-driven ransomware operation that exploited an internet-facing Langflow instance via CVE-2025-3248 for unauthenticated code execution, harvested credentials, then pivoted to a production MySQL/Alibaba Nacos server and encrypted 1,342 configuration items for extortion. The randomly generated key was never stored or transmitted, preventing recovery.",
    "tags": [
      "ransomware",
      "ai-agent",
      "langflow",
      "cve-2025-3248"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-11T18:46:47.033Z"
  },
  {
    "id": "auto-conn-misp-injective-labs-npm-sdk-wallet-key-stealer",
    "connector": "misp",
    "title": "Injective Labs npm SDK supply-chain wallet-key stealer",
    "date": "2026-07-08",
    "severity": "High",
    "summary": "A backdoored @injectivelabs/sdk-ts@1.20.21 (and 17 dependent packages) captured BIP-39 seed phrases and private keys by hooking PrivateKey.fromMnemonic()/fromHex(), exfiltrating them base64-encoded inside the X-Request-Id header. It was live for roughly 49 minutes before maintainers reverted to clean 1.20.23. Detected by Socket, Ox Security and StepSecurity.",
    "tags": [
      "supply-chain",
      "npm",
      "injective",
      "wallet-stealer"
    ],
    "iocs": [
      {
        "type": "Domain",
        "value": "testnet.archival.chain.grpc-web.injective.network"
      },
      {
        "type": "npm package",
        "value": "@injectivelabs/sdk-ts@1.20.21"
      }
    ],
    "fetchedAt": "2026-07-11T18:46:47.033Z"
  },
  {
    "id": "auto-conn-pulsedive-silver-fox-modbeacon-rust-rat-cdn-c2",
    "connector": "pulsedive",
    "title": "Silver Fox MODBEACON Rust RAT using CDN-fronted gRPC C2",
    "date": "2026-07-10",
    "severity": "High",
    "summary": "QiAnXin attributed a new Rust-based RAT, MODBEACON, to China-linked Silver Fox, distributed via SEO poisoning and counterfeit installers. MODBEACON fingerprints hosts, loads plugins, persists through scheduled tasks and uses Amazon and Cloudflare CDN infrastructure for gRPC-based command-and-control, complicating IP-based blocking.",
    "tags": [
      "silver-fox",
      "modbeacon",
      "rat",
      "seo-poisoning",
      "c2"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-11T18:46:47.033Z"
  },
  {
    "id": "auto-conn-otx-goddamn-ransomware-poisonx-signed-driver-byovd-edr-kill",
    "connector": "otx",
    "title": "GodDamn ransomware PoisonX signed-driver BYOVD EDR kill",
    "date": "2026-07-09",
    "severity": "High",
    "summary": "Symantec disclosed GodDamn ransomware (Hyadina lineage) abusing a Microsoft-signed malicious kernel driver, PoisonX, to terminate endpoint defenses before encryption. The intrusion chained AnyDesk, PsExec and a Mimikatz/NirSoft credential toolkit, with the driver delivered via a fake Symantec-branded evasion tool.",
    "tags": [
      "ransomware",
      "byovd",
      "poisonx",
      "edr-evasion",
      "hyadina"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-11T17:05:13.000Z"
  },
  {
    "id": "auto-conn-pulsedive-ubiquiti-unifi-connect-cve-2026-50746-command-injection",
    "connector": "pulsedive",
    "title": "Ubiquiti UniFi Connect CVE-2026-50746 command injection",
    "date": "2026-07-08",
    "severity": "Critical",
    "summary": "Ubiquiti patched a CVSS 10.0 unauthenticated command-injection flaw (CVE-2026-50746) in UniFi Connect (<=3.4.16), one of seven critical UniFi fixes. Any network-adjacent attacker can execute arbitrary OS commands; Censys reports ~100,000 UniFi OS endpoints exposed to the internet. Update to UniFi Connect 3.4.20+.",
    "tags": [
      "ubiquiti",
      "unifi",
      "command-injection",
      "cve-2026-50746",
      "rce"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-11T17:05:13.000Z"
  },
  {
    "id": "auto-conn-misp-cisa-kev-joomla-file-upload-icagenda-balbooa-cve-2026-48939",
    "connector": "misp",
    "title": "CISA KEV adds Joomla iCagenda & Balbooa Forms file-upload flaws (CVE-2026-48939, CVE-2026-56291)",
    "date": "2026-07-10",
    "severity": "High",
    "summary": "CISA added two actively exploited Joomla extension flaws to its KEV catalog on July 10, 2026: CVE-2026-48939 (iCagenda) and CVE-2026-56291 (Balbooa Forms), both unrestricted uploads of dangerous file types enabling web-shell/code execution. Federal agencies must remediate under BOD 26-04.",
    "tags": [
      "cisa-kev",
      "joomla",
      "file-upload",
      "icagenda",
      "balbooa"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-11T17:05:13.000Z"
  },
  {
    "id": "auto-conn-otx-oracle-peoplesoft-peopletools-zero-day-exploited-by-shinyhun",
    "connector": "otx",
    "title": "Oracle PeopleSoft PeopleTools zero-day exploited by ShinyHunters (CVE-2026-35273)",
    "date": "2026-06-11",
    "severity": "Critical",
    "summary": "OTX/community trackers are circulating context on CVE-2026-35273, a CVSS 9.8 unauthenticated RCE in Oracle PeopleSoft PeopleTools (8.61/8.62) exploited in the wild as a zero-day from late May 2026. Mandiant attributes the data-theft and extortion campaign to UNC6240 (ShinyHunters), with universities heavily represented among 100-plus notified victims. No consolidated public IOC set is confirmed here.",
    "tags": [
      "oracle",
      "peoplesoft",
      "shinyhunters",
      "exploited"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-11T00:41:28.000Z"
  },
  {
    "id": "auto-conn-otx-rogueplanet-windows-defender-quarantine-pipeline-zero-day-lp",
    "connector": "otx",
    "title": "RoguePlanet Windows Defender quarantine-pipeline zero-day (LPE to SYSTEM)",
    "date": "2026-07-08",
    "severity": "Critical",
    "summary": "Community trackers are sharing analysis of RoguePlanet, an uncoordinated Windows local privilege-escalation zero-day whose PoC was published on GitHub on June 10, 2026 with no CVE and no patch. It abuses Defender's quarantine pipeline, NTFS junctions and the WER QueueReporting scheduled task to execute a payload as SYSTEM; Microsoft patched it in early July 2026. No consolidated public IOC set is confirmed here.",
    "tags": [
      "windows",
      "defender",
      "zero-day",
      "lpe"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-11T00:41:28.000Z"
  },
  {
    "id": "auto-conn-misp-the-gentlemen-raas-gentlekiller-edr-killer-and-fortigate-ini",
    "connector": "misp",
    "title": "The Gentlemen RaaS GentleKiller EDR-killer and FortiGate initial access",
    "date": "2026-07-06",
    "severity": "High",
    "summary": "MISP communities are tracking The Gentlemen ransomware-as-a-service group, which gains initial access mainly via internet-facing Fortinet FortiGate/SSL-VPN devices and stolen credentials, propagates through NETLOGON and a custom deploy_gpo.ps1 GPO workflow, and deploys the in-house GentleKiller BYOVD EDR-killer (8+ driver variants). Reporting from ESET, Securelist and Huntress documents the tradecraft. No consolidated public IOC set is confirmed here.",
    "tags": [
      "ransomware",
      "gentlemen",
      "edr-killer",
      "fortigate"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-11T00:41:28.000Z"
  },
  {
    "connector": "otx",
    "title": "Oracle E-Business Suite Payments unauthenticated takeover (CVE-2026-46817)",
    "date": "2026-06-30",
    "severity": "Critical",
    "summary": "OTX/community trackers are circulating context on active exploitation of CVE-2026-46817 (CVSS 9.8), an unauthenticated takeover flaw in the File Transmission component of Oracle Payments (Oracle EBS 12.2.3-12.2.15). Attackers abuse the ibytransmit endpoint over HTTP to read arbitrary files and compromise instances; Shadowserver logged hundreds of attempts across regions from late June 2026. No consolidated public IOC set is confirmed here.",
    "tags": [
      "oracle",
      "ebs",
      "exploited",
      "takeover"
    ],
    "iocs": [],
    "id": "auto-conn-otx-oracle-e-business-suite-payments-unauthenticated-takeover-cv",
    "fetchedAt": "2026-07-10T09:30:00.000Z"
  },
  {
    "connector": "pulsedive",
    "title": "Progress Kemp LoadMaster pre-auth root RCE (CVE-2026-8037)",
    "date": "2026-07-06",
    "severity": "Critical",
    "summary": "Community trackers are following exploitation of CVE-2026-8037 (CVSS 9.6), an OS command injection in Progress Kemp LoadMaster reachable pre-authentication via the /accessv2 API endpoint that yields root-level RCE. eSentire reported exploitation attempts from June 29, 2026, coinciding with a watchTowr Labs write-up and a public PoC. Fixed in GA v7.2.63.2 / LTSF v7.2.54.18. No consolidated public IOC set is confirmed here.",
    "tags": [
      "progress",
      "kemp",
      "loadmaster",
      "rce"
    ],
    "iocs": [],
    "id": "auto-conn-pulsedive-progress-kemp-loadmaster-pre-auth-root-rce-cve-2026-8037",
    "fetchedAt": "2026-07-10T09:30:00.000Z"
  },
  {
    "connector": "misp",
    "title": "Armored Likho LLM-assisted loader targeting government and power grids (CVE-2025-9491)",
    "date": "2026-07-04",
    "severity": "High",
    "summary": "MISP-style community reporting (Kaspersky) covers Armored Likho - overlapping BI.ZONE's Eagle Werewolf - spear-phishing government agencies and electric power operators in Russia, Kazakhstan and Brazil by exploiting the patched Windows LNK flaw CVE-2025-9491. The first-stage loader shows indicators of LLM-generated code. No consolidated public IOC set is confirmed here.",
    "tags": [
      "armored-likho",
      "apt",
      "lnk",
      "llm"
    ],
    "iocs": [],
    "id": "auto-conn-misp-armored-likho-llm-assisted-loader-targeting-government-and-p",
    "fetchedAt": "2026-07-10T09:30:00.000Z"
  },
  {
    "id": "auto-conn-otx-fortibleed-fortigate-credential-theft-inc-lynx",
    "connector": "otx",
    "title": "FortiBleed: 110M+ FortiGate credentials harvested, linked to INC & Lynx ransomware",
    "date": "2026-07-02",
    "severity": "Critical",
    "summary": "OTX/community trackers are circulating context on the FortiBleed campaign, which used a custom \"FortiGate Sniffer\" packet-capture tool on compromised firewalls to intercept SSL-VPN credentials across ~430,000 FortiGate devices, gathering 110M+ credentials. SOCRadar's STRU linked the campaign to INC Ransom and Lynx RaaS operations after an operator tied to FortiBleed infrastructure was found logged into both groups' negotiation panels. CISA has urged organizations to harden Fortinet devices and rotate credentials; no consolidated public IOC set is confirmed here.",
    "tags": [
      "fortinet",
      "fortigate",
      "credential-theft",
      "ransomware",
      "inc-ransom",
      "lynx"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-09T00:45:35.000Z"
  },
  {
    "id": "auto-conn-pulsedive-simplehelp-oidc-auth-bypass-cve-2026-48558",
    "connector": "pulsedive",
    "title": "SimpleHelp RMM OIDC auth bypass (CVE-2026-48558) exploited to drop Djinn Stealer & TaskWeaver",
    "date": "2026-07-02",
    "severity": "Critical",
    "summary": "Community intel is tracking active exploitation of CVE-2026-48558, a CVSS 10.0 authentication bypass in SimpleHelp RMM caused by acceptance of unsigned OIDC tokens, which lets unauthenticated attackers forge technician sessions on internet-facing servers. Post-exploitation, operators deploy two previously undocumented malware families, TaskWeaver and Djinn Stealer, for credential theft. Roughly 14,000 SimpleHelp servers were internet-exposed at disclosure; CISA added the flaw to KEV with a July 2, 2026 deadline.",
    "tags": [
      "simplehelp",
      "rmm",
      "auth-bypass",
      "djinn-stealer",
      "taskweaver",
      "cve-2026-48558"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-09T00:45:35.000Z"
  },
  {
    "id": "auto-conn-otx-cisco-unified-cm-zero-day-rce-cve-2026-20045",
    "connector": "otx",
    "title": "Cisco Unified CM zero-day RCE (CVE-2026-20045) active exploitation",
    "date": "2026-07-08",
    "severity": "Critical",
    "summary": "Community trackers are circulating detection guidance for CVE-2026-20045, an actively exploited RCE in Cisco Unified Communications Manager that yields root on internet-facing voice servers via crafted HTTP requests to the web management interface. Pulses focus on management-interface exploitation attempts and post-exploitation root escalation; no consolidated public IOC set has been confirmed yet.",
    "tags": [
      "cisco",
      "unified-cm",
      "rce",
      "cve-2026-20045"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-08T23:38:49.000Z"
  },
  {
    "id": "auto-conn-misp-teampcp-vect-supply-chain-ransomware",
    "connector": "misp",
    "title": "TeamPCP supply-chain credential theft feeding Vect ransomware",
    "date": "2026-07-02",
    "severity": "High",
    "summary": "MISP communities are sharing context on the TeamPCP/Vect campaign detailed by Sophos: TeamPCP poisoned widely used open-source packages (e.g. Trivy, LiteLLM) to steal CI/CD credentials, which the Vect RaaS then uses to deploy ransomware. Tracking focuses on poisoned package versions and stolen-credential reuse; specific hash/IP indicators vary by wave and are not consolidated here.",
    "tags": [
      "supply-chain",
      "teampcp",
      "vect",
      "ransomware"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-08T23:38:49.000Z"
  },
  {
    "connector": "otx",
    "title": "Ivanti EPMM mass-exploitation infrastructure (CVE-2026-1281 / CVE-2026-1340)",
    "date": "2026-07-09",
    "severity": "Critical",
    "summary": "Ongoing unauthenticated RCE exploitation of Ivanti EPMM is dominated by a single bulletproof-hosted IP (PROSPERO OOO, AS200593), responsible for roughly 83% of observed activity per GreyNoise/Unit42 telemetry. Post-exploitation drops a sleeper web shell at /mifs/403.jsp plus cryptominers or backdoors. Community trackers continue to circulate the infrastructure and host artifacts.",
    "tags": [
      "ivanti",
      "epmm",
      "rce",
      "bulletproof-hosting"
    ],
    "iocs": [
      {
        "type": "IP",
        "value": "193.24.123.42"
      },
      {
        "type": "ASN",
        "value": "AS200593 (PROSPERO OOO)"
      },
      {
        "type": "File Path",
        "value": "/mifs/403.jsp"
      },
      {
        "type": "File Path",
        "value": "/slt"
      }
    ],
    "id": "auto-conn-otx-ivanti-epmm-mass-exploitation-infrastructure-cve-2026-1281-c",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  }
];
