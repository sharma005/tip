/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: hypothesis (Hunt Lab). Hand-updated via an
   interactive Claude session (WebSearch) — see lib/intel/schemas.mjs
   (HYPOTHESIS_SCHEMA) and lib/intel/contentTypes.mjs (cap 80) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_HUNTLAB = [
  {
    "title": "Hunt for Langflow unauthenticated RCE via auto_login and validate/code (CVE-2026-9198)",
    "description": "Attackers are exploiting CVE-2026-9198 (CVSS 9.8) by chaining Langflow's /api/v1/auto_login endpoint, which issues SUPERUSER tokens to any network caller, with /api/v1/validate/code, which executes attacker-supplied Python via exec(), to gain full RCE on default Langflow deployments (versions 1.0.0-1.10.0, fixed in 1.10.1). Hunt web/proxy and application logs for requests to these endpoints from external sources, especially POSTs to /api/v1/validate/code shortly after an /api/v1/auto_login call.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "WAF Logs",
      "Application Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-9198",
    "queries": [
      {
        "name": "Langflow auto_login to validate/code exploitation chain",
        "query": "source logs\n| filter $d.http_path in [\"/api/v1/auto_login\", \"/api/v1/validate/code\"]\n| filter $d.timestamp >= \"2026-08-01T00:00:00Z\"\n| groupby $d.src_ip, $d.http_path\n| count() as hits\n| filter hits > 0\n| sort -hits"
      }
    ],
    "id": "auto-hypo-hunt-for-langflow-unauthenticated-rce-via-auto-login-and-val",
    "status": "active",
    "fetchedAt": "2026-08-05T18:46:21.613Z"
  },
  {
    "title": "Hunt for FDMTP backdoor loader from trojanized QuickFox VPN installer",
    "description": "A supply-chain compromise of the QuickFox VPN client (fixed in 3.59.6) shipped a trojanized Windows installer whose modified Electron renderer HTML downloads and runs a JavaScript loader; the loader fingerprints the host, then fetches and installs Mustang Panda's FDMTP implant. Hunt endpoints for QuickFox spawning scripting hosts or making outbound requests from its Electron/install process, and for suspicious child processes or persistence created shortly after QuickFox execution.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1195.002 - Compromise Software Supply Chain",
    "dataSources": [
      "EDR Logs",
      "Process Creation Logs",
      "DNS Logs"
    ],
    "priority": "P2",
    "linkedAdversaryName": "Mustang Panda",
    "linkedFeedItemRef": "QuickFox",
    "queries": [
      {
        "name": "QuickFox spawning scripting or LOLBin child processes",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process.contains(\"QuickFox\") || $d.parent_process in [\"quickfox.exe\"]\n| filter $d.process_name in [\"node.exe\", \"wscript.exe\", \"cscript.exe\", \"powershell.exe\", \"mshta.exe\"]\n| groupby $d.hostname, $d.process_name, $d.command_line\n| count() as spawn_count\n| filter spawn_count > 0\n| sort -spawn_count"
      }
    ],
    "id": "auto-hypo-hunt-for-fdmtp-backdoor-loader-from-trojanized-quickfox-vpn-",
    "status": "active",
    "fetchedAt": "2026-08-05T18:46:21.613Z"
  },
  {
    "title": "Hunt for INC ransomware post-exploitation web shells on SonicWall SMA 1000 (KNUCKLEBALL, Suo5, ORANGETAIL)",
    "description": "INC Ransomware is the dominant actor chaining SonicWall SMA 1000 flaws CVE-2026-15409 (CVSS 10) and CVE-2026-15410 to reach internal networks. Resecurity reports the post-exploitation toolkit includes KNUCKLEBALL, a Python script that launches the open-source Suo5 HTTP proxy and a Behinder-like custom Java web shell dubbed ORANGETAIL. Hunt appliance and adjacent web servers for anomalous Java/web-shell process activity, Suo5 proxy patterns, and Python executing from appliance paths.",
    "mitreTactic": "Persistence",
    "mitreTechnique": "T1505.003 - Server Software Component: Web Shell",
    "dataSources": [
      "Web Server Logs",
      "EDR Logs",
      "Network Traffic Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": "INC Ransom",
    "linkedFeedItemRef": "CVE-2026-15409",
    "queries": [
      {
        "name": "Web server or interpreter spawning shell/recon processes",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process in [\"java\", \"java.exe\", \"python\", \"python3\"]\n| filter $d.process_name in [\"cmd.exe\", \"sh\", \"bash\", \"whoami\", \"powershell.exe\"]\n| groupby $d.hostname, $d.parent_process, $d.process_name\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "id": "auto-hypo-hunt-for-inc-ransomware-post-exploitation-web-shells-on-soni",
    "status": "active",
    "fetchedAt": "2026-08-05T18:46:21.613Z"
  },
  {
    "id": "auto-hypo-hunt-for-cloudflared-tunnels-deployed-after-n-able-n-central",
    "title": "Hunt for cloudflared tunnels deployed after N-able N-central CVE-2026-18577 exploitation",
    "description": "Attackers exploiting the N-able N-central authentication bypass (CVE-2026-18577, added to CISA KEV on August 3, 2026) have been observed gaining admin access to N-central servers, abusing the Take Control feature to reach managed endpoints, and installing Cloudflare Tunnel (cloudflared) for persistent remote access. Hunt for cloudflared execution on RMM servers and managed endpoints where it is not a sanctioned tool, especially first-seen installs after August 1, 2026.",
    "mitreTactic": "Command and Control",
    "mitreTechnique": "T1572 - Protocol Tunneling",
    "dataSources": [
      "EDR Logs",
      "Process Creation Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-18577",
    "queries": [
      {
        "name": "cloudflared tunnel execution on servers and endpoints",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.process_name in [\"cloudflared.exe\", \"cloudflared\"]\n| filter $d.command_line.contains(\"tunnel\")\n| filter $d.timestamp >= \"2026-08-01T00:00:00Z\"\n| groupby $d.hostname, $d.parent_process\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-08-04T18:49:38.411Z"
  },
  {
    "id": "auto-hypo-hunt-for-golden-chickens-chromeggscalator-chrome-credential-",
    "title": "Hunt for Golden Chickens ChromEggscalator Chrome credential and session theft",
    "description": "Golden Chickens (Venom Spider) resurfaced in late July 2026 with new modular malware including ChromEggscalator, a TerraStealerV2 successor built on the ChromElevator Chrome encryption-bypass tool to steal browser credentials and hijack sessions. Hunt for non-browser processes reading Chrome's Login Data or Local State files, a behavior typical of app-bound-encryption bypass stealers.",
    "mitreTactic": "Credential Access",
    "mitreTechnique": "T1555.003 - Credentials from Web Browsers",
    "dataSources": [
      "EDR Logs",
      "File Access Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": "Golden Chickens",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "non-browser process reading Chrome credential stores",
        "query": "source logs\n| filter $d.event_type == \"file_access\"\n| filter $d.file_path.contains(\"\\\\Google\\\\Chrome\\\\User Data\") && ($d.file_path.contains(\"Login Data\") || $d.file_path.contains(\"Local State\"))\n| filter $d.process_name not in [\"chrome.exe\"]\n| filter $d.timestamp >= \"2026-07-25T00:00:00Z\"\n| groupby $d.hostname, $d.process_name\n| count() as access_count\n| filter access_count > 0\n| sort -access_count"
      }
    ],
    "fetchedAt": "2026-08-04T18:49:38.411Z"
  },
  {
    "id": "auto-hypo-hunt-for-armored-likho-lnk-triggered-obfuscated-powershell-l",
    "title": "Hunt for Armored Likho LNK-triggered obfuscated PowerShell loaders (CVE-2025-9491)",
    "description": "Kaspersky's Armored Likho espionage campaign against government and electric-power targets weaponizes malicious LNK shortcuts exploiting CVE-2025-9491 to launch obfuscated PowerShell that loads a decoy document and a Python-based BusySnake stealer, with Go2Tunnel used for network tunneling. Hunt for PowerShell processes spawned by explorer.exe with encoded or hidden-window arguments, consistent with LNK-triggered execution.",
    "mitreTactic": "Execution",
    "mitreTechnique": "T1059.001 - PowerShell",
    "dataSources": [
      "EDR Logs",
      "Process Creation Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": "Armored Likho",
    "linkedFeedItemRef": "CVE-2025-9491",
    "queries": [
      {
        "name": "explorer-spawned PowerShell with encoded or hidden window",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.process_name == \"powershell.exe\"\n| filter $d.parent_process in [\"explorer.exe\"]\n| filter $d.command_line.contains(\"-enc\") || $d.command_line.contains(\"-EncodedCommand\") || $d.command_line.contains(\"-w hidden\")\n| filter $d.timestamp >= \"2026-07-01T00:00:00Z\"\n| groupby $d.hostname, $d.user\n| count() as susp_ps\n| filter susp_ps > 0\n| sort -susp_ps"
      }
    ],
    "fetchedAt": "2026-08-04T18:49:38.411Z"
  },
  {
    "id": "auto-hypo-hunt-for-cve-2026-20316-hard-coded-credential-logins-to-cisc",
    "title": "Hunt for CVE-2026-20316 hard-coded credential logins to Cisco Secure FMC",
    "description": "CISA added CVE-2026-20316 to its KEV catalog on July 29, 2026 after confirming active exploitation of a hard-coded low-privilege account in Cisco Secure Firewall Management Center. Hunt for successful local-account authentications to FMC management interfaces originating from unexpected or external source addresses, which should be rare for a central firewall manager.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1078.001 - Default Accounts",
    "dataSources": [
      "Authentication Logs",
      "Network Device Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-20316",
    "queries": [
      {
        "name": "FMC local-account logins from non-management source IPs",
        "query": "source logs\n| filter $d.appliance_type == \"cisco_secure_fmc\"\n| filter $d.event_type == \"authentication\" && $d.outcome == \"success\"\n| filter $d.auth_method == \"local\"\n| filter $d.src_ip not in [\"10.0.0.0/8\", \"172.16.0.0/12\", \"192.168.0.0/16\"]\n| groupby $d.username, $d.src_ip\n| count() as logins\n| filter logins > 0\n| sort -logins"
      }
    ],
    "fetchedAt": "2026-08-01T18:45:19.126Z"
  },
  {
    "id": "auto-hypo-hunt-for-fortios-cve-2025-68686-crafted-http-information-dis",
    "title": "Hunt for FortiOS CVE-2025-68686 crafted-HTTP information disclosure and symlink persistence",
    "description": "CISA added CVE-2025-68686 to its KEV catalog on July 27, 2026. The flaw lets an attacker use crafted HTTP requests to bypass Fortinet's fix for the SSL-VPN symbolic-link persistency mechanism and read sensitive files, and it presumes an earlier filesystem-level compromise. Hunt for anomalous GET requests to FortiOS SSL-VPN language/theme endpoints that return unusually large responses, and for unexpected symlinks appearing in the web root.",
    "mitreTactic": "Persistence",
    "mitreTechnique": "T1505.003 - Server Software Component: Web Shell",
    "dataSources": [
      "Web Proxy Logs",
      "Network Traffic",
      "File Monitoring"
    ],
    "priority": "P2",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2025-68686",
    "queries": [
      {
        "name": "Large responses from FortiOS SSL-VPN remote paths",
        "query": "source logs\n| filter $d.device_vendor == \"fortinet\"\n| filter $d.http_method == \"GET\"\n| filter $d.url_path ~ \"/remote/\"\n| filter $d.http_status == 200 && $d.response_bytes > 10000\n| groupby $d.src_ip, $d.url_path\n| count() as hits\n| filter hits > 5\n| sort -hits"
      }
    ],
    "fetchedAt": "2026-08-01T18:45:19.126Z"
  },
  {
    "id": "auto-hypo-hunt-for-msarat-headless-browser-c2-via-chrome-devtools-prot",
    "title": "Hunt for msaRAT headless-browser C2 via Chrome DevTools Protocol (Chaos ransomware)",
    "description": "Cisco Talos reported that Chaos ransomware's msaRAT launches Chrome/Edge in headless mode with remote debugging enabled and tunnels C2 over WebRTC. Hunt for browser processes started with --headless and --remote-debugging-port by non-standard parent processes, which is rare in normal user activity.",
    "mitreTactic": "Command and Control",
    "mitreTechnique": "T1572 - Protocol Tunneling",
    "dataSources": [
      "EDR Logs",
      "Process Creation Logs",
      "Web Proxy Logs"
    ],
    "priority": "P2",
    "linkedAdversaryName": "Chaos",
    "linkedFeedItemRef": "msaRAT",
    "queries": [
      {
        "name": "Headless browser with remote-debugging from unusual parent",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.process_name in [\"chrome.exe\", \"msedge.exe\"]\n| filter $d.command_line.contains(\"--headless\") && $d.command_line.contains(\"--remote-debugging-port\")\n| filter $d.parent_process_name !in [\"explorer.exe\", \"chrome.exe\", \"msedge.exe\", \"services.exe\"]\n| groupby $d.hostname, $d.parent_process_name, $d.user\n| count() as launches\n| filter launches > 0\n| sort -launches"
      }
    ],
    "fetchedAt": "2026-07-29T18:46:01.726Z"
  },
  {
    "id": "auto-hypo-hunt-for-jfrog-artifactory-zero-day-exploitation-cve-2026-65",
    "title": "Hunt for JFrog Artifactory zero-day exploitation (CVE-2026-65921 path traversal and SSRF)",
    "description": "JFrog patched Artifactory zero-days (CVE-2026-65921 path traversal, CVE-2026-65923/65924 SSRF) chained for arbitrary file write and outbound access. Hunt on self-hosted Artifactory hosts for file writes containing traversal sequences and for outbound requests to internal metadata or unexpected external endpoints originating from the Artifactory service.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Application Logs",
      "EDR Logs",
      "Web Proxy Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-65921",
    "queries": [
      {
        "name": "Artifactory path traversal file write or SSRF egress",
        "query": "source logs\n| filter $d.service == \"artifactory\"\n| filter $d.event_type == \"file_write\" || $d.event_type == \"http_request\"\n| filter $d.file_path.contains(\"..\") || $d.request_url.contains(\"169.254.169.254\")\n| groupby $d.hostname, $d.file_path, $d.request_url\n| count() as hits\n| filter hits > 0\n| sort -hits"
      }
    ],
    "fetchedAt": "2026-07-29T18:46:01.726Z"
  },
  {
    "id": "auto-hypo-hunt-for-cl0p-exploitation-of-ptc-windchill-flexplm-cve-2026",
    "title": "Hunt for Cl0p exploitation of PTC Windchill/FlexPLM (CVE-2026-12569) JSP webshells",
    "description": "ReliaQuest and Ransom-ISAC reported active, likely-Cl0p exploitation of CVE-2026-12569 (CVSS 9.8) in PTC Windchill and FlexPLM, deploying hex-named JSP webshells under /Windchill/login/. Hunt for creation of .jsp files with hex-only names in that path and for the Windchill/Tomcat process spawning shells.",
    "mitreTactic": "Persistence",
    "mitreTechnique": "T1505.003 - Server Software Component: Web Shell",
    "dataSources": [
      "File Integrity Monitoring",
      "Web Server Logs",
      "EDR Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-12569",
    "queries": [
      {
        "name": "Hex-named JSP webshell dropped under Windchill login path",
        "query": "source logs\n| filter $d.event_type == \"file_creation\"\n| filter $d.file_path.contains(\"/Windchill/login/\")\n| filter $d.file_name.matches(\"^[a-f0-9]{6,}\\\\.jsp$\")\n| groupby $d.hostname, $d.file_path\n| count() as webshell_writes\n| filter webshell_writes > 0\n| sort -webshell_writes"
      }
    ],
    "fetchedAt": "2026-07-29T18:46:01.726Z"
  },
  {
    "id": "auto-hypo-hunt-for-fastjson-cve-2026-16723-zero-day-rce-exploitation-i",
    "title": "Hunt for FastJson CVE-2026-16723 zero-day RCE exploitation in Java/Spring Boot apps",
    "description": "FastJson 1.x has an unpatched, actively exploited RCE zero-day (CVE-2026-16723) reported by BleepingComputer/Imperva on July 21, 2026, hitting US organizations. Malicious JSON abuses FastJson's type-resolution to execute code, commonly in Spring Boot fat-JAR services. Hunt for Java application processes spawning shell/download utilities shortly after handling web requests, which would indicate successful post-exploitation command execution.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "EDR Logs",
      "Process Creation Logs",
      "Web Proxy Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-16723",
    "queries": [
      {
        "name": "Java processes spawning shells or download tools",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process in [\"java\", \"java.exe\"]\n| filter $d.process_name in [\"sh\", \"bash\", \"cmd.exe\", \"powershell.exe\", \"curl\", \"wget\"]\n| filter $d.timestamp >= \"2026-07-21T00:00:00Z\"\n| groupby $d.hostname, $d.parent_process, $d.process_name, $d.command_line\n| count() as spawn_count\n| sort -spawn_count"
      }
    ],
    "fetchedAt": "2026-07-29T17:09:02.760Z"
  },
  {
    "id": "auto-hypo-hunt-for-arista-velocloud-orchestrator-command-injection-cve",
    "title": "Hunt for Arista VeloCloud Orchestrator command injection (CVE-2026-16812) exploitation",
    "description": "Arista disclosed active zero-day exploitation of CVE-2026-16812 (CVSS 10.0), an unauthenticated OS command injection in on-prem VeloCloud Orchestrator, and published attacker source IPs (July 28, 2026). Hunt for inbound connections from the known malicious IPs to VCO management interfaces, and for unexpected OS commands executed by the VCO web-service account.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Firewall Logs",
      "Web Proxy Logs",
      "EDR Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-16812",
    "queries": [
      {
        "name": "Connections from known VeloCloud exploitation source IPs",
        "query": "source logs\n| filter $d.event_type == \"network_connection\"\n| filter $d.source_ip in [\"8.19.75.217\", \"206.72.242.124\", \"206.72.242.162\"]\n| filter $d.timestamp >= \"2026-07-20T00:00:00Z\"\n| groupby $d.source_ip, $d.destination_ip, $d.destination_port\n| count() as conn_count\n| sort -conn_count"
      }
    ],
    "fetchedAt": "2026-07-29T17:09:02.760Z"
  },
  {
    "id": "auto-hypo-hunt-for-the-gentlemen-ransomware-shadow-copy-deletion-befor",
    "title": "Hunt for The Gentlemen ransomware shadow-copy deletion before encryption",
    "description": "The Gentlemen ransomware group (active through 2026, latest listing Thialf ice arena July 23, 2026) uses Fortinet/VPN access, credential abuse and a self-propagating Go encryptor for double extortion, per Microsoft and Group-IB reporting. Like most crypto-ransomware it deletes volume shadow copies and backups to inhibit recovery before mass encryption. Hunt for backup/shadow-copy deletion utility execution across endpoints as an early pre-encryption signal.",
    "mitreTactic": "Impact",
    "mitreTechnique": "T1490 - Inhibit System Recovery",
    "dataSources": [
      "EDR Logs",
      "Process Creation Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": "The Gentlemen",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "Shadow copy / backup deletion utilities",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.process_name in [\"vssadmin.exe\", \"wbadmin.exe\", \"bcdedit.exe\", \"wmic.exe\"]\n| filter $d.timestamp >= \"2026-07-16T00:00:00Z\"\n| groupby $d.hostname, $d.user, $d.process_name, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-07-29T17:09:02.760Z"
  },
  {
    "id": "auto-hypo-hunt-for-steam-forum-clickfix-xmrig-cryptominer-install-via-",
    "title": "Hunt for Steam forum ClickFix XMRig cryptominer install via PowerShell, Defender exclusion, and scheduled task",
    "description": "BleepingComputer reported (July 25, 2026) that threat actors are abusing Steam discussion forums in a ClickFix campaign: fake accounts post PowerShell \"fixes\" for game/PC issues that, when run with admin rights, install an XMRig cryptominer. The loader poses as an optimization utility (\"msf utility \\ PC Opt\"), adds a Microsoft Defender exclusion, creates a hidden directory at C:\\Windows\\Background, and registers a scheduled task (prefixed \"XMRig-\") to run the miner with SYSTEM privileges at startup. Hunt for these host-side artifacts across endpoints where users may have pasted a \"fix\" command.",
    "mitreTactic": "Execution",
    "mitreTechnique": "T1059.001 - PowerShell",
    "dataSources": [
      "EDR / Process Creation Logs",
      "PowerShell Script Block Logs",
      "Windows Scheduled Task Logs",
      "Microsoft Defender Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "XMRig ClickFix artifacts: Defender exclusion, hidden dir, or XMRig- scheduled task",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.process_name in [\"powershell.exe\", \"schtasks.exe\", \"MpCmdRun.exe\", \"reg.exe\"]\n| filter $d.command_line.contains(\"XMRig-\") || $d.command_line.contains(\"Add-MpPreference -ExclusionPath\") || $d.command_line.contains(\"C:\\\\Windows\\\\Background\")\n| groupby $d.hostname, $d.user_name, $d.process_name\n| count() as hits\n| filter hits > 0\n| sort -hits"
      }
    ],
    "fetchedAt": "2026-07-26T18:42:58.158Z"
  },
  {
    "title": "Hunt for APT-C-60 SpyGlace delivery via mshta.exe and LNK/VHDX lures",
    "description": "APT-C-60, a South Korea-aligned espionage group, is running recruitment-themed spearphishing against organizations in Japan and East Asia to deploy its SpyGlace backdoor. Reported chains attach a malicious LNK file (or, more recently, a VHDX disk image) that abuses mshta.exe to execute embedded JavaScript, which then stages SpyGlace from legitimate developer/cloud services (Proton Drive, Bitbucket, GitHub). Hunt endpoint telemetry for mshta.exe spawned from Explorer or a mounted VHDX volume with script content or remote URLs on its command line, plus follow-on outbound connections to developer/file-hosting domains.",
    "mitreTactic": "Execution",
    "mitreTechnique": "T1218.005 - Mshta",
    "dataSources": [
      "EDR Logs",
      "Process Creation Logs",
      "Web Proxy Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": "APT-C-60",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "mshta.exe launched from Explorer/mounted image",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.process_name == \"mshta.exe\"\n| filter $d.parent_process in [\"explorer.exe\", \"cmd.exe\", \"wscript.exe\"]\n| groupby $d.hostname, $d.user, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "id": "auto-hypo-hunt-for-apt-c-60-spyglace-delivery-via-mshta-exe-and-lnk-vh",
    "fetchedAt": "2026-07-25T18:43:52.798Z"
  },
  {
    "title": "Hunt for Langflow unauthenticated RCE exploitation (CVE-2026-0770)",
    "description": "CISA confirmed active exploitation of CVE-2026-0770, a critical (CVSS 9.8) unauthenticated RCE in Langflow (<= 1.4.2) whose /api/v1/validate/code endpoint passes attacker-controlled input into an exec() call. Observed payloads attempt to deploy malware and harvest AWS credentials, environment variables and container/cloud metadata. Hunt web/proxy and application logs for POST requests to /api/v1/validate/code (or /validate) containing tokens like exec_globals, __import__ or subprocess, unexpected cloud-metadata (169.254.169.254) access or outbound connections from the Langflow host, and new child processes spawned by the Langflow service.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "Web Server Logs",
      "EDR Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-0770",
    "queries": [
      {
        "name": "Langflow /validate/code exploitation attempts",
        "query": "source logs\n| filter $d.event_type == \"http_request\"\n| filter $d.url_path in [\"/api/v1/validate/code\", \"/api/v1/validate\"]\n| filter $d.http_method == \"POST\"\n| filter $d.request_body contains \"exec_globals\" || $d.request_body contains \"__import__\" || $d.request_body contains \"subprocess\"\n| groupby $d.source_ip, $d.url_path, $d.status_code\n| count() as attempts\n| filter attempts > 0\n| sort -attempts"
      }
    ],
    "id": "auto-hypo-hunt-for-langflow-unauthenticated-rce-exploitation-cve-2026-",
    "status": "active",
    "fetchedAt": "2026-07-24T18:43:50.964Z"
  },
  {
    "title": "Hunt for Check Point SmartConsole authentication-bypass exploitation (CVE-2026-16232)",
    "description": "Check Point confirmed on July 22, 2026 that CVE-2026-16232, an improper-authentication flaw in the SmartConsole login process, is being exploited in the wild to obtain an application login token and log in to Security Management / Multi-Domain Management servers with full administrator privileges. Post-compromise, an attacker can alter security policy and push configuration to gateways. Hunt management-server and authentication logs for SmartConsole logins from unexpected or external source IPs (especially where Trusted Clients is unrestricted), token-based admin authentications with no preceding interactive credential prompt, and unplanned policy/object changes or newly created administrator accounts.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Authentication Logs",
      "Firewall Management Logs",
      "Network Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-16232",
    "queries": [
      {
        "name": "SmartConsole app-token admin logins from external IPs",
        "query": "source logs\n| filter $d.product == \"checkpoint_management\"\n| filter $d.event_type == \"smartconsole_login\"\n| filter $d.auth_method == \"application_token\"\n| filter $d.timestamp >= \"2026-07-20T00:00:00Z\"\n| groupby $d.source_ip, $d.admin_name\n| count() as logins\n| filter logins > 0\n| sort -logins"
      }
    ],
    "id": "auto-hypo-hunt-for-check-point-smartconsole-authentication-bypass-expl",
    "status": "active",
    "fetchedAt": "2026-07-23T18:44:55.355Z"
  },
  {
    "title": "Hunt for wp2shell WordPress Core RCE exploitation (CVE-2026-63030, CVE-2026-60137)",
    "description": "Multiple vendors (Patchstack, Wiz, watchTowr, Wordfence) confirmed in-the-wild exploitation of the wp2shell WordPress core RCE chain within hours of its July 17, 2026 disclosure. Attackers send crafted requests to the REST API batch endpoint (CVE-2026-63030) chained with a WP_Query SQL injection (CVE-2026-60137) to exfiltrate the database and drop PHP webshells. Hunt web/proxy logs for POSTs to the /wp-json/batch/v1 endpoint, HTTP 207/200 Multi-Status responses, and user agents containing \"wp2shell\" or \"rezwp2shell\", plus creation of unexpected admin users or new PHP files in webroots.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "Web Server Logs",
      "WAF Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-63030",
    "queries": [
      {
        "name": "WordPress REST batch endpoint hits with wp2shell markers",
        "query": "source logs\n| filter $d.url_path ~ \"/wp-json/batch/v1\"\n| filter $d.http_status in [200, 207]\n| filter $d.http_method == \"POST\" || $d.user_agent ~ \"(?i)(wp2shell|rezwp2shell)\"\n| groupby $d.client_ip, $d.host, $d.user_agent\n| count() as req_count\n| filter req_count > 0\n| sort -req_count"
      }
    ],
    "id": "auto-hypo-hunt-for-wp2shell-wordpress-core-rce-exploitation-cve-2026-6",
    "status": "active",
    "fetchedAt": "2026-07-22T18:45:28.539Z"
  },
  {
    "title": "Hunt for SharePoint CVE-2026-50522 exploitation and IIS machine-key theft",
    "description": "watchTowr observed active exploitation of CVE-2026-50522 (deserialization RCE) against on-premises SharePoint after a public PoC, with attackers extracting IIS machine keys via a single request to establish persistence. Hunt for anomalous requests to SharePoint _layouts endpoints, w3wp.exe spawning command interpreters, and signs of ViewState/machine-key access, since patching alone does not evict actors who already stole keys.",
    "mitreTactic": "Credential Access",
    "mitreTechnique": "T1552 - Unsecured Credentials",
    "dataSources": [
      "IIS Logs",
      "Web Server Logs",
      "EDR Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-50522",
    "queries": [
      {
        "name": "SharePoint w3wp.exe spawning shells or machine-key access",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process == \"w3wp.exe\"\n| filter $d.process_name in [\"cmd.exe\", \"powershell.exe\", \"csc.exe\", \"reg.exe\"]\n| filter $d.command_line ~ \"machineKey\" || $d.command_line ~ \"web.config\" || $d.process_name in [\"cmd.exe\", \"powershell.exe\"]\n| groupby $d.hostname, $d.process_name, $d.command_line\n| count() as hits\n| sort -hits"
      }
    ],
    "id": "auto-hypo-hunt-for-sharepoint-cve-2026-50522-exploitation-and-iis-mach",
    "status": "active",
    "fetchedAt": "2026-07-22T12:19:09.910Z"
  },
  {
    "title": "Hunt for ServiceNow CVE-2026-6875 sandbox-escape RCE via assessment_thanks.do",
    "description": "CVE-2026-6875 is a pre-authentication code-injection flaw in the ServiceNow AI Platform under active exploitation. Public research and observed in-the-wild payloads target the unauthenticated /assessment_thanks.do endpoint to escape the script sandbox and execute code. Hunt web/proxy logs for unauthenticated POSTs to /assessment_thanks.do, especially with large or encoded bodies and anomalous user agents, on self-hosted instances not patched since July 13.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "Web Server Logs",
      "Application Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-6875",
    "queries": [
      {
        "name": "Unauthenticated requests to ServiceNow assessment_thanks.do",
        "query": "source logs\n| filter $d.event_type == \"http_request\"\n| filter $d.url_path ~ \"/assessment_thanks.do\"\n| filter $d.auth_user == null || $d.auth_user == \"\"\n| groupby $d.source_ip, $d.http_method, $d.status_code\n| count() as requests\n| filter requests > 0\n| sort -requests"
      }
    ],
    "id": "auto-hypo-hunt-for-servicenow-cve-2026-6875-sandbox-escape-rce-via-ass",
    "status": "active",
    "fetchedAt": "2026-07-22T12:19:09.910Z"
  },
  {
    "title": "Hunt for UAC-0145 ClickFix PowerShell execution from fake CAPTCHA lures",
    "description": "Sandworm sub-cluster UAC-0145 uses ClickFix fake-CAPTCHA pages to trick Ukrainian users into pasting and running PowerShell via the Windows Run dialog, dropping a VBS autorun payload (GHETTOVIBE) into the Startup folder and running the SCOUTCURL recon script. Hunt for PowerShell or mshta spawned from a browser or explorer.exe with download/clipboard behaviour and for new VBS files written to Startup directories.",
    "mitreTactic": "Execution",
    "mitreTechnique": "T1204 - User Execution",
    "dataSources": [
      "EDR Logs",
      "PowerShell Logs",
      "Process Creation Logs"
    ],
    "priority": "P2",
    "linkedAdversaryName": "UAC-0145",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "PowerShell spawned from browser writing to Startup",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.process_name in [\"powershell.exe\", \"mshta.exe\", \"wscript.exe\", \"cscript.exe\"]\n| filter $d.parent_process in [\"chrome.exe\", \"msedge.exe\", \"firefox.exe\", \"explorer.exe\"]\n| filter $d.command_line ~ \"Startup\" || $d.command_line ~ \"DownloadString\" || $d.command_line ~ \".vbs\"\n| groupby $d.hostname, $d.user, $d.command_line\n| count() as exec_count\n| sort -exec_count"
      }
    ],
    "id": "auto-hypo-hunt-for-uac-0145-clickfix-powershell-execution-from-fake-ca",
    "status": "active",
    "fetchedAt": "2026-07-22T12:19:09.910Z"
  },
  {
    "title": "Hunt for HollowGraph Microsoft 365 calendar and Graph API C2 activity",
    "description": "HollowGraph, assessed as part of the Iranian-linked Cavern C2 framework, abuses a compromised Microsoft 365 account to authenticate to the Microsoft Graph API and hides commands and exfiltrated data inside calendar events dated far in the future (e.g. 2050). It also uses DNS tunnelling as a secondary channel. Hunt for anomalous Graph API app authentication and calendar events with unusual future dates or attachment activity.",
    "mitreTactic": "Command and Control",
    "mitreTechnique": "T1102 - Web Service",
    "dataSources": [
      "Microsoft 365 Audit Logs",
      "Graph API Logs",
      "DNS Logs"
    ],
    "priority": "P2",
    "linkedAdversaryName": "Cavern Manticore",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "M365 calendar events with far-future dates via Graph API",
        "query": "source logs\n| filter $d.event_type == \"graph_api_call\"\n| filter $d.operation in [\"Calendar.Create\", \"Calendar.Update\", \"Event.Create\"]\n| filter $d.event_start >= \"2040-01-01T00:00:00Z\"\n| groupby $d.user_principal_name, $d.client_app_id\n| count() as suspicious_events\n| filter suspicious_events > 0\n| sort -suspicious_events"
      }
    ],
    "id": "auto-hypo-hunt-for-hollowgraph-microsoft-365-calendar-and-graph-api-c2",
    "status": "active",
    "fetchedAt": "2026-07-20T19:14:34.526833Z"
  },
  {
    "title": "Hunt for ACR Stealer ClickFix execution chains",
    "description": "Microsoft Defender Experts reported increased ACR Stealer activity from late April to mid-June 2026 using ClickFix social-engineering lures that trick users into pasting attacker-supplied commands into the Run dialog, leading to script execution that steals browser credentials, tokens and documents. Hunt for mshta/powershell processes spawned shortly after clipboard-driven Run dialog usage.",
    "mitreTactic": "Execution",
    "mitreTechnique": "T1059.001 - PowerShell",
    "dataSources": [
      "EDR Logs",
      "Process Creation Logs"
    ],
    "priority": "P2",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "Suspicious script execution consistent with ClickFix lures",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process in [\"explorer.exe\", \"mshta.exe\"]\n| filter $d.process_name in [\"powershell.exe\", \"cmd.exe\", \"mshta.exe\"]\n| filter $d.command_line.contains(\"http\") || $d.command_line.contains(\"-enc\")\n| groupby $d.hostname, $d.user_name, $d.command_line\n| count() as exec_count\n| sort -exec_count"
      }
    ],
    "id": "auto-hypo-hunt-for-acr-stealer-clickfix-execution-chains",
    "status": "active",
    "fetchedAt": "2026-07-20T19:14:34.526833Z"
  },
  {
    "title": "Hunt for UTA0533 SonicWall SMA post-exploitation webshell and proxy",
    "description": "Volexity attributes exploitation of SonicWall SMA 1000 zero-days (CVE-2026-15409/15410) to UTA0533, which after gaining root deploys custom malware (KNUCKLEBALL) and loads Java tooling into a legitimate SonicWall process, including the Suo5 proxy and a Behinder-like webshell tracked as ORANGETAIL, to maintain access and tunnel traffic. Hunt SonicWall appliance and adjacent network logs for anomalous outbound tunnels and webshell-like request patterns.",
    "mitreTactic": "Persistence",
    "mitreTechnique": "T1505.003 - Web Shell",
    "dataSources": [
      "VPN Appliance Logs",
      "Web Proxy Logs",
      "Network Flow Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": "UTA0533",
    "linkedFeedItemRef": "CVE-2026-15409",
    "queries": [
      {
        "name": "SonicWall SMA anomalous proxy/webshell requests",
        "query": "source logs\n| filter $d.source_device_type == \"sonicwall_sma\"\n| filter $d.request_uri.contains(\"/wsproxy\") || $d.request_uri.contains(\"cgi-bin\")\n| filter $d.http_method in [\"POST\", \"CONNECT\"]\n| groupby $d.src_ip, $d.request_uri\n| count() as req_count\n| filter req_count > 5\n| sort -req_count"
      }
    ],
    "id": "auto-hypo-hunt-for-uta0533-sonicwall-sma-post-exploitation-webshell-an",
    "status": "active",
    "fetchedAt": "2026-07-20T19:14:34.526833Z"
  },
  {
    "id": "auto-hypo-hunt-for-fortisandbox-unauthenticated-os-command-injection-e",
    "title": "Hunt for FortiSandbox unauthenticated OS command injection exploitation (CVE-2026-25089 / CVE-2026-39808)",
    "description": "CISA added two Fortinet FortiSandbox OS command injection flaws (CVE-2026-25089, CVE-2026-39808) to its KEV catalog on 2026-07-16 after in-the-wild exploitation. An unauthenticated attacker sends crafted HTTP requests to the appliance management interface to inject shell metacharacters and execute commands as the underlying OS user. Hunt for FortiSandbox web-facing services spawning shell/interpreter child processes and anomalous inbound HTTP requests to admin endpoints from external IPs.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "EDR Logs",
      "Network Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-25089",
    "queries": [
      {
        "name": "FortiSandbox web service spawning shell processes",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process in [\"java\", \"httpd\", \"nginx\", \"fortisandbox\"]\n| filter $d.process_name in [\"sh\", \"bash\", \"python\", \"curl\", \"wget\", \"nc\"]\n| filter $d.timestamp >= \"2026-07-12T00:00:00Z\"\n| groupby $d.hostname, $d.process_name, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-07-18T18:45:39.935Z"
  },
  {
    "id": "auto-hypo-hunt-for-oracle-e-business-suite-payments-unauthenticated-fi",
    "title": "Hunt for Oracle E-Business Suite Payments unauthenticated file read via ibytransmit (CVE-2026-46817)",
    "description": "CVE-2026-46817 (CVSS 9.8) in Oracle E-Business Suite's Payments module is under active exploitation, with first in-the-wild activity observed on 2026-06-27 and CISA adding it to KEV on 2026-07-15. Attackers reach the unauthenticated 'ibytransmit' File Transmission endpoint and coerce an internal Oracle Java routine to read arbitrary server files such as /etc/passwd. Hunt for external HTTP requests to ibytransmit / File Transmission URIs on EBS hosts and for EBS application processes reading sensitive system files.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "Application Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-46817",
    "queries": [
      {
        "name": "Requests to Oracle EBS ibytransmit endpoint from external IPs",
        "query": "source logs\n| filter $d.event_type == \"http_request\"\n| filter $d.url_path contains \"ibytransmit\"\n| filter $d.source_ip not in [${INTERNAL_RANGES}]\n| filter $d.timestamp >= \"2026-07-01T00:00:00Z\"\n| groupby $d.source_ip, $d.http_host, $d.url_path, $d.http_status\n| count() as req_count\n| sort -req_count"
      }
    ],
    "fetchedAt": "2026-07-18T18:45:39.935Z"
  },
  {
    "id": "auto-hypo-hunt-for-sharepoint-deserialization-rce-exploitation-cve-202",
    "title": "Hunt for SharePoint deserialization RCE exploitation (CVE-2026-58644) via w3wp.exe child processes",
    "description": "Following CISA's warning of active exploitation of on-premises Microsoft SharePoint Server and the July 2026 disclosure of CVE-2026-58644 - a critical unauthenticated deserialization RCE (CVSS 9.8) - hunt for post-exploitation activity where the SharePoint IIS worker process w3wp.exe spawns command interpreters, script hosts, or the C# compiler. Such child processes off w3wp.exe are a strong signal of webshell drop or in-memory code execution after exploitation of the SharePoint deserialization flaw.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "EDR Logs",
      "Process Creation Logs",
      "Web Server Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-58644",
    "queries": [
      {
        "name": "SharePoint w3wp.exe spawning shells / compilers",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process == \"w3wp.exe\"\n| filter $d.process_name in [\"cmd.exe\", \"powershell.exe\", \"csc.exe\", \"cscript.exe\", \"wscript.exe\"]\n| filter $d.timestamp >= \"2026-07-14T00:00:00Z\"\n| groupby $d.hostname, $d.process_name, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-07-16T18:44:44.837Z"
  },
  {
    "id": "auto-hypo-hunt-sonicwall-sma1000-ssrf-to-command-exec-cve-2026-15409",
    "title": "Hunt for SonicWall SMA1000 SSRF-to-command-execution exploitation (CVE-2026-15409/15410)",
    "description": "SonicWall confirmed active zero-day exploitation of SMA1000 appliances, chaining an unauthenticated SSRF (CVE-2026-15409) with a post-auth command injection (CVE-2026-15410) to run OS commands with admin privileges. Hunt for anomalous outbound requests originating from the SMA1000 Work Place interface and for unexpected shell or interpreter child processes spawned by appliance management components.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "Firewall Logs",
      "EDR Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-15409",
    "queries": [
      {
        "name": "SMA1000 appliance spawning shells or making anomalous outbound requests",
        "query": "source logs\n| filter $d.device_type == \"sonicwall_sma1000\"\n| filter $d.event_type in [\"process_creation\", \"outbound_request\"]\n| filter $d.process_name in [\"sh\", \"bash\", \"python\", \"curl\", \"wget\"] || $d.component == \"work_place_interface\"\n| groupby $d.src_ip, $d.component, $d.process_name, $d.uri\n| count() as hits\n| filter hits > 0\n| sort -hits"
      }
    ],
    "fetchedAt": "2026-07-15T18:43:59.000Z"
  },
  {
    "id": "auto-hypo-hunt-adfs-privilege-escalation-cve-2026-56155",
    "title": "Hunt for AD FS privilege escalation abuse following CVE-2026-56155 exploitation",
    "description": "Microsoft disclosed CVE-2026-56155, an actively exploited AD FS access-control flaw allowing a low-privileged local user to gain administrator rights on the federation server. Hunt for unexpected command shells spawned under the AD FS service process, and for anomalous privilege changes or token-issuance spikes on federation servers.",
    "mitreTactic": "Privilege Escalation",
    "mitreTechnique": "T1068 - Exploitation for Privilege Escalation",
    "dataSources": [
      "Windows Security Logs",
      "EDR Logs",
      "Identity Provider Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-56155",
    "queries": [
      {
        "name": "AD FS service process spawning interactive shells",
        "query": "source logs\n| filter $d.host_role == \"adfs_server\"\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process == \"Microsoft.IdentityServer.ServiceHost.exe\"\n| filter $d.process_name in [\"cmd.exe\", \"powershell.exe\", \"rundll32.exe\"]\n| groupby $d.hostname, $d.user, $d.process_name, $d.command_line\n| count() as exec_count\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-07-15T18:43:59.000Z"
  },
  {
    "id": "auto-hypo-hunt-sharepoint-unauth-privesc-cve-2026-56164",
    "title": "Hunt for SharePoint unauthenticated privilege-escalation exploitation (CVE-2026-56164)",
    "description": "CVE-2026-56164 is an actively exploited SharePoint Server flaw (missing authentication for a critical function) that lets a remote unauthenticated attacker elevate privileges over the network. Hunt for w3wp.exe spawning command shells or the C# compiler on SharePoint web front-ends, a common indicator of post-exploitation webshell activity.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "IIS Logs",
      "Web Server Logs",
      "EDR Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-56164",
    "queries": [
      {
        "name": "SharePoint w3wp.exe spawning shells or csc.exe",
        "query": "source logs\n| filter $d.application == \"sharepoint\"\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process == \"w3wp.exe\"\n| filter $d.process_name in [\"cmd.exe\", \"powershell.exe\", \"csc.exe\"]\n| groupby $d.hostname, $d.process_name, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-07-15T18:43:59.000Z"
  },
  {
    "id": "auto-hypo-hunt-langflow-idor-flow-hijack-cve-2026-55255",
    "title": "Hunt for Langflow /api/v1/responses IDOR flow hijacking (CVE-2026-55255)",
    "description": "Sysdig's Threat Research Team observed in-the-wild exploitation (from June 25, 2026) of the Langflow IDOR CVE-2026-55255, where an authenticated attacker enumerates /api/v1/flows/ then replays another user's flow ID against /api/v1/responses to execute their flows, inject a 'leak api keys' prompt, and stage a second-stage loader. Hunt for enumeration of the flows endpoint followed by POSTs to /api/v1/responses, and for any outbound connection to the reported loader host 45.207.216.55.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "Web Server Logs",
      "Network Flow Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-55255",
    "queries": [
      {
        "name": "Outbound to Langflow second-stage loader host",
        "query": "source logs\n| filter $d.event_type == \"network_connection\"\n| filter $d.dest_ip == \"45.207.216.55\"\n| groupby $d.hostname, $d.dest_ip, $d.dest_port\n| count() as conn_count\n| filter conn_count > 0\n| sort -conn_count"
      }
    ],
    "fetchedAt": "2026-07-14T13:43:58.000Z"
  },
  {
    "id": "auto-hypo-hunt-npm-preinstall-native-binary-jscrambler",
    "title": "Hunt for malicious npm preinstall hooks spawning native binaries (jscrambler supply-chain)",
    "description": "The jscrambler npm compromise (8.14.0, July 11, 2026) ran hidden cross-platform Rust binaries via an undocumented preinstall hook, and later versions self-executed from index.js to bypass --ignore-scripts. Hunt build and developer hosts for npm/node processes spawning unexpected native executables out of node_modules shortly after an install, which can indicate a poisoned dependency dropping an infostealer.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1195.002 - Compromise Software Supply Chain",
    "dataSources": [
      "EDR Logs",
      "Process Creation Logs",
      "DNS Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "jscrambler",
    "queries": [
      {
        "name": "npm/node spawning native binaries from node_modules",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process in [\"npm\", \"node\", \"npm.exe\", \"node.exe\"]\n| filter $d.process_path ~ \"node_modules\"\n| groupby $d.hostname, $d.parent_process, $d.process_name, $d.command_line\n| count() as spawn_count\n| filter spawn_count > 0\n| sort -spawn_count"
      }
    ],
    "fetchedAt": "2026-07-14T13:43:58.000Z"
  },
  {
    "id": "auto-hypo-hunt-sp-page-builder-uploadcustomicon-webshell-cve-2026-48908",
    "title": "Hunt for SP Page Builder uploadCustomIcon webshell drops (CVE-2026-48908)",
    "description": "CVE-2026-48908 (CVSS 10.0) is an unauthenticated arbitrary file upload in the SP Page Builder Joomla extension, exploited in the wild via a POST to index.php?option=com_sppagebuilder&task=asset.uploadCustomIcon. Observed post-exploitation includes PHP webshells and file-manager backdoors written under /media/com_sppagebuilder/assets/ and creation of hidden Joomla super-administrator accounts. Hunt web servers for these upload requests and for new PHP files appearing in that asset path.",
    "mitreTactic": "Persistence",
    "mitreTechnique": "T1505.003 - Server Software Component: Web Shell",
    "dataSources": [
      "Web Server Logs",
      "File Integrity Monitoring",
      "Web Proxy Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-48908",
    "queries": [
      {
        "name": "SP Page Builder uploadCustomIcon POST attempts",
        "query": "source logs\n| filter $d.event_type == \"http_request\"\n| filter $d.uri ~ \"com_sppagebuilder\" && $d.uri ~ \"asset.uploadCustomIcon\"\n| filter $d.http_method == \"POST\"\n| groupby $d.src_ip, $d.host, $d.status_code\n| count() as upload_attempts\n| filter upload_attempts > 0\n| sort -upload_attempts"
      }
    ],
    "fetchedAt": "2026-07-14T13:43:58.000Z"
  },
  {
    "id": "auto-hypo-hunt-for-citrixbleed-netscaler-saml-memory-overread-exploita",
    "title": "Hunt for CitrixBleed NetScaler SAML memory-overread exploitation (CVE-2026-8451)",
    "description": "SecurityWeek and watchTowr report active in-the-wild exploitation of CVE-2026-8451 ('CitrixBleed') within 24 hours of disclosure, a pre-auth memory overread in NetScaler ADC/Gateway SAML IdP endpoints that leaks session tokens. Hunt for anomalous or high-volume unauthenticated requests to NetScaler SAML/AAA endpoints from external IPs, followed by reuse of the same session from a different IP or geolocation, which can indicate token theft and session hijacking.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "VPN/Gateway Logs",
      "Authentication Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-8451",
    "queries": [
      {
        "name": "High-volume unauthenticated hits to NetScaler SAML endpoints",
        "query": "source logs\n| filter $d.device_type == \"netscaler\"\n| filter $d.url_path in [\"/saml/login\", \"/cgi/samlauth\", \"/saml\"]\n| filter $d.auth_status == \"unauthenticated\"\n| groupby $d.source_ip\n| count() as req_count\n| filter req_count > 50\n| sort -req_count"
      }
    ],
    "fetchedAt": "2026-07-12T18:43:39.365Z"
  },
  {
    "id": "auto-hypo-hunt-for-malicious-payment-sdk-npm-pypi-packages-exfiltratin",
    "title": "Hunt for malicious payment-SDK npm/PyPI packages exfiltrating CI/CD secrets",
    "description": "GBHackers and NHS England report a July 2026 supply-chain campaign in which ~17 npm/PyPI packages impersonating PaySafe/Skrill/Neteller SDKs steal credentials and tokens from developer machines and CI runners, exfiltrating them to Ngrok-hosted C2 after sandbox-evasion checks. Hunt for build/CI hosts making outbound connections to tunneling domains (ngrok.io, ngrok-free.app, trycloudflare.com) shortly after installation of recently-added payment-related dependencies, and for package install scripts spawning unexpected network activity.",
    "mitreTactic": "Exfiltration",
    "mitreTechnique": "T1567 - Exfiltration Over Web Service",
    "dataSources": [
      "CI/CD Logs",
      "DNS Logs",
      "Web Proxy Logs",
      "EDR Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "CI hosts beaconing to tunneling domains after package install",
        "query": "source logs\n| filter $d.event_type == \"dns_query\"\n| filter $d.query_domain ~ \"(ngrok\\.io|ngrok-free\\.app|trycloudflare\\.com)$\"\n| filter $d.host_role in [\"ci_runner\", \"build_agent\", \"developer_workstation\"]\n| groupby $d.hostname, $d.query_domain\n| count() as lookups\n| filter lookups > 0\n| sort -lookups"
      }
    ],
    "fetchedAt": "2026-07-12T18:43:39.365Z"
  },
  {
    "id": "auto-hypo-hunt-gitea-x-webauth-user-header-auth-bypass-cve-2026-20896",
    "title": "Hunt for Gitea X-WEBAUTH-USER header abuse (CVE-2026-20896)",
    "description": "BleepingComputer and Sysdig report active exploitation of CVE-2026-20896, an authentication bypass in the official Gitea Docker image that trusts the X-WEBAUTH-USER header from any source IP due to REVERSE_PROXY_TRUSTED_PROXIES=*. Hunt for inbound HTTP requests to Gitea carrying an X-WEBAUTH-USER header originating from IPs outside your trusted reverse-proxy range, especially requests authenticating as admin accounts or accessing repositories, tokens or secrets.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "Web Server Logs",
      "Application Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-20896",
    "queries": [
      {
        "name": "Untrusted source IPs sending X-WEBAUTH-USER to Gitea",
        "query": "source logs\n| filter $d.service == \"gitea\"\n| filter $d.http.request.headers ~ \"x-webauth-user\"\n| filter $d.source.ip !~ \"^(10\\\\.|172\\\\.(1[6-9]|2[0-9]|3[01])\\\\.|192\\\\.168\\\\.)\"\n| groupby $d.source.ip, $d.http.request.path\n| count() as hits\n| filter hits > 0\n| sort -hits"
      }
    ],
    "fetchedAt": "2026-07-12T00:44:48.538Z"
  },
  {
    "id": "auto-hypo-hunt-cavern-manticore-dll-sideloading-nativeaot-c2",
    "title": "Hunt for Cavern Manticore DLL side-loading and NativeAOT C2 modules",
    "description": "Check Point reports Iran-nexus Cavern Manticore using a modular .NET C2 framework (Cavern/Cav3rn) against Israeli organizations, leveraging DLL side-loading, NativeAOT modules and AppDomain unloading with low AV detection. Hunt for legitimate signed executables loading unsigned or unexpected DLLs from user-writable or non-standard paths, especially when followed by outbound connections to low-reputation infrastructure.",
    "mitreTactic": "Defense Evasion",
    "mitreTechnique": "T1574.001 - DLL Side-Loading",
    "dataSources": [
      "EDR Logs",
      "Sysmon",
      "Process Creation Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": "Cavern Manticore",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "Signed processes side-loading unsigned DLLs from user paths",
        "query": "source logs\n| filter $d.event_type == \"image_load\"\n| filter $d.module_signed == false\n| filter $d.module_path ~ \"\\\\\\\\(AppData|Temp|ProgramData)\\\\\\\\\"\n| filter $d.process_name in [\"explorer.exe\", \"onedrive.exe\", \"teams.exe\", \"w3wp.exe\", \"svchost.exe\"]\n| groupby $d.hostname, $d.process_name, $d.module_path\n| count() as loads\n| sort -loads"
      }
    ],
    "fetchedAt": "2026-07-12T00:44:48.538Z"
  },
  {
    "id": "auto-hypo-hunt-uat-7810-dogleash-router-payload-download-scripts",
    "title": "Hunt for UAT-7810 DOGLEASH loader scripts on edge/router devices",
    "description": "Cisco Talos reports China-nexus UAT-7810 hosting DOGLEASH (C-based) and JARLEASH (Java) backdoors on new servers, pulled onto compromised edge devices by shell scripts after exploiting n-day router vulnerabilities in Ruckus (CVE-2020-22653, CVE-2020-22658, CVE-2023-25717) and ASUS AiCloud (CVE-2025-2492). Hunt for wget/curl/tftp fetching ELF payloads built for MIPS/ARM architectures on network appliances, and for exploitation attempts against internet-facing Ruckus/ASUS management interfaces.",
    "mitreTactic": "Command and Control",
    "mitreTechnique": "T1105 - Ingress Tool Transfer",
    "dataSources": [
      "Network Device Logs",
      "Firewall Logs",
      "Web Proxy Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": "UAT-7810",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "Download utilities fetching MIPS/ARM payloads on network appliances",
        "query": "source logs\n| filter $d.device_type == \"network_appliance\"\n| filter $d.process_name in [\"wget\", \"curl\", \"tftp\", \"ftpget\"]\n| filter $d.command_line ~ \"(\\\\.sh|mips|arm|elf)\"\n| groupby $d.hostname, $d.command_line\n| count() as fetches\n| sort -fetches"
      }
    ],
    "fetchedAt": "2026-07-12T00:44:48.538Z"
  },
  {
    "id": "auto-hypo-hunt-jadepuffer-agentic-ransomware-langflow-rce-cve-2025-3248",
    "title": "Hunt for JADEPUFFER agentic ransomware exploiting Langflow (CVE-2025-3248)",
    "description": "Sysdig reported JADEPUFFER, an autonomous AI-agent ransomware that exploits internet-facing Langflow via CVE-2025-3248 to run arbitrary Python, then pivots to database servers (MySQL / Alibaba Nacos) to encrypt and extort. Hunt for the Langflow code-validation endpoint being hit by unauthenticated requests followed by Python spawning shells, credential access, or mass database configuration changes.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "EDR Logs",
      "Database Audit Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2025-3248",
    "queries": [
      {
        "name": "Langflow process spawning interpreters/shells",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process in [\"langflow\", \"uvicorn\", \"gunicorn\", \"python\", \"python3\"]\n| filter $d.process_name in [\"sh\", \"bash\", \"python\", \"python3\", \"curl\", \"wget\", \"mysql\"]\n| groupby $d.hostname, $d.parent_process, $d.process_name, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-07-11T18:46:47.033Z"
  },
  {
    "id": "auto-hypo-hunt-injective-npm-sdk-wallet-key-exfil-x-request-id",
    "title": "Hunt for Injective npm SDK wallet-key exfiltration via X-Request-Id",
    "description": "A backdoored @injectivelabs/sdk-ts (1.20.21) captured BIP-39 seed phrases and private keys and smuggled them out base64-encoded inside the X-Request-Id HTTP header. Hunt developer, CI/CD and build hosts for installs of the malicious SDK version and for outbound HTTP requests carrying an unusually long, base64-looking X-Request-Id header, especially to non-standard endpoints.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1195.002 - Compromise Software Supply Chain",
    "dataSources": [
      "Web Proxy Logs",
      "EDR Logs",
      "CI/CD Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "Injective",
    "queries": [
      {
        "name": "Outbound requests with long base64 X-Request-Id header",
        "query": "source logs\n| filter $d.event_type == \"http_request\"\n| filter $d.direction == \"outbound\"\n| filter $d.http_header_name == \"X-Request-Id\"\n| filter $d.http_header_value ~ \"^[A-Za-z0-9+/=]{80,}$\"\n| groupby $d.hostname, $d.destination_host, $d.http_header_value\n| count() as req_count\n| sort -req_count"
      }
    ],
    "fetchedAt": "2026-07-11T18:46:47.033Z"
  },
  {
    "id": "auto-hypo-hunt-silver-fox-modbeacon-fake-installer-scheduled-task-persistence",
    "title": "Hunt for Silver Fox MODBEACON fake-installer execution and scheduled-task persistence",
    "description": "QiAnXin attributed a new Rust-based RAT, MODBEACON, to China-linked Silver Fox, delivered through SEO poisoning and counterfeit software installers and using Amazon/Cloudflare CDN for gRPC C2. It establishes persistence via scheduled tasks. Hunt for installer-named binaries executing from user download or temp paths that create scheduled tasks and then beacon out to CDN-fronted hosts.",
    "mitreTactic": "Persistence",
    "mitreTechnique": "T1053.005 - Scheduled Task/Job: Scheduled Task",
    "dataSources": [
      "EDR Logs",
      "Windows Event Logs",
      "DNS Logs"
    ],
    "priority": "P2",
    "linkedAdversaryName": "Silver Fox",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "Scheduled task creation by installer-like binaries",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.process_name == \"schtasks.exe\"\n| filter $d.parent_command_line ~ \"(?i)(setup|install|update|downloads|temp)\"\n| groupby $d.hostname, $d.user, $d.parent_process, $d.command_line\n| count() as task_count\n| filter task_count > 0\n| sort -task_count"
      }
    ],
    "fetchedAt": "2026-07-11T18:46:47.033Z"
  },
  {
    "id": "auto-hypo-hunt-ubiquiti-unifi-connect-unauth-command-injection-cve-2026-50746",
    "title": "Hunt for Ubiquiti UniFi Connect unauthenticated command injection (CVE-2026-50746)",
    "description": "Ubiquiti disclosed a CVSS 10.0 unauthenticated command-injection flaw (CVE-2026-50746) in UniFi Connect, with ~100,000 UniFi OS endpoints exposed to the internet. Hunt for anomalous process execution and outbound connections originating from UniFi management hosts, which should rarely spawn shells or network utilities.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "Network Logs",
      "EDR Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-50746",
    "queries": [
      {
        "name": "Shell/utility spawns from UniFi services",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process in [\"unifi-connect\", \"unifi\", \"node\", \"unifi-os\"]\n| filter $d.process_name in [\"sh\", \"bash\", \"curl\", \"wget\", \"nc\", \"python\", \"python3\"]\n| groupby $d.hostname, $d.parent_process, $d.process_name, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-07-11T17:05:13.000Z"
  },
  {
    "id": "auto-hypo-hunt-goddamn-poisonx-signed-driver-load-anydesk-psexec",
    "title": "Hunt for GodDamn ransomware: PoisonX signed-driver load with AnyDesk and PsExec staging",
    "description": "Symantec attributed a GodDamn ransomware intrusion (Hyadina lineage) that installed the Microsoft-signed PoisonX kernel driver to disable EDR, using AnyDesk for remote access and PsExec for lateral movement before encryption. Hunt for the loading of newly-registered or unusual kernel drivers on hosts that also show AnyDesk and PsExec activity.",
    "mitreTactic": "Defense Evasion",
    "mitreTechnique": "T1562.001 - Impair Defenses: Disable or Modify Tools",
    "dataSources": [
      "EDR Logs",
      "Windows Event Logs",
      "Sysmon"
    ],
    "priority": "P1",
    "linkedAdversaryName": "Hyadina",
    "linkedFeedItemRef": "GodDamn",
    "queries": [
      {
        "name": "Kernel driver load co-occurring with AnyDesk/PsExec",
        "query": "source logs\n| filter $d.event_type in [\"driver_load\", \"service_install\", \"process_creation\"]\n| filter $d.image_path contains \".sys\" || $d.process_name in [\"AnyDesk.exe\", \"PsExec.exe\", \"psexesvc.exe\"]\n| groupby $d.hostname\n| distinct_count($d.image_path) as driver_events, count() as total\n| filter total > 1\n| sort -total"
      }
    ],
    "fetchedAt": "2026-07-11T17:05:13.000Z"
  },
  {
    "id": "auto-hypo-hunt-oracle-peoplesoft-peopletools-unauth-rce-exploitation-c",
    "title": "Hunt Oracle PeopleSoft PeopleTools unauth RCE exploitation (CVE-2026-35273)",
    "description": "Oracle disclosed CVE-2026-35273, a CVSS 9.8 unauthenticated RCE in the Updates Environment Management component of PeopleSoft PeopleTools 8.61/8.62 that ShinyHunters (UNC6240) exploited in the wild as a zero-day from late May 2026, predominantly against higher-education targets. Hunt internet-facing PeopleSoft hosts for anomalous unauthenticated POST/PUT requests to PeopleTools management endpoints from external sources, followed by unexpected child processes of the web/app tier.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Server Logs",
      "Web Proxy Logs",
      "Network Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": "ShinyHunters",
    "linkedFeedItemRef": "CVE-2026-35273",
    "queries": [
      {
        "name": "External unauth POSTs to PeopleSoft management endpoints",
        "query": "source logs\n| filter $d.event_type == \"http_request\"\n| filter $d.url_path contains \"/psc/\" || $d.url_path contains \"EMC_MANAGE\"\n| filter $d.http_method in [\"POST\", \"PUT\"]\n| filter $d.src_ip_is_external == true\n| filter $d.timestamp >= \"2026-05-27T00:00:00Z\"\n| groupby $d.hostname, $d.src_ip\n| count() as req_count\n| filter req_count > 3\n| sort -req_count"
      }
    ],
    "fetchedAt": "2026-07-11T00:41:28.000Z"
  },
  {
    "id": "auto-hypo-hunt-rogueplanet-defender-quarantine-abuse-via-wer-queuerepo",
    "title": "Hunt RoguePlanet Defender quarantine abuse via WER QueueReporting SYSTEM execution",
    "description": "The RoguePlanet Windows zero-day forces Microsoft Defender to create a SYSTEM-owned quarantine artifact in attacker-controlled space, overwrites it with a payload, then triggers the WER QueueReporting scheduled task (running as SYSTEM) to execute it, using NTFS junctions and opportunistic locks along the way. Hunt for SYSTEM-integrity processes spawned by the Windows Error Reporting manager that are not legitimate WER binaries.",
    "mitreTactic": "Privilege Escalation",
    "mitreTechnique": "T1068 - Exploitation for Privilege Escalation",
    "dataSources": [
      "EDR Logs",
      "Windows Event Logs",
      "File Monitoring"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "RoguePlanet",
    "queries": [
      {
        "name": "Unexpected SYSTEM child of WER manager (wermgr.exe)",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process == \"wermgr.exe\"\n| filter $d.integrity_level == \"SYSTEM\"\n| filter $d.process_name not in [\"WerFault.exe\", \"wermgr.exe\"]\n| groupby $d.hostname, $d.process_name, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-07-11T00:41:28.000Z"
  },
  {
    "id": "auto-hypo-hunt-the-gentlemen-raas-gpo-based-defender-disable-and-netlo",
    "title": "Hunt The Gentlemen RaaS GPO-based Defender disable and NETLOGON PowerShell deployment",
    "description": "The Gentlemen ransomware-as-a-service group distributes payloads via the NETLOGON share and a custom deploy_gpo.ps1 script for rapid Group Policy-based propagation, creating fake update policies that disable Windows Defender and forcing immediate group-policy refreshes before deploying their GentleKiller EDR-killer. Hunt for PowerShell referencing NETLOGON or deploy_gpo.ps1 alongside GPO changes that disable Defender.",
    "mitreTactic": "Defense Evasion",
    "mitreTechnique": "T1562.001 - Impair Defenses: Disable or Modify Tools",
    "dataSources": [
      "EDR Logs",
      "Windows Event Logs",
      "PowerShell Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": "The Gentlemen",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "NETLOGON/deploy_gpo.ps1 PowerShell disabling Defender",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.process_name == \"powershell.exe\"\n| filter $d.command_line contains \"deploy_gpo.ps1\" || $d.command_line contains \"\\\\NETLOGON\\\\\"\n| filter $d.command_line contains \"DisableAntiSpyware\" || $d.command_line contains \"gpupdate\"\n| groupby $d.hostname, $d.user\n| count() as hits\n| filter hits > 0\n| sort -hits"
      }
    ],
    "fetchedAt": "2026-07-11T00:41:28.000Z"
  },
  {
    "title": "Hunt Oracle EBS Payments ibytransmit unauth file read/takeover (CVE-2026-46817)",
    "description": "Oracle disclosed CVE-2026-46817, a CVSS 9.8 unauthenticated flaw in the File Transmission component of Oracle Payments (EBS 12.2.3-12.2.15) that attackers exploit by sending crafted HTTP requests to the ibytransmit endpoint to read arbitrary files (e.g. /etc/passwd) and take over the instance; in-the-wild exploitation began June 27, 2026. Hunt internet-facing Oracle EBS hosts for anomalous HTTP requests to the File Transmission / ibytransmit endpoint originating from external sources.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Proxy Logs",
      "Web Server Logs",
      "Network Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-46817",
    "queries": [
      {
        "name": "Oracle EBS ibytransmit access from external IPs",
        "query": "source logs\n| filter $d.event_type == \"http_request\"\n| filter $d.url_path contains \"ibytransmit\" || $d.url_path contains \"OA_HTML/ibytransmit\"\n| filter $d.src_ip not in [${INTERNAL_RANGES}]\n| groupby $d.src_ip, $d.host, $d.url_path, $d.http_status\n| count() as hits\n| filter hits > 0\n| sort -hits"
      }
    ],
    "id": "auto-hypo-hunt-oracle-ebs-payments-ibytransmit-unauth-file-read-takeov",
    "fetchedAt": "2026-07-10T09:30:00.000Z"
  },
  {
    "title": "Hunt Kemp LoadMaster /accessv2 pre-auth RCE (CVE-2026-8037)",
    "description": "CVE-2026-8037 is a CVSS 9.6 OS command injection in Progress Kemp LoadMaster reachable pre-authentication via the /accessv2 API endpoint, letting unauthenticated attackers run commands as root. eSentire observed exploitation from June 29, 2026 after watchTowr published a technical write-up and a PoC surfaced. Hunt LoadMaster appliances for requests to /accessv2 followed by unexpected shell/command execution or unusual outbound connections from the appliance.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Server Logs",
      "Network Logs",
      "EDR Logs"
    ],
    "priority": "P1",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-8037",
    "queries": [
      {
        "name": "Kemp LoadMaster accessv2 exploitation",
        "query": "source logs\n| filter $d.event_type == \"http_request\"\n| filter $d.url_path contains \"/accessv2\"\n| filter $d.src_ip not in [${INTERNAL_RANGES}]\n| groupby $d.src_ip, $d.host, $d.http_method, $d.http_status\n| count() as hits\n| filter hits > 0\n| sort -hits"
      }
    ],
    "id": "auto-hypo-hunt-kemp-loadmaster-accessv2-pre-auth-rce-cve-2026-8037",
    "fetchedAt": "2026-07-10T09:30:00.000Z"
  },
  {
    "title": "Hunt Armored Likho LNK spear-phishing and LLM-generated loader (CVE-2025-9491)",
    "description": "Kaspersky attributes a July 2026 campaign to Armored Likho (overlapping BI.ZONE's Eagle Werewolf) targeting government agencies and electric power operators in Russia, Kazakhstan and Brazil via spear-phishing that exploits the patched Windows LNK vulnerability CVE-2025-9491; the first-stage loader shows signs of being LLM-generated. Hunt for LNK files delivered by email that launch script interpreters or spawn unusual child processes, especially on hosts in government/energy environments.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1566.001 - Spearphishing Attachment",
    "dataSources": [
      "Email Gateway Logs",
      "EDR Logs",
      "Process Creation Logs"
    ],
    "priority": "P2",
    "linkedAdversaryName": "Armored Likho",
    "linkedFeedItemRef": "CVE-2025-9491",
    "queries": [
      {
        "name": "LNK files spawning script interpreters",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process contains \".lnk\" || $d.command_line contains \".lnk\"\n| filter $d.process_name in [\"powershell.exe\", \"cmd.exe\", \"mshta.exe\", \"wscript.exe\", \"cscript.exe\", \"rundll32.exe\"]\n| groupby $d.hostname, $d.user, $d.process_name, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "id": "auto-hypo-hunt-armored-likho-lnk-spear-phishing-and-llm-generated-load",
    "fetchedAt": "2026-07-10T09:30:00.000Z"
  },
  {
    "id": "auto-hypo-hunt-for-simplehelp-rmm-oidc-auth-bypass-and-infostealer-sta",
    "title": "Hunt for SimpleHelp RMM OIDC auth-bypass and infostealer staging (CVE-2026-48558)",
    "description": "Attackers are exploiting CVE-2026-48558, a CVSS 10.0 authentication bypass in SimpleHelp RMM that accepts unsigned OIDC tokens, to forge technician sessions on internet-facing servers without credentials and then deploy the TaskWeaver and Djinn Stealer malware families. Hunt internet-facing SimpleHelp hosts for anomalous technician logins followed by remote script/tooling execution and infostealer staging on managed endpoints.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Authentication Logs",
      "EDR Logs",
      "Web Proxy Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-48558",
    "queries": [
      {
        "name": "SimpleHelp service spawning scripting/LOLBins",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process in [\"Remote Access.exe\", \"SimpleService.exe\", \"SimpleHelp\"]\n| filter $d.process_name in [\"powershell.exe\", \"cmd.exe\", \"cscript.exe\", \"wscript.exe\", \"rundll32.exe\", \"mshta.exe\"]\n| filter $d.timestamp >= \"2026-06-29T00:00:00Z\"\n| groupby $d.hostname, $d.parent_process, $d.process_name, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-07-09T00:45:35.000Z"
  },
  {
    "id": "auto-hypo-hunt-for-fortigate-ssl-vpn-logins-from-fortibleed-harvested-",
    "title": "Hunt for FortiGate SSL-VPN logins from FortiBleed-harvested credentials (INC/Lynx)",
    "description": "The FortiBleed campaign harvested 110M+ credentials from roughly 430,000 FortiGate SSL-VPN appliances using a custom packet-sniffing tool, and SOCRadar has tied the stolen credentials to INC Ransom and Lynx ransomware deployments. Hunt FortiGate SSL-VPN telemetry for successful authentications from anomalous or foreign source ASNs and impossible-travel patterns, especially where MFA is absent, as a precursor to lateral movement and ransomware.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1133 - External Remote Services",
    "dataSources": [
      "VPN Logs",
      "Firewall Logs",
      "Authentication Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": "INC Ransom",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "FortiGate SSL-VPN successful logins by user and source geo",
        "query": "source logs\n| filter $d.vendor == \"fortinet\" && $d.action == \"ssl-vpn-login\" && $d.status == \"success\"\n| filter $d.timestamp >= \"2026-06-16T00:00:00Z\"\n| groupby $d.user, $d.src_ip, $d.src_country\n| count() as login_count\n| filter login_count > 0\n| sort -login_count"
      }
    ],
    "fetchedAt": "2026-07-09T00:45:35.000Z"
  },
  {
    "id": "auto-hypo-hunt-cisco-unified-cm-management-interface-rce-cve-2026-20045",
    "title": "Hunt for Cisco Unified CM management-interface RCE and root escalation (CVE-2026-20045)",
    "description": "Following active in-the-wild exploitation of CVE-2026-20045, hunt internet-facing Cisco Unified Communications Manager hosts for anomalous shells or utilities spawned by the web/management service stack and for privilege escalation to root, which signals successful RCE via crafted HTTP requests to the management interface.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "EDR Logs",
      "Web Proxy Logs",
      "Linux Auditd"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-20045",
    "queries": [
      {
        "name": "Unexpected child processes under CUCM web/management services",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process in [\"tomcat\", \"java\", \"ccm\", \"httpd\"]\n| filter $d.process_name in [\"sh\", \"bash\", \"python\", \"id\", \"whoami\", \"curl\", \"wget\"]\n| filter $d.user == \"root\"\n| groupby $d.hostname, $d.parent_process, $d.process_name, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-07-08T23:38:49.000Z"
  },
  {
    "id": "auto-hypo-hunt-byovd-vulnerable-driver-load-to-disable-edr",
    "title": "Hunt for BYOVD vulnerable-driver loads used to disable EDR before ransomware",
    "description": "Recent ransomware campaigns (July 2026 reporting on Citrix Bleed 2, BYOVD and supply-chain credential abuse) increasingly load a signed-but-vulnerable kernel driver to terminate security tooling before encryption. Hunt for new kernel driver or service loads from unusual writable paths, which often precede AV/EDR process termination.",
    "mitreTactic": "Defense Evasion",
    "mitreTechnique": "T1562.001 - Impair Defenses: Disable or Modify Tools",
    "dataSources": [
      "EDR Logs",
      "Windows Process Logs",
      "Windows Service Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "Signed driver loaded from a writable/temp path",
        "query": "source logs\n| filter $d.event_type == \"driver_load\"\n| filter $d.driver_signed == true\n| filter $d.image_path contains \"Temp\" || $d.image_path contains \"ProgramData\"\n| groupby $d.hostname, $d.driver_name, $d.image_path\n| count() as load_count\n| filter load_count > 0\n| sort -load_count"
      }
    ],
    "fetchedAt": "2026-07-08T23:38:49.000Z"
  },
  {
    "title": "Hunt for SharePoint w3wp.exe spawning shells after CVE-2026-45659 exploitation",
    "description": "Following active exploitation of the SharePoint deserialization RCE CVE-2026-45659, hunt on-prem SharePoint hosts for the IIS worker process (w3wp.exe) spawning command interpreters or compiler processes — a common signal of post-deserialization code execution and web-shell drop.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "EDR Logs",
      "Windows Process Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-45659",
    "queries": [
      {
        "name": "IIS worker spawning shells/compilers",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process == \"w3wp.exe\"\n| filter $d.process_name in [\"cmd.exe\", \"powershell.exe\", \"csc.exe\", \"cscript.exe\"]\n| groupby $d.hostname, $d.process_name, $d.command_line\n| count() as exec_count\n| filter exec_count > 0\n| sort -exec_count"
      }
    ],
    "id": "auto-hypo-hunt-for-sharepoint-w3wp-exe-spawning-shells-after-cve-2026-",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  },
  {
    "title": "Hunt for Ivanti EPMM web-shell access after CVE-2026-1281 / CVE-2026-1340",
    "description": "Unauthenticated RCE in Ivanti EPMM (CVE-2026-1281, CVE-2026-1340) is being mass-exploited to drop web shells; researchers observed a sleeper shell at /mifs/403.jsp. Hunt web/proxy logs for requests to unusual .jsp paths under /mifs/ on EPMM appliances, especially from unfamiliar source IPs.",
    "mitreTactic": "Persistence",
    "mitreTechnique": "T1505.003 - Server Software Component: Web Shell",
    "dataSources": [
      "Web Proxy Logs",
      "WAF Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-1281",
    "queries": [
      {
        "name": "Suspicious EPMM /mifs/ jsp access",
        "query": "source logs\n| filter $d.event_type == \"http_request\"\n| filter $d.url_path == \"/mifs/403.jsp\"\n| filter $d.status_code == 200\n| groupby $d.source_ip, $d.url_path, $d.http_method\n| count() as req_count\n| filter req_count > 0\n| sort -req_count"
      }
    ],
    "id": "auto-hypo-hunt-for-ivanti-epmm-web-shell-access-after-cve-2026-1281-cv",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  },
  {
    "title": "Hunt for CI/CD credential theft from supply-chain package compromise",
    "description": "Supply-chain attacks (e.g. the TeamPCP-linked \"Mini Shai-Hulud\" TanStack/npm compromises) plant malicious install scripts that harvest GitHub tokens, npm tokens, SSH keys and cloud secrets from build agents. Hunt build/CI hosts for package tooling reading credential material or exfiltrating over the network.",
    "mitreTactic": "Credential Access",
    "mitreTechnique": "T1552.001 - Unsecured Credentials: Credentials In Files",
    "dataSources": [
      "EDR Logs",
      "CI/CD Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": "TeamPCP",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "Package tooling touching secrets",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.process_name in [\"node\", \"npm\", \"npx\", \"curl\", \"wget\"]\n| filter $d.command_line contains \"npmrc\" || $d.command_line contains \"NPM_TOKEN\" || $d.command_line contains \"id_rsa\" || $d.command_line contains \"AWS_SECRET\"\n| groupby $d.hostname, $d.user, $d.command_line\n| count() as hits\n| filter hits > 0\n| sort -hits"
      }
    ],
    "id": "auto-hypo-hunt-for-ci-cd-credential-theft-from-supply-chain-package-co",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  }
];
