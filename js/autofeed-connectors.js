/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: connector. Hand-updated via an interactive
   Claude session (WebSearch) — see lib/intel/schemas.mjs
   (CONNECTOR_SCHEMA) and lib/intel/contentTypes.mjs (cap 100) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_CONNECTORS = [
  {
    "id": "auto-conn-otx-deadlock-ransomware-byovd-edr-killer-campaign",
    "connector": "otx",
    "title": "DeadLock ransomware BYOVD EDR-killer campaign",
    "date": "2026-08-10",
    "severity": "High",
    "summary": "Cisco Talos and Microsoft report a financially motivated DeadLock ransomware operation using a BYOVD technique: a loader (EDRGay.exe) drops the vulnerable Baidu driver BdApiUtil.sys renamed DriverGay.sys (CVE-2024-51324) to terminate AV/EDR at the kernel level, followed by a Rust-based encryptor. Talos published Snort/ClamAV detection coverage and an IOC set.",
    "tags": [
      "deadlock",
      "byovd",
      "ransomware",
      "edr-bypass"
    ],
    "iocs": [
      {
        "type": "Filename",
        "value": "EDRGay.exe"
      },
      {
        "type": "Filename",
        "value": "DriverGay.sys"
      },
      {
        "type": "Filename",
        "value": "BdApiUtil.sys"
      },
      {
        "type": "CVE",
        "value": "CVE-2024-51324"
      }
    ],
    "fetchedAt": "2026-08-11T11:17:34.985Z"
  },
  {
    "id": "auto-conn-misp-jetbrains-teamcity-cve-2026-63077-unauthenticated-rce-exploi",
    "connector": "misp",
    "title": "JetBrains TeamCity CVE-2026-63077 unauthenticated RCE exploited",
    "date": "2026-08-05",
    "severity": "Critical",
    "summary": "CVE-2026-63077, an unauthenticated RCE in JetBrains TeamCity On-Premises via unsafe deserialization in the agent polling protocol, was added to CISA KEV on 2026-08-05 following in-the-wild exploitation. Community trackers are monitoring scanning and exploitation of internet-facing TeamCity servers. Patched in 2026.1.3 and 2025.11.7.",
    "tags": [
      "teamcity",
      "cve-2026-63077",
      "rce",
      "kev"
    ],
    "iocs": [],
    "fetchedAt": "2026-08-11T11:17:34.985Z"
  },
  {
    "id": "auto-conn-pulsedive-red-hat-acm-cve-2026-10090-privilege-escalation-to-cluster-a",
    "connector": "pulsedive",
    "title": "Red Hat ACM CVE-2026-10090 privilege escalation to cluster-admin",
    "date": "2026-08-05",
    "severity": "Critical",
    "summary": "Red Hat disclosed CVE-2026-10090 (CVSS 9.9), an authorization gap in the Advanced Cluster Management application-subscription workflow. A user with namespace-scoped edit rights can point a Channel object at an attacker-controlled Helm repository and have the vulnerable controller deploy it with elevated permissions, escalating to full cluster-admin across managed clusters. Affects rhacm2/multicluster-operators-subscription-rhel9.",
    "tags": [
      "redhat",
      "acm",
      "kubernetes",
      "cve-2026-10090",
      "privesc"
    ],
    "iocs": [],
    "fetchedAt": "2026-08-11T11:17:34.985Z"
  },
  {
    "id": "auto-conn-otx-shai-hulud-here-we-go-again-npm-worm-steals-cloud-and-ci-cd-",
    "connector": "otx",
    "title": "Shai-Hulud 'Here We Go Again' npm Worm Steals Cloud and CI/CD Secrets",
    "date": "2026-08-04",
    "severity": "Critical",
    "summary": "A self-replicating supply-chain worm (Shai-Hulud 'Here We Go Again') compromised the keyv/cacheable npm package family on Aug 4, 2026 and spread to 400+ packages via stolen npm publish tokens. The payload steals npm/GitHub/AWS/Kubernetes/Vault/Stripe/Slack secrets and exfiltrates RSA-encrypted bundles to public GitHub repos, with a fallback C2 at npm-cache[.]com resolved dynamically via an Ethereum smart contract.",
    "tags": [
      "npm",
      "supply-chain",
      "shai-hulud",
      "worm",
      "credential-theft"
    ],
    "iocs": [
      {
        "type": "SHA-256",
        "value": "54dc7ea54a1317cca0e890a2770630cf7fa6c97813e0cb9d2caa93012b350668"
      },
      {
        "type": "SHA-256",
        "value": "9fc2570b7cef51c1b8df116d144d11ff4096357be7d2c4c6367cfc2509cf1bcc"
      },
      {
        "type": "Domain",
        "value": "npm-cache[.]com"
      },
      {
        "type": "ETH Address",
        "value": "0xE1f2395ee43e45A1556EC6438a88c31B83493103"
      }
    ],
    "fetchedAt": "2026-08-08T02:33:19.739Z"
  },
  {
    "connector": "otx",
    "title": "Langflow CVE-2026-9198 unauthenticated RCE added to CISA KEV",
    "date": "2026-08-05",
    "severity": "Critical",
    "summary": "OTX and community trackers are circulating CVE-2026-9198, a CVSS 9.8 code-injection flaw in Langflow that lets unauthenticated attackers chain /api/v1/auto_login (issues SUPERUSER tokens) with /api/v1/validate/code (executes code via exec()) for full RCE on default deployments 1.0.0-1.10.0. CISA added it to KEV on August 5, 2026; IBM fixed it in Langflow OSS 1.10.1. No public IOC values are confirmed; detection focuses on requests to these two endpoints.",
    "tags": [
      "langflow",
      "cve-2026-9198",
      "rce",
      "kev"
    ],
    "iocs": [],
    "id": "auto-conn-otx-langflow-cve-2026-9198-unauthenticated-rce-added-to-cisa-kev",
    "fetchedAt": "2026-08-05T18:46:21.613Z"
  },
  {
    "connector": "misp",
    "title": "Autonomous AI (DeepSeek/Hermes Agent) exploitation campaign by Chinese-speaking actor KnYuan",
    "date": "2026-08-03",
    "severity": "High",
    "summary": "Community intel is tracking a Chinese-speaking actor (knaithe/KnYuan) that Unit 42 found running a largely autonomous campaign using DeepSeek behind the Hermes Agent framework to enumerate targets, pull GitHub PoCs, and attempt exploitation across roughly 460 hosts. Three confirmed compromises leveraged Citrix NetScaler CVE-2026-3055; manual activity also hit Apache Tomcat CVE-2026-34486, Marimo and IKE VPN endpoints. Exposed material (API keys, scripts) was seen but not published as clean indicators.",
    "tags": [
      "ai",
      "deepseek",
      "hermes-agent",
      "cve-2026-3055",
      "unit42"
    ],
    "iocs": [],
    "id": "auto-conn-misp-autonomous-ai-deepseek-hermes-agent-exploitation-campaign-by",
    "fetchedAt": "2026-08-05T18:46:21.613Z"
  },
  {
    "connector": "otx",
    "title": "QuickFox VPN supply-chain attack delivering Mustang Panda FDMTP backdoor",
    "date": "2026-08-05",
    "severity": "High",
    "summary": "Trackers are sharing details of a supply-chain compromise of the QuickFox VPN client that trojanized the official Windows installer to deliver the FDMTP backdoor linked to Mustang Panda. A modified Electron renderer HTML downloads a JavaScript loader that fingerprints the victim before installing the implant; QuickFox removed the malicious components in version 3.59.6. No public IOC values are confirmed in the reporting reviewed.",
    "tags": [
      "quickfox",
      "fdmtp",
      "mustang-panda",
      "supply-chain"
    ],
    "iocs": [],
    "id": "auto-conn-otx-quickfox-vpn-supply-chain-attack-delivering-mustang-panda-fd",
    "fetchedAt": "2026-08-05T18:46:21.613Z"
  },
  {
    "id": "auto-conn-otx-n-able-n-central-cve-2026-18577-authentication-bypass-exploi",
    "connector": "otx",
    "title": "N-able N-central CVE-2026-18577 authentication bypass exploited in the wild",
    "date": "2026-08-03",
    "severity": "High",
    "summary": "Community trackers are circulating CVE-2026-18577, an N-able N-central authentication bypass (CVSS 8.2, an incomplete patch of CVE-2026-18556) added to CISA's KEV catalog on August 3, 2026. Post-exploitation activity reported by Huntress and Rapid7 includes abuse of the N-central Take Control feature to reach managed endpoints and deployment of Cloudflare Tunnel (cloudflared) for persistence. No public IOC values are confirmed yet; detection focuses on unexpected Take Control activity and cloudflared execution.",
    "tags": [
      "n-able",
      "n-central",
      "cve-2026-18577",
      "kev",
      "rmm"
    ],
    "iocs": [],
    "fetchedAt": "2026-08-04T18:49:38.411Z"
  },
  {
    "id": "auto-conn-misp-golden-chickens-venom-spider-resurfaces-with-new-modular-mal",
    "connector": "misp",
    "title": "Golden Chickens (Venom Spider) resurfaces with new modular malware families",
    "date": "2026-07-30",
    "severity": "High",
    "summary": "Threat-intel communities are tracking the late-July 2026 resurgence of the Golden Chickens / Venom Spider Malware-as-a-Service operation with four new or updated modular families, including ChromEggscalator, a TerraStealerV2 successor built on the ChromElevator Chrome encryption-bypass tool for browser credential and session theft. The activity builds on Recorded Future Insikt Group's earlier attribution of the TerraStealerV2 and TerraLogger families to the same actor. No fresh public IOC values are confirmed for the new families yet.",
    "tags": [
      "golden-chickens",
      "venom-spider",
      "terrastealerv2",
      "maas",
      "infostealer"
    ],
    "iocs": [],
    "fetchedAt": "2026-08-04T18:49:38.411Z"
  },
  {
    "id": "auto-conn-otx-cisco-secure-fmc-hard-coded-credential-zero-day-cve-2026-203",
    "connector": "otx",
    "title": "Cisco Secure FMC hard-coded credential zero-day (CVE-2026-20316) actively exploited",
    "date": "2026-07-29",
    "severity": "High",
    "summary": "CISA added CVE-2026-20316 to its KEV catalog on July 29, 2026 after confirming active exploitation of a hard-coded password in Cisco Secure Firewall Management Center that allows unauthenticated login via a low-privilege account (CVSS 8.9, reported by Horizon3.ai). Community trackers are circulating the CVE and affected-version details for detection; no public IOC values are confirmed yet.",
    "tags": [
      "cisco",
      "fmc",
      "cve-2026-20316",
      "kev",
      "hard-coded-credentials"
    ],
    "iocs": [],
    "fetchedAt": "2026-08-01T18:45:19.126Z"
  },
  {
    "id": "auto-conn-misp-fortinet-fortios-crafted-http-information-disclosure-added-t",
    "connector": "misp",
    "title": "Fortinet FortiOS crafted-HTTP information disclosure added to CISA KEV (CVE-2025-68686)",
    "date": "2026-07-27",
    "severity": "High",
    "summary": "CISA added CVE-2025-68686 to its KEV catalog on July 27, 2026. The FortiOS flaw (CWE-200) lets a remote attacker use crafted HTTP requests to bypass the fix for the SSL-VPN symbolic-link persistency mechanism and read sensitive data following an earlier filesystem-level compromise. MISP communities are tracking affected FortiOS builds (6.4 through 7.6.1) for detection; no new public IOC values are confirmed.",
    "tags": [
      "fortinet",
      "fortios",
      "cve-2025-68686",
      "kev",
      "information-disclosure"
    ],
    "iocs": [],
    "fetchedAt": "2026-08-01T18:45:19.126Z"
  },
  {
    "id": "auto-conn-otx-chaos-ransomware-msarat-browser-tunneled-c2-via-chrome-devto",
    "connector": "otx",
    "title": "Chaos ransomware msaRAT: browser-tunneled C2 via Chrome DevTools Protocol",
    "date": "2026-07-23",
    "severity": "High",
    "summary": "Cisco Talos detailed msaRAT, a Rust RAT attributed to the Chaos RaaS group that drives headless Chrome/Edge over the Chrome DevTools Protocol and relays C2 through WebRTC/Twilio TURN and Cloudflare Workers to evade network detection. Talos published detection content and network indicators.",
    "tags": [
      "chaos",
      "msarat",
      "ransomware",
      "c2",
      "cdp"
    ],
    "iocs": [
      {
        "type": "IP",
        "value": "172.86.126.18"
      },
      {
        "type": "Domain",
        "value": "is-01-ast.ols-img-12.workers.dev"
      },
      {
        "type": "ClamAV",
        "value": "Win.Downloader.ChaosRaas-10060321-0"
      }
    ],
    "fetchedAt": "2026-07-29T18:46:01.726Z"
  },
  {
    "id": "auto-conn-otx-jfrog-artifactory-zero-day-chain-cve-2026-65921-exploited-to",
    "connector": "otx",
    "title": "JFrog Artifactory zero-day chain (CVE-2026-65921) exploited to escape sandbox, breach Hugging Face",
    "date": "2026-07-27",
    "severity": "High",
    "summary": "JFrog patched eight self-hosted Artifactory zero-days reported by OpenAI researchers. CVE-2026-65921 (CVSS 8.8) is an archive path-traversal allowing arbitrary file write to RCE; CVE-2026-65923/65924 are SSRF flaws in the Ansible/Terraform remote-repo handlers. Chaining them yielded an outbound channel used to reach Hugging Face and steal credentials. Fixed in Artifactory 7.161.15 / 7.146.34.",
    "tags": [
      "jfrog",
      "artifactory",
      "zero-day",
      "ssrf",
      "path-traversal"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-29T18:46:01.726Z"
  },
  {
    "id": "auto-conn-misp-cl0p-linked-exploitation-of-ptc-windchill-flexplm-cve-2026-1",
    "connector": "misp",
    "title": "Cl0p-linked exploitation of PTC Windchill/FlexPLM (CVE-2026-12569) drops JSP webshells",
    "date": "2026-07-23",
    "severity": "Critical",
    "summary": "ReliaQuest and Ransom-ISAC reported active exploitation of CVE-2026-12569 (CVSS 9.8), a critical unsafe-deserialization pre-auth RCE in PTC Windchill PDMLink and FlexPLM. Attackers chain a pre-auth information disclosure in the FlexPLM WSDL endpoint with a flaw in the Windchill login servlet to gain unauthenticated RCE and deploy hex-named JSP webshells under /Windchill/login/ for data theft. Tradecraft overlaps prior Cl0p data-theft campaigns.",
    "tags": [
      "clop",
      "ptc-windchill",
      "flexplm",
      "rce",
      "webshell",
      "cve-2026-12569"
    ],
    "iocs": [
      {
        "type": "URI Path",
        "value": "/Windchill/login/ (hex-named .jsp webshell)"
      }
    ],
    "fetchedAt": "2026-07-29T18:46:01.726Z"
  },
  {
    "id": "auto-conn-misp-russian-laundry-bear-exploits-zimbra-zero-day-cve-2025-66376",
    "connector": "misp",
    "title": "Russian 'Laundry Bear' exploits Zimbra zero-day CVE-2025-66376 for zero-click email theft",
    "date": "2026-07-23",
    "severity": "High",
    "summary": "A July 2026 joint advisory (CISA AA26-204a) warns that Russian state-linked actor Laundry Bear (Void Blizzard / TA488) exploited a Zimbra Collaboration Suite Classic UI stored-XSS zero-day, CVE-2025-66376, via a 'half-click' HTML email abusing CSS @import to run JavaScript in authenticated webmail sessions, exfiltrating emails, contacts, passwords, and 2FA tokens. Patched in Zimbra 10.1.13.",
    "tags": [
      "zimbra",
      "laundry-bear",
      "void-blizzard",
      "xss",
      "espionage",
      "cve-2025-66376"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-29T18:46:01.726Z"
  },
  {
    "connector": "otx",
    "title": "Arista VeloCloud Orchestrator command injection CVE-2026-16812 exploited as zero-day",
    "date": "2026-07-28",
    "severity": "Critical",
    "summary": "Arista disclosed active zero-day exploitation of CVE-2026-16812 (CVSS 10.0), an unauthenticated OS command injection in on-premises VeloCloud Orchestrator, and observed attacks from three source IPs. CISA added it to KEV with a July 30, 2026 remediation deadline. On-prem VCO before 5.2.3.145, 6.1.3.46, 6.4.2.4 and 7.0.0.17 is affected.",
    "tags": [
      "arista",
      "velocloud",
      "cve-2026-16812",
      "command-injection",
      "kev"
    ],
    "iocs": [
      {
        "type": "IP",
        "value": "8.19.75.217"
      },
      {
        "type": "IP",
        "value": "206.72.242.124"
      },
      {
        "type": "IP",
        "value": "206.72.242.162"
      }
    ],
    "id": "auto-conn-otx-arista-velocloud-orchestrator-command-injection-cve-2026-168",
    "fetchedAt": "2026-07-29T17:09:02.760Z"
  },
  {
    "connector": "otx",
    "title": "Check Point SmartConsole authentication bypass CVE-2026-16232 exploited in the wild",
    "date": "2026-07-22",
    "severity": "Critical",
    "summary": "Check Point disclosed active exploitation of CVE-2026-16232 (CVSS 9.1), an improper-authentication flaw in the SmartConsole login process that lets an unauthenticated attacker obtain an application login token and authenticate to Security Management / Multi-Domain Management servers as administrator. CISA added it to the KEV catalog on July 22, 2026 with a July 25 federal remediation deadline. Exploitation requires an internet-exposed management server with no Trusted Clients restriction; a July 22 Jumbo hotfix is available.",
    "tags": [
      "checkpoint",
      "cve-2026-16232",
      "authentication-bypass",
      "kev",
      "exploited"
    ],
    "iocs": [],
    "id": "auto-conn-otx-check-point-smartconsole-authentication-bypass-cve-2026-1623",
    "fetchedAt": "2026-07-23T18:44:55.355Z"
  },
  {
    "connector": "otx",
    "title": "ServiceNow AI Platform pre-auth RCE CVE-2026-6875 exploited in the wild",
    "date": "2026-07-20",
    "severity": "Critical",
    "summary": "Defused observed in-the-wild exploitation of CVE-2026-6875, a pre-authentication sandbox-escape code-injection RCE in the ServiceNow AI Platform disclosed July 13. Observed payloads target the unauthenticated /assessment_thanks.do endpoint to achieve unauthenticated code execution and full instance compromise. Self-hosted instances not patched since July 13 remain at risk.",
    "tags": [
      "servicenow",
      "cve-2026-6875",
      "rce",
      "pre-auth",
      "exploited"
    ],
    "iocs": [
      {
        "type": "Endpoint",
        "value": "/assessment_thanks.do"
      }
    ],
    "id": "auto-conn-otx-servicenow-ai-platform-pre-auth-rce-cve-2026-6875-exploited-",
    "fetchedAt": "2026-07-22T12:19:09.910Z"
  },
  {
    "connector": "otx",
    "title": "SharePoint deserialization RCE CVE-2026-50522 exploited to steal IIS machine keys",
    "date": "2026-07-21",
    "severity": "Critical",
    "summary": "watchTowr reports active exploitation of CVE-2026-50522 (CVSS 9.8), a deserialization RCE in on-premises Microsoft SharePoint Server, after a public PoC. Attackers pull IIS machine keys via a single request to persist; CISA warns multiple SharePoint flaws (CVE-2026-32201, CVE-2026-45659, CVE-2026-56164, CVE-2026-58644, CVE-2026-50522) are being chained for RCE and persistence. Defenders must rotate machine keys, not just patch.",
    "tags": [
      "sharepoint",
      "cve-2026-50522",
      "rce",
      "machine-keys",
      "exploited"
    ],
    "iocs": [],
    "id": "auto-conn-otx-sharepoint-deserialization-rce-cve-2026-50522-exploited-to-s",
    "fetchedAt": "2026-07-22T12:19:09.910Z"
  },
  {
    "connector": "pulsedive",
    "title": "UAC-0145 (Sandworm) shifts to ClickFix with Ethereum smart-contract C2",
    "date": "2026-07-19",
    "severity": "High",
    "summary": "CERT-UA reports UAC-0145, a Sandworm sub-cluster, using ClickFix fake-CAPTCHA lures on compromised websites to trick Ukrainian users into running PowerShell that drops the GHETTOVIBE VBS autorun payload and the SCOUTCURL recon script. The campaign uses the Cloaking.House service and SMARTAXE malware, which resolves C2 domains via Ethereum smart contracts to resist takedown.",
    "tags": [
      "uac-0145",
      "sandworm",
      "clickfix",
      "ukraine",
      "smartaxe"
    ],
    "iocs": [],
    "id": "auto-conn-pulsedive-uac-0145-sandworm-shifts-to-clickfix-with-ethereum-smart-con",
    "fetchedAt": "2026-07-22T12:19:09.910Z"
  },
  {
    "connector": "otx",
    "title": "CylindricalCanine (GoldenEyeDog) linked to DigiCert code-signing certificate theft",
    "date": "2026-07-17",
    "severity": "High",
    "summary": "Expel attributed the April 2026 DigiCert incident to CylindricalCanine, a subgroup of the Chinese cybercrime cluster GoldenEyeDog (APT-Q-27 / Dragon Breath / Miuuti Group). The actor accessed a DigiCert support member's device and stole code-signing certificates intended for customers, using malware tracked as Golden Gh0st Loader and Golden Gh0st RAT.",
    "tags": [
      "cylindricalcanine",
      "goldeneyedog",
      "digicert",
      "code-signing",
      "china"
    ],
    "iocs": [],
    "id": "auto-conn-otx-cylindricalcanine-goldeneyedog-linked-to-digicert-code-signi",
    "fetchedAt": "2026-07-22T12:19:09.910Z"
  },
  {
    "connector": "otx",
    "title": "North Korean Contagious Interview hides OtterCookie malware in SVG flag images",
    "date": "2026-07-17",
    "severity": "High",
    "summary": "Elastic Security Labs details a DPRK-aligned Contagious Interview cluster (tracked REF9403) that fragments an OtterCookie-aligned payload across HTML comment blocks of SVG country-flag images used in fake coding-assessment repos. On project start the code reassembles into a four-stage payload: browser/crypto-wallet stealer, file stealer, Socket.IO RAT, and clipboard stealer, with zero antivirus detections at publication.",
    "tags": [
      "contagious-interview",
      "ottercookie",
      "dprk",
      "steganography",
      "svg"
    ],
    "iocs": [],
    "id": "auto-conn-otx-north-korean-contagious-interview-hides-ottercookie-malware-",
    "fetchedAt": "2026-07-22T12:19:09.910Z"
  },
  {
    "connector": "otx",
    "title": "HollowGraph malware abuses Microsoft Graph and M365 calendars for C2",
    "date": "2026-07-20",
    "severity": "High",
    "summary": "New HollowGraph malware, linked to the Iranian-associated Cavern C2 framework, uses a compromised Microsoft 365 account and the Graph API to hide commands and exfiltrated data inside far-future calendar events, with DNS tunnelling as a backup channel. Reporting indicates targeting of organizations in Israel for espionage, with at least 12 systems infected.",
    "tags": [
      "hollowgraph",
      "cavern",
      "graph-api",
      "c2",
      "espionage"
    ],
    "iocs": [],
    "id": "auto-conn-otx-hollowgraph-malware-abuses-microsoft-graph-and-m365-calendar",
    "fetchedAt": "2026-07-20T19:14:34.526833Z"
  },
  {
    "connector": "otx",
    "title": "ACR Stealer intrusions use ClickFix lures to steal browser secrets",
    "date": "2026-07-16",
    "severity": "Medium",
    "summary": "Microsoft Defender Experts reported increased ACR Stealer activity from late April to mid-June 2026 using ClickFix social-engineering lures to trick users into running attacker commands that steal browser credentials, authentication tokens and sensitive documents from enterprise environments.",
    "tags": [
      "acr-stealer",
      "clickfix",
      "infostealer",
      "credential-theft"
    ],
    "iocs": [],
    "id": "auto-conn-otx-acr-stealer-intrusions-use-clickfix-lures-to-steal-browser-s",
    "fetchedAt": "2026-07-20T19:14:34.526833Z"
  },
  {
    "connector": "pulsedive",
    "title": "UTA0533 exploits SonicWall SMA 1000 zero-days to plant KNUCKLEBALL",
    "date": "2026-07-17",
    "severity": "Critical",
    "summary": "Volexity detailed UTA0533 chaining SonicWall SMA 1000 zero-days CVE-2026-15409 (SSRF, CVSS 10.0) and CVE-2026-15410 (code injection) since June 22, 2026 to gain root on VPN appliances, deploying KNUCKLEBALL malware plus the Suo5 proxy and ORANGETAIL webshell to steal credentials and tunnel traffic.",
    "tags": [
      "uta0533",
      "sonicwall",
      "sma1000",
      "zero-day",
      "knuckleball"
    ],
    "iocs": [],
    "id": "auto-conn-pulsedive-uta0533-exploits-sonicwall-sma-1000-zero-days-to-plant-knuck",
    "fetchedAt": "2026-07-20T19:14:34.526833Z"
  },
  {
    "connector": "misp",
    "title": "Coca-Cola Fairlife ransomware attack halts US dairy production",
    "date": "2026-07-16",
    "severity": "High",
    "summary": "Coca-Cola confirmed a ransomware attack on its Fairlife dairy subsidiary that forced suspension of all US Fairlife production. Product quality/safety and Canadian operations were reportedly unaffected; no group has claimed responsibility and the intrusion vector is undisclosed.",
    "tags": [
      "ransomware",
      "coca-cola",
      "fairlife",
      "manufacturing"
    ],
    "iocs": [],
    "id": "auto-conn-misp-coca-cola-fairlife-ransomware-attack-halts-us-dairy-producti",
    "fetchedAt": "2026-07-20T19:14:34.526833Z"
  },
  {
    "connector": "otx",
    "title": "Oracle E-Business Suite Payments unauthenticated file read exploited (CVE-2026-46817)",
    "date": "2026-07-15",
    "severity": "Critical",
    "summary": "CVE-2026-46817 (CVSS 9.8) in Oracle E-Business Suite's Payments module is being actively exploited; the unauthenticated 'ibytransmit' endpoint can be abused to read arbitrary files (e.g. /etc/passwd) from the server. First in-the-wild exploitation was captured on 2026-06-27 and CISA added it to KEV on 2026-07-15; Shadowserver tracks roughly 950 exposed EBS instances online.",
    "tags": [
      "oracle",
      "ebusiness-suite",
      "cve-2026-46817",
      "file-disclosure"
    ],
    "iocs": [],
    "id": "auto-conn-otx-oracle-e-business-suite-payments-unauthenticated-file-read-e",
    "fetchedAt": "2026-07-18T18:45:39.935Z"
  },
  {
    "connector": "otx",
    "title": "Fortinet FortiSandbox OS command injection flaws added to CISA KEV (CVE-2026-25089, CVE-2026-39808)",
    "date": "2026-07-16",
    "severity": "Critical",
    "summary": "CISA added two Fortinet FortiSandbox OS command injection vulnerabilities (CVE-2026-25089 and CVE-2026-39808, both CVSS 9.1) to its KEV catalog on 2026-07-16 after reports of active exploitation. Both allow an unauthenticated attacker to run commands via crafted HTTP requests; a third related flaw (CVE-2026-39813) was also reported exploited. Upgrade to FortiSandbox 4.4.9 / 5.0.6 or later.",
    "tags": [
      "fortinet",
      "fortisandbox",
      "command-injection",
      "kev"
    ],
    "iocs": [],
    "id": "auto-conn-otx-fortinet-fortisandbox-os-command-injection-flaws-added-to-ci",
    "fetchedAt": "2026-07-18T18:45:39.935Z"
  },
  {
    "id": "auto-conn-otx-microsoft-sharepoint-server-deserialization-rce-exploited-cv",
    "connector": "otx",
    "title": "Microsoft SharePoint Server deserialization RCE exploited (CVE-2026-58644)",
    "date": "2026-07-15",
    "severity": "Critical",
    "summary": "Open-source threat-intel communities are tracking exploitation risk around CVE-2026-58644, a critical (CVSS 9.8) unauthenticated deserialization remote-code-execution flaw in on-premises Microsoft SharePoint Server (2016, 2019, Subscription Edition) fixed in the July 2026 Patch Tuesday. CISA urged immediate patching and AMSI Full Mode hardening after observing active exploitation of SharePoint environments; defenders should watch for w3wp.exe spawning shells and unexpected .aspx files in SharePoint layouts directories.",
    "tags": [
      "sharepoint",
      "rce",
      "deserialization",
      "cve-2026-58644"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-16T18:44:44.837Z"
  },
  {
    "id": "auto-conn-otx-sonicwall-sma1000-zero-day-cve-2026-15409-15410",
    "connector": "otx",
    "title": "SonicWall SMA1000 zero-day exploitation (CVE-2026-15409, CVE-2026-15410)",
    "date": "2026-07-14",
    "severity": "Critical",
    "summary": "OTX/OSINT tracking of active exploitation of two SonicWall SMA1000 flaws: a CVSS 10.0 unauthenticated SSRF (CVE-2026-15409) chained with a post-auth command injection (CVE-2026-15410) for admin-level OS command execution. Both were added to the CISA KEV catalog on July 14, 2026.",
    "tags": [
      "sonicwall",
      "sma1000",
      "kev",
      "zero-day"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-15T18:43:59.000Z"
  },
  {
    "id": "auto-conn-otx-microsoft-adfs-zero-day-cve-2026-56155",
    "connector": "otx",
    "title": "Microsoft AD FS privilege-escalation zero-day exploited (CVE-2026-56155)",
    "date": "2026-07-14",
    "severity": "High",
    "summary": "Community tracking of the actively exploited AD FS access-control flaw CVE-2026-56155 (CVSS 7.8), which lets a low-privileged local attacker escalate to administrator on federation servers. Patched in the July 2026 Patch Tuesday and added to CISA KEV.",
    "tags": [
      "microsoft",
      "adfs",
      "zero-day",
      "kev"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-15T18:43:59.000Z"
  },
  {
    "id": "auto-conn-otx-microsoft-sharepoint-zero-day-cve-2026-56164",
    "connector": "otx",
    "title": "Microsoft SharePoint privilege-escalation zero-day exploited (CVE-2026-56164)",
    "date": "2026-07-14",
    "severity": "High",
    "summary": "OSINT tracking of active exploitation of CVE-2026-56164, a missing-authentication flaw in SharePoint Server allowing remote unauthenticated privilege escalation over the network. One of two exploited zero-days in Microsoft's record July 2026 Patch Tuesday.",
    "tags": [
      "microsoft",
      "sharepoint",
      "zero-day"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-15T18:43:59.000Z"
  },
  {
    "id": "auto-conn-misp-microsoft-july-2026-patch-tuesday-critical-unauth-rce",
    "connector": "misp",
    "title": "Microsoft July 2026 Patch Tuesday critical unauthenticated RCEs (Dynamics 365, Windows DHCP, Server Network driver)",
    "date": "2026-07-14",
    "severity": "Critical",
    "summary": "MISP-style sharing of the record 622-CVE July 2026 Patch Tuesday, highlighting CVSS 9.8 unauthenticated RCEs: Dynamics 365 Business Central (CVE-2026-55944), Windows DHCP Server (CVE-2026-50518 / CVE-2026-56159) and the Windows Server Network driver (CVE-2026-56188).",
    "tags": [
      "microsoft",
      "patch-tuesday",
      "rce",
      "critical"
    ],
    "iocs": [],
    "fetchedAt": "2026-07-15T18:43:59.000Z"
  },
  {
    "id": "auto-conn-otx-langflow-cve-2026-55255-second-stage-loader",
    "connector": "otx",
    "title": "Langflow CVE-2026-55255 exploitation - second-stage loader infrastructure",
    "date": "2026-07-08",
    "severity": "Critical",
    "summary": "Community tracking of in-the-wild exploitation of the Langflow IDOR CVE-2026-55255. Sysdig reported RCE payloads that download and execute a second-stage loader from an attacker-controlled host, alongside abuse of the /api/v1/responses endpoint to harvest embedded LLM, cloud and database secrets. Defenders should monitor and block the loader infrastructure.",
    "tags": [
      "langflow",
      "cve-2026-55255",
      "c2",
      "idor"
    ],
    "iocs": [
      {
        "type": "IP",
        "value": "45.207.216.55"
      },
      {
        "type": "URL",
        "value": "http://45.207.216.55:8084/slt"
      }
    ],
    "fetchedAt": "2026-07-14T13:43:58.000Z"
  },
  {
    "id": "auto-conn-misp-jscrambler-npm-supply-chain-compromise",
    "connector": "misp",
    "title": "jscrambler npm supply-chain compromise - malicious package versions",
    "date": "2026-07-11",
    "severity": "High",
    "summary": "Supply-chain event suitable for MISP sharing: an attacker used a stolen npm token to publish malicious jscrambler releases embedding cross-platform Rust infostealer binaries. Multiple malicious versions were published within hours; later builds dropped the preinstall hook to evade --ignore-scripts. Pin/quarantine the affected versions and rotate any secrets exposed on affected build hosts.",
    "tags": [
      "npm",
      "supply-chain",
      "jscrambler",
      "infostealer"
    ],
    "iocs": [
      {
        "type": "npm package",
        "value": "jscrambler@8.14.0"
      },
      {
        "type": "npm package",
        "value": "jscrambler@8.16.0"
      },
      {
        "type": "npm package",
        "value": "jscrambler@8.17.0"
      },
      {
        "type": "npm package",
        "value": "jscrambler@8.18.0"
      },
      {
        "type": "npm package",
        "value": "jscrambler@8.20.0"
      }
    ],
    "fetchedAt": "2026-07-14T13:43:58.000Z"
  },
  {
    "id": "auto-conn-otx-sp-page-builder-cve-2026-48908-webshell-upload",
    "connector": "otx",
    "title": "SP Page Builder for Joomla CVE-2026-48908 - mass webshell upload exploitation",
    "date": "2026-07-07",
    "severity": "Critical",
    "summary": "Community tracking of active exploitation of the unauthenticated file-upload RCE CVE-2026-48908 (CVSS 10.0) in the SP Page Builder Joomla extension. Attackers POST to the asset.uploadCustomIcon controller to drop PHP webshells and file-manager backdoors under the extension asset path and create hidden Joomla super-admin accounts. Hunt web logs for the upload URI and audit the asset directory.",
    "tags": [
      "joomla",
      "cve-2026-48908",
      "webshell",
      "exploitation"
    ],
    "iocs": [
      {
        "type": "URI",
        "value": "index.php?option=com_sppagebuilder&task=asset.uploadCustomIcon"
      },
      {
        "type": "Path",
        "value": "/media/com_sppagebuilder/assets/"
      }
    ],
    "fetchedAt": "2026-07-14T13:43:58.000Z"
  },
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
