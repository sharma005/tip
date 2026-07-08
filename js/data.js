/* ═══════════════════════════════════════════════════════════════════
   TIP — Data Layer
   All sample data, CRUD operations, localStorage persistence
   ═══════════════════════════════════════════════════════════════════ */

const TIP_DATA = {
  /* ── Categories ── */
  categories: {
    kev:         { label: 'Actively Exploited', short: 'KEV',          color: 'kev' },
    zeroday:     { label: 'Zero-Day',           short: '0-DAY',        color: 'zeroday' },
    supplychain: { label: 'Supply Chain',       short: 'SUPPLY CHAIN', color: 'supplychain' },
    ransomware:  { label: 'Ransomware',         short: 'RANSOMWARE',   color: 'ransomware' },
    rce:         { label: 'Critical RCE',       short: 'RCE',          color: 'rce' },
    darkweb:     { label: 'Dark Web',           short: 'DARK WEB',     color: 'darkweb' }
  },

  /* ── Severity ranking ── */
  sevRank: { Critical: 4, High: 3, Medium: 2, Low: 1 },

  /* ── Feed Items (populated by scripts/fetch-intel.mjs + admin manual entries) ── */
  feedItems: [],

  /* ── Adversaries ── */
  adversaries: [],

  /* ── Hypotheses ── */
  hypotheses: [],

  /* ── Dark Web Intel ── */
  darkwebItems: [],

  /* ── Connector Intel (MISP, OTX, Pulsedive, YETI, Cortex) ── */
  connectorIntel: [],

  /* ── Snowbit Advisories ── */
  snowbitAdvisories: [],

  /* ── Tweetfeed (tracked Twitter/X accounts) ── */
  twitterAccounts: [],

  tweetfeedItems: [],

  /* ── DataPrime Query Templates ── */
  queryTemplates: [
    {
      id: 'qt-1',
      name: 'Suspicious Network Connections',
      category: 'network',
      template: 'source logs\n| filter $d.event_type == "network_connection"\n| filter $d.destination_port in [${PORTS}]\n| filter $d.destination_ip not in [${WHITELIST_IPS}]\n| groupby $d.source_ip, $d.destination_ip, $d.destination_port\n| count() as connection_count\n| filter connection_count > ${THRESHOLD}\n| sort -connection_count'
    },
    {
      id: 'qt-2',
      name: 'Suspicious Process Execution',
      category: 'endpoint',
      template: 'source logs\n| filter $d.event_type == "process_creation"\n| filter $d.process_name in [${SUSPICIOUS_PROCESSES}]\n| filter $d.parent_process not in [${NORMAL_PARENTS}]\n| groupby $d.hostname, $d.user, $d.process_name, $d.command_line\n| count() as exec_count\n| sort -exec_count'
    },
    {
      id: 'qt-3',
      name: 'Failed Authentication Spray',
      category: 'identity',
      template: 'source logs\n| filter $d.event_type == "authentication"\n| filter $d.auth_result == "failure"\n| groupby $d.source_ip, $d.target_user\n| count() as fail_count\n| filter fail_count > ${THRESHOLD}\n| sort -fail_count'
    },
    {
      id: 'qt-4',
      name: 'Cloud API Anomalous Activity',
      category: 'cloud',
      template: 'source logs\n| filter $d.cloud_provider == "${PROVIDER}"\n| filter $d.event_type in ["CreateUser", "AttachPolicy", "AssumeRole", "PutBucketPolicy"]\n| filter $d.source_ip not in [${KNOWN_IPS}]\n| groupby $d.source_ip, $d.event_type, $d.user_identity\n| count() as api_calls\n| filter api_calls > ${THRESHOLD}\n| sort -api_calls'
    },
    {
      id: 'qt-5',
      name: 'DNS Exfiltration Detection',
      category: 'network',
      template: 'source logs\n| filter $d.event_type == "dns_query"\n| filter $d.query_length > 50\n| filter $d.query_type in ["TXT", "CNAME", "MX"]\n| groupby $d.source_ip, $d.query_domain\n| count() as query_count\n| filter query_count > ${THRESHOLD}\n| sort -query_count'
    }
  ],

  /* ── Metadata ── */
  meta: {
    lastBuilt: new Date().toISOString(),
    lastFetch: null,
    fetchInterval: '6h',
    totalPublished: 0
  }
};


/* ═══════════════════════════════════════════════════════════════════
   Data Manager — localStorage CRUD
   ═══════════════════════════════════════════════════════════════════ */
const DataManager = {
  STORAGE_KEY: 'tip_data',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved data with defaults (keep structure, override with saved)
        if (parsed.feedItems) TIP_DATA.feedItems = parsed.feedItems;
        if (parsed.adversaries) TIP_DATA.adversaries = parsed.adversaries;
        if (parsed.hypotheses) TIP_DATA.hypotheses = parsed.hypotheses;
        if (parsed.darkwebItems) TIP_DATA.darkwebItems = parsed.darkwebItems;
        if (parsed.connectorIntel) TIP_DATA.connectorIntel = parsed.connectorIntel;
        if (parsed.snowbitAdvisories) TIP_DATA.snowbitAdvisories = parsed.snowbitAdvisories;
        if (parsed.twitterAccounts) TIP_DATA.twitterAccounts = parsed.twitterAccounts;
        if (parsed.tweetfeedItems) TIP_DATA.tweetfeedItems = parsed.tweetfeedItems;
        if (parsed.meta) Object.assign(TIP_DATA.meta, parsed.meta);
      } catch (e) {
        console.warn('Failed to load saved data, using defaults');
      }
    }
    // Seed the tracked-account list from the repo-committed config (only if
    // nothing was restored from localStorage above) — see js/tweetfeed-accounts.js
    // for why this can't just live in the TIP_DATA literal.
    if (!TIP_DATA.twitterAccounts || !TIP_DATA.twitterAccounts.length) {
      TIP_DATA.twitterAccounts = (typeof TWEETFEED_ACCOUNTS !== 'undefined' && Array.isArray(TWEETFEED_ACCOUNTS))
        ? TWEETFEED_ACCOUNTS.slice()
        : ['Huntio'];
    }
    this.mergeAutoFetched();
    this.mergeAutoFetchedHypotheses();
    this.mergeAutoFetchedAdversaries();
    this.mergeAutoFetchedDarkweb();
    this.mergeAutoFetchedConnectors();
    this.mergeAutoFetchedTweetfeed();
    this.save();
  },

  // Validates one TIP_AUTOFEED entry before it's allowed anywhere near
  // feedItems. autofeed.js is generated by scripts/fetch-intel.mjs from LLM
  // output derived from arbitrary web pages — this is the actual trust
  // boundary in the shipped app, so re-check everything here even though the
  // generator script already validates. Returns null (drop) on any failure
  // rather than trying to repair a bad field.
  // Ids are meant to be slugify()'d server-side (lib/intel/schemas.mjs) — [a-z0-9-]
  // only — and get interpolated unescaped into onclick="...('${id}')" handlers
  // across the view modules, so re-check the charset here too rather than only
  // the prefix: a quote/backtick in a malformed or tampered id would otherwise
  // break out of that inline JS string.
  _isSafeAutoId(id, prefix) {
    return typeof id === 'string' && new RegExp(`^${prefix}[a-z0-9-]{1,80}$`).test(id);
  },

  _sanitizeAutoFetchedItem(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (!this._isSafeAutoId(raw.id, 'auto-')) return null;
    if (!TIP_DATA.categories[raw.category]) return null;
    if (!(raw.severity in TIP_DATA.sevRank)) return null;
    if (typeof raw.url !== 'string' || !/^https?:\/\//i.test(raw.url.trim())) return null;
    if (typeof raw.title !== 'string' || !raw.title.trim()) return null;
    if (typeof raw.summary !== 'string' || !raw.summary.trim()) return null;

    const cve = typeof raw.cve === 'string' && /^CVE-\d{4}-\d{4,7}$/i.test(raw.cve.trim()) ? raw.cve.trim().toUpperCase() : null;
    const cvss = typeof raw.cvss === 'number' && raw.cvss >= 0 && raw.cvss <= 10 ? raw.cvss : null;
    const tags = Array.isArray(raw.tags) ? raw.tags.filter(t => typeof t === 'string' && /^[\w.-]{1,32}$/.test(t)).slice(0, 8) : [];

    return {
      id: raw.id,
      title: raw.title.trim().slice(0, 200),
      category: raw.category,
      severity: raw.severity,
      cve,
      cvss,
      date: typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date.trim()) ? raw.date.trim() : new Date().toISOString().slice(0, 10),
      actor: typeof raw.actor === 'string' && raw.actor.trim() ? raw.actor.trim().slice(0, 120) : null,
      source: (typeof raw.source === 'string' && raw.source.trim() ? raw.source.trim() : 'Unknown').slice(0, 100),
      url: raw.url.trim(),
      summary: raw.summary.trim().slice(0, 800),
      tags,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  // Merges TIP_AUTOFEED (js/autofeed.js, regenerated by scripts/fetch-intel.mjs
  // every 6 hours) directly into the live, published feed — same as
  // mergeAutoFetchedHypotheses/Adversaries/Darkweb, no pending/approval gate.
  // Dedupes by id against feedItems so already-seen items from a prior fetch
  // aren't re-added.
  mergeAutoFetched() {
    if (typeof TIP_AUTOFEED === 'undefined' || !Array.isArray(TIP_AUTOFEED) || !TIP_AUTOFEED.length) return;
    const knownIds = new Set(TIP_DATA.feedItems.map(i => i.id));
    const fresh = TIP_AUTOFEED
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedItem(item))
      .filter(Boolean);
    if (!fresh.length) return;
    fresh.forEach(item => {
      TIP_DATA.feedItems.unshift({ ...item, status: 'published' });
    });
    TIP_DATA.meta.totalPublished = TIP_DATA.feedItems.length;
    TIP_DATA.meta.lastFetch = new Date().toISOString();
  },

  // Best-effort name/ref -> id resolution for auto-fetched hypotheses, which
  // can't know internal ids. Returns null rather than guessing on no match.
  _resolveAdversaryIdByName(name) {
    if (typeof name !== 'string' || !name.trim()) return null;
    const needle = name.trim().toLowerCase();
    const match = TIP_DATA.adversaries.find(a =>
      a.name.toLowerCase() === needle ||
      (Array.isArray(a.aliases) && a.aliases.some(al => al.toLowerCase() === needle))
    );
    return match ? match.id : null;
  },

  _resolveFeedItemIdByRef(ref) {
    if (typeof ref !== 'string' || !ref.trim()) return null;
    const needle = ref.trim().toLowerCase();
    const match = TIP_DATA.feedItems.find(i =>
      (i.cve && i.cve.toLowerCase() === needle) ||
      i.title.toLowerCase().includes(needle) ||
      needle.includes(i.title.toLowerCase())
    );
    return match ? match.id : null;
  },

  // Same trust-boundary posture as _sanitizeAutoFetchedItem above: this is LLM
  // output derived from arbitrary web pages, re-validate everything even
  // though the generator (lib/intel/schemas.mjs) already sanitized it.
  _sanitizeAutoFetchedHypothesis(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (!this._isSafeAutoId(raw.id, 'auto-hypo-')) return null;
    const title = typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim().slice(0, 200) : null;
    const description = typeof raw.description === 'string' && raw.description.trim() ? raw.description.trim().slice(0, 800) : null;
    const mitreTactic = typeof raw.mitreTactic === 'string' && raw.mitreTactic.trim() ? raw.mitreTactic.trim().slice(0, 80) : null;
    const mitreTechnique = typeof raw.mitreTechnique === 'string' && raw.mitreTechnique.trim() ? raw.mitreTechnique.trim().slice(0, 120) : null;
    if (!title || !description || !mitreTactic || !mitreTechnique) return null;
    if (!['P1', 'P2', 'P3', 'P4'].includes(raw.priority)) return null;

    const dataSources = Array.isArray(raw.dataSources)
      ? raw.dataSources.filter(s => typeof s === 'string' && s.trim()).slice(0, 6).map(s => s.trim().slice(0, 60))
      : [];
    const queries = Array.isArray(raw.queries)
      ? raw.queries
        .filter(q => q && typeof q.name === 'string' && q.name.trim() && typeof q.query === 'string' && q.query.trim())
        .slice(0, 3)
        .map(q => ({ name: q.name.trim().slice(0, 100), query: q.query.trim().slice(0, 2000) }))
      : [];

    return {
      id: raw.id,
      title,
      description,
      mitreTactic,
      mitreTechnique,
      dataSources,
      priority: raw.priority,
      status: 'active',
      linkedAdversary: this._resolveAdversaryIdByName(raw.linkedAdversaryName),
      linkedFeedItem: this._resolveFeedItemIdByRef(raw.linkedFeedItemRef),
      createdAt: new Date().toISOString().split('T')[0],
      queries,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  _sanitizeAutoFetchedAdversary(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (!this._isSafeAutoId(raw.id, 'auto-adv-')) return null;
    const name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim().slice(0, 120) : null;
    const notes = typeof raw.notes === 'string' && raw.notes.trim() ? raw.notes.trim().slice(0, 800) : null;
    if (!name || !notes) return null;
    if (!['apt', 'criminal', 'hacktivist'].includes(raw.type)) return null;

    const strArr = (v, max, len) => Array.isArray(v)
      ? v.filter(s => typeof s === 'string' && s.trim()).slice(0, max).map(s => s.trim().slice(0, len))
      : [];

    return {
      id: raw.id,
      name,
      aliases: strArr(raw.aliases, 8, 60),
      type: raw.type,
      origin: typeof raw.origin === 'string' && raw.origin.trim() ? raw.origin.trim().slice(0, 60) : 'Unknown',
      motivation: typeof raw.motivation === 'string' && raw.motivation.trim() ? raw.motivation.trim().slice(0, 60) : 'Unknown',
      sectors: strArr(raw.sectors, 10, 60),
      ttps: strArr(raw.ttps, 15, 20).filter(t => /^T\d{4}(\.\d{3})?$/i.test(t)).map(t => t.toUpperCase()),
      campaigns: strArr(raw.campaigns, 10, 150),
      iocs: strArr(raw.iocs, 20, 120),
      notes,
      active: true,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  _sanitizeAutoFetchedDarkweb(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (!this._isSafeAutoId(raw.id, 'auto-dw-')) return null;
    if (!['leak', 'credential', 'exploit', 'ransomware', 'chatter'].includes(raw.type)) return null;
    const title = typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim().slice(0, 200) : null;
    const snippet = typeof raw.snippet === 'string' && raw.snippet.trim() ? raw.snippet.trim().slice(0, 600) : null;
    if (!title || !snippet) return null;

    const relevance = typeof raw.relevance === 'number' ? Math.max(0, Math.min(100, Math.round(raw.relevance))) : 50;
    const tags = Array.isArray(raw.tags) ? raw.tags.filter(t => typeof t === 'string' && /^[\w.-]{1,32}$/.test(t)).slice(0, 8) : [];

    return {
      id: raw.id,
      title,
      type: raw.type,
      source: typeof raw.source === 'string' && raw.source.trim() ? raw.source.trim().slice(0, 100) : 'Unknown',
      date: typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date.trim()) ? raw.date.trim() : new Date().toISOString().slice(0, 10),
      snippet,
      relevance,
      flagged: false,
      tags,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  _sanitizeAutoFetchedConnectorIntel(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (!this._isSafeAutoId(raw.id, 'auto-conn-')) return null;
    if (!['misp', 'otx', 'pulsedive', 'yeti', 'cortex'].includes(raw.connector)) return null;
    if (!(raw.severity in TIP_DATA.sevRank)) return null;
    const title = typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim().slice(0, 200) : null;
    const summary = typeof raw.summary === 'string' && raw.summary.trim() ? raw.summary.trim().slice(0, 600) : null;
    if (!title || !summary) return null;

    const tags = Array.isArray(raw.tags) ? raw.tags.filter(t => typeof t === 'string' && /^[\w.-]{1,32}$/.test(t)).slice(0, 8) : [];
    // Mirror lib/intel/schemas.mjs's IOC_TYPE_RE here too — this is a separate
    // trust boundary and shouldn't rely on the generator having enforced it.
    const iocs = Array.isArray(raw.iocs)
      ? raw.iocs.filter(i => i && typeof i.type === 'string' && /^[\w.\- ]{1,40}$/.test(i.type.trim()) && typeof i.value === 'string' && i.value.trim())
        .slice(0, 10)
        .map(i => ({ type: i.type.trim().slice(0, 40), value: i.value.trim().slice(0, 200) }))
      : [];

    return {
      id: raw.id,
      connector: raw.connector,
      title,
      date: typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date.trim()) ? raw.date.trim() : new Date().toISOString().slice(0, 10),
      severity: raw.severity,
      summary,
      tags,
      iocs,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  _sanitizeAutoFetchedTweetfeedItem(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (!this._isSafeAutoId(raw.id, 'auto-tweet-')) return null;
    if (typeof raw.username !== 'string' || !/^\w{1,15}$/.test(raw.username.trim())) return null;
    if (typeof raw.url !== 'string' || !/^https:\/\/(x|twitter)\.com\/\w{1,15}\/status\/\d+$/i.test(raw.url.trim())) return null;
    if (!(raw.severity in TIP_DATA.sevRank)) return null;
    const text = typeof raw.text === 'string' && raw.text.trim() ? raw.text.trim().slice(0, 500) : null;
    const summary = typeof raw.summary === 'string' && raw.summary.trim() ? raw.summary.trim().slice(0, 300) : null;
    if (!text || !summary) return null;

    const tags = Array.isArray(raw.tags) ? raw.tags.filter(t => typeof t === 'string' && /^[\w.-]{1,32}$/.test(t)).slice(0, 6) : [];

    return {
      id: raw.id,
      username: raw.username.trim(),
      url: raw.url.trim(),
      date: typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date.trim()) ? raw.date.trim() : new Date().toISOString().slice(0, 10),
      text,
      summary,
      severity: raw.severity,
      tags,
      fetchedAt: typeof raw.fetchedAt === 'string' ? raw.fetchedAt : new Date().toISOString(),
    };
  },

  // Auto-fetched hypotheses/adversaries/dark-web/connector/tweetfeed items
  // publish directly into their live arrays — unlike feed items, there's no
  // pending queue for these sections (manual adds don't go through one
  // either). Only the existing admin-only edit/delete controls gate them
  // after the fact.
  mergeAutoFetchedHypotheses() {
    if (typeof TIP_AUTOFEED_HUNTLAB === 'undefined' || !Array.isArray(TIP_AUTOFEED_HUNTLAB) || !TIP_AUTOFEED_HUNTLAB.length) return;
    const knownIds = new Set(TIP_DATA.hypotheses.map(h => h.id));
    TIP_AUTOFEED_HUNTLAB
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedHypothesis(item))
      .filter(Boolean)
      .forEach(item => TIP_DATA.hypotheses.push(item));
  },

  mergeAutoFetchedAdversaries() {
    if (typeof TIP_AUTOFEED_ADVERSARY === 'undefined' || !Array.isArray(TIP_AUTOFEED_ADVERSARY) || !TIP_AUTOFEED_ADVERSARY.length) return;
    const knownIds = new Set(TIP_DATA.adversaries.map(a => a.id));
    TIP_AUTOFEED_ADVERSARY
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedAdversary(item))
      .filter(Boolean)
      .forEach(item => TIP_DATA.adversaries.push(item));
  },

  mergeAutoFetchedDarkweb() {
    if (typeof TIP_AUTOFEED_DARKWEB === 'undefined' || !Array.isArray(TIP_AUTOFEED_DARKWEB) || !TIP_AUTOFEED_DARKWEB.length) return;
    const knownIds = new Set(TIP_DATA.darkwebItems.map(d => d.id));
    TIP_AUTOFEED_DARKWEB
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedDarkweb(item))
      .filter(Boolean)
      .forEach(item => TIP_DATA.darkwebItems.unshift(item));
  },

  mergeAutoFetchedConnectors() {
    if (typeof TIP_AUTOFEED_CONNECTORS === 'undefined' || !Array.isArray(TIP_AUTOFEED_CONNECTORS) || !TIP_AUTOFEED_CONNECTORS.length) return;
    const knownIds = new Set(TIP_DATA.connectorIntel.map(c => c.id));
    TIP_AUTOFEED_CONNECTORS
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedConnectorIntel(item))
      .filter(Boolean)
      .forEach(item => TIP_DATA.connectorIntel.unshift(item));
  },

  mergeAutoFetchedTweetfeed() {
    if (typeof TIP_AUTOFEED_TWEETFEED === 'undefined' || !Array.isArray(TIP_AUTOFEED_TWEETFEED) || !TIP_AUTOFEED_TWEETFEED.length) return;
    const knownIds = new Set(TIP_DATA.tweetfeedItems.map(t => t.id));
    TIP_AUTOFEED_TWEETFEED
      .filter(item => item && !knownIds.has(item.id))
      .map(item => this._sanitizeAutoFetchedTweetfeedItem(item))
      .filter(Boolean)
      .forEach(item => TIP_DATA.tweetfeedItems.unshift(item));
  },

  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        feedItems: TIP_DATA.feedItems,
        adversaries: TIP_DATA.adversaries,
        hypotheses: TIP_DATA.hypotheses,
        darkwebItems: TIP_DATA.darkwebItems,
        connectorIntel: TIP_DATA.connectorIntel,
        snowbitAdvisories: TIP_DATA.snowbitAdvisories,
        twitterAccounts: TIP_DATA.twitterAccounts,
        tweetfeedItems: TIP_DATA.tweetfeedItems,
        meta: TIP_DATA.meta
      }));
      return true;
    } catch (e) {
      console.warn('Failed to save data to localStorage', e);
      // Surface this instead of letting callers toast a false "success" —
      // e.g. Safari private browsing or a full localStorage quota otherwise
      // fails silently and the mutation vanishes on next reload.
      if (typeof App !== 'undefined') {
        App.toast('Could not save changes — your browser storage may be full or restricted', 'error');
      }
      return false;
    }
  },

  // Feed items — auto-fetched and manually-added items publish directly (no
  // approval gate); admin can only add or delete.
  getPublishedItems() {
    return TIP_DATA.feedItems.filter(i => i.status === 'published');
  },

  addManualItem(item) {
    item.id = 'manual-' + Date.now();
    item.status = 'published';
    item.date = item.date || new Date().toISOString().split('T')[0];
    TIP_DATA.feedItems.unshift(item);
    TIP_DATA.meta.totalPublished = TIP_DATA.feedItems.length;
    this.save();
    return item;
  },

  deleteFeedItem(id) {
    TIP_DATA.feedItems = TIP_DATA.feedItems.filter(i => i.id !== id);
    TIP_DATA.meta.totalPublished = TIP_DATA.feedItems.length;
    this.save();
    return true;
  },

  // Adversaries
  getAdversaries() {
    return TIP_DATA.adversaries;
  },

  addAdversary(adv) {
    adv.id = 'adv-' + Date.now();
    TIP_DATA.adversaries.push(adv);
    this.save();
    return adv;
  },

  updateAdversary(id, updates) {
    const idx = TIP_DATA.adversaries.findIndex(a => a.id === id);
    if (idx === -1) return false;
    Object.assign(TIP_DATA.adversaries[idx], updates);
    this.save();
    return true;
  },

  deleteAdversary(id) {
    TIP_DATA.adversaries = TIP_DATA.adversaries.filter(a => a.id !== id);
    this.save();
    return true;
  },

  // Hypotheses
  getHypotheses() {
    return TIP_DATA.hypotheses;
  },

  addHypothesis(hypo) {
    hypo.id = 'hypo-' + Date.now();
    hypo.createdAt = new Date().toISOString().split('T')[0];
    hypo.queries = hypo.queries || [];
    TIP_DATA.hypotheses.push(hypo);
    this.save();
    return hypo;
  },

  updateHypothesis(id, updates) {
    const idx = TIP_DATA.hypotheses.findIndex(h => h.id === id);
    if (idx === -1) return false;
    Object.assign(TIP_DATA.hypotheses[idx], updates);
    this.save();
    return true;
  },

  deleteHypothesis(id) {
    TIP_DATA.hypotheses = TIP_DATA.hypotheses.filter(h => h.id !== id);
    this.save();
    return true;
  },

  // Dark web
  getDarkwebItems() {
    return TIP_DATA.darkwebItems;
  },

  addDarkwebItem(item) {
    item.id = 'dw-' + Date.now();
    TIP_DATA.darkwebItems.unshift(item);
    this.save();
    return item;
  },

  // Connector intel (MISP, OTX, Pulsedive, YETI, Cortex)
  deleteConnectorIntel(id) {
    TIP_DATA.connectorIntel = TIP_DATA.connectorIntel.filter(c => c.id !== id);
    this.save();
    return true;
  },

  // Snowbit advisories
  getSnowbitAdvisories() {
    return TIP_DATA.snowbitAdvisories;
  },

  // Tweetfeed
  deleteTweetfeedItem(id) {
    TIP_DATA.tweetfeedItems = TIP_DATA.tweetfeedItems.filter(t => t.id !== id);
    this.save();
    return true;
  },

  // Tracked Twitter/X accounts — the live copy here is browser-local (like
  // every other admin mutation in this app); js/tweetfeed-accounts.js is the
  // copy the scheduled fetch actually reads, since this is a static site
  // with no backend to receive a write from the browser. TweetfeedView's
  // "Manage Accounts" modal walks the admin through committing changes there.
  getTwitterAccounts() {
    return TIP_DATA.twitterAccounts;
  },

  addTwitterAccount(username) {
    const clean = typeof username === 'string' ? username.trim().replace(/^@/, '') : '';
    if (!/^\w{1,15}$/.test(clean)) return false;
    if (TIP_DATA.twitterAccounts.some(a => a.toLowerCase() === clean.toLowerCase())) return false;
    TIP_DATA.twitterAccounts.push(clean);
    this.save();
    return true;
  },

  removeTwitterAccount(username) {
    const before = TIP_DATA.twitterAccounts.length;
    TIP_DATA.twitterAccounts = TIP_DATA.twitterAccounts.filter(a => a.toLowerCase() !== String(username).toLowerCase());
    if (TIP_DATA.twitterAccounts.length === before) return false;
    this.save();
    return true;
  },

  // Category counts
  getCategoryCounts() {
    const counts = {};
    this.getPublishedItems().forEach(i => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  },

  // Meta
  getMeta() {
    return TIP_DATA.meta;
  }
};
