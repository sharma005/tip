/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: hypothesis (Hunt Lab). Hand-updated via an
   interactive Claude session (WebSearch) — see lib/intel/schemas.mjs
   (HYPOTHESIS_SCHEMA) and lib/intel/contentTypes.mjs (cap 80) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_HUNTLAB = [
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
