/* ═══════════════════════════════════════════════════════════════════
   TIP — Adversary View
   Ingestion form, collection gallery, profile detail view
   ═══════════════════════════════════════════════════════════════════ */

const AdversaryView = {
  searchQuery: '',
  filterType: 'all',
  detailId: null,

  render(subRoute) {
    if (subRoute && subRoute[0] === 'detail' && subRoute[1]) {
      this.detailId = subRoute[1];
      this.renderDetail();
    } else {
      this.detailId = null;
      this.renderCollection();
    }
  },

  renderCollection() {
    const container = document.getElementById('adversaryContent');
    if (!container) return;

    let adversaries = DataManager.getAdversaries();

    // Filter
    if (this.filterType !== 'all') {
      adversaries = adversaries.filter(a => a.type === this.filterType);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      adversaries = adversaries.filter(a =>
        (a.name + ' ' + a.aliases.join(' ') + ' ' + a.origin + ' ' + a.sectors.join(' ')).toLowerCase().includes(q)
      );
    }

    const countHtml = `<div class="results-count">${adversaries.length} adversaries tracked</div>`;

    const gridHtml = adversaries.length ? `<div class="adversary-grid">
      ${adversaries.map(adv => this.renderCard(adv)).join('')}
    </div>` : `<div class="empty-state">
      <div class="empty-icon">👤</div>
      No adversaries match your filter.
    </div>`;

    container.innerHTML = countHtml + gridHtml;
  },

  renderCard(adv) {
    const typeIcons = { apt: '🎯', criminal: '💰', hacktivist: '✊' };
    const typeLabels = { apt: 'APT', criminal: 'Criminal', hacktivist: 'Hacktivist' };

    return `<div class="adversary-card" onclick="window.location.hash='adversaries/detail/${adv.id}'">
      <div class="adv-header">
        <div class="adv-icon ${adv.type}">${typeIcons[adv.type] || '👤'}</div>
        <div>
          <div class="adv-name">${App.escapeHtml(adv.name)}</div>
          <div class="adv-aliases">${adv.aliases.length ? adv.aliases.map(a => App.escapeHtml(a)).join(' · ') : 'No aliases'}</div>
        </div>
        <span style="margin-left:auto;display:flex;align-items:center;gap:6px">
          ${App.isFreshFetch(adv, TIP_DATA.adversaries) ? '<span class="new-badge">New</span>' : ''}
          <span class="badge badge-${adv.type === 'apt' ? 'kev' : adv.type === 'criminal' ? 'ransomware' : 'supplychain'}">
            ${typeLabels[adv.type] || adv.type}
          </span>
        </span>
      </div>
      <p class="card-summary" style="font-size:12.5px;margin:8px 0">${App.escapeHtml(adv.notes).substring(0, 120)}${adv.notes.length > 120 ? '…' : ''}</p>
      <div class="adv-details">
        <span class="adv-detail-tag">🌍 ${App.escapeHtml(adv.origin)}</span>
        <span class="adv-detail-tag">🎯 ${App.escapeHtml(adv.motivation)}</span>
        <span class="adv-detail-tag">📅 ${App.formatDate(adv.lastSeen)}</span>
      </div>
      <div class="adv-details" style="margin-top:6px">
        ${adv.sectors.slice(0, 3).map(s => `<span class="adv-detail-tag">${App.escapeHtml(s)}</span>`).join('')}
        ${adv.sectors.length > 3 ? `<span class="adv-detail-tag">+${adv.sectors.length - 3}</span>` : ''}
      </div>
    </div>`;
  },

  renderDetail() {
    const container = document.getElementById('adversaryContent');
    if (!container || !this.detailId) return;

    const adv = TIP_DATA.adversaries.find(a => a.id === this.detailId);
    if (!adv) {
      container.innerHTML = `<div class="empty-state">Adversary not found.</div>`;
      return;
    }

    const typeLabels = { apt: 'APT', criminal: 'Criminal', hacktivist: 'Hacktivist' };

    container.innerHTML = `
      <div class="back-btn" onclick="window.location.hash='adversaries'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Collection
      </div>
      <div class="detail-panel">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
          <div class="adv-icon ${adv.type}" style="width:48px;height:48px;font-size:24px">${adv.type === 'apt' ? '🎯' : adv.type === 'criminal' ? '💰' : '✊'}</div>
          <div>
            <h2 style="margin:0">${App.escapeHtml(adv.name)}</h2>
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);margin-top:2px">${adv.aliases.map(a => App.escapeHtml(a)).join(' · ') || 'No known aliases'}</div>
          </div>
          <span class="badge badge-${adv.type === 'apt' ? 'kev' : adv.type === 'criminal' ? 'ransomware' : 'supplychain'}" style="margin-left:auto;font-size:12px;padding:5px 14px">
            ${typeLabels[adv.type]}
          </span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Origin</span>
          <span class="detail-value">${App.escapeHtml(adv.origin)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Motivation</span>
          <span class="detail-value">${App.escapeHtml(adv.motivation)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Last Seen</span>
          <span class="detail-value">${App.formatDate(adv.lastSeen)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Target Sectors</span>
          <span class="detail-value">
            ${adv.sectors.map(s => `<span class="hash-tag" style="margin:2px 4px 2px 0">${App.escapeHtml(s)}</span>`).join('')}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">MITRE TTPs</span>
          <span class="detail-value" style="font-family:var(--font-mono);font-size:12px">
            ${adv.ttps.map(t => `<span class="cve-tag" style="margin:2px 4px 2px 0">${App.escapeHtml(t)}</span>`).join('')}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Campaigns</span>
          <span class="detail-value">
            ${adv.campaigns.map(c => `<div style="margin-bottom:4px">• ${App.escapeHtml(c)}</div>`).join('')}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">IOCs</span>
          <span class="detail-value" style="font-family:var(--font-mono);font-size:12px">
            ${adv.iocs.length ? adv.iocs.map(i => `<div style="margin-bottom:2px;color:var(--cat-kev)">${App.escapeHtml(i)}</div>`).join('') : '<span style="color:var(--text-muted)">None recorded</span>'}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Notes</span>
          <span class="detail-value">${App.escapeHtml(adv.notes)}</span>
        </div>
      </div>

      <div style="display:flex;gap:10px" class="admin-only">
        <button class="btn btn-ghost" onclick="AdversaryView.editAdversary('${adv.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit Adversary
        </button>
        <button class="btn btn-danger btn-sm" onclick="AdversaryView.deleteAdversary('${adv.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete
        </button>
      </div>
    `;
  },

  openIngestForm() {
    document.getElementById('advName').value = '';
    document.getElementById('advAliases').value = '';
    document.getElementById('advType').value = 'criminal';
    document.getElementById('advOrigin').value = '';
    document.getElementById('advMotivation').value = 'Financial';
    document.getElementById('advSectors').value = '';
    document.getElementById('advTtps').value = '';
    document.getElementById('advCampaigns').value = '';
    document.getElementById('advIocs').value = '';
    document.getElementById('advNotes').value = '';
    document.getElementById('ingestAdversaryModal').dataset.editId = '';

    App.openModal('ingestAdversaryModal');
  },

  saveAdversary() {
    const name = document.getElementById('advName').value.trim();
    if (!name) {
      App.toast('Adversary name is required', 'error');
      return;
    }

    const adv = {
      name,
      aliases: document.getElementById('advAliases').value.split(',').map(s => s.trim()).filter(Boolean),
      type: document.getElementById('advType').value,
      origin: document.getElementById('advOrigin').value || 'Unknown',
      motivation: document.getElementById('advMotivation').value,
      sectors: document.getElementById('advSectors').value.split(',').map(s => s.trim()).filter(Boolean),
      ttps: document.getElementById('advTtps').value.split(',').map(s => s.trim()).filter(Boolean),
      campaigns: document.getElementById('advCampaigns').value.split('\n').map(s => s.trim()).filter(Boolean),
      iocs: document.getElementById('advIocs').value.split('\n').map(s => s.trim()).filter(Boolean),
      lastSeen: new Date().toISOString().split('T')[0],
      notes: document.getElementById('advNotes').value
    };

    const editId = document.getElementById('ingestAdversaryModal').dataset.editId;
    if (editId) {
      DataManager.updateAdversary(editId, adv);
      App.toast('Adversary profile updated', 'success');
    } else {
      DataManager.addAdversary(adv);
      App.toast('Adversary profile created', 'success');
    }
    App.closeModal('ingestAdversaryModal');
    this.renderCollection();
  },

  editAdversary(id) {
    const adv = TIP_DATA.adversaries.find(a => a.id === id);
    if (!adv) return;

    document.getElementById('advName').value = adv.name;
    document.getElementById('advAliases').value = adv.aliases.join(', ');
    document.getElementById('advType').value = adv.type;
    document.getElementById('advOrigin').value = adv.origin;
    document.getElementById('advMotivation').value = adv.motivation;
    document.getElementById('advSectors').value = adv.sectors.join(', ');
    document.getElementById('advTtps').value = adv.ttps.join(', ');
    document.getElementById('advCampaigns').value = adv.campaigns.join('\n');
    document.getElementById('advIocs').value = adv.iocs.join('\n');
    document.getElementById('advNotes').value = adv.notes;

    // Store editing id
    document.getElementById('ingestAdversaryModal').dataset.editId = id;
    App.openModal('ingestAdversaryModal');
  },

  deleteAdversary(id) {
    if (confirm('Delete this adversary profile?')) {
      DataManager.deleteAdversary(id);
      App.toast('Adversary deleted', 'warning');
      window.location.hash = 'adversaries';
    }
  },

  bindEvents() {
    const search = document.getElementById('advSearch');
    if (search) {
      search.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderCollection();
      });
    }

    const filter = document.getElementById('advFilter');
    if (filter) {
      filter.addEventListener('change', (e) => {
        this.filterType = e.target.value;
        this.renderCollection();
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => AdversaryView.bindEvents());
