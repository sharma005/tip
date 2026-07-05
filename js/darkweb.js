/* ═══════════════════════════════════════════════════════════════════
   TIP — Dark Web Intelligence View
   Monitoring feed, alert flagging, statistics, detail view
   ═══════════════════════════════════════════════════════════════════ */

const DarkWebView = {
  searchQuery: '',
  filterType: 'all',
  sortBy: 'date',
  detailId: null,

  render(subRoute) {
    if (subRoute && subRoute.length >= 2 && subRoute[0] === 'detail') {
      this.detailId = subRoute[1];
      this.renderDetail();
    } else {
      this.detailId = null;
      this.showListUI(true);
      this.renderStats();
      this.renderFeed();
    }
  },

  showListUI(show) {
    const ids = ['dwHeader', 'dwStats', 'dwControls', 'dwCount'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = show ? '' : 'none';
    });
  },

  renderStats() {
    const container = document.getElementById('dwStats');
    if (!container) return;

    const items = DataManager.getDarkwebItems();
    const types = {};
    items.forEach(i => { types[i.type] = (types[i.type] || 0) + 1; });
    const flagged = items.filter(i => i.flagged).length;
    const avgRelevance = items.length ? Math.round(items.reduce((s, i) => s + i.relevance, 0) / items.length) : 0;

    const af = this.filterType; // active filter for highlight
    container.innerHTML = `
      <div class="dw-stat ${af === 'all' ? 'active-filter' : ''}" onclick="DarkWebView.statFilter('all')">
        <div class="dw-stat-value">${items.length}</div>
        <div class="dw-stat-label">Total Intel</div>
      </div>
      <div class="dw-stat ${af === '_flagged' ? 'active-filter' : ''}" onclick="DarkWebView.statFilter('_flagged')">
        <div class="dw-stat-value" style="color:var(--danger)">${flagged}</div>
        <div class="dw-stat-label">Flagged</div>
      </div>
      <div class="dw-stat ${af === '_relevance' ? 'active-filter' : ''}" onclick="DarkWebView.statFilter('_relevance')">
        <div class="dw-stat-value" style="color:var(--accent)">${avgRelevance}%</div>
        <div class="dw-stat-label">Avg Relevance</div>
      </div>
      <div class="dw-stat ${af === 'leak' ? 'active-filter' : ''}" onclick="DarkWebView.statFilter('leak')">
        <div class="dw-stat-value" style="color:var(--cat-kev)">${types.leak || 0}</div>
        <div class="dw-stat-label">Data Leaks</div>
      </div>
      <div class="dw-stat ${af === 'exploit' ? 'active-filter' : ''}" onclick="DarkWebView.statFilter('exploit')">
        <div class="dw-stat-value" style="color:var(--cat-rce)">${types.exploit || 0}</div>
        <div class="dw-stat-label">Exploits</div>
      </div>
      <div class="dw-stat ${af === 'credential' ? 'active-filter' : ''}" onclick="DarkWebView.statFilter('credential')">
        <div class="dw-stat-value" style="color:var(--warning)">${types.credential || 0}</div>
        <div class="dw-stat-label">Credentials</div>
      </div>
    `;
  },

  renderFeed() {
    const container = document.getElementById('dwFeed');
    if (!container) return;

    let items = DataManager.getDarkwebItems();

    // Filter
    if (this.filterType === '_flagged') {
      items = items.filter(i => i.flagged);
    } else if (this.filterType !== 'all' && this.filterType !== '_relevance') {
      items = items.filter(i => i.type === this.filterType);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(i =>
        (i.title + ' ' + i.snippet + ' ' + i.source + ' ' + i.tags.join(' ')).toLowerCase().includes(q)
      );
    }

    // Sort
    items.sort((a, b) => {
      if (this.sortBy === 'relevance') return b.relevance - a.relevance;
      if (this.sortBy === 'flagged') return (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0) || b.date.localeCompare(a.date);
      return b.date.localeCompare(a.date);
    });

    const countEl = document.getElementById('dwCount');
    if (countEl) countEl.textContent = `${items.length} intelligence items`;

    if (!items.length) {
      container.innerHTML = `<div class="empty-state">
        <div class="empty-icon">🕸️</div>
        No dark web intelligence matches your filter.
      </div>`;
      return;
    }

    container.innerHTML = items.map(item => this.renderCard(item)).join('');
  },

  renderCard(item) {
    const typeLabels = {
      leak: 'DATA LEAK',
      credential: 'CREDENTIALS',
      exploit: 'EXPLOIT SALE',
      ransomware: 'RANSOMWARE',
      chatter: 'ACTOR CHATTER'
    };
    const typeClass = {
      leak: 'dw-leak',
      credential: 'dw-credential',
      exploit: 'dw-exploit',
      ransomware: 'dw-ransomware',
      chatter: 'dw-chatter'
    };

    return `<div class="darkweb-card ${item.flagged ? 'glow-border' : ''}" onclick="window.location.hash='darkweb/detail/${item.id}'" style="cursor:pointer">
      <div class="card-top">
        <span class="dw-type-tag ${typeClass[item.type]}">${typeLabels[item.type] || item.type}</span>
        ${item.flagged ? '<span class="sev-badge sev-critical">⚠ FLAGGED</span>' : ''}
        ${App.isFreshFetch(item, TIP_DATA.darkwebItems) ? '<span class="new-badge">New</span>' : ''}
        <span class="hash-tag">${App.escapeHtml(item.source)}</span>
        <span class="date-tag">${App.formatDate(item.date)}</span>
      </div>
      <h3 style="margin:6px 0 8px;font-size:15px;color:var(--heading);font-weight:650">${App.escapeHtml(item.title)}</h3>
      <p class="card-summary">${App.escapeHtml(item.snippet)}</p>
      <div class="card-footer" style="margin-top:8px">
        ${item.tags.map(t => `<span class="hash-tag">#${App.escapeHtml(t)}</span>`).join('')}
        <span style="margin-left:auto;display:flex;align-items:center;gap:6px">
          <button class="btn btn-xs admin-only ${item.flagged ? 'btn-danger' : 'btn-ghost'}" onclick="event.stopPropagation();DarkWebView.toggleFlag('${item.id}')">
            ${item.flagged ? '🚩 Unflag' : '🏳️ Flag'}
          </button>
        </span>
      </div>
      <div class="relevance-bar">
        <div class="relevance-fill" style="width:${item.relevance}%"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:4px;font-family:var(--font-mono);font-size:10px;color:var(--text-muted)">
        <span>Relevance</span>
        <span>${item.relevance}%</span>
      </div>
    </div>`;
  },

  /* ═══════════════════════════════════════════════════════════════════
     DETAIL VIEW — Full dark web intelligence report
     ═══════════════════════════════════════════════════════════════════ */
  renderDetail() {
    const container = document.getElementById('dwFeed');
    if (!container) return;

    this.showListUI(false);

    const item = TIP_DATA.darkwebItems.find(i => i.id === this.detailId);
    if (!item) {
      container.innerHTML = `<div class="empty-state">Intelligence item not found.</div>`;
      return;
    }

    const typeLabels = {
      leak: 'DATA LEAK', credential: 'CREDENTIALS', exploit: 'EXPLOIT SALE',
      ransomware: 'RANSOMWARE', chatter: 'ACTOR CHATTER'
    };
    const typeClass = {
      leak: 'dw-leak', credential: 'dw-credential', exploit: 'dw-exploit',
      ransomware: 'dw-ransomware', chatter: 'dw-chatter'
    };

    const detail = this.generateDetailContent(item);

    container.innerHTML = `
      <div class="dw-detail-article">
        <div class="back-btn" onclick="window.location.hash='darkweb'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Dark Web Intel
        </div>

        <div class="dw-detail-container">
          <header class="dw-detail-header">
            <div class="article-badges">
              <span class="dw-type-tag ${typeClass[item.type]}" style="font-size:11px;padding:4px 12px">${typeLabels[item.type]}</span>
              ${item.flagged ? '<span class="sev-badge sev-critical" style="font-size:11px;padding:4px 10px">⚠ FLAGGED</span>' : ''}
            </div>

            <h1 class="dw-detail-title">${App.escapeHtml(item.title)}</h1>

            <div class="dw-detail-meta">
              <span class="meta-item"><span class="meta-label">Source:</span> ${App.escapeHtml(item.source)}</span>
              <span class="meta-item"><span class="meta-label">Discovered:</span> ${App.formatDate(item.date)}</span>
              <span class="meta-item"><span class="meta-label">Type:</span> ${typeLabels[item.type]}</span>
            </div>

            <div class="article-tags">
              ${item.tags.map(t => `<span class="hash-tag">#${App.escapeHtml(t)}</span>`).join('')}
            </div>
          </header>

          <!-- Original Snippet -->
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">1.</span> Original Intelligence
            </h2>
            <div class="dw-snippet-box">${App.escapeHtml(item.snippet)}</div>
          </div>

          <!-- Relevance Assessment -->
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">2.</span> Relevance Assessment
            </h2>
            <div class="dw-relevance-display">
              <div class="dw-relevance-bar-lg">
                <div class="dw-relevance-fill-lg" style="width:${item.relevance}%"></div>
              </div>
              <span class="dw-relevance-label" style="color:${item.relevance >= 80 ? 'var(--danger)' : item.relevance >= 60 ? 'var(--warning)' : 'var(--success)'}">${item.relevance}%</span>
            </div>
            <p class="article-p">${detail.relevanceAssessment}</p>
          </div>

          <hr class="article-divider">

          <!-- TL;DR for SOC Teams -->
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">3.</span> TL;DR for SOC Teams
            </h2>
            <blockquote class="article-tldr">
              <strong>Bottom Line</strong> ${detail.tldr}
            </blockquote>
          </div>

          <hr class="article-divider">

          <!-- Threat Context -->
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">4.</span> Threat Context & Analysis
            </h2>
            ${detail.analysis.map(p => `<p class="article-p">${p}</p>`).join('')}
          </div>

          <hr class="article-divider">

          <!-- Risk Impact -->
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">5.</span> Risk & Impact
            </h2>
            ${detail.risks.map(r => `
              <div class="dw-assessment">
                <h3>${r.title}</h3>
                <p>${r.description}</p>
              </div>
            `).join('')}
          </div>

          <hr class="article-divider">

          <!-- Recommended Actions -->
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">6.</span> Recommended Actions
            </h2>
            <div class="action-list">
              ${detail.actions.map((action, i) => `
                <div class="action-item">
                  <div class="action-num">${i + 1}</div>
                  <div class="action-text">${action}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Flag Controls -->
          <div class="article-section admin-only" style="margin-top:28px">
            <div style="display:flex;gap:10px">
              <button class="btn ${item.flagged ? 'btn-danger' : 'btn-ghost'}" onclick="DarkWebView.toggleFlagFromDetail('${item.id}')">
                ${item.flagged ? '🚩 Unflag This Intelligence' : '🏳️ Flag for Attention'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* ═══════════════════════════════════════════════════════════════════
     DETAIL CONTENT GENERATOR
     ═══════════════════════════════════════════════════════════════════ */
  generateDetailContent(item) {
    const typeLabels = {
      leak: 'data leak', credential: 'credential dump', exploit: 'exploit listing',
      ransomware: 'ransomware intelligence', chatter: 'threat actor chatter'
    };
    const typeName = typeLabels[item.type] || item.type;

    // --- Relevance Assessment ---
    let relevanceAssessment = '';
    if (item.relevance >= 85) {
      relevanceAssessment = `<strong>Very High Relevance (${item.relevance}%).</strong> This intelligence directly impacts organizational security posture. The information from <strong>${App.escapeHtml(item.source)}</strong> indicates an immediate or near-term threat that requires prompt investigation and potential incident response activation.`;
    } else if (item.relevance >= 65) {
      relevanceAssessment = `<strong>High Relevance (${item.relevance}%).</strong> This ${typeName} from <strong>${App.escapeHtml(item.source)}</strong> represents a significant data point for threat intelligence operations. While not necessarily an immediate crisis, this intelligence should inform security operations and defensive priorities.`;
    } else if (item.relevance >= 40) {
      relevanceAssessment = `<strong>Moderate Relevance (${item.relevance}%).</strong> This ${typeName} provides useful context for understanding the current threat landscape. Monitor for further developments and correlate with other intelligence sources.`;
    } else {
      relevanceAssessment = `<strong>Low Relevance (${item.relevance}%).</strong> This intelligence has limited direct applicability but may provide background context. Consider archiving for future reference and correlation.`;
    }

    // --- TL;DR ---
    let tldr = `${App.escapeHtml(item.snippet)} `;
    if (item.type === 'leak') {
      tldr += `This data leak from ${App.escapeHtml(item.source)} indicates sensitive information has been exposed. Assess whether any organizational data, credentials, or PII may be included in the dump. Initiate credential rotation if overlap is confirmed.`;
    } else if (item.type === 'credential') {
      tldr += `Credentials from this source may grant unauthorized access to systems. Immediate cross-referencing against internal identity systems is required. Force password resets for any matched accounts.`;
    } else if (item.type === 'exploit') {
      tldr += `An exploit is being actively marketed or distributed. Determine whether your infrastructure is vulnerable to the targeted attack vector. Prioritize patching and deploy compensating controls.`;
    } else if (item.type === 'ransomware') {
      tldr += `Ransomware-related intelligence from dark web channels. Review backup integrity, endpoint protection coverage, and incident response readiness. Assess exposure to the specific ransomware variant or threat actor involved.`;
    } else {
      tldr += `Threat actor communications from underground forums. This chatter may indicate upcoming campaigns, target selection, or capability development. Monitor for escalation and correlate with known actor TTPs.`;
    }

    // --- Analysis ---
    const analysis = [];
    if (item.type === 'leak') {
      analysis.push(`This intelligence was sourced from <strong>${App.escapeHtml(item.source)}</strong>, a dark web marketplace/forum known for hosting data breach dumps. The listing indicates that data — potentially including personally identifiable information (PII), credentials, internal documents, or proprietary source code — has been made available either for sale or public download.`);
      analysis.push(`Data leaks of this nature often follow a predictable lifecycle: initial breach → staging on actor infrastructure → listing/sale on dark web forums → wider distribution and exploitation. Early detection at the "listing" stage provides a critical window for damage containment.`);
      analysis.push(`Key questions for investigation: <strong>1)</strong> Does the leaked data overlap with your organization's data assets? <strong>2)</strong> What is the breach date vs. discovery date — has there been an extended dwell time? <strong>3)</strong> Are any credentials or API keys included that remain valid?`);
    } else if (item.type === 'credential') {
      analysis.push(`Credential dumps posted on <strong>${App.escapeHtml(item.source)}</strong> represent a direct access threat. These credentials may have been obtained through phishing campaigns, infostealer malware, database breaches, or other collection methods.`);
      analysis.push(`The danger multiplier with credential exposure is <strong>credential reuse</strong>. A single compromised password can cascade across multiple services if the user has reused it. Additionally, even "old" credentials can be weaponized if the accounts haven't been rotated since the compromise date.`);
      analysis.push(`Priority actions: Cross-reference exposed email domains with your corporate domains. Check for matches against your Active Directory / IdP. Enable MFA enforcement for any accounts that don't already have it.`);
    } else if (item.type === 'exploit') {
      analysis.push(`An exploit listing on <strong>${App.escapeHtml(item.source)}</strong> indicates that a working exploit — potentially for a zero-day or recently patched vulnerability — is available for purchase or distribution. This dramatically lowers the barrier to exploitation.`);
      analysis.push(`Exploits sold on dark web forums are typically weaponized and ready-to-use, often including bypass techniques for common security controls. The presence of an exploit listing indicates that exploitation is no longer theoretical — it is actively occurring or imminent.`);
      analysis.push(`Assess whether the targeted software/hardware is present in your environment. If so, this intelligence should be escalated to vulnerability management for emergency patching prioritization.`);
    } else if (item.type === 'ransomware') {
      analysis.push(`Ransomware intelligence from <strong>${App.escapeHtml(item.source)}</strong> provides insights into threat actor operations, including new variants, affiliate recruitment, victim targeting criteria, and operational playbooks.`);
      analysis.push(`Modern ransomware operations function as sophisticated businesses with dedicated development teams, customer support, and affiliate networks. Intelligence from these sources can reveal targeting patterns, pricing models, and operational security practices that inform defensive strategies.`);
      analysis.push(`This intelligence should be correlated with your organization's sector, geography, and technology stack to assess relevance. Ransomware actors often target specific industries and exploit specific vulnerability classes.`);
    } else {
      analysis.push(`Threat actor chatter from <strong>${App.escapeHtml(item.source)}</strong> provides raw intelligence on adversary communications, intent, and capability development. Forum discussions often precede operational activity by days to weeks.`);
      analysis.push(`Monitoring actor communications allows defenders to anticipate attacks rather than merely react to them. Key indicators include: mentions of specific targets or sectors, discussions of new techniques or tools, and recruitment activity for specialized skills.`);
      analysis.push(`This type of intelligence is most valuable when correlated with other sources — technical indicators, open-source intelligence, and internal security telemetry — to build a comprehensive threat picture.`);
    }

    // --- Risk & Impact ---
    const risks = [];
    if (item.type === 'leak' || item.type === 'credential') {
      risks.push({ title: 'Data Exposure Risk', description: 'Sensitive information may be accessible to unauthorized parties. This includes potential regulatory implications under GDPR, CCPA, HIPAA, or other applicable data protection frameworks.' });
      risks.push({ title: 'Account Takeover Risk', description: 'Exposed credentials may enable unauthorized access to corporate systems, cloud services, or third-party platforms. Credential stuffing attacks may follow.' });
      risks.push({ title: 'Reputational Impact', description: 'Public disclosure of data breaches can damage customer trust, brand reputation, and market confidence. Proactive disclosure and response can mitigate this impact.' });
    } else if (item.type === 'exploit') {
      risks.push({ title: 'Active Exploitation Risk', description: 'The availability of a working exploit dramatically reduces the skill barrier for exploitation. Expect increased scanning and exploitation attempts targeting the affected vulnerability.' });
      risks.push({ title: 'Lateral Movement Risk', description: 'Successful exploitation may enable attackers to pivot deeper into the network. Post-exploitation tools often enable credential harvesting, privilege escalation, and persistence.' });
    } else if (item.type === 'ransomware') {
      risks.push({ title: 'Operational Disruption', description: 'Ransomware incidents can halt business operations for days to weeks. Recovery costs typically exceed ransom demands by 5-10x when including downtime, remediation, and reputation damage.' });
      risks.push({ title: 'Data Extortion', description: 'Modern ransomware groups practice double-extortion: encrypting data AND threatening to publish stolen data. Even with viable backups, the data exposure component must be addressed.' });
      risks.push({ title: 'Supply Chain Propagation', description: 'Ransomware infections can propagate to partners and customers through shared network connections, compromised updates, or trusted communication channels.' });
    } else {
      risks.push({ title: 'Emerging Threat Risk', description: 'Actor chatter may indicate planned campaigns or capability development targeting your sector. Early warning enables proactive defensive measures.' });
      risks.push({ title: 'Intelligence Value', description: 'Understanding adversary intent and capability helps prioritize defensive investments and detection engineering efforts.' });
    }

    // --- Recommended Actions ---
    const actions = [];
    if (item.type === 'leak') {
      actions.push(`<strong>Verify overlap:</strong> Check if leaked data contains any organizational assets — domain names, email addresses, internal IPs, API keys, or proprietary information.`);
      actions.push(`<strong>Credential reset:</strong> Force password rotation for any accounts potentially exposed in the dump. Enforce MFA where not already active.`);
      actions.push(`<strong>Monitor for abuse:</strong> Set up alerts for login attempts from unusual locations, credential stuffing patterns, and data exfiltration indicators.`);
    } else if (item.type === 'credential') {
      actions.push(`<strong>Cross-reference identities:</strong> Compare exposed credentials against corporate identity providers (AD, Okta, Azure AD). Automate matching where possible.`);
      actions.push(`<strong>Force rotation:</strong> Immediately reset passwords for matched accounts. Revoke API keys and tokens that may be included.`);
      actions.push(`<strong>Enforce MFA:</strong> Ensure all accounts have multi-factor authentication enabled. Credential-only access should be eliminated.`);
    } else if (item.type === 'exploit') {
      actions.push(`<strong>Vulnerability assessment:</strong> Determine if the exploited software is present in your environment. Scan for affected versions.`);
      actions.push(`<strong>Emergency patching:</strong> If vulnerable, initiate emergency patching procedures. Deploy compensating controls if immediate patching is not feasible.`);
      actions.push(`<strong>Detection rules:</strong> Deploy IDS/IPS signatures and SIEM rules targeting the specific exploitation pattern.`);
    } else if (item.type === 'ransomware') {
      actions.push(`<strong>Backup validation:</strong> Verify backup integrity and test restoration procedures. Ensure backups are air-gapped or immutable.`);
      actions.push(`<strong>Endpoint hardening:</strong> Review EDR coverage and ensure behavioral detection for ransomware patterns (mass file encryption, shadow copy deletion) is active.`);
      actions.push(`<strong>Incident response prep:</strong> Update IR playbooks with specific procedures for the ransomware variant identified. Pre-stage containment procedures.`);
    } else {
      actions.push(`<strong>Monitor escalation:</strong> Track this conversation thread for follow-up activity — increased specificity of targeting or capability development.`);
      actions.push(`<strong>Correlate with telemetry:</strong> Cross-reference discussed TTPs with your SIEM/EDR alerts to identify potential overlap with ongoing activity.`);
      actions.push(`<strong>Brief stakeholders:</strong> Share relevant intelligence with SOC analysts and hunt teams to inform proactive detection efforts.`);
    }
    actions.push(`<strong>Document and archive:</strong> Record this intelligence item in your threat intelligence platform for future correlation and trend analysis.`);

    return { relevanceAssessment, tldr, analysis, risks, actions };
  },

  toggleFlag(id) {
    const item = TIP_DATA.darkwebItems.find(i => i.id === id);
    if (item) {
      item.flagged = !item.flagged;
      DataManager.save();
      this.render();
      App.toast(item.flagged ? 'Item flagged for attention' : 'Flag removed', item.flagged ? 'warning' : 'info');
    }
  },

  toggleFlagFromDetail(id) {
    const item = TIP_DATA.darkwebItems.find(i => i.id === id);
    if (item) {
      item.flagged = !item.flagged;
      DataManager.save();
      this.renderDetail();
      App.toast(item.flagged ? 'Item flagged for attention' : 'Flag removed', item.flagged ? 'warning' : 'info');
    }
  },

  openAddIntel() {
    document.getElementById('dwTitle').value = '';
    document.getElementById('dwType').value = 'leak';
    document.getElementById('dwSource').value = '';
    document.getElementById('dwSnippet').value = '';
    document.getElementById('dwRelevance').value = '75';
    document.getElementById('dwTags').value = '';
    document.getElementById('dwFlagged').checked = false;

    App.openModal('addDwIntelModal');
  },

  saveIntel() {
    const title = document.getElementById('dwTitle').value.trim();
    const snippet = document.getElementById('dwSnippet').value.trim();
    if (!title || !snippet) {
      App.toast('Title and content are required', 'error');
      return;
    }

    const item = {
      title,
      type: document.getElementById('dwType').value,
      source: document.getElementById('dwSource').value || 'Manual',
      date: new Date().toISOString().split('T')[0],
      snippet,
      relevance: parseInt(document.getElementById('dwRelevance').value) || 50,
      flagged: document.getElementById('dwFlagged').checked,
      tags: document.getElementById('dwTags').value.split(',').map(s => s.trim()).filter(Boolean)
    };

    DataManager.addDarkwebItem(item);
    App.closeModal('addDwIntelModal');
    App.toast('Intelligence added', 'success');
    this.render();
  },

  statFilter(type) {
    this.filterType = type;
    if (type === '_relevance') this.sortBy = 'relevance';

    const filterEl = document.getElementById('dwFilter');
    if (filterEl) filterEl.value = ['leak', 'credential', 'exploit', 'ransomware', 'chatter'].includes(type) ? type : 'all';
    const sortEl = document.getElementById('dwSort');
    if (sortEl) sortEl.value = this.sortBy;

    this.renderStats();
    this.renderFeed();
  },

  bindEvents() {
    const search = document.getElementById('dwSearch');
    if (search) {
      search.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderFeed();
      });
    }

    const filter = document.getElementById('dwFilter');
    if (filter) {
      filter.addEventListener('change', (e) => {
        this.filterType = e.target.value;
        this.renderFeed();
      });
    }

    const sort = document.getElementById('dwSort');
    if (sort) {
      sort.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderFeed();
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => DarkWebView.bindEvents());
