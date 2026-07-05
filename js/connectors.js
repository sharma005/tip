/* ═══════════════════════════════════════════════════════════════════
   TIP — Connectors View
   Open-source threat-intel platform connectors (MISP, OTX, Pulsedive,
   YETI, Cortex) — each links to real, AI-curated "emerging threats"
   content sourced the same way as the rest of the auto-fetch pipeline.
   ═══════════════════════════════════════════════════════════════════ */

const CONNECTORS = [
  {
    key: 'misp',
    name: 'MISP',
    fullName: 'Malware Information Sharing Platform',
    description: 'Open source threat intelligence and information-sharing platform used by CERTs, SOCs, and security researchers to collect, store, and distribute structured threat indicators.',
    url: 'https://www.misp-project.org/',
    context: "MISP-shared events like this one propagate through federated communities in near real time — if your organization syncs with any MISP instance or feed subscribing to this event's originating community, this indicator set may already be reachable from your own platform."
  },
  {
    key: 'otx',
    name: 'OTX',
    fullName: 'AlienVault Open Threat Exchange',
    description: 'Crowd-sourced threat intelligence exchange (now under LevelBlue / AT&T Cybersecurity) where analysts share IOCs and "pulses" covering emerging campaigns in real time.',
    url: 'https://otx.alienvault.com/',
    context: 'OTX pulses are crowd-sourced and unmoderated by design — corroborate before acting operationally, but the scale of the OTX contributor base (180,000+ analysts across 140 countries) means convergent reporting on the same infrastructure is a meaningful signal.'
  },
  {
    key: 'pulsedive',
    name: 'Pulsedive',
    fullName: 'Pulsedive Threat Intelligence',
    description: 'Free community threat intelligence platform for searching, scanning, and enriching IPs, URLs, and domains sourced from OSINT feeds and user submissions.',
    url: 'https://pulsedive.com/',
    context: "Pulsedive's automated scanning and OSINT aggregation means this item reflects both passive feed ingestion and active scan data — cross-check the risk score trend on the platform itself before final triage."
  },
  {
    key: 'yeti',
    name: 'YETI',
    fullName: 'Your Everyday Threat Intelligence',
    description: 'Open source platform for organizing indicators, TTPs, and forensic artifacts — bridges CTI and DFIR teams with a shared observable repository.',
    url: 'https://yeti-platform.io/',
    context: 'YETI is built for pivoting across observables and forensic artifacts — if you run a YETI instance, importing this indicator set lets you immediately check for historical overlap in your own case data.'
  },
  {
    key: 'cortex',
    name: 'Cortex',
    fullName: 'TheHive Cortex Analysis Engine',
    description: 'Observable analysis and active-response engine from TheHive Project / StrangeBee — runs analyzers against IOCs at scale via a REST API.',
    url: 'https://github.com/TheHive-Project/Cortex',
    context: 'Cortex analyzers are typically run in bulk as part of an automated triage pipeline — this classification likely already flowed into a connected incident response platform (e.g. TheHive) if your environment has that integration wired up.'
  }
];

const ConnectorsView = {
  detailKey: null,
  itemId: null,

  render(subRoute) {
    if (subRoute && subRoute[0] === 'detail' && subRoute[1]) {
      this.detailKey = subRoute[1];
      if (subRoute[2] === 'item' && subRoute[3]) {
        this.itemId = subRoute[3];
        this.renderItemDetail();
      } else {
        this.itemId = null;
        this.renderDetail();
      }
    } else {
      this.detailKey = null;
      this.itemId = null;
      this.renderList();
    }
  },

  showListUI(show) {
    const el = document.getElementById('connectorsHeader');
    if (el) el.style.display = show ? '' : 'none';
  },

  renderList() {
    this.showListUI(true);
    const container = document.getElementById('connectorsContent');
    if (!container) return;

    container.innerHTML = `<section class="adversary-grid">${CONNECTORS.map(c => this.renderCard(c)).join('')}</section>`;
  },

  renderCard(connector) {
    const count = TIP_DATA.connectorIntel.filter(c => c.connector === connector.key).length;
    return `<article class="feed-card" onclick="window.location.hash='connectors/detail/${connector.key}'" style="cursor:pointer">
      <div class="card-top">
        <span class="date-tag" style="margin-left:auto">${count} update${count === 1 ? '' : 's'}</span>
      </div>
      <h3>${App.escapeHtml(connector.name)} <span style="font-weight:400;font-size:13px;color:var(--text-muted)">— ${App.escapeHtml(connector.fullName)}</span></h3>
      <p class="card-summary">${App.escapeHtml(connector.description)}</p>
      <div class="card-footer">
        <span class="source-link"><a href="${App.escapeHtml(App.safeUrl(connector.url))}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${App.escapeHtml(connector.name)} official site →</a></span>
      </div>
    </article>`;
  },

  /* ═══════════════════════════════════════════════════════════════════
     DETAIL VIEW — one connector's emerging-threats feed
     ═══════════════════════════════════════════════════════════════════ */
  renderDetail() {
    this.showListUI(false);
    const container = document.getElementById('connectorsContent');
    if (!container) return;

    const connector = CONNECTORS.find(c => c.key === this.detailKey);
    if (!connector) {
      container.innerHTML = `<div class="empty-state">Connector not found.</div>`;
      return;
    }

    const items = TIP_DATA.connectorIntel
      .filter(c => c.connector === connector.key)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = `
      <div class="back-btn" onclick="window.location.hash='connectors'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Connectors
      </div>

      <div class="article-container" style="margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <div style="flex:1;min-width:200px">
            <h1 class="article-title" style="margin-bottom:2px">${App.escapeHtml(connector.name)}</h1>
            <div style="color:var(--text-muted);font-size:13px">${App.escapeHtml(connector.fullName)}</div>
          </div>
          <a href="${App.escapeHtml(App.safeUrl(connector.url))}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Visit ${App.escapeHtml(connector.name)} →</a>
        </div>
        <p class="article-p" style="margin-top:16px;margin-bottom:0">${App.escapeHtml(connector.description)}</p>
      </div>

      <div class="section-divider">Emerging Threats</div>
      ${items.length ? `<section class="feed-list">${items.map(item => this.renderIntelCard(item)).join('')}</section>` : `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          No ${App.escapeHtml(connector.name)} intel yet. Claude will research new activity on the next fetch cycle.
        </div>`}
    `;
  },

  renderIntelCard(item) {
    return `<article class="feed-card" onclick="window.location.hash='connectors/detail/${item.connector}/item/${item.id}'" style="cursor:pointer">
      <div class="card-top">
        <span class="sev-badge sev-${item.severity.toLowerCase()}">${item.severity}</span>
        ${App.isFreshFetch(item, TIP_DATA.connectorIntel) ? '<span class="new-badge">New</span>' : ''}
        <span class="date-tag">${App.formatDate(item.date)}</span>
      </div>
      <h3>${App.escapeHtml(item.title)}</h3>
      <p class="card-summary">${App.escapeHtml(item.summary)}</p>
      <div class="card-footer">
        ${item.tags.map(t => `<span class="hash-tag">#${App.escapeHtml(t)}</span>`).join('')}
        ${item.iocs.map(ioc => `<span class="cve-tag">${App.escapeHtml(ioc.type)}: ${App.escapeHtml(ioc.value)}</span>`).join('')}
      </div>
      <div class="pending-actions admin-only" style="margin-top:10px" onclick="event.stopPropagation()">
        <button class="btn btn-danger btn-sm" onclick="ConnectorsView.deleteIntel('${item.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>
          Delete
        </button>
      </div>
    </article>`;
  },

  /* ═══════════════════════════════════════════════════════════════════
     ITEM DETAIL VIEW — full article for one emerging-threat item,
     generated from the compact record the same way FeedView/DarkWebView
     expand their own detail views from a lean data shape.
     ═══════════════════════════════════════════════════════════════════ */
  generateIntelDetailContent(item, connector) {
    const specificTag = item.tags.find(t => t.toLowerCase() !== connector.key);
    const tldr = `${item.summary} Tracked via the ${connector.name} community; treat as ${item.severity.toLowerCase()}-priority${specificTag ? ` for teams monitoring ${specificTag} activity` : ''}.`;

    const context = [
      `This item was surfaced via the ${connector.fullName} (${connector.name}) community and reflects activity reported in the last several days.`,
      connector.context
    ];

    const actions = [
      'Cross-reference the indicators below against your own telemetry (SIEM, EDR, proxy/DNS logs) for the past 14 days.',
      item.iocs.length
        ? `Add the ${item.iocs.length} indicator${item.iocs.length === 1 ? '' : 's'} listed below to your blocklist/watchlist pending internal validation.`
        : `No specific indicators were published with this item — monitor ${connector.name} directly for IOC updates as the story develops.`,
      `Check ${connector.name} directly for the full event this summary was derived from, including additional context or related items from other contributors.`
    ];
    if (item.severity === 'Critical' || item.severity === 'High') {
      actions.push(`Given the ${item.severity.toLowerCase()} severity, consider notifying your IR team even before full validation completes.`);
    }

    return { tldr, context, actions };
  },

  renderItemDetail() {
    this.showListUI(false);
    const container = document.getElementById('connectorsContent');
    if (!container) return;

    const item = TIP_DATA.connectorIntel.find(c => c.id === this.itemId);
    const connector = item ? CONNECTORS.find(c => c.key === item.connector) : null;
    if (!item || !connector) {
      container.innerHTML = `<div class="empty-state">Intel item not found.</div>`;
      return;
    }

    const detail = this.generateIntelDetailContent(item, connector);

    container.innerHTML = `
      <div class="detail-article fade-in">
        <div class="back-btn" onclick="window.location.hash='connectors/detail/${connector.key}'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to ${App.escapeHtml(connector.name)}
        </div>

        <article class="article-container">
          <header class="article-header">
            <div class="article-badges">
              <span class="badge" style="font-size:11px;padding:4px 12px;color:var(--accent);background:var(--accent-bg);border:1px solid var(--accent-border)">${App.escapeHtml(connector.name.toUpperCase())}</span>
              <span class="sev-badge sev-${item.severity.toLowerCase()}" style="font-size:11px;padding:4px 10px">${item.severity}</span>
            </div>

            <h1 class="article-title">${App.escapeHtml(item.title)}</h1>

            <div class="article-meta">
              <span class="meta-item"><span class="meta-label">Reported:</span> ${App.formatDate(item.date)}</span>
              <span class="meta-item"><span class="meta-label">Community:</span> <span style="color:var(--accent)">${App.escapeHtml(connector.fullName)}</span></span>
            </div>

            <div class="article-tags">
              ${item.tags.map(t => `<span class="hash-tag">#${App.escapeHtml(t)}</span>`).join('')}
            </div>
          </header>

          <div class="article-section">
            <blockquote class="article-tldr"><strong>TL;DR.</strong> ${App.escapeHtml(detail.tldr)}</blockquote>
          </div>

          <hr class="article-divider">

          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">1.</span> Context</h2>
            ${detail.context.map(p => `<p class="article-p">${App.escapeHtml(p)}</p>`).join('')}
          </div>

          <hr class="article-divider">

          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">2.</span> Indicators</h2>
            ${item.iocs.length ? `
            <div class="ioc-table">
              <div class="ioc-header">
                <span>Type</span>
                <span>Value</span>
                <span>Context</span>
              </div>
              ${item.iocs.map(ioc => `
                <div class="ioc-row">
                  <span class="ioc-type">${App.escapeHtml(ioc.type)}</span>
                  <span class="ioc-value">${App.escapeHtml(ioc.value)}</span>
                  <span class="ioc-context">Reported via ${App.escapeHtml(connector.name)}</span>
                </div>
              `).join('')}
            </div>` : '<p class="article-p" style="color:var(--text-muted)">No specific indicators were published with this item.</p>'}
          </div>

          <hr class="article-divider">

          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">3.</span> Recommended Actions</h2>
            <div class="action-list">
              ${detail.actions.map((a, i) => `
                <div class="action-item">
                  <div class="action-num">${i + 1}</div>
                  <div class="action-text">${App.escapeHtml(a)}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">⚡</span> Admin Actions</h2>
            <button class="btn btn-danger admin-only" onclick="ConnectorsView.deleteIntel('${item.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>
              Delete Item
            </button>
          </div>

          <div class="article-section" style="margin-top:28px">
            <div class="article-source-box">
              <div style="font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px">Source Community</div>
              <a href="${App.escapeHtml(App.safeUrl(connector.url))}" target="_blank" rel="noopener" class="article-source-link">
                <span>${App.escapeHtml(connector.fullName)}</span>
                <span style="color:var(--accent)">Visit ${App.escapeHtml(connector.name)} →</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    `;
  },

  deleteIntel(id) {
    if (!confirm('Delete this intel item?')) return;
    if (DataManager.deleteConnectorIntel(id)) {
      App.toast('Intel item deleted', 'warning');
      if (this.itemId === id) {
        const connector = CONNECTORS.find(c => c.key === this.detailKey);
        window.location.hash = connector ? `connectors/detail/${connector.key}` : 'connectors';
      } else {
        this.renderDetail();
      }
    }
  }
};
