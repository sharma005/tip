# Manual "Fetch Now" Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a button to the Security Advisory Feed header that triggers `.github/workflows/fetch-intel.yml` on demand via GitHub's `workflow_dispatch` REST API, called directly from the browser using a GitHub personal access token stored in `localStorage`.

**Architecture:** A new client-only module, `js/fetch-now.js`, exposes a `FetchNow` object (same pattern as `App`/`FeedView`/`AdminView`). It manages a token stored under `localStorage['tip-gh-pat']`, POSTs to GitHub's dispatches endpoint, then polls the workflow's runs endpoint to reflect queued/running/success/failure back into a status `<span>` next to the new button. No backend, no build step — this is a static site, and everything ships as plain browser JS/HTML/CSS like every other module in `js/`.

**Tech Stack:** Vanilla JS (`fetch`, `localStorage`, `async`/`await`), no framework, no test runner (there is none in this repo — `package.json` only defines `fetch-intel`). Verification in every task below is manual: open `index.html` directly in a browser and drive it from the DevTools console, stubbing `window.fetch` to avoid needing a real GitHub token or triggering a real workflow run during development.

## Global Constraints
- Token is stored **client-side only**, in `localStorage['tip-gh-pat']` — never sent anywhere but `api.github.com`. (Spec: "Token setup")
- Repo/workflow identity is fixed: owner `sharma005`, repo `tip`, workflow file `fetch-intel.yml`, ref `main`. (Spec: "Trigger + poll flow")
- Button has no admin-mode gating — visible to all visitors. (Spec: "UI", explicit user decision)
- Button must be `disabled` for the entire trigger+poll cycle — no double-dispatch from a double-click. (Spec: "UI")
- A successful run does **not** update the page live — surface a "reload to see new items" affordance instead of trying to re-render data in place. (Spec: "Why no live in-page update on success")
- Poll up to 3 minutes, every 5 seconds, before falling back to a static "check Actions" link. (Spec: "Trigger + poll flow", step 3)
- No changes to `scripts/fetch-intel.mjs`, `lib/intel/*`, or `.github/workflows/fetch-intel.yml`. (Spec: "Out of scope")

---

### Task 1: Markup + token modal + trigger (no polling yet)

**Files:**
- Create: `js/fetch-now.js`
- Modify: `index.html:160` (button + status span in the feed header)
- Modify: `index.html:739` (new `#fetchTokenModal`)
- Modify: `index.html` (script tag, after `js/tweetfeed.js`, before `js/app.js`)

**Interfaces:**
- Consumes: `App.openModal(id)` / `App.closeModal(id)` / `App.toast(message, type)` — all defined in `js/app.js`, already used by every other modal in this codebase (e.g. `AdminView`, see `js/admin.js`).
- Produces: `FetchNow.trigger()`, `FetchNow.saveToken()`, `FetchNow.changeToken()`, `FetchNow.getToken()`, `FetchNow.setToken(token)` — Task 2 extends `FetchNow._run`'s success path but does not change these signatures.

- [ ] **Step 1: Add the button + status span to the feed header**

Modify `index.html` — the feed header's `page-meta` block currently ends at:

```html
          <span>Refresh <b>every 6h</b></span>
          <span id="feedShowing"></span>
        </div>
```

Replace with:

```html
          <span>Refresh <b>every 6h</b></span>
          <span id="feedShowing"></span>
          <button class="btn btn-ghost btn-sm" id="fetchNowBtn" onclick="FetchNow.trigger()" title="Trigger an immediate fetch via GitHub Actions, instead of waiting for the 6h schedule">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            Fetch Now
          </button>
          <button class="btn btn-ghost btn-sm" id="fetchNowTokenBtn" onclick="FetchNow.changeToken()" title="Set or change the GitHub token used to trigger fetches">Change token</button>
          <span id="fetchNowStatus" class="fetch-now-status"></span>
        </div>
```

- [ ] **Step 2: Add the token modal**

Modify `index.html` — find this exact block (the closing tags of the Admin Login Modal, immediately followed by the Toast Container):

```html
    </div>
  </div>
</div>

<!-- Toast Container -->
<div class="toast-container" id="toastContainer"></div>
```

Replace with:

```html
    </div>
  </div>
</div>

<!-- Fetch Now Token Modal -->
<div class="modal-overlay" id="fetchTokenModal">
  <div class="modal" style="max-width:460px">
    <div class="modal-header">
      <h2 style="display:flex;align-items:center;gap:10px">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" width="22" height="22"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        GitHub Token Required
      </h2>
      <button class="modal-close" onclick="App.closeModal('fetchTokenModal')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <p style="color:var(--text-secondary);font-size:13px;margin-bottom:14px">
        Fetch Now calls the GitHub Actions API directly from your browser. Paste a personal access token scoped to <code>sharma005/tip</code> with <b>Actions: Read and write</b> permission. It's stored only in this browser's local storage and sent only to <code>api.github.com</code>.
      </p>
      <div id="fetchTokenError" style="display:none;background:var(--danger-bg);color:var(--danger);padding:10px 14px;border-radius:var(--radius);font-size:13px;margin-bottom:14px;font-weight:500"></div>
      <div class="form-group">
        <label class="form-label" for="fetchTokenInput">Personal Access Token</label>
        <input type="password" class="form-input" id="fetchTokenInput" placeholder="github_pat_..." autocomplete="off" onkeydown="if(event.key==='Enter')FetchNow.saveToken()">
      </div>
      <p style="font-size:12px"><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Create a fine-grained token →</a></p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="App.closeModal('fetchTokenModal')">Cancel</button>
      <button class="btn btn-primary" onclick="FetchNow.saveToken()">Save &amp; Fetch</button>
    </div>
  </div>
</div>

<!-- Toast Container -->
<div class="toast-container" id="toastContainer"></div>
```

- [ ] **Step 3: Load the new module**

Modify `index.html` — in the script list at the bottom of the file, change:

```html
<script src="js/tweetfeed.js"></script>
<script src="js/app.js"></script>
```

to:

```html
<script src="js/tweetfeed.js"></script>
<script src="js/fetch-now.js"></script>
<script src="js/app.js"></script>
```

- [ ] **Step 4: Create `js/fetch-now.js`**

```js
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
```

- [ ] **Step 5: Verify manually**

Open `index.html` directly in a browser (double-click it or run `open index.html` on macOS — no server needed, this is a static file). Open DevTools console and run:

```js
localStorage.removeItem('tip-gh-pat');
document.getElementById('fetchNowBtn').click();
```

Expected: the `#fetchTokenModal` overlay gains class `active` and becomes visible (GitHub Token Required dialog).

With the modal open, stub `fetch` and save a token:

```js
window.fetch = () => Promise.resolve({ ok: true, status: 204 });
document.getElementById('fetchTokenInput').value = 'test-token';
FetchNow.saveToken();
```

Expected: modal closes; `localStorage.getItem('tip-gh-pat') === 'test-token'`; the status span next to the button reads `Triggered — check Actions` in green (`.fetch-now-status.success`); `document.getElementById('fetchNowBtn').disabled === false`.

Now test the invalid-token path:

```js
window.fetch = () => Promise.resolve({ ok: false, status: 401 });
FetchNow.trigger();
```

Expected: status span reads `⚠ Invalid or insufficient token — change token` in red (`.fetch-now-status.error`), button stays enabled, clicking "change token" reopens the modal.

Now test the network-failure path:

```js
window.fetch = () => Promise.reject(new Error('offline'));
FetchNow.trigger();
```

Expected: status span reads `❌ Couldn't trigger — open Actions` in red.

- [ ] **Step 6: Commit**

```bash
git add index.html js/fetch-now.js
git commit -m "feat: add manual Fetch Now trigger for the intel workflow"
```

---

### Task 2: Live polling for run status

**Files:**
- Modify: `js/fetch-now.js` (extend `_run`'s success path; add `_poll`, `_findRun`, `_sleep`, and two new constants)

**Interfaces:**
- Consumes: `FetchNow._setStatus(html, state)` / `FetchNow._setButtonEnabled(enabled)` from Task 1 (unchanged signatures).
- Produces: `FetchNow._poll(triggeredAt, token): Promise<void>` — resolves once a terminal state (success/failure) is reached or the poll deadline passes; always leaves the button re-enabled and `_polling` reset to `false` before resolving.

- [ ] **Step 1: Replace the static post-trigger message with live polling**

In `js/fetch-now.js`, find:

```js
    App.toast('Fetch triggered on GitHub Actions', 'success');
    this._setStatus(`Triggered — <a href="https://github.com/${this.OWNER}/${this.REPO}/actions/workflows/${this.WORKFLOW_FILE}" target="_blank" rel="noopener">check Actions</a>`, 'success');
    this._setButtonEnabled(true);
    this._polling = false;
  },

  _triggerFailed() {
```

Replace with:

```js
    App.toast('Fetch triggered on GitHub Actions', 'info');
    await this._poll(triggeredAt, token);
  },

  POLL_INTERVAL_MS: 5000,
  POLL_TIMEOUT_MS: 3 * 60 * 1000,

  async _poll(triggeredAt, token) {
    const triggeredMs = new Date(triggeredAt).getTime();
    const deadline = Date.now() + this.POLL_TIMEOUT_MS;

    while (Date.now() < deadline) {
      await this._sleep(this.POLL_INTERVAL_MS);

      let run = null;
      try {
        run = await this._findRun(triggeredMs, token);
      } catch (err) {
        continue; // transient poll error — keep trying until the deadline
      }

      if (!run) {
        this._setStatus('Queued on GitHub…', 'pending');
        continue;
      }
      if (run.status !== 'completed') {
        this._setStatus(run.status === 'queued' ? 'Queued on GitHub…' : 'Running…', 'pending');
        continue;
      }
      if (run.conclusion === 'success') {
        this._setStatus('✅ Done — <a href="#" onclick="location.reload();return false;">reload</a> to see new items', 'success');
      } else {
        this._setStatus(`❌ Run ${run.conclusion} — <a href="${run.html_url}" target="_blank" rel="noopener">view run</a>`, 'error');
      }
      this._setButtonEnabled(true);
      this._polling = false;
      return;
    }

    this._setStatus(`Triggered — <a href="https://github.com/${this.OWNER}/${this.REPO}/actions/workflows/${this.WORKFLOW_FILE}" target="_blank" rel="noopener">check Actions</a> (taking longer than expected)`, 'pending');
    this._setButtonEnabled(true);
    this._polling = false;
  },

  async _findRun(triggeredMs, token) {
    const res = await fetch(`https://api.github.com/repos/${this.OWNER}/${this.REPO}/actions/workflows/${this.WORKFLOW_FILE}/runs?per_page=5`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      }
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    const runs = (data.workflow_runs || [])
      // 5s tolerance for clock skew between the browser and GitHub's servers
      .filter(r => new Date(r.created_at).getTime() >= triggeredMs - 5000)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return runs[0] || null;
  },

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  _triggerFailed() {
```

- [ ] **Step 2: Verify the happy path (queued → running → success)**

Reload `index.html` in the browser (fresh page, so `_polling` resets). In DevTools console:

```js
let call = 0;
const now = new Date().toISOString();
window.fetch = (url, opts) => {
  call++;
  if (opts && opts.method === 'POST') return Promise.resolve({ ok: true, status: 204 });
  const steps = [{ status: 'queued' }, { status: 'in_progress' }, { status: 'completed', conclusion: 'success', html_url: 'https://github.com/sharma005/tip/actions/runs/1' }];
  const step = steps[Math.min(call - 2, steps.length - 1)];
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ workflow_runs: [{ created_at: now, ...step }] }) });
};
FetchNow.POLL_INTERVAL_MS = 200;
FetchNow.POLL_TIMEOUT_MS = 3000;
localStorage.setItem('tip-gh-pat', 'test-token');
FetchNow.trigger();
```

Expected: watching `document.getElementById('fetchNowStatus').textContent` over the next ~1 second, it moves through `Triggering…` → `Queued on GitHub…` → `Running…` → `✅ Done — reload to see new items`, ending with class `fetch-now-status success` and the button re-enabled.

- [ ] **Step 3: Verify the timeout fallback**

```js
window.fetch = (url, opts) => {
  if (opts && opts.method === 'POST') return Promise.resolve({ ok: true, status: 204 });
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ workflow_runs: [] }) });
};
FetchNow.POLL_INTERVAL_MS = 200;
FetchNow.POLL_TIMEOUT_MS = 1000;
FetchNow.trigger();
```

Expected: after ~1 second, status reads `Triggered — check Actions (taking longer than expected)` with class `fetch-now-status pending`, button re-enabled.

- [ ] **Step 4: Verify the run-failure path**

```js
window.fetch = (url, opts) => {
  if (opts && opts.method === 'POST') return Promise.resolve({ ok: true, status: 204 });
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ workflow_runs: [{ created_at: new Date().toISOString(), status: 'completed', conclusion: 'failure', html_url: 'https://github.com/sharma005/tip/actions/runs/2' }] }) });
};
FetchNow.POLL_INTERVAL_MS = 200;
FetchNow.POLL_TIMEOUT_MS = 3000;
FetchNow.trigger();
```

Expected: status reads `❌ Run failure — view run` (linking to the stub `html_url`) with class `fetch-now-status error`.

- [ ] **Step 5: Commit**

```bash
git add js/fetch-now.js
git commit -m "feat: poll workflow run status after triggering a manual fetch"
```

---

### Task 3: Styling

**Files:**
- Modify: `css/styles.css` (new rules for `.fetch-now-status` and its spinner; insert after the existing `@keyframes pulse` block)

**Interfaces:**
- Consumes: `.fetch-now-status` / `.fetch-now-status.pending` / `.fetch-now-status.success` / `.fetch-now-status.error` class names set by `FetchNow._setStatus` (Task 1).
- Produces: nothing consumed by later tasks — this is the last task in the plan.

- [ ] **Step 1: Add status styles**

In `css/styles.css`, find the end of the existing "Live pulse" block:

```css
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.5); }
  70% { box-shadow: 0 0 0 7px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}
```

Insert immediately after it:

```css

/* Fetch Now status */
.fetch-now-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.fetch-now-status:empty { display: none; }
.fetch-now-status a { color: inherit; text-decoration: underline; }
.fetch-now-status.pending { color: var(--text-secondary); }
.fetch-now-status.pending::before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--border-2);
  border-top-color: var(--accent);
  animation: fetchNowSpin 0.7s linear infinite;
  flex-shrink: 0;
}
.fetch-now-status.success { color: var(--success); }
.fetch-now-status.error { color: var(--danger); }
@keyframes fetchNowSpin {
  to { transform: rotate(360deg); }
}
```

- [ ] **Step 2: Verify visually in both themes**

Open `index.html` in a browser. In DevTools console, force each state and eyeball it against the header's existing `.pill-live`/`.page-meta` text for contrast and alignment:

```js
const el = document.getElementById('fetchNowStatus');
el.innerHTML = 'Queued on GitHub…'; el.className = 'fetch-now-status pending';
```

Expected: a small spinning ring appears before the text, muted gray, aligned with the other `page-meta` spans.

```js
el.innerHTML = '✅ Done — <a href="#">reload</a> to see new items'; el.className = 'fetch-now-status success';
```

Expected: green text matching the existing `.pill-live` green.

```js
el.innerHTML = '❌ Couldn\'t trigger — <a href="#">open Actions</a>'; el.className = 'fetch-now-status error';
```

Expected: red text matching `.form.. #fetchTokenError` / `.btn-danger` red used elsewhere in the app.

Toggle the theme via the existing theme switcher in the sidebar (or `App.setTheme('light')` / `App.setTheme('dark')` in the console) and re-check all three states render legibly in both themes.

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "style: add Fetch Now status indicator styles"
```

---

## Final human check (not part of automated task verification)

Everything above is verified with a stubbed `fetch` so implementation doesn't require a real GitHub token or trigger a real Actions run (which would cost Anthropic API usage and create a real commit). Before considering this feature done end-to-end, the repo owner should, at their own discretion:

1. Create a fine-grained PAT for `sharma005/tip` with Actions: Read and write.
2. Open the deployed site, click Fetch Now, paste the token.
3. Confirm a run appears at `https://github.com/sharma005/tip/actions/workflows/fetch-intel.yml` and the status span reaches "Done".

This step is **not** something the implementing agent should do autonomously — it costs real API quota and pushes a real commit to `main`.
