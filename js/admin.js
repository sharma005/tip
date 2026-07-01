/* ═══════════════════════════════════════════════════════════════════
   TIP — Admin Panel View
   Pending review queue, approve/reject, audit log, detail view,
   manual entry, clickable stats
   ═══════════════════════════════════════════════════════════════════ */

const AdminView = {
  auditFilter: null, // null = hidden, 'approved' or 'rejected'

  render() {
    this.showPendingUI(true);
    this.renderStats();
    this.renderPendingQueue();
  },

  showPendingUI(show) {
    const pending = document.getElementById('adminPendingSection');
    const detail = document.getElementById('adminDetailView');
    const header = document.getElementById('adminHeader');
    if (pending) pending.style.display = show ? '' : 'none';
    if (detail) detail.style.display = show ? 'none' : '';
    if (header) header.style.display = show ? '' : 'none';
  },

  renderStats() {
    const meta = DataManager.getMeta();
    const pending = DataManager.getPendingItems().length;

    const statsEl = document.getElementById('adminStats');
    if (!statsEl) return;

    statsEl.innerHTML = `
      <div class="stat-card accent">
        <div class="stat-label">Pending Review</div>
        <div class="stat-value">${pending}</div>
      </div>
      <div class="stat-card success" onclick="AdminView.showAudit('approved')" style="cursor:pointer" title="Click to view approved feed audit log">
        <div class="stat-label">Published ↗</div>
        <div class="stat-value">${meta.totalPublished}</div>
      </div>
      <div class="stat-card danger" onclick="AdminView.showAudit('rejected')" style="cursor:pointer" title="Click to view rejected feed audit log">
        <div class="stat-label">Rejected ↗</div>
        <div class="stat-value">${meta.totalRejected}</div>
      </div>
      <div class="stat-card info">
        <div class="stat-label">Last Fetch</div>
        <div class="stat-value" style="font-size:16px">${App.timeAgo(meta.lastFetch)}</div>
      </div>
    `;
  },

  /* ═══════════════════════════════════════════════════════════════════
     AUDIT LOG — shown when Published/Rejected stat clicked
     ═══════════════════════════════════════════════════════════════════ */
  showAudit(type) {
    this.auditFilter = type;
    const panel = document.getElementById('adminAuditPanel');
    const title = document.getElementById('auditTitle');
    const list = document.getElementById('adminAuditList');

    if (!panel || !list) return;

    panel.style.display = '';
    title.textContent = type === 'approved' ? '// Approved Feed Audit Log' : '// Rejected Feed Audit Log';

    // Get items from the right source
    let items = [];
    if (type === 'approved') {
      // Published items are in feedItems
      items = TIP_DATA.feedItems.map(i => ({ ...i, _auditStatus: 'approved' }));
    } else {
      // Rejected items are pendingItems with status 'rejected'
      items = TIP_DATA.pendingItems
        .filter(i => i.status === 'rejected')
        .map(i => ({ ...i, _auditStatus: 'rejected' }));
    }

    if (!items.length) {
      list.innerHTML = `<div class="empty-state">
        <div class="empty-icon">${type === 'approved' ? '📋' : '🗑️'}</div>
        No ${type} items in the audit log.
      </div>`;
      return;
    }

    list.innerHTML = items.map(item => {
      const cat = TIP_DATA.categories[item.category] || { short: item.category?.toUpperCase() || 'N/A' };
      return `<div class="pending-card ${type}" style="cursor:pointer" onclick="AdminView.showDetail('${item.id}','${type}')">
        <div class="card-top">
          <span class="badge badge-${item.category}">${cat.short}</span>
          <span class="sev-badge sev-${item.severity?.toLowerCase() || 'medium'}">${item.severity || 'Medium'}</span>
          ${item.cve ? `<span class="cve-tag">${item.cve}</span>` : ''}
          <span class="date-tag">${App.formatDate(item.date)}</span>
          <span style="margin-left:auto;font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:${type === 'approved' ? 'var(--success)' : 'var(--danger)'}">${type === 'approved' ? '✓ Published' : '✕ Rejected'}</span>
        </div>
        <h3 style="margin:2px 0 6px;font-size:15px;color:var(--heading);font-weight:650">${App.escapeHtml(item.title)}</h3>
        <p class="card-summary">${App.escapeHtml(item.summary)}</p>
        <div class="card-footer">
          ${(item.tags || []).map(t => `<span class="hash-tag">#${t}</span>`).join('')}
          <span class="source-link"><a href="${item.url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${App.escapeHtml(item.source)} →</a></span>
        </div>
      </div>`;
    }).join('');
  },

  closeAudit() {
    this.auditFilter = null;
    const panel = document.getElementById('adminAuditPanel');
    if (panel) panel.style.display = 'none';
  },

  /* ═══════════════════════════════════════════════════════════════════
     PENDING QUEUE — only shows pending items
     ═══════════════════════════════════════════════════════════════════ */
  renderPendingQueue() {
    const container = document.getElementById('pendingQueue');
    if (!container) return;

    // Only show pending items (not approved/rejected)
    const pendingOnly = TIP_DATA.pendingItems.filter(i => i.status === 'pending');

    if (!pendingOnly.length) {
      container.innerHTML = `<div class="empty-state">
        <div class="empty-icon">📭</div>
        No pending items. Claude will fetch new advisories on the next cycle.
      </div>`;
      return;
    }

    container.innerHTML = pendingOnly.map(item => {
      const cat = TIP_DATA.categories[item.category] || { short: item.category.toUpperCase(), color: 'kev' };

      return `<div class="pending-card" data-id="${item.id}" style="cursor:pointer" onclick="AdminView.showDetail('${item.id}','pending')">
        <div class="card-top">
          <span class="badge badge-${item.category}">${cat.short}</span>
          <span class="sev-badge sev-${item.severity.toLowerCase()}">${item.severity}</span>
          ${item.cve ? `<span class="cve-tag">${item.cve}</span>` : ''}
          ${item.cvss ? `<span class="cvss-tag">CVSS ${item.cvss.toFixed(1)}</span>` : ''}
          <span class="date-tag">${App.formatDate(item.date)}</span>
        </div>
        <h3 style="margin:2px 0 6px;font-size:15px;color:var(--heading);font-weight:650">${App.escapeHtml(item.title)}</h3>
        <p class="card-summary">${App.escapeHtml(item.summary)}</p>
        <div class="card-footer">
          ${item.actor ? `<span class="actor-tag">▲ ${App.escapeHtml(item.actor)}</span>` : ''}
          ${item.tags.map(t => `<span class="hash-tag">#${t}</span>`).join('')}
          <span class="source-link"><a href="${item.url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${App.escapeHtml(item.source)} →</a></span>
        </div>
        <div class="pending-actions" onclick="event.stopPropagation()">
          <button class="btn btn-success btn-sm" onclick="AdminView.approve('${item.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M20 6L9 17l-5-5"/></svg>
            Approve
          </button>
          <button class="btn btn-danger btn-sm" onclick="AdminView.reject('${item.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M18 6L6 18M6 6l12 12"/></svg>
            Reject
          </button>
          <button class="btn btn-ghost btn-sm" onclick="AdminView.editItem('${item.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
        </div>
      </div>`;
    }).join('');
  },

  /* ═══════════════════════════════════════════════════════════════════
     DETAIL VIEW — advisory detail from admin panel
     ═══════════════════════════════════════════════════════════════════ */
  showDetail(id, source) {
    let item;
    if (source === 'approved') {
      item = TIP_DATA.feedItems.find(i => i.id === id);
    } else {
      item = TIP_DATA.pendingItems.find(i => i.id === id);
    }
    if (!item) return;

    this.showPendingUI(false);
    const auditPanel = document.getElementById('adminAuditPanel');
    if (auditPanel) auditPanel.style.display = 'none';

    const container = document.getElementById('adminDetailView');
    if (!container) return;
    container.style.display = '';

    const cat = TIP_DATA.categories[item.category] || { short: item.category?.toUpperCase() || 'N/A' };
    const isPending = item.status === 'pending';

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
              ${item.cve ? `<span class="cve-tag" style="font-size:12px;padding:3px 10px">${item.cve}</span>` : ''}
              ${item.cvss ? `<span class="cvss-tag" style="font-size:12px">CVSS ${item.cvss.toFixed(1)}</span>` : ''}
              <span style="margin-left:auto;font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;padding:4px 10px;border-radius:6px;background:${source === 'approved' ? 'var(--success-bg)' : source === 'rejected' ? 'var(--danger-bg)' : 'var(--accent-bg)'};color:${source === 'approved' ? 'var(--success)' : source === 'rejected' ? 'var(--danger)' : 'var(--accent)'}">${source === 'approved' ? '✓ Published' : source === 'rejected' ? '✕ Rejected' : '⏳ Pending'}</span>
            </div>

            <h1 class="article-title">${App.escapeHtml(item.title)}</h1>

            <div class="article-meta">
              <span class="meta-item"><span class="meta-label">Date:</span> ${App.formatDate(item.date)}</span>
              <span class="meta-item"><span class="meta-label">Source:</span> <a href="${item.url}" target="_blank" rel="noopener" style="color:var(--accent)">${App.escapeHtml(item.source)}</a></span>
              ${item.actor ? `<span class="meta-item"><span class="meta-label">Threat Actor:</span> <span style="color:var(--cat-kev);font-weight:600">${App.escapeHtml(item.actor)}</span></span>` : ''}
            </div>

            <div class="article-tags">
              ${(item.tags || []).map(t => `<span class="hash-tag">#${t}</span>`).join('')}
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
            <p class="article-p"><strong>${item.cve || 'N/A'}</strong> — CVSS base score of <strong>${item.cvss.toFixed(1)}</strong> (${item.severity}). ${item.cvss >= 9.0 ? 'This is a critical-severity vulnerability that is trivially exploitable with maximum impact.' : item.cvss >= 7.0 ? 'High-severity vulnerability requiring prioritized remediation.' : 'Moderate severity — assess exposure before prioritizing.'}</p>
          </div>
          ` : ''}

          ${isPending ? `
          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">⚡</span> Admin Actions
            </h2>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-success" onclick="AdminView.approve('${item.id}');AdminView.closeDetail()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M20 6L9 17l-5-5"/></svg>
                Approve & Publish
              </button>
              <button class="btn btn-danger" onclick="AdminView.reject('${item.id}');AdminView.closeDetail()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M18 6L6 18M6 6l12 12"/></svg>
                Reject
              </button>
              <button class="btn btn-ghost" onclick="AdminView.editItem('${item.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
            </div>
          </div>
          ` : ''}

          <!-- Source Box -->
          <div class="article-section" style="margin-top:28px">
            <div class="article-source-box">
              <div style="font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px">Original Source</div>
              <a href="${item.url}" target="_blank" rel="noopener" class="article-source-link">
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
    this.showPendingUI(true);
    const detail = document.getElementById('adminDetailView');
    if (detail) detail.style.display = 'none';
    this.render();
  },

  /* ═══════════════════════════════════════════════════════════════════
     ACTIONS
     ═══════════════════════════════════════════════════════════════════ */
  approve(id) {
    if (DataManager.approveItem(id)) {
      App.toast('Advisory approved and published', 'success');
      this.render();
      App.updatePendingBadge();
      App.renderSidebarCategories();
    }
  },

  reject(id) {
    if (DataManager.rejectItem(id)) {
      App.toast('Advisory rejected', 'warning');
      this.render();
      App.updatePendingBadge();
    }
  },

  approveAll() {
    const pending = DataManager.getPendingItems();
    let count = 0;
    pending.forEach(item => {
      if (DataManager.approveItem(item.id)) count++;
    });
    App.toast(`${count} advisories approved and published`, 'success');
    this.render();
    App.updatePendingBadge();
    App.renderSidebarCategories();
  },

  editItem(id) {
    const item = TIP_DATA.pendingItems.find(i => i.id === id);
    if (!item) return;

    // Populate edit modal
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editTitle').value = item.title;
    document.getElementById('editCategory').value = item.category;
    document.getElementById('editSeverity').value = item.severity;
    document.getElementById('editCve').value = item.cve || '';
    document.getElementById('editCvss').value = item.cvss || '';
    document.getElementById('editSummary').value = item.summary;
    document.getElementById('editSource').value = item.source;
    document.getElementById('editUrl').value = item.url;
    document.getElementById('editActor').value = item.actor || '';
    document.getElementById('editTags').value = item.tags.join(', ');

    App.openModal('editItemModal');
  },

  saveEdit() {
    const id = document.getElementById('editItemId').value;
    const idx = TIP_DATA.pendingItems.findIndex(i => i.id === id);
    if (idx === -1) return;

    TIP_DATA.pendingItems[idx].title = document.getElementById('editTitle').value;
    TIP_DATA.pendingItems[idx].category = document.getElementById('editCategory').value;
    TIP_DATA.pendingItems[idx].severity = document.getElementById('editSeverity').value;
    TIP_DATA.pendingItems[idx].cve = document.getElementById('editCve').value || null;
    TIP_DATA.pendingItems[idx].cvss = parseFloat(document.getElementById('editCvss').value) || null;
    TIP_DATA.pendingItems[idx].summary = document.getElementById('editSummary').value;
    TIP_DATA.pendingItems[idx].source = document.getElementById('editSource').value;
    TIP_DATA.pendingItems[idx].url = document.getElementById('editUrl').value;
    TIP_DATA.pendingItems[idx].actor = document.getElementById('editActor').value || null;
    TIP_DATA.pendingItems[idx].tags = document.getElementById('editTags').value.split(',').map(t => t.trim()).filter(Boolean);

    DataManager.save();
    App.closeModal('editItemModal');
    App.toast('Advisory updated', 'success');
    this.render();
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
  }
};
