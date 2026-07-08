/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: hypothesis (Hunt Lab). Hand-updated via an
   interactive Claude session (WebSearch) — see lib/intel/schemas.mjs
   (HYPOTHESIS_SCHEMA) and lib/intel/contentTypes.mjs (cap 80) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_HUNTLAB = [
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
