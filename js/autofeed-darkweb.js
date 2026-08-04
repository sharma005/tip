/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: darkweb. Hand-updated via an interactive
   Claude session (WebSearch) — see lib/intel/schemas.mjs
   (DARKWEB_SCHEMA) and lib/intel/contentTypes.mjs (cap 80) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_DARKWEB = [
  {
    "id": "auto-dw-qilin-ransomware-posts-104-new-victims-to-its-leak-site-in-a",
    "title": "Qilin ransomware posts 104 new victims to its leak site in August, outpacing Akira",
    "type": "ransomware",
    "source": "GBHackers",
    "date": "2026-08-04",
    "snippet": "Reporting in early August 2026 shows the Qilin (Agenda) ransomware-as-a-service operation claimed 104 organizations on its data leak site in August, nearly doubling second-place Akira and cementing Qilin as the most prolific ransomware brand of the period. Since RansomHub's decline in April, Qilin has accounted for roughly 18% of all logged ransomware incidents, aided by an aggressive affiliate program and customizable leak-site tooling.",
    "relevance": 75,
    "flagged": false,
    "tags": [
      "qilin",
      "agenda",
      "ransomware",
      "leak-site",
      "raas"
    ],
    "fetchedAt": "2026-08-04T18:49:38.411Z"
  },
  {
    "id": "auto-dw-inc-ransom-sonicwall-sma-breach-victims-on-leak-site",
    "title": "INC Ransom publishes SonicWall SMA breach victims on its data leak site",
    "type": "ransomware",
    "source": "The Hacker News",
    "date": "2026-08-02",
    "snippet": "Following zero-day exploitation of SonicWall SMA 1000 appliances (CVE-2026-15409 / CVE-2026-15410), the INC Ransom group has posted a wave of new victims to its data leak site between July 17 and August 1, 2026, spanning private-sector and government organizations in Australia, the U.S., the U.A.E., Colombia and Switzerland. Ransomware.Live tracks the group at 885 claimed victims, the most recent added August 2, 2026.",
    "relevance": 80,
    "flagged": false,
    "tags": [
      "inc-ransom",
      "sonicwall",
      "ransomware",
      "leak-site"
    ],
    "fetchedAt": "2026-08-03T18:47:35.894Z"
  },
  {
    "title": "coinbasecartel extortion group lists European standards bodies CEN and CENELEC on leak site",
    "type": "ransomware",
    "source": "coinbasecartel leak site",
    "date": "2026-08-01",
    "snippet": "Threat-intel reporting (DeXpose, RedPacketSecurity, ransomware.live) noted that on August 1, 2026 the data-extortion group 'coinbasecartel' added the European standardization bodies CEN and CENELEC (Belgium) to its dark web leak site, threatening to publish stolen data unless negotiations begin. Active since September 2025, the group steals data and extorts victims without deploying an encryptor and has claimed 60+ victims across healthcare, technology, transportation, finance and telecom.",
    "relevance": 60,
    "flagged": false,
    "tags": [
      "coinbasecartel",
      "extortion",
      "data-leak",
      "leak-site",
      "europe"
    ],
    "id": "auto-dw-coinbasecartel-lists-cen-and-cenelec-on-leak-site",
    "fetchedAt": "2026-08-02T18:45:20.617Z"
  },
  {
    "title": "Bank of Baroda ~1TB customer and corporate banking data leaked on dark web by 'TripleX'",
    "type": "leak",
    "source": "Business Standard",
    "date": "2026-07-24",
    "snippet": "Business Standard and others reported that on July 24, 2026 a ransomware/extortion group calling itself 'TripleX' listed India's state-owned Bank of Baroda on its dark web leak site, allegedly exposing nearly 1TB of data. The trove reportedly includes savings/current and loan account records, net-banking and NRI customer data, Aadhaar numbers and branch/ATM records drawn from multiple branches. The bank confirmed an employee email-account compromise led to unauthorised access to certain internal files, while stating core banking systems were not touched.",
    "relevance": 72,
    "flagged": false,
    "tags": [
      "bank-of-baroda",
      "triplex",
      "data-leak",
      "india",
      "pii"
    ],
    "id": "auto-dw-bank-of-baroda-1tb-customer-and-corporate-banking-data-leake",
    "fetchedAt": "2026-07-29T17:09:02.760Z"
  },
  {
    "title": "The Gentlemen ransomware lists Thialf ice arena on leak site",
    "type": "leak",
    "source": "DeXpose",
    "date": "2026-07-23",
    "snippet": "Threat-intel reporting (DeXpose, GalaxyWarden) noted that on July 23, 2026 the double-extortion group 'The Gentlemen' claimed the Thialf ice arena (thialf.nl) in Heerenveen, Netherlands on its dark web leak site, stating internal files were exfiltrated. The world-renowned speed-skating venue is a comparatively small victim but fits the group's pattern of naming diverse organizations to pressure ransom payment.",
    "relevance": 38,
    "flagged": false,
    "tags": [
      "the-gentlemen",
      "ransomware",
      "thialf",
      "data-leak",
      "netherlands"
    ],
    "id": "auto-dw-the-gentlemen-ransomware-lists-thialf-ice-arena-on-leak-site",
    "fetchedAt": "2026-07-29T17:09:02.760Z"
  },
  {
    "title": "Flying Eagle Android RAT source code circulating on criminal Telegram channels",
    "type": "chatter",
    "source": "The Hacker News",
    "date": "2026-07-28",
    "snippet": "Hunt.io and researcher NetAskari published joint research (The Hacker News, July 28, 2026) showing the leaked source code for the Flying Eagle (飞鹰) Android RAT and device-control framework is circulating through criminal Telegram channels as a 388MB archive. Using TLS certificate and panel fingerprints, they traced 170 active servers running the framework and documented a successor platform, 'Night Dragon,' targeting Chinese users. The leak lowers the barrier to entry and is fueling a fractured criminal ecosystem building on the codebase.",
    "relevance": 55,
    "flagged": false,
    "tags": [
      "flying-eagle",
      "android",
      "rat",
      "telegram",
      "source-code-leak"
    ],
    "id": "auto-dw-flying-eagle-android-rat-source-code-circulating-on-criminal",
    "fetchedAt": "2026-07-29T17:09:02.760Z"
  },
  {
    "title": "ShinyHunters breach data reused in $2,000 Bitcoin sextortion email campaign",
    "type": "credential",
    "source": "BleepingComputer",
    "date": "2026-07-25",
    "snippet": "BleepingComputer reported that email addresses exposed in breaches previously leaked by the ShinyHunters extortion group are being reused to send sextortion emails demanding $2,000 in Bitcoin. Leaked data seen in the campaign includes records from the Amtrak, Hallmark, Substack, Betterment, CarGurus, ADT, Panera Bread, and McGraw Hill breaches. The messages appear to come from an opportunistic actor who downloaded the previously leaked data rather than from ShinyHunters directly, using the real exposed addresses to make the threats look credible.",
    "relevance": 40,
    "flagged": false,
    "tags": [
      "shinyhunters",
      "sextortion",
      "data-leak",
      "credentials"
    ],
    "id": "auto-dw-shinyhunters-breach-data-reused-in-2-000-bitcoin-sextortion-",
    "fetchedAt": "2026-07-26T18:42:58.158Z"
  },
  {
    "title": "Everest extortion gang breaches Stadler Rail supplier platform, demands $12.3M",
    "type": "leak",
    "source": "Everest extortion group (reported by Help Net Security / The Register)",
    "date": "2026-07-23",
    "snippet": "Swiss rail-vehicle manufacturer Stadler Rail disclosed that the Everest extortion gang stole technical data after compromising credentials for a data-exchange platform shared with one of its suppliers, then demanded roughly $12.3M (CHF 10M). Stadler refused to negotiate and filed a criminal complaint; it said personal data, in-service trains, IT and production were unaffected. As of reporting Everest had not publicly claimed the attack or listed Stadler on its leak site, so the extortion remains ongoing.",
    "relevance": 55,
    "tags": [
      "everest",
      "extortion",
      "stadler-rail",
      "supply-chain",
      "manufacturing"
    ],
    "id": "auto-dw-everest-extortion-gang-breaches-stadler-rail-supplier-platfo",
    "flagged": false,
    "fetchedAt": "2026-07-23T18:44:55.355Z"
  },
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
