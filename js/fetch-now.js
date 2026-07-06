/* ═══════════════════════════════════════════════════════════════════
   TIP — Manual Fetch Now
   Lets any visitor trigger .github/workflows/fetch-intel.yml on demand
   (workflow_dispatch) instead of waiting for its 6h schedule, using a
   GitHub personal access token stored client-side only (localStorage).
   See docs/superpowers/specs/2026-07-06-fetch-now-button-design.md.
   ═══════════════════════════════════════════════════════════════════ */
const FetchNow = {
  OWNER: 'sharma005',
  REPO: 'tip',
  WORKFLOW_FILE: 'fetch-intel.yml',
  REF: 'main',
  TOKEN_KEY: 'tip-gh-pat',

  _polling: false,

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  },

  changeToken() {
    App.openModal('fetchTokenModal');
  },

  saveToken() {
    const input = document.getElementById('fetchTokenInput');
    const errorEl = document.getElementById('fetchTokenError');
    const token = input.value.trim();
    if (!token) {
      errorEl.textContent = 'Please paste a token.';
      errorEl.style.display = 'block';
      return;
    }
    this.setToken(token);
    errorEl.style.display = 'none';
    input.value = '';
    App.closeModal('fetchTokenModal');
    this._run(token);
  },

  trigger() {
    if (this._polling) return;
    const token = this.getToken();
    if (!token) {
      App.openModal('fetchTokenModal');
      return;
    }
    this._run(token);
  },

  async _run(token) {
    this._polling = true;
    this._setButtonEnabled(false);
    this._setStatus('Triggering…', 'pending');
    const triggeredAt = new Date().toISOString();

    let res;
    try {
      res = await fetch(`https://api.github.com/repos/${this.OWNER}/${this.REPO}/actions/workflows/${this.WORKFLOW_FILE}/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ref: this.REF })
      });
    } catch (err) {
      this._triggerFailed();
      return;
    }

    if (res.status === 401 || res.status === 403) {
      this._setStatus('⚠ Invalid or insufficient token — <a href="#" onclick="FetchNow.changeToken();return false;">change token</a>', 'error');
      this._setButtonEnabled(true);
      this._polling = false;
      return;
    }
    if (!res.ok) {
      this._triggerFailed();
      return;
    }

    App.toast('Fetch triggered on GitHub Actions', 'success');
    this._setStatus(`Triggered — <a href="https://github.com/${this.OWNER}/${this.REPO}/actions/workflows/${this.WORKFLOW_FILE}" target="_blank" rel="noopener">check Actions</a>`, 'success');
    this._setButtonEnabled(true);
    this._polling = false;
  },

  _triggerFailed() {
    this._setStatus(`❌ Couldn't trigger — <a href="https://github.com/${this.OWNER}/${this.REPO}/actions/workflows/${this.WORKFLOW_FILE}" target="_blank" rel="noopener">open Actions</a>`, 'error');
    this._setButtonEnabled(true);
    this._polling = false;
  },

  _setStatus(html, state) {
    const el = document.getElementById('fetchNowStatus');
    if (!el) return;
    el.innerHTML = html;
    el.className = `fetch-now-status ${state}`;
  },

  _setButtonEnabled(enabled) {
    const btn = document.getElementById('fetchNowBtn');
    if (btn) btn.disabled = !enabled;
  }
};
