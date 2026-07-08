/* ═══════════════════════════════════════════════════════════════════
   TIP — Snowbit Advisory View
   Curated threat advisories sourced from Snowbit by Coralogix
   ═══════════════════════════════════════════════════════════════════ */

const SnowbitView = {
  detailId: null,

  render(subRoute) {
    if (subRoute && subRoute.length >= 2 && subRoute[0] === 'detail') {
      this.detailId = subRoute[1];
      this.renderDetail();
    } else {
      this.detailId = null;
      this.renderList();
    }
  },

  showListUI(show) {
    const el = document.getElementById('snowbitHeader');
    if (el) el.style.display = show ? '' : 'none';
  },

  renderList() {
    this.showListUI(true);
    const container = document.getElementById('snowbitContent');
    if (!container) return;

    const items = DataManager.getSnowbitAdvisories();
    if (!items.length) {
      container.innerHTML = `<div class="empty-state">No Snowbit advisories yet.</div>`;
      return;
    }
    container.innerHTML = `<section class="feed-list">${items.map(item => this.renderCard(item)).join('')}</section>`;
  },

  renderCard(item) {
    return `<article class="feed-card" onclick="window.location.hash='snowbit/detail/${item.id}'" style="cursor:pointer">
      <div class="card-top">
        <span class="date-tag" style="color:var(--accent);background:var(--accent-bg);border-color:var(--accent-border)">SNOWBIT</span>
        <span class="sev-badge sev-${item.severity.toLowerCase()}">${item.severity}</span>
        <span class="date-tag">${App.formatDate(item.date)}</span>
      </div>
      <h3>${App.escapeHtml(item.title)}</h3>
      <p class="card-summary">${App.escapeHtml(item.summary)}</p>
      <div class="card-footer">
        ${item.actor ? `<span class="actor-tag">▲ ${App.escapeHtml(item.actor)}</span>` : ''}
        ${item.tags.map(t => `<span class="hash-tag">#${App.escapeHtml(t)}</span>`).join('')}
        ${item.pdfUrl
          ? `<span class="source-link"><a href="${App.escapeHtml(App.safeResourceUrl(item.pdfUrl))}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${App.escapeHtml(item.source)} · PDF →</a></span>`
          : `<span class="source-link">${App.escapeHtml(item.source)}</span>`}
      </div>
    </article>`;
  },

  /* ═══════════════════════════════════════════════════════════════════
     DETAIL VIEW
     ═══════════════════════════════════════════════════════════════════ */
  renderDetail() {
    this.showListUI(false);
    const container = document.getElementById('snowbitContent');
    if (!container) return;

    const item = TIP_DATA.snowbitAdvisories.find(a => a.id === this.detailId);
    if (!item) {
      container.innerHTML = `<div class="empty-state">Advisory not found.</div>`;
      return;
    }

    container.innerHTML = `
      <div class="detail-article fade-in">
        <div class="back-btn" onclick="window.location.hash='snowbit'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Snowbit Advisory
        </div>

        <article class="article-container">
          <header class="article-header">
            <div class="article-badges">
              <span class="badge" style="font-size:11px;padding:4px 12px;color:var(--accent);background:var(--accent-bg);border:1px solid var(--accent-border)">SNOWBIT ADVISORY</span>
              <span class="sev-badge sev-${item.severity.toLowerCase()}" style="font-size:11px;padding:4px 10px">${item.severity}</span>
            </div>

            <h1 class="article-title">${App.escapeHtml(item.title)}</h1>

            <div class="article-meta">
              <span class="meta-item"><span class="meta-label">Published:</span> ${App.formatDate(item.date)}</span>
              <span class="meta-item"><span class="meta-label">Source:</span> <span style="color:var(--accent)">${App.escapeHtml(item.source)}</span></span>
              ${item.actor ? `<span class="meta-item"><span class="meta-label">Threat Infrastructure:</span> <span style="color:var(--cat-kev);font-weight:600">${App.escapeHtml(item.actor)}</span></span>` : ''}
              ${item.pdfUrl ? `<span class="meta-item"><a href="${App.escapeHtml(App.safeResourceUrl(item.pdfUrl))}" target="_blank" rel="noopener" style="color:var(--accent);font-weight:600">⬇ Download Full Advisory (PDF)</a></span>` : ''}
            </div>

            <div class="article-tags">
              ${item.tags.map(t => `<span class="hash-tag">#${App.escapeHtml(t)}</span>`).join('')}
            </div>
          </header>

          <hr class="article-divider">

          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">1.</span> Executive Summary</h2>
            ${item.execSummary.map(p => `<p class="article-p">${App.escapeHtml(p)}</p>`).join('')}
          </div>

          <hr class="article-divider">

          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">2.</span> How It Works</h2>
            <div class="attack-topology">
              ${item.howItWorks.map(step => `
                <div class="topology-step">
                  <div class="topology-phase">${App.escapeHtml(step.phase)}</div>
                  <div class="topology-detail">
                    <div class="topology-title">${App.escapeHtml(step.title)}</div>
                    <div class="topology-desc">${App.escapeHtml(step.description)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          ${item.mfaGaps && item.mfaGaps.length ? `
          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">3.</span> MFA Misconfigurations Observed</h2>
            <ul style="padding-left:20px;margin:0">
              ${item.mfaGaps.map(g => `<li class="article-p" style="margin-bottom:8px">${App.escapeHtml(g)}</li>`).join('')}
            </ul>
          </div>` : ''}

          ${item.timeline && item.timeline.length ? `
          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">4.</span> Campaign Timeline</h2>
            ${item.timeline.map(t => `
              <div style="display:flex;gap:16px;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-family:var(--font-mono);font-size:11px;color:var(--accent);min-width:190px;flex:none">${App.escapeHtml(t.date)}</span>
                <span class="article-p" style="margin:0">${App.escapeHtml(t.event)}</span>
              </div>
            `).join('')}
          </div>` : ''}

          ${item.affectedComponents && item.affectedComponents.length ? `
          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">5.</span> Key Affected Components</h2>
            <div class="ioc-table" style="grid-template-columns:170px 1fr 1fr">
              <div class="ioc-header" style="grid-template-columns:170px 1fr 1fr">
                <span>Component</span>
                <span>Vulnerable Configuration</span>
                <span>Protected Configuration</span>
              </div>
              ${item.affectedComponents.map(c => `
                <div class="ioc-row" style="grid-template-columns:170px 1fr 1fr">
                  <span class="ioc-type">${App.escapeHtml(c.component)}</span>
                  <span class="ioc-value">${App.escapeHtml(c.vulnerable)}</span>
                  <span class="ioc-context">${App.escapeHtml(c.protectedConfig)}</span>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

          <hr class="article-divider">

          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">6.</span> Indicators of Compromise</h2>
            ${item.iocs && item.iocs.length ? `
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
                  <span class="ioc-context">${App.escapeHtml(ioc.context)}</span>
                </div>
              `).join('')}
            </div>` : '<p class="article-p" style="color:var(--text-muted)">No specific IOCs published for this advisory.</p>'}
          </div>

          ${item.dataprimeQueries && item.dataprimeQueries.length ? `
          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">7.</span> DataPrime Hunting Queries</h2>
            ${item.dataprimeQueries.map((q, idx) => `
              <p class="article-p" style="margin-bottom:8px"><strong>${App.escapeHtml(q.name)}.</strong> ${App.escapeHtml(q.description)}</p>
              <div class="query-block" style="margin-bottom:16px">
                <div class="query-header">
                  <span>DataPrime · Coralogix</span>
                  <button class="copy-btn" data-advisory-id="${item.id}" data-query-idx="${idx}" onclick="SnowbitView.copyQuery(this)">Copy</button>
                </div>
                <pre class="query-body">${HuntLabView.highlightQuery(q.query)}</pre>
              </div>
            `).join('')}
          </div>` : ''}

          ${item.remediation && item.remediation.length ? `
          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">8.</span> Remediation</h2>
            <div class="action-list">
              ${item.remediation.map((action, i) => `
                <div class="action-item">
                  <div class="action-num">${i + 1}</div>
                  <div class="action-text">${App.escapeHtml(action)}</div>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

          ${item.snowbitResponse && item.snowbitResponse.length ? `
          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">9.</span> Snowbit Response</h2>
            ${item.snowbitResponse.map(p => `<p class="article-p">${App.escapeHtml(p)}</p>`).join('')}
          </div>` : ''}

          ${item.pdfUrl ? `
          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">10.</span> Original Advisory (PDF)
              <a href="${App.escapeHtml(App.safeResourceUrl(item.pdfUrl))}" target="_blank" rel="noopener" style="margin-left:auto;font-size:12px;font-weight:600;color:var(--accent)">Open in new tab ↗</a>
            </h2>
            <div style="border:1px solid var(--border);border-radius:var(--radius-lg,8px);overflow:hidden;background:var(--surface-2)">
              <iframe src="${App.escapeHtml(App.safeResourceUrl(item.pdfUrl))}" title="${App.escapeHtml(item.title)} — PDF" style="width:100%;height:900px;border:0;display:block"></iframe>
            </div>
          </div>` : ''}

          <div class="article-section" style="margin-top:32px">
            <div class="article-source-box">
              <div style="font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px">Source</div>
              ${item.pdfUrl ? `
              <a href="${App.escapeHtml(App.safeResourceUrl(item.pdfUrl))}" target="_blank" rel="noopener" class="article-source-link">
                <span>${App.escapeHtml(item.source)} — Threat Intelligence Advisory</span>
                <span style="color:var(--accent)">Open Full PDF →</span>
              </a>` : `<span style="color:var(--accent);font-weight:600">${App.escapeHtml(item.source)} — Threat Intelligence Advisory</span>`}
            </div>
          </div>
        </article>
      </div>
    `;
  },

  copyQuery(btn) {
    const adv = TIP_DATA.snowbitAdvisories.find(a => a.id === btn.dataset.advisoryId);
    const q = adv && adv.dataprimeQueries[Number(btn.dataset.queryIdx)];
    if (!q) return;
    navigator.clipboard.writeText(q.query).then(() => {
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
  }
};
