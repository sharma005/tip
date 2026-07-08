/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: hypothesis (Hunt Lab). Hand-updated via an
   interactive Claude session (WebSearch) — see lib/intel/schemas.mjs
   (HYPOTHESIS_SCHEMA) and lib/intel/contentTypes.mjs (cap 80) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_HUNTLAB = [
  {
    "id": "auto-hypo-sharepoint-deserialization-rce-exploitation-cve-2026-45659",
    "title": "SharePoint deserialization RCE exploitation (CVE-2026-45659)",
    "description": "Following CISA KEV listing of CVE-2026-45659, hunt for post-exploitation behavior on internet-facing SharePoint servers — the IIS worker process spawning command interpreters or writing web shells into web-accessible directories.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1190 - Exploit Public-Facing Application",
    "dataSources": [
      "Web Server Logs",
      "Process Creation Logs",
      "EDR Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "CVE-2026-45659",
    "queries": [
      {
        "name": "SharePoint w3wp spawning shells",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process == \"w3wp.exe\"\n| filter $d.process_name in [\"cmd.exe\", \"powershell.exe\", \"csc.exe\"]\n| groupby $d.hostname, $d.process_name\n| count() as exec_count\n| sort -exec_count"
      }
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-hypo-fortibleed-credential-abuse-via-fortinet-vpn",
    "title": "FortiBleed credential abuse via Fortinet VPN",
    "description": "The FortiBleed campaign replays stolen Fortinet credentials to gain entry before deploying ransomware. Hunt for successful VPN authentications from previously unseen geolocations or hosting-provider ASNs, especially those quickly followed by internal discovery.",
    "mitreTactic": "Initial Access",
    "mitreTechnique": "T1078 - Valid Accounts",
    "dataSources": [
      "VPN Logs",
      "Authentication Logs",
      "Firewall Logs"
    ],
    "priority": "P1",
    "status": "active",
    "linkedAdversaryName": "FortiBleed",
    "linkedFeedItemRef": null,
    "queries": [
      {
        "name": "Fortinet VPN logins from new ASNs",
        "query": "source logs\n| filter $d.vendor == \"fortinet\" && $d.action == \"vpn_login\" && $d.status == \"success\"\n| filter $d.src_asn_type == \"hosting\"\n| groupby $d.username, $d.src_ip, $d.src_asn\n| count() as logins\n| sort -logins"
      }
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  },
  {
    "id": "auto-hypo-malicious-npm-postinstall-execution-shai-hulud-node-ipc",
    "title": "Malicious npm postinstall execution (Shai-Hulud/node-ipc)",
    "description": "Self-propagating npm supply-chain malware executes credential-stealing payloads during package install. Hunt for node/npm processes spawning network utilities or reaching out to unexpected hosts during CI/CD build steps.",
    "mitreTactic": "Execution",
    "mitreTechnique": "T1195.002 - Compromise Software Supply Chain",
    "dataSources": [
      "Process Creation Logs",
      "EDR Logs",
      "DNS Logs"
    ],
    "priority": "P2",
    "status": "active",
    "linkedAdversaryName": null,
    "linkedFeedItemRef": "node-ipc",
    "queries": [
      {
        "name": "npm install spawning network tools",
        "query": "source logs\n| filter $d.event_type == \"process_creation\"\n| filter $d.parent_process in [\"node\", \"npm\", \"node.exe\"]\n| filter $d.process_name in [\"curl\", \"wget\", \"bash\", \"powershell.exe\"]\n| groupby $d.hostname, $d.process_name, $d.command_line\n| count() as spawns\n| sort -spawns"
      }
    ],
    "fetchedAt": "2026-07-08T20:41:31.777Z"
  }
];
