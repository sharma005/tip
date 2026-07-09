/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: connector. Hand-updated via an interactive
   Claude session (WebSearch) — see lib/intel/schemas.mjs
   (CONNECTOR_SCHEMA) and lib/intel/contentTypes.mjs (cap 100) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_CONNECTORS = [
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
