/* ═══════════════════════════════════════════════════════════════════
   TIP — Tweetfeed View
   Real posts from tracked Twitter/X accounts, fetched on the same
   6-hour cycle as the rest of the auto-fetch pipeline. Tracked-account
   management lives here (admin-only), same as how DarkWeb/Adversary/
   Connectors each own their admin-only add/delete UI rather than going
   through the central Admin Panel.
   ═══════════════════════════════════════════════════════════════════ */

const TweetfeedView = {
  detailId: null,
  activeAccount: 'all',
  REPO_ACCOUNTS_URL: 'https://github.com/sharma005/TIP/edit/main/js/tweetfeed-accounts.js',

  render(subRoute) {
    if (subRoute && subRoute[0] === 'detail' && subRoute[1]) {
      this.detailId = subRoute[1];
      this.renderDetail();
    } else {
      this.detailId = null;
      this.renderList();
    }
  },

  showListUI(show) {
    const el = document.getElementById('tweetfeedHeader');
    if (el) el.style.display = show ? '' : 'none';
  },

  getKnownAccounts() {
    return [...TIP_DATA.tweetfeedItems.reduce((set, t) => set.add(t.username), new Set())];
  },

  /* ═══════════════════════════════════════════════════════════════════
     LIST VIEW
     ═══════════════════════════════════════════════════════════════════ */
  renderList() {
    this.showListUI(true);
    const container = document.getElementById('tweetfeedContent');
    if (!container) return;

    const accounts = this.getKnownAccounts();
    const items = TIP_DATA.tweetfeedItems
      .filter(t => this.activeAccount === 'all' || t.username === this.activeAccount)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const filterHtml = accounts.length > 1 ? `
      <div class="controls-bar" id="tweetfeedControls">
        <select class="control-select" id="tweetfeedAccountFilter" onchange="TweetfeedView.setAccountFilter(this.value)">
          <option value="all" ${this.activeAccount === 'all' ? 'selected' : ''}>All accounts</option>
          ${accounts.map(a => `<option value="${App.escapeHtml(a)}" ${this.activeAccount === a ? 'selected' : ''}>@${App.escapeHtml(a)}</option>`).join('')}
        </select>
      </div>` : '';

    container.innerHTML = `
      <div class="admin-actions admin-only">
        <button class="btn btn-primary btn-sm" onclick="TweetfeedView.openAccountsModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6"/></svg>
          Manage Accounts
        </button>
      </div>
      ${filterHtml}
      ${items.length ? `<section class="feed-list">${items.map(item => this.renderCard(item)).join('')}</section>` : `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          No posts yet. Claude will research new activity from tracked accounts on the next fetch cycle.
        </div>`}
    `;
  },

  setAccountFilter(value) {
    this.activeAccount = value;
    this.renderList();
  },

  renderCard(item) {
    return `<article class="feed-card" onclick="window.location.hash='tweetfeed/detail/${item.id}'" style="cursor:pointer">
      <div class="card-top">
        <span class="badge" style="font-size:11px;padding:4px 12px;color:var(--accent);background:var(--accent-bg);border:1px solid var(--accent-border)">@${App.escapeHtml(item.username)}</span>
        <span class="sev-badge sev-${item.severity.toLowerCase()}">${item.severity}</span>
        ${App.isFreshFetch(item, TIP_DATA.tweetfeedItems) ? '<span class="new-badge">New</span>' : ''}
        <span class="date-tag" style="margin-left:auto">${App.formatDate(item.date)}</span>
      </div>
      <p class="card-summary">${App.escapeHtml(item.text)}</p>
      <div class="card-footer">
        ${item.tags.map(t => `<span class="hash-tag">#${App.escapeHtml(t)}</span>`).join('')}
        <span class="source-link"><a href="${App.escapeHtml(App.safeUrl(item.url))}" target="_blank" rel="noopener" onclick="event.stopPropagation()">View on X →</a></span>
      </div>
      <div class="pending-actions admin-only" style="margin-top:10px" onclick="event.stopPropagation()">
        <button class="btn btn-danger btn-sm" onclick="TweetfeedView.deleteTweet('${item.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>
          Delete
        </button>
      </div>
    </article>`;
  },

  /* ═══════════════════════════════════════════════════════════════════
     DETAIL VIEW — full article generated from the compact stored record,
     same approach as FeedView/DarkWebView/ConnectorsView.
     ═══════════════════════════════════════════════════════════════════ */
  generateTweetDetailContent(item) {
    const tldr = `${item.summary} Posted by @${item.username} on X; treat as ${item.severity.toLowerCase()}-priority pending independent validation.`;

    const context = [
      `This is drawn from @${item.username}'s own post (quoted above), found via web search — not a third-party summary of their activity.`,
      'Treat anything the post reports (infrastructure, indicators, claims) as a lead rather than a confirmed finding until corroborated through your own tooling or a second source.'
    ];

    const actions = [
      'Cross-reference anything mentioned in the post (domains, IPs, hashes) against your own telemetry (SIEM, EDR, proxy/DNS logs).',
      `Check @${item.username} on X directly for a follow-up thread, replies, or corrections posted after this snapshot.`
    ];
    if (item.severity === 'Critical' || item.severity === 'High') {
      actions.push(`Given the ${item.severity.toLowerCase()} severity, consider flagging this to your IR/threat-intel team even before independent validation completes.`);
    } else {
      actions.push('Monitor for corroborating reporting before acting on this alone — treat it as informational.');
    }

    return { tldr, context, actions };
  },

  // Cosmetic, client-side-only heuristic scan of the post text for
  // IOC-shaped tokens (handles simple defanging like domain[.]tld) — never
  // stored, never trusted as verified, purely a reading aid in the detail
  // view. Not part of the schema/sanitizer trust boundary.
  extractMentions(text) {
    const normalized = text.replace(/\[\.\]|\(\.\)/g, '.');
    const mentions = [];
    const seen = new Set();
    const add = (type, value) => {
      const key = `${type}:${value.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      mentions.push({ type, value });
    };

    (normalized.match(/CVE-\d{4}-\d{4,7}/gi) || []).forEach(v => add('CVE', v.toUpperCase()));
    (normalized.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || []).forEach(v => add('IP', v));
    (normalized.match(/\b[a-f0-9]{64}\b|\b[a-f0-9]{40}\b|\b[a-f0-9]{32}\b/gi) || []).forEach(v => add('Hash', v.toLowerCase()));
    (normalized.match(/\b[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?){1,4}\.(?:com|net|org|io|ru|cn|top|xyz|info|co|dev|app)\b/gi) || []).forEach(v => add('Domain', v.toLowerCase()));

    return mentions.slice(0, 10);
  },

  renderDetail() {
    this.showListUI(false);
    const container = document.getElementById('tweetfeedContent');
    if (!container) return;

    const item = TIP_DATA.tweetfeedItems.find(t => t.id === this.detailId);
    if (!item) {
      container.innerHTML = `<div class="empty-state">Post not found.</div>`;
      return;
    }

    const detail = this.generateTweetDetailContent(item);
    const mentions = this.extractMentions(item.text);

    container.innerHTML = `
      <div class="detail-article fade-in">
        <div class="back-btn" onclick="window.location.hash='tweetfeed'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Tweetfeed
        </div>

        <article class="article-container">
          <header class="article-header">
            <div class="article-badges">
              <span class="badge" style="font-size:11px;padding:4px 12px;color:var(--accent);background:var(--accent-bg);border:1px solid var(--accent-border)">@${App.escapeHtml(item.username)}</span>
              <span class="sev-badge sev-${item.severity.toLowerCase()}" style="font-size:11px;padding:4px 10px">${item.severity}</span>
            </div>

            <h1 class="article-title">${App.escapeHtml(item.summary)}</h1>

            <div class="article-meta">
              <span class="meta-item"><span class="meta-label">Posted:</span> ${App.formatDate(item.date)}</span>
              <span class="meta-item"><span class="meta-label">Account:</span> <span style="color:var(--accent)">@${App.escapeHtml(item.username)}</span></span>
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
            <h2 class="article-h2"><span class="section-num">1.</span> Original Post</h2>
            <blockquote class="article-tldr" style="background:var(--surface);border-color:var(--border);color:var(--text)">${App.escapeHtml(item.text)}</blockquote>
          </div>

          <hr class="article-divider">

          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">2.</span> Context</h2>
            ${detail.context.map(p => `<p class="article-p">${App.escapeHtml(p)}</p>`).join('')}
          </div>

          <hr class="article-divider">

          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">3.</span> Mentioned in Post</h2>
            ${mentions.length ? `
            <div class="ioc-table">
              <div class="ioc-header">
                <span>Type</span>
                <span>Value</span>
                <span>Context</span>
              </div>
              ${mentions.map(m => `
                <div class="ioc-row">
                  <span class="ioc-type">${App.escapeHtml(m.type)}</span>
                  <span class="ioc-value">${App.escapeHtml(m.value)}</span>
                  <span class="ioc-context">Unverified — extracted from post text</span>
                </div>
              `).join('')}
            </div>` : '<p class="article-p" style="color:var(--text-muted)">No IPs, hashes, domains, or CVE IDs detected in the post text.</p>'}
          </div>

          <hr class="article-divider">

          <div class="article-section">
            <h2 class="article-h2"><span class="section-num">4.</span> Recommended Actions</h2>
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
            <button class="btn btn-danger admin-only" onclick="TweetfeedView.deleteTweet('${item.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>
              Delete Post
            </button>
          </div>

          <div class="article-section" style="margin-top:28px">
            <div class="article-source-box">
              <div style="font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px">Source Post</div>
              <a href="${App.escapeHtml(App.safeUrl(item.url))}" target="_blank" rel="noopener" class="article-source-link">
                <span>@${App.escapeHtml(item.username)} on X</span>
                <span style="color:var(--accent)">View original post →</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    `;
  },

  deleteTweet(id) {
    if (!confirm('Delete this post?')) return;
    if (DataManager.deleteTweetfeedItem(id)) {
      App.toast('Post deleted', 'warning');
      if (this.detailId === id) {
        window.location.hash = 'tweetfeed';
      } else {
        this.renderList();
      }
    }
  },

  /* ═══════════════════════════════════════════════════════════════════
     ACCOUNT MANAGEMENT (admin-only) — localStorage is instant/local, like
     every other admin mutation in this app; js/tweetfeed-accounts.js is
     the copy the scheduled cron actually reads, since there's no backend
     to receive a write straight from the browser. The modal below walks
     the admin through committing that file on GitHub by hand.
     ═══════════════════════════════════════════════════════════════════ */
  openAccountsModal() {
    this.renderAccountsModalBody();
    App.openModal('tweetfeedAccountsModal');
  },

  buildAccountsFileContent(accounts) {
    return `/* ═══════════════════════════════════════════════════════════════════
   TIP — Tracked Twitter/X accounts for the Tweetfeed connector.

   Source of truth for tweetfeed research sessions — this is a static
   site with no backend, so a Claude cowork session can only see what's
   committed here, not any admin's browser localStorage. Manage via the
   Tweetfeed view's "Manage Accounts" modal: changes there update your
   browser immediately and walk you through copying the updated array here
   and committing it on GitHub so the next research session picks it up.
   ═══════════════════════════════════════════════════════════════════ */
const TWEETFEED_ACCOUNTS = ${JSON.stringify(accounts)};
`;
  },

  renderAccountsModalBody() {
    const body = document.getElementById('tweetfeedAccountsModalBody');
    if (!body) return;
    const accounts = DataManager.getTwitterAccounts();
    const fileContent = this.buildAccountsFileContent(accounts);

    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Tracked Accounts</label>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:4px">
          ${accounts.length ? accounts.map(a => `
            <span class="hash-tag" style="display:inline-flex;align-items:center;gap:6px">
              @${App.escapeHtml(a)}
              <button type="button" onclick="TweetfeedView.removeAccount('${App.escapeHtml(a)}')" title="Remove" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:14px;line-height:1;padding:0">×</button>
            </span>
          `).join('') : '<span style="color:var(--text-muted);font-size:13px">No accounts tracked yet.</span>'}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Add Account</label>
        <div style="display:flex;gap:8px">
          <input type="text" class="form-input" id="tweetfeedNewAccount" placeholder="username (no @)" onkeydown="if(event.key==='Enter'){event.preventDefault();TweetfeedView.addAccount();}">
          <button class="btn btn-primary btn-sm" onclick="TweetfeedView.addAccount()">Add</button>
        </div>
      </div>

      <hr class="article-divider">

      <div class="form-group">
        <label class="form-label">Sync to GitHub</label>
        <p style="font-size:12px;color:var(--text-muted);margin:0 0 10px">
          Changes above update this browser immediately. The scheduled fetch (GitHub Actions) only sees accounts committed to <code>js/tweetfeed-accounts.js</code> — copy the contents below, open the file on GitHub, replace its contents, and commit to <code>main</code>.
        </p>
        <textarea class="form-textarea" id="tweetfeedAccountsFile" rows="5" readonly style="font-family:var(--font-mono);font-size:12px" onclick="this.select()">${App.escapeHtml(fileContent)}</textarea>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-ghost btn-sm" onclick="TweetfeedView.copyAccountsFileContent()">Copy File Contents</button>
          <button class="btn btn-primary btn-sm" onclick="TweetfeedView.openAccountsFileOnGithub()">Open js/tweetfeed-accounts.js on GitHub →</button>
        </div>
      </div>
    `;
  },

  addAccount() {
    const input = document.getElementById('tweetfeedNewAccount');
    if (!input) return;
    if (!DataManager.addTwitterAccount(input.value)) {
      App.toast('Enter a valid, non-duplicate X/Twitter username (letters, numbers, underscore, up to 15 chars)', 'error');
      return;
    }
    input.value = '';
    App.toast('Account added locally — sync to GitHub to apply it to the scheduled fetch', 'success');
    this.renderAccountsModalBody();
    this.renderList();
  },

  removeAccount(username) {
    if (!DataManager.removeTwitterAccount(username)) return;
    App.toast('Account removed locally — sync to GitHub to apply it to the scheduled fetch', 'warning');
    this.renderAccountsModalBody();
    this.renderList();
  },

  copyAccountsFileContent() {
    const textarea = document.getElementById('tweetfeedAccountsFile');
    if (!textarea) return;
    navigator.clipboard.writeText(textarea.value)
      .then(() => App.toast('File contents copied', 'success'))
      .catch(() => App.toast('Copy failed — select the text manually', 'error'));
  },

  openAccountsFileOnGithub() {
    window.open(this.REPO_ACCOUNTS_URL, '_blank', 'noopener');
  }
};
