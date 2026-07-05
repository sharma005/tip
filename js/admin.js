/* ═══════════════════════════════════════════════════════════════════
   TIP — Admin Panel View
   All feed advisories (add/delete), settings (change password)
   ═══════════════════════════════════════════════════════════════════ */

const AdminView = {
  activeTab: 'queue', // 'queue' or 'settings'

  render() {
    this.switchTab(this.activeTab);
  },

  switchTab(tab) {
    this.activeTab = tab;

    document.querySelectorAll('#adminTabs .tab').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tab);
    });

    const queueSection = document.getElementById('adminQueueSection');
    const settingsSection = document.getElementById('adminSettingsSection');
    if (queueSection) queueSection.style.display = tab === 'queue' ? '' : 'none';
    if (settingsSection) settingsSection.style.display = tab === 'settings' ? '' : 'none';

    if (tab === 'queue') {
      this.showListUI(true);
      this.renderStats();
      this.renderFeedList();
    } else if (tab === 'settings') {
      this.resetPasswordForm();
    }
  },

  /* ═══════════════════════════════════════════════════════════════════
     SETTINGS — change admin password
     ═══════════════════════════════════════════════════════════════════ */
  resetPasswordForm() {
    ['changePwCurrent', 'changePwNew', 'changePwConfirm'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const err = document.getElementById('changePwError');
    const ok = document.getElementById('changePwSuccess');
    if (err) err.style.display = 'none';
    if (ok) ok.style.display = 'none';
  },

  async changePassword() {
    const current = document.getElementById('changePwCurrent').value;
    const next = document.getElementById('changePwNew').value;
    const confirm = document.getElementById('changePwConfirm').value;
    const errEl = document.getElementById('changePwError');
    const okEl = document.getElementById('changePwSuccess');
    okEl.style.display = 'none';

    const showError = (msg) => {
      errEl.textContent = msg;
      errEl.style.display = 'block';
    };

    if (!current || !next || !confirm) {
      showError('Please fill in all fields.');
      return;
    }
    if (next.length < 8) {
      showError('New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      showError('New password and confirmation do not match.');
      return;
    }
    if (current === next) {
      showError('New password must be different from the current password.');
      return;
    }

    const currentHash = await App.hashPassword(current);
    if (currentHash !== App.getAdminHash()) {
      showError('Current password is incorrect.');
      return;
    }

    const newHash = await App.hashPassword(next);
    App.setAdminHash(newHash);

    errEl.style.display = 'none';
    this.resetPasswordForm();
    okEl.textContent = 'Password updated. Use the new password next time you log in.';
    okEl.style.display = 'block';
    App.toast('Admin password updated', 'success');
  },

  showListUI(show) {
    const list = document.getElementById('adminFeedSection');
    const detail = document.getElementById('adminDetailView');
    const header = document.getElementById('adminHeader');
    if (list) list.style.display = show ? '' : 'none';
    if (detail) detail.style.display = show ? 'none' : '';
    if (header) header.style.display = show ? '' : 'none';
  },

  renderStats() {
    const meta = DataManager.getMeta();
    const statsEl = document.getElementById('adminStats');
    if (!statsEl) return;

    statsEl.innerHTML = `
      <div class="stat-card success">
        <div class="stat-label">Total Advisories</div>
        <div class="stat-value">${TIP_DATA.feedItems.length}</div>
      </div>
      <div class="stat-card info">
        <div class="stat-label">Last Fetch</div>
        <div class="stat-value" style="font-size:16px">${App.timeAgo(meta.lastFetch)}</div>
      </div>
    `;
  },

  /* ═══════════════════════════════════════════════════════════════════
     FEED LIST — every published advisory; auto-fetch publishes directly,
     admin can only add (manual entry) or delete
     ═══════════════════════════════════════════════════════════════════ */
  renderFeedList() {
    const container = document.getElementById('adminFeedList');
    if (!container) return;

    const items = TIP_DATA.feedItems;
    if (!items.length) {
      container.innerHTML = `<div class="empty-state">
        <div class="empty-icon">📭</div>
        No advisories yet. Claude will fetch new ones on the next cycle, or add one manually.
      </div>`;
      return;
    }

    container.innerHTML = items.map(item => {
      const cat = TIP_DATA.categories[item.category] || { short: item.category.toUpperCase(), color: 'kev' };

      return `<div class="pending-card" data-id="${item.id}" style="cursor:pointer" onclick="AdminView.showDetail('${item.id}')">
        <div class="card-top">
          <span class="badge badge-${item.category}">${cat.short}</span>
          <span class="sev-badge sev-${item.severity.toLowerCase()}">${item.severity}</span>
          ${item.cve ? `<span class="cve-tag">${App.escapeHtml(item.cve)}</span>` : ''}
          ${item.cvss ? `<span class="cvss-tag">CVSS ${item.cvss.toFixed(1)}</span>` : ''}
          <span class="date-tag">${App.formatDate(item.date)}</span>
        </div>
        <h3 style="margin:2px 0 6px;font-size:15px;color:var(--heading);font-weight:650">${App.escapeHtml(item.title)}</h3>
        <p class="card-summary">${App.escapeHtml(item.summary)}</p>
        <div class="card-footer">
          ${item.actor ? `<span class="actor-tag">▲ ${App.escapeHtml(item.actor)}</span>` : ''}
          ${item.tags.map(t => `<span class="hash-tag">#${App.escapeHtml(t)}</span>`).join('')}
          <span class="source-link"><a href="${App.escapeHtml(App.safeUrl(item.url))}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${App.escapeHtml(item.source)} →</a></span>
        </div>
        <div class="pending-actions" onclick="event.stopPropagation()">
          <button class="btn btn-danger btn-sm" onclick="AdminView.deleteItem('${item.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>
            Delete
          </button>
        </div>
      </div>`;
    }).join('');
  },

  /* ═══════════════════════════════════════════════════════════════════
     DETAIL VIEW — advisory detail from admin panel
     ═══════════════════════════════════════════════════════════════════ */
  showDetail(id) {
    const item = TIP_DATA.feedItems.find(i => i.id === id);
    if (!item) return;

    this.showListUI(false);
    const container = document.getElementById('adminDetailView');
    if (!container) return;
    container.style.display = '';

    const cat = TIP_DATA.categories[item.category] || { short: item.category?.toUpperCase() || 'N/A' };

    container.innerHTML = `
      <div class="detail-article">
        <div class="back-btn" onclick="AdminView.closeDetail()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Admin Panel
        </div>

        <article class="article-container">
          <header class="article-header">
            <div class="article-badges">
              <span class="badge badge-${item.category}" style="font-size:11px;padding:4px 12px">${cat.short}</span>
              <span class="sev-badge sev-${(item.severity || 'medium').toLowerCase()}" style="font-size:11px;padding:4px 10px">${item.severity || 'Medium'}</span>
              ${item.cve ? `<span class="cve-tag" style="font-size:12px;padding:3px 10px">${App.escapeHtml(item.cve)}</span>` : ''}
              ${item.cvss ? `<span class="cvss-tag" style="font-size:12px">CVSS ${item.cvss.toFixed(1)}</span>` : ''}
            </div>

            <h1 class="article-title">${App.escapeHtml(item.title)}</h1>

            <div class="article-meta">
              <span class="meta-item"><span class="meta-label">Date:</span> ${App.formatDate(item.date)}</span>
              <span class="meta-item"><span class="meta-label">Source:</span> <a href="${App.escapeHtml(App.safeUrl(item.url))}" target="_blank" rel="noopener" style="color:var(--accent)">${App.escapeHtml(item.source)}</a></span>
              ${item.actor ? `<span class="meta-item"><span class="meta-label">Threat Actor:</span> <span style="color:var(--cat-kev);font-weight:600">${App.escapeHtml(item.actor)}</span></span>` : ''}
            </div>

            <div class="article-tags">
              ${(item.tags || []).map(t => `<span class="hash-tag">#${App.escapeHtml(t)}</span>`).join('')}
            </div>
          </header>

          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">1.</span> Advisory Summary
            </h2>
            <blockquote class="article-tldr">
              <strong>Summary</strong> ${App.escapeHtml(item.summary)}
            </blockquote>
          </div>

          ${item.cvss ? `
          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">2.</span> Vulnerability Details
            </h2>
            <p class="article-p"><strong>${App.escapeHtml(item.cve || 'N/A')}</strong> — CVSS base score of <strong>${item.cvss.toFixed(1)}</strong> (${App.escapeHtml(item.severity)}). ${item.cvss >= 9.0 ? 'This is a critical-severity vulnerability that is trivially exploitable with maximum impact.' : item.cvss >= 7.0 ? 'High-severity vulnerability requiring prioritized remediation.' : 'Moderate severity — assess exposure before prioritizing.'}</p>
          </div>
          ` : ''}

          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">⚡</span> Admin Actions
            </h2>
            <button class="btn btn-danger" onclick="AdminView.deleteItem('${item.id}');AdminView.closeDetail()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>
              Delete Advisory
            </button>
          </div>

          <!-- Source Box -->
          <div class="article-section" style="margin-top:28px">
            <div class="article-source-box">
              <div style="font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px">Original Source</div>
              <a href="${App.escapeHtml(App.safeUrl(item.url))}" target="_blank" rel="noopener" class="article-source-link">
                <span>${App.escapeHtml(item.source)}</span>
                <span style="color:var(--accent)">Open Source →</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    `;
  },

  closeDetail() {
    this.showListUI(true);
    const detail = document.getElementById('adminDetailView');
    if (detail) detail.style.display = 'none';
    this.render();
  },

  /* ═══════════════════════════════════════════════════════════════════
     ACTIONS — add or delete only
     ═══════════════════════════════════════════════════════════════════ */
  deleteItem(id) {
    if (!confirm('Delete this advisory? This cannot be undone.')) return;
    if (DataManager.deleteFeedItem(id)) {
      App.toast('Advisory deleted', 'warning');
      this.render();
      App.renderSidebarCategories();
      App.updateSidebarMeta();
    }
  },

  openManualEntry() {
    // Clear form
    document.getElementById('manualTitle').value = '';
    document.getElementById('manualCategory').value = 'kev';
    document.getElementById('manualSeverity').value = 'High';
    document.getElementById('manualCve').value = '';
    document.getElementById('manualCvss').value = '';
    document.getElementById('manualSummary').value = '';
    document.getElementById('manualSource').value = '';
    document.getElementById('manualUrl').value = '';
    document.getElementById('manualActor').value = '';
    document.getElementById('manualTags').value = '';
    document.getElementById('manualDate').value = new Date().toISOString().split('T')[0];

    App.openModal('manualEntryModal');
  },

  saveManualEntry() {
    const title = document.getElementById('manualTitle').value.trim();
    const summary = document.getElementById('manualSummary').value.trim();
    if (!title || !summary) {
      App.toast('Title and summary are required', 'error');
      return;
    }

    const item = {
      title,
      category: document.getElementById('manualCategory').value,
      severity: document.getElementById('manualSeverity').value,
      cve: document.getElementById('manualCve').value || null,
      cvss: parseFloat(document.getElementById('manualCvss').value) || null,
      date: document.getElementById('manualDate').value,
      actor: document.getElementById('manualActor').value || null,
      source: document.getElementById('manualSource').value || 'Manual Entry',
      url: document.getElementById('manualUrl').value || '#',
      summary,
      tags: document.getElementById('manualTags').value.split(',').map(t => t.trim()).filter(Boolean)
    };

    DataManager.addManualItem(item);
    App.closeModal('manualEntryModal');
    App.toast('Advisory published successfully', 'success');
    App.renderSidebarCategories();
    App.updateSidebarMeta();
    this.render();
  }
};
