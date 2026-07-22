/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: darkweb. Hand-updated via an interactive
   Claude session (WebSearch) — see lib/intel/schemas.mjs
   (DARKWEB_SCHEMA) and lib/intel/contentTypes.mjs (cap 80) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_DARKWEB = [
  {
    "title": "ShinyHunters lists Abbott Laboratories on leak site, threatens to publish stolen data",
    "type": "leak",
    "source": "ShinyHunters data leak site (reported by BleepingComputer)",
    "date": "2026-07-18",
    "snippet": "The ShinyHunters extortion gang added Abbott Laboratories to its dark web data leak site, threatening to publish allegedly stolen data after a July 18 deadline (later extended to July 21) unless Abbott negotiates. ShinyHunters claims it breached Abbott through a mid-June vishing attack that compromised a Microsoft Entra SSO account; Abbott is investigating this alongside a separate LabCentral-portal breach claim by an actor called ShadowByt3$, and says operations are unaffected.",
    "relevance": 65,
    "flagged": false,
    "tags": [
      "shinyhunters",
      "abbott",
      "extortion",
      "healthcare",
      "data-leak"
    ],
    "id": "auto-dw-shinyhunters-lists-abbott-laboratories-on-leak-site-threaten",
    "fetchedAt": "2026-07-22T18:45:28.539Z"
  },
  {
    "title": "Anubis ransomware claims Coca-Cola's Fairlife attack, threatens to leak 1TB",
    "type": "ransomware",
    "source": "BleepingComputer (reporting on Anubis leak site)",
    "date": "2026-07-20",
    "snippet": "The Anubis ransomware-as-a-service gang listed Coca-Cola and its Fairlife dairy subsidiary on its dark web leak site on July 20, claiming to have encrypted Fairlife's Nutanix infrastructure and exfiltrated roughly 1TB of confidential data. Anubis says it hit Fairlife about a week before the company's July 16 public disclosure and gave Coca-Cola one week to pay before the data is leaked.",
    "relevance": 70,
    "flagged": false,
    "tags": [
      "anubis",
      "ransomware",
      "coca-cola",
      "fairlife",
      "extortion"
    ],
    "id": "auto-dw-anubis-ransomware-claims-coca-cola-s-fairlife-attack-threate",
    "fetchedAt": "2026-07-22T12:19:09.910Z"
  },
  {
    "title": "Accenture data offered for sale after confirmed breach",
    "type": "leak",
    "source": "BleepingComputer (reporting on underground forum)",
    "date": "2026-07-08",
    "snippet": "Accenture confirmed a breach after a threat actor advertised roughly 35GB of stolen data on a hacking forum, claiming it included source code, RSA and SSH keys, Azure personal access tokens, Azure Storage access keys and configuration files, with a screenshot showing an Azure DevOps repo clone.",
    "relevance": 75,
    "flagged": false,
    "tags": [
      "accenture",
      "source-code",
      "azure",
      "credentials-leak"
    ],
    "id": "auto-dw-accenture-data-offered-for-sale-after-confirmed-breach",
    "fetchedAt": "2026-07-08T23:07:48.925Z"
  }
];
