/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: snowbit. Sourced from Slack #team-snowbit,
   hand-written into this file (no automated fetch — these advisories
   come from a Slack channel, not WebSearch). Field shape is validated
   by DataManager.mergeAutoFetchedSnowbit() in js/data.js (there is no
   lib/intel/schemas.mjs entry for this type). Append new items deduped
   by id; no cap currently enforced.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_SNOWBIT = [
  {
    "id": "snowbit-lshiy-password-spray-azure-cli-ropc-attack-bypasses-mfa",
    "title": "LSHIY Password Spray: Azure CLI ROPC Attack Bypasses MFA",
    "severity": "High",
    "date": "2026-07-03",
    "source": "Snowbit by Coralogix",
    "actor": "LSHIY LLC — bulletproof infrastructure on AS32167 / AS955",
    "pdfUrl": "assets/advisories/lshiy-password-spray-advisory.pdf",
    "summary": "A threat actor operating from infrastructure controlled by LSHIY LLC (AS32167 / AS955) has executed over 81 million login attempts against Microsoft 365 tenants since June 12, 2026, compromising accounts across multiple organizations. The campaign abuses the deprecated OAuth 2.0 Resource Owner Password Credentials (ROPC) flow via the Azure CLI, which bypasses MFA entirely when Conditional Access Policies are not explicitly scoped to cover it. Organizations with MFA enabled are not automatically protected — impacted tenants had MFA in place but no policy blocking this vector.",
    "tags": [
      "azure",
      "m365",
      "entra-id",
      "ropc",
      "mfa-bypass",
      "password-spray",
      "identity"
    ],
    "execSummary": [
      "Snowbit is tracking a high-volume password-spray campaign attributed to infrastructure controlled by LSHIY LLC (AS32167 / AS955). Since June 12, 2026 the actor has generated over 81 million Microsoft 365 login attempts and successfully compromised accounts across several organizations.",
      "The attack abuses the deprecated OAuth 2.0 ROPC authentication flow through the Azure CLI. Because ROPC exchanges a username and password directly for tokens, it bypasses MFA unless Conditional Access Policies are explicitly scoped to cover all client app types. Having MFA enabled is not sufficient on its own to block this technique."
    ],
    "howItWorks": [
      {
        "phase": "Initial Access",
        "title": "Credential validation via ROPC",
        "description": "The actor submits harvested or sprayed username/password pairs to Entra ID using the OAuth 2.0 ROPC grant through the Azure CLI client, exchanging credentials directly for access tokens."
      },
      {
        "phase": "Defense Evasion",
        "title": "MFA bypass",
        "description": "Because the ROPC flow is not challenged by MFA unless Conditional Access is scoped to all client app types, valid credentials yield tokens without any second-factor prompt."
      },
      {
        "phase": "Impact",
        "title": "Account takeover",
        "description": "Successful token issuance grants the actor authenticated access to the tenant, enabling data access and follow-on abuse under a legitimate identity."
      }
    ],
    "mfaGaps": [
      "Conditional Access Policies not scoped to \"All client app types\", leaving legacy/ROPC authentication paths unprotected.",
      "MFA enabled at the tenant level but not enforced for the ROPC/Azure CLI client, so token issuance skips the second factor."
    ],
    "timeline": [
      {
        "date": "2026-06-12",
        "event": "Campaign login attempts against Microsoft 365 tenants begin from LSHIY-controlled infrastructure."
      },
      {
        "date": "2026-07-03",
        "event": "Snowbit publishes the advisory and completes proactive threat hunts across managed SRC customers."
      }
    ],
    "affectedComponents": [
      {
        "component": "Microsoft 365 / Entra ID authentication",
        "vulnerable": "OAuth 2.0 ROPC (Resource Owner Password Credentials) grant via Azure CLI, not covered by Conditional Access",
        "protectedConfig": "Conditional Access enforcing MFA for All Users, All Cloud Apps and All Client App Types with no exclusions; ROPC blocked at the token level"
      }
    ],
    "iocs": [
      {
        "type": "ASN",
        "value": "AS32167",
        "context": "LSHIY LLC-controlled source infrastructure"
      },
      {
        "type": "ASN",
        "value": "AS955",
        "context": "LSHIY LLC-controlled source infrastructure"
      }
    ],
    "dataprimeQueries": [
      {
        "name": "ROPC / Azure CLI sign-ins",
        "description": "Surface interactive sign-ins using the ROPC flow or Azure CLI client, which should be rare in most tenants.",
        "query": "source logs\n| filter $d.event_type == \"signin\"\n| filter $d.auth_protocol == \"ROPC\" || $d.app_display_name == \"Microsoft Azure CLI\"\n| groupby $d.user_principal_name, $d.ip_address, $d.result\n| count() as attempts\n| filter attempts > 0\n| sort -attempts"
      },
      {
        "name": "High-volume failed sign-ins from single ASN",
        "description": "Detect password-spray patterns by grouping failed sign-ins by source ASN and target user count.",
        "query": "source logs\n| filter $d.event_type == \"signin\"\n| filter $d.result == \"failure\"\n| groupby $d.source_asn\n| distinct_count($d.user_principal_name) as targeted_users, count() as fail_count\n| filter fail_count > 100\n| sort -fail_count"
      }
    ],
    "remediation": [
      "Audit Conditional Access Policies — ensure MFA is enforced for All Users, All Cloud Apps and All Client App Types with no exclusions.",
      "Enable userStrongAuthClientAuthNRequired to block ROPC flows at the token level.",
      "Force password resets for any accounts appearing in breach datasets or showing anomalous ROPC/Azure CLI sign-ins."
    ],
    "snowbitResponse": [
      "Snowbit ran proactive threat hunts across managed SRC customers using Azure AD / Entra ID sign-in telemetry, scoping for ROPC and Azure CLI authentication originating from the LSHIY-controlled ASNs. Observed attempts against monitored customers were blocked, and per-customer reports were delivered to affected accounts along with Conditional Access hardening guidance."
    ],
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  }
];
