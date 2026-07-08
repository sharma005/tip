/* ═══════════════════════════════════════════════════════════════════
   TIP — Hunt Lab View
   Hypothesis repository, DataPrime query generator, query library
   ═══════════════════════════════════════════════════════════════════ */

const HuntLabView = {
  activeTab: 'hypotheses',
  searchQuery: '',
  filterStatus: 'all',

  render(subRoute) {
    if (subRoute && subRoute[0] === 'detail' && subRoute[1]) {
      this.renderHypothesisDetail(subRoute[1]);
    } else {
      this.renderMain();
    }
  },

  renderMain() {
    const content = document.getElementById('huntlabContent');
    if (!content) return;

    // Tabs
    const tabsHtml = `<div class="tabs">
      <div class="tab ${this.activeTab === 'hypotheses' ? 'active' : ''}" onclick="HuntLabView.switchTab('hypotheses')">Hypothesis Repository</div>
      <div class="tab ${this.activeTab === 'queries' ? 'active' : ''}" onclick="HuntLabView.switchTab('queries')">DataPrime Queries</div>
      <div class="tab ${this.activeTab === 'templates' ? 'active' : ''}" onclick="HuntLabView.switchTab('templates')">Query Templates</div>
    </div>`;

    let bodyHtml = '';
    switch (this.activeTab) {
      case 'hypotheses':
        bodyHtml = this.renderHypothesesTab();
        break;
      case 'queries':
        bodyHtml = this.renderQueriesTab();
        break;
      case 'templates':
        bodyHtml = this.renderTemplatesTab();
        break;
    }

    content.innerHTML = tabsHtml + bodyHtml;

    if (this.activeTab === 'hypotheses') this.bindHypothesesSearch();
  },

  bindHypothesesSearch() {
    const input = document.getElementById('hypoSearchInput');
    if (!input) return;
    input.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      const resultsContainer = document.getElementById('hypoResultsContainer');
      if (resultsContainer) resultsContainer.innerHTML = this.renderHypothesisResults();
    });
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.renderMain();
  },

  /* ── Hypotheses Tab ── */
  renderHypothesesTab() {
    const stats = this.getHypoStats();

    return `
      <div class="dw-stats" style="margin-bottom:16px">
        <div class="dw-stat ${this.filterStatus === 'all' ? 'active-filter' : ''}" onclick="HuntLabView.filterStatus='all';HuntLabView.renderMain()">
          <div class="dw-stat-value" style="color:var(--heading)">${stats.total}</div>
          <div class="dw-stat-label">Total</div>
        </div>
        <div class="dw-stat ${this.filterStatus === 'active' ? 'active-filter' : ''}" onclick="HuntLabView.filterStatus='active';HuntLabView.renderMain()">
          <div class="dw-stat-value" style="color:var(--accent)">${stats.active}</div>
          <div class="dw-stat-label">Active</div>
        </div>
        <div class="dw-stat ${this.filterStatus === 'validated' ? 'active-filter' : ''}" onclick="HuntLabView.filterStatus='validated';HuntLabView.renderMain()">
          <div class="dw-stat-value" style="color:var(--success)">${stats.validated}</div>
          <div class="dw-stat-label">Validated</div>
        </div>
        <div class="dw-stat ${this.filterStatus === 'draft' ? 'active-filter' : ''}" onclick="HuntLabView.filterStatus='draft';HuntLabView.renderMain()">
          <div class="dw-stat-value" style="color:var(--text-muted)">${stats.draft}</div>
          <div class="dw-stat-label">Draft</div>
        </div>
      </div>
      <div class="controls-bar">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input type="search" id="hypoSearchInput" placeholder="Search hypotheses…" value="${App.escapeHtml(this.searchQuery)}">
        </div>
        <select class="control-select" onchange="HuntLabView.filterStatus=this.value;HuntLabView.renderMain()">
          <option value="all" ${this.filterStatus === 'all' ? 'selected' : ''}>All Status</option>
          <option value="draft" ${this.filterStatus === 'draft' ? 'selected' : ''}>Draft</option>
          <option value="active" ${this.filterStatus === 'active' ? 'selected' : ''}>Active</option>
          <option value="validated" ${this.filterStatus === 'validated' ? 'selected' : ''}>Validated</option>
          <option value="archived" ${this.filterStatus === 'archived' ? 'selected' : ''}>Archived</option>
        </select>
      </div>
      <div id="hypoResultsContainer">${this.renderHypothesisResults()}</div>
    `;
  },

  renderHypothesisResults() {
    let hypotheses = DataManager.getHypotheses();

    if (this.filterStatus !== 'all') {
      hypotheses = hypotheses.filter(h => h.status === this.filterStatus);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      hypotheses = hypotheses.filter(h =>
        (h.title + ' ' + h.description + ' ' + h.mitreTactic + ' ' + h.mitreTechnique).toLowerCase().includes(q)
      );
    }

    return `
      <div class="results-count">${hypotheses.length} hypotheses</div>
      <div class="hypothesis-list">
        ${hypotheses.length ? hypotheses.map(h => this.renderHypothesisCard(h)).join('') : `
          <div class="empty-state">
            <div class="empty-icon">🔬</div>
            No hypotheses match your filter.
          </div>
        `}
      </div>
    `;
  },

  renderHypothesisCard(hypo) {
    const adv = hypo.linkedAdversary ? TIP_DATA.adversaries.find(a => a.id === hypo.linkedAdversary) : null;

    return `<div class="hypothesis-card" onclick="window.location.hash='huntlab/detail/${hypo.id}'" style="cursor:pointer">
      <div class="card-top">
        <span class="hypo-status ${hypo.status}">${hypo.status}</span>
        <span class="priority-badge priority-${hypo.priority.toLowerCase()}">${hypo.priority}</span>
        <span class="hash-tag">${App.escapeHtml(hypo.mitreTactic)}</span>
        ${App.isFreshFetch(hypo, TIP_DATA.hypotheses) ? '<span class="new-badge">New</span>' : ''}
        <span class="date-tag">${App.formatDate(hypo.createdAt)}</span>
      </div>
      <h3 style="margin:6px 0 8px;font-size:15px;color:var(--heading);font-weight:650">${App.escapeHtml(hypo.title)}</h3>
      <p class="card-summary">${App.escapeHtml(hypo.description).substring(0, 180)}${hypo.description.length > 180 ? '…' : ''}</p>
      <div class="card-footer" style="margin-top:8px">
        <span class="cve-tag">${App.escapeHtml(hypo.mitreTechnique)}</span>
        ${adv ? `<span class="actor-tag">▲ ${App.escapeHtml(adv.name)}</span>` : ''}
        ${hypo.queries.length ? `<span class="hash-tag" style="color:var(--success)">${hypo.queries.length} queries</span>` : ''}
        <span style="margin-left:auto;font-family:var(--font-mono);font-size:11px;color:var(--text-muted)">${hypo.dataSources.length} data sources</span>
      </div>
    </div>`;
  },

  renderHypothesisDetail(id) {
    const content = document.getElementById('huntlabContent');
    if (!content) return;

    const hypo = TIP_DATA.hypotheses.find(h => h.id === id);
    if (!hypo) {
      content.innerHTML = `<div class="empty-state">Hypothesis not found.</div>`;
      return;
    }

    const adv = hypo.linkedAdversary ? TIP_DATA.adversaries.find(a => a.id === hypo.linkedAdversary) : null;
    const feedItem = hypo.linkedFeedItem ? TIP_DATA.feedItems.find(f => f.id === hypo.linkedFeedItem) : null;

    content.innerHTML = `
      <div class="back-btn" onclick="window.location.hash='huntlab'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Repository
      </div>

      <div class="detail-panel">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap">
          <span class="hypo-status ${hypo.status}" style="font-size:12px;padding:4px 12px">${hypo.status}</span>
          <span class="priority-badge priority-${hypo.priority.toLowerCase()}" style="font-size:12px;padding:4px 10px">${hypo.priority}</span>
          <select class="control-select" style="margin-left:auto;font-size:12px;padding:5px 8px" onchange="HuntLabView.updateStatus('${hypo.id}', this.value)">
            <option value="draft" ${hypo.status === 'draft' ? 'selected' : ''}>Draft</option>
            <option value="active" ${hypo.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="validated" ${hypo.status === 'validated' ? 'selected' : ''}>Validated</option>
            <option value="archived" ${hypo.status === 'archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>

        <h2 style="margin-bottom:12px">${App.escapeHtml(hypo.title)}</h2>
        <p style="color:var(--text-secondary);font-size:14px;line-height:1.6;margin-bottom:20px">${App.escapeHtml(hypo.description)}</p>

        <div class="detail-row">
          <span class="detail-label">MITRE Tactic</span>
          <span class="detail-value">${App.escapeHtml(hypo.mitreTactic)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Technique</span>
          <span class="detail-value"><span class="cve-tag">${App.escapeHtml(hypo.mitreTechnique)}</span></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Data Sources</span>
          <span class="detail-value">${hypo.dataSources.map(d => `<span class="hash-tag" style="margin:2px 4px 2px 0">${App.escapeHtml(d)}</span>`).join('')}</span>
        </div>
        ${adv ? `<div class="detail-row">
          <span class="detail-label">Linked Actor</span>
          <span class="detail-value"><a href="#adversaries/detail/${adv.id}" class="actor-tag">▲ ${App.escapeHtml(adv.name)}</a></span>
        </div>` : ''}
        ${feedItem ? `<div class="detail-row">
          <span class="detail-label">Linked Advisory</span>
          <span class="detail-value"><a href="${App.escapeHtml(App.safeUrl(feedItem.url))}" target="_blank" style="color:var(--accent)">${App.escapeHtml(feedItem.title)}</a></span>
        </div>` : ''}
        <div class="detail-row">
          <span class="detail-label">Created</span>
          <span class="detail-value">${App.formatDate(hypo.createdAt)}</span>
        </div>
      </div>

      <div class="section-divider">Detection Queries</div>

      ${hypo.queries.length ? hypo.queries.map((q, idx) => q.kql ? `
        <div class="detection-tabs" style="margin-bottom:14px">
          <div class="det-tab-bar">
            <button class="det-tab active" onclick="FeedView.switchDetTab(this,'dataprime')">DataPrime</button>
            <button class="det-tab" onclick="FeedView.switchDetTab(this,'kql')">KQL</button>
          </div>
          <div class="det-tab-panel active" data-panel="dataprime">
            <div class="query-block">
              <div class="query-header">
                <span>${App.escapeHtml(q.name)} · DataPrime</span>
                <button class="copy-btn" onclick="HuntLabView.copyQuery(this, ${idx}, '${hypo.id}', 'query')">Copy</button>
              </div>
              <div class="query-body">${this.highlightQuery(q.query)}</div>
            </div>
          </div>
          <div class="det-tab-panel" data-panel="kql">
            <div class="query-block">
              <div class="query-header">
                <span>${App.escapeHtml(q.name)} · KQL${q.source ? ` — <a href="${App.escapeHtml(App.safeUrl(q.source))}" target="_blank" rel="noopener" style="font-weight:400;color:var(--text-muted)">source →</a>` : ''}</span>
                <button class="copy-btn" onclick="HuntLabView.copyQuery(this, ${idx}, '${hypo.id}', 'kql')">Copy</button>
              </div>
              <div class="query-body">${FeedView.highlightKQL(q.kql)}</div>
            </div>
          </div>
        </div>
      ` : `
        <div class="query-block" style="margin-bottom:14px">
          <div class="query-header">
            <span>${App.escapeHtml(q.name)}</span>
            <button class="copy-btn" onclick="HuntLabView.copyQuery(this, ${idx}, '${hypo.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy
            </button>
          </div>
          <div class="query-body">${this.highlightQuery(q.query)}</div>
        </div>
      `).join('') : `<p style="color:var(--text-muted);font-family:var(--font-mono);font-size:13px;padding:20px 0">No queries created yet. Use the button below to generate one.</p>`}

      <div style="display:flex;gap:10px;margin-top:16px" class="admin-only">
        <button class="btn btn-primary" onclick="HuntLabView.openQueryBuilder('${hypo.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 5v14M5 12h14"/></svg>
          Create DataPrime Query
        </button>
        <button class="btn btn-danger btn-sm" onclick="HuntLabView.deleteHypothesis('${hypo.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete
        </button>
      </div>
    `;
  },

  /* ── Queries Tab ── */
  renderQueriesTab() {
    const allQueries = [];
    TIP_DATA.hypotheses.forEach(h => {
      h.queries.forEach((q, idx) => {
        allQueries.push({ ...q, hypothesisTitle: h.title, hypothesisId: h.id, queryIdx: idx });
      });
    });

    return `
      <div class="results-count">${allQueries.length} saved queries across ${TIP_DATA.hypotheses.length} hypotheses</div>
      ${allQueries.length ? allQueries.map(q => `
        <div class="query-block" style="margin-bottom:14px">
          <div class="query-header">
            <span>${App.escapeHtml(q.name)}</span>
            <div style="display:flex;align-items:center;gap:8px">
              <a href="#huntlab/detail/${q.hypothesisId}" style="font-size:11px;color:var(--accent);font-family:var(--font-mono)">→ ${App.escapeHtml(q.hypothesisTitle).substring(0, 40)}…</a>
              <button class="copy-btn" onclick="HuntLabView.copyQuery(this, ${q.queryIdx}, '${q.hypothesisId}', 'query')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </button>
            </div>
          </div>
          <div class="query-body">${this.highlightQuery(q.query)}</div>
        </div>
      `).join('') : `<div class="empty-state">
        <div class="empty-icon">📝</div>
        No queries yet. Create hypotheses and add queries to them.
      </div>`}
    `;
  },

  /* ── Templates Tab ── */
  renderTemplatesTab() {
    const categories = { network: '🌐 Network', endpoint: '💻 Endpoint', identity: '🔑 Identity', cloud: '☁️ Cloud' };

    return `
      <p style="color:var(--text-secondary);font-size:13.5px;margin-bottom:16px">Pre-built DataPrime query templates. Click "Use Template" to customize and add to a hypothesis.</p>
      ${TIP_DATA.queryTemplates.map(qt => `
        <div class="query-block" style="margin-bottom:14px">
          <div class="query-header">
            <span>${categories[qt.category] || qt.category} · ${App.escapeHtml(qt.name)}</span>
            <button class="btn btn-primary btn-xs" onclick="HuntLabView.useTemplate('${qt.id}')">Use Template</button>
          </div>
          <div class="query-body">${this.highlightQuery(qt.template)}</div>
        </div>
      `).join('')}
    `;
  },

  /* ── Syntax Highlighting (Single-pass — prevents tag corruption) ── */
  highlightQuery(query) {
    const escaped = query
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped.replace(
      /(\$d\.\w+)|(\$\{[A-Z_]+\})|("(?:[^"\\]|\\.)*")|(\/\/.*)|(--.*)|(\b(?:source|filter|groupby|count|sort|limit|extract|redact|select|block|create|enrich|choose|lucene|text|top|bottom)\b)|(\b(?:in|not|contains|matches|as|and|or)\b|==|!=|&gt;=|&lt;=|&gt;|&lt;|&&|\|\|)|(\b\d+\.?\d*\b)/g,
      function(match, field, variable, str, comment1, comment2, keyword, op, num) {
        if (field)    return '<span class="q-function">' + match + '</span>';
        if (variable) return '<span class="q-string">' + match + '</span>';
        if (str)      return '<span class="q-string">' + match + '</span>';
        if (comment1 || comment2) return '<span class="q-comment">' + match + '</span>';
        if (keyword)  return '<span class="q-keyword">' + match + '</span>';
        if (op)       return '<span class="q-operator">' + match + '</span>';
        if (num)      return '<span class="q-number">' + match + '</span>';
        return match;
      }
    );
  },

  /* ── Actions ── */
  openCreateHypothesis() {
    document.getElementById('hypoTitle').value = '';
    document.getElementById('hypoDescription').value = '';
    document.getElementById('hypoMitreTactic').value = 'Initial Access';
    document.getElementById('hypoMitreTechnique').value = '';
    document.getElementById('hypoDataSources').value = '';
    document.getElementById('hypoPriority').value = 'P2';
    document.getElementById('hypoLinkedAdversary').value = '';
    document.getElementById('createHypothesisModal').dataset.editId = '';

    // Populate adversary dropdown
    const advSelect = document.getElementById('hypoLinkedAdversary');
    advSelect.innerHTML = '<option value="">None</option>' +
      TIP_DATA.adversaries.map(a => `<option value="${App.escapeHtml(a.id)}">${App.escapeHtml(a.name)}</option>`).join('');

    App.openModal('createHypothesisModal');
  },

  saveHypothesis() {
    const title = document.getElementById('hypoTitle').value.trim();
    const description = document.getElementById('hypoDescription').value.trim();
    if (!title || !description) {
      App.toast('Title and description are required', 'error');
      return;
    }

    const editId = document.getElementById('createHypothesisModal').dataset.editId;

    const hypo = {
      title,
      description,
      mitreTactic: document.getElementById('hypoMitreTactic').value,
      mitreTechnique: document.getElementById('hypoMitreTechnique').value || 'T0000',
      dataSources: document.getElementById('hypoDataSources').value.split(',').map(s => s.trim()).filter(Boolean),
      priority: document.getElementById('hypoPriority').value,
      status: 'draft',
      linkedAdversary: document.getElementById('hypoLinkedAdversary').value || null,
      linkedFeedItem: null
    };

    if (editId) {
      DataManager.updateHypothesis(editId, hypo);
      App.toast('Hypothesis updated', 'success');
    } else {
      DataManager.addHypothesis(hypo);
      App.toast('Hypothesis created', 'success');
    }

    App.closeModal('createHypothesisModal');
    this.renderMain();
  },

  updateStatus(id, status) {
    DataManager.updateHypothesis(id, { status });
    App.toast(`Status updated to ${status}`, 'success');
  },

  deleteHypothesis(id) {
    if (confirm('Delete this hypothesis and all its queries?')) {
      DataManager.deleteHypothesis(id);
      App.toast('Hypothesis deleted', 'warning');
      window.location.hash = 'huntlab';
    }
  },

  openQueryBuilder(hypoId) {
    document.getElementById('queryBuilderHypoId').value = hypoId;
    document.getElementById('queryName').value = '';
    document.getElementById('queryBody').value = '';

    // Populate template selector
    const sel = document.getElementById('queryTemplate');
    sel.innerHTML = '<option value="">Blank query</option>' +
      TIP_DATA.queryTemplates.map(qt => `<option value="${App.escapeHtml(qt.id)}">${App.escapeHtml(qt.name)} (${App.escapeHtml(qt.category)})</option>`).join('');

    App.openModal('queryBuilderModal');
  },

  loadTemplate() {
    const templateId = document.getElementById('queryTemplate').value;
    if (!templateId) {
      document.getElementById('queryBody').value = '';
      return;
    }
    const tmpl = TIP_DATA.queryTemplates.find(t => t.id === templateId);
    if (tmpl) {
      document.getElementById('queryBody').value = tmpl.template;
      document.getElementById('queryName').value = tmpl.name;
    }
  },

  saveQuery() {
    const hypoId = document.getElementById('queryBuilderHypoId').value;
    const name = document.getElementById('queryName').value.trim();
    const query = document.getElementById('queryBody').value.trim();

    if (!name || !query) {
      App.toast('Query name and body are required', 'error');
      return;
    }

    const hypo = TIP_DATA.hypotheses.find(h => h.id === hypoId);
    if (!hypo) return;

    hypo.queries.push({ name, query });
    DataManager.save();
    App.closeModal('queryBuilderModal');
    App.toast('Query saved to hypothesis', 'success');
    this.renderHypothesisDetail(hypoId);
  },

  useTemplate(templateId) {
    const tmpl = TIP_DATA.queryTemplates.find(t => t.id === templateId);
    if (!tmpl) return;

    // Open query builder with template pre-filled, but no hypo linked
    document.getElementById('queryBuilderHypoId').value = '';
    document.getElementById('queryName').value = tmpl.name;
    document.getElementById('queryBody').value = tmpl.template;
    document.getElementById('queryTemplate').value = templateId;

    App.openModal('queryBuilderModal');
  },

  copyQuery(btn, idx, hypoId, field = 'query') {
    const hypo = TIP_DATA.hypotheses.find(h => h.id === hypoId);
    if (!hypo || !hypo.queries[idx]) return;
    const text = hypo.queries[idx][field];
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="M20 6L9 17l-5-5"/></svg> Copied!`;
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
      }, 2000);
    });
  },

  getHypoStats() {
    const all = TIP_DATA.hypotheses;
    return {
      total: all.length,
      active: all.filter(h => h.status === 'active').length,
      validated: all.filter(h => h.status === 'validated').length,
      draft: all.filter(h => h.status === 'draft').length,
      archived: all.filter(h => h.status === 'archived').length
    };
  }
};
