# Date Range Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a From/To date-range filter to the controls bar of every list view (Feed, Adversaries, Dark Web, Hunt Lab Hypotheses, Tweetfeed, Connectors per-connector detail, Snowbit).

**Architecture:** TIP is a static HTML/CSS/vanilla-JS app (no build step, no test framework, no bundler — see `package.json`, whose only script is an unrelated data-fetch cron job). Each view is a plain JS object (`FeedView`, `AdversaryView`, etc.) holding filter state as own properties and re-rendering itself via template-string `innerHTML` assignment on state change. This plan follows that exact pattern: add `dateFrom`/`dateTo` string properties (`''` = unset, else `YYYY-MM-DD`) to each view object, filter the item array with simple string comparisons (dates in this codebase are already ISO `YYYY-MM-DD` strings, so `>=`/`<=` on the string is correct and matches how sorting already works, e.g. `b.date.localeCompare(a.date)`), and render two `<input type="date">` elements styled to match the existing `.control-select` dropdowns.

**Tech Stack:** Vanilla JS, no framework, no test runner.

## Global Constraints

- Dates in `TIP_DATA` are `YYYY-MM-DD` strings (per `lib/intel/schemas.mjs`) — lexical string comparison is valid for range checks, no `Date` parsing needed.
- Empty date input (`''`) means "no bound on that side" — never filter when both are empty (default/current behavior must be unchanged for existing users of the app).
- Range is inclusive on both ends: `from <= item.date <= to`.
- Reuse the existing `.control-select` class on the new date inputs (add a second class `date-input` only for the `color-scheme` override) — do not introduce a new visual style.
- No automated test suite exists in this repo. Verification for every task is: (a) `node --check <file>.js` to catch syntax errors, since these files run unmodified in the browser with no transpilation, and (b) a manual browser check (steps given per task) — call this out explicitly, do not claim automated test coverage that doesn't exist.

---

## File Map

| File | Change |
|---|---|
| `css/styles.css` | New `.date-range-group` / `.control-select.date-input` rules |
| `index.html` | New date inputs in `#feedControls`, Adversaries controls-bar, `#dwControls` |
| `js/feed.js` | `dateFrom`/`dateTo` state, filter in `renderFeed()`, listeners in `bindEvents()` |
| `js/adversary.js` | `dateFrom`/`dateTo` state, filter in `renderCollection()`, listeners in `bindEvents()` |
| `js/darkweb.js` | `dateFrom`/`dateTo` state, filter in `renderFeed()`, listeners in `bindEvents()` |
| `js/huntlab.js` | `dateFrom`/`dateTo` state, filter + inline inputs in `renderHypothesesTab()` |
| `js/tweetfeed.js` | `dateFrom`/`dateTo` state, filter + inline inputs in `renderList()`, controls-bar always renders now |
| `js/connectors.js` | `dateFrom`/`dateTo` state, new controls-bar + filter in `renderDetail()` |
| `js/snowbit.js` | `dateFrom`/`dateTo` state, new controls-bar + filter in `renderList()` |

---

### Task 1: Shared CSS for date-range inputs

**Files:**
- Modify: `css/styles.css:510-523` (right after the existing `.control-select` / `.control-select:focus` rules)

- [ ] **Step 1: Add the CSS rules**

Insert immediately after the `.control-select:focus { ... }` block (currently ending at line 523, right before `.results-count`):

```css
.date-range-group {
  display: flex;
  align-items: center;
  gap: 6px;
}
.date-range-group span {
  color: var(--text-muted);
  font-size: 12px;
}
.control-select.date-input {
  color-scheme: dark;
  font-family: inherit;
}
[data-theme="light"] .control-select.date-input {
  color-scheme: light;
}
```

- [ ] **Step 2: Verify no CSS syntax errors**

Run: `node -e "require('fs').readFileSync('css/styles.css','utf8')" && echo OK`
Expected: `OK` (this just confirms the file is still readable/UTF-8; open the file afterward and visually confirm the braces are balanced around your insertion).

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "Add date-range filter input styles"
```

---

### Task 2: Feed date-range filter

**Files:**
- Modify: `index.html:172-176` (inside `#feedControls`)
- Modify: `js/feed.js:6-10` (state), `js/feed.js` inside `renderFeed()` around line 61, `js/feed.js` inside `bindEvents()` around line 875

**Interfaces:**
- Produces: `FeedView.dateFrom` (string, default `''`), `FeedView.dateTo` (string, default `''`)

- [ ] **Step 1: Add the date inputs to the controls bar**

In `index.html`, the `#feedControls` block currently reads:

```html
        <select class="control-select" id="feedSort" aria-label="Sort feed">
          <option value="date">Newest first</option>
          <option value="cvss">Highest CVSS</option>
          <option value="sev">Severity</option>
        </select>
      </div>
```

Change to:

```html
        <select class="control-select" id="feedSort" aria-label="Sort feed">
          <option value="date">Newest first</option>
          <option value="cvss">Highest CVSS</option>
          <option value="sev">Severity</option>
        </select>
        <div class="date-range-group">
          <input type="date" class="control-select date-input" id="feedDateFrom" aria-label="Filter from date">
          <span>–</span>
          <input type="date" class="control-select date-input" id="feedDateTo" aria-label="Filter to date">
        </div>
      </div>
```

- [ ] **Step 2: Add state fields**

In `js/feed.js`, the `FeedView` object currently starts:

```javascript
const FeedView = {
  activeCat: 'all',
  query: '',
  sortBy: 'date',
  detailId: null,
```

Change to:

```javascript
const FeedView = {
  activeCat: 'all',
  query: '',
  sortBy: 'date',
  dateFrom: '',
  dateTo: '',
  detailId: null,
```

- [ ] **Step 3: Apply the filter in `renderFeed()`**

Find this block (currently around line 55-61):

```javascript
    if (this.query) {
      const q = this.query.toLowerCase();
      items = items.filter(i =>
        (i.title + ' ' + i.summary + ' ' + (i.cve || '') + ' ' + (i.actor || '') +
          ' ' + i.tags.join(' ') + ' ' + i.source).toLowerCase().includes(q)
      );
    }
```

Add immediately after it:

```javascript
    if (this.dateFrom) {
      items = items.filter(i => i.date >= this.dateFrom);
    }
    if (this.dateTo) {
      items = items.filter(i => i.date <= this.dateTo);
    }
```

- [ ] **Step 4: Wire up the inputs in `bindEvents()`**

Find:

```javascript
    const sortSelect = document.getElementById('feedSort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderFeed();
      });
    }
  }
};
```

Change to:

```javascript
    const sortSelect = document.getElementById('feedSort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderFeed();
      });
    }

    const dateFrom = document.getElementById('feedDateFrom');
    if (dateFrom) {
      dateFrom.addEventListener('change', (e) => {
        this.dateFrom = e.target.value;
        this.renderFeed();
      });
    }

    const dateTo = document.getElementById('feedDateTo');
    if (dateTo) {
      dateTo.addEventListener('change', (e) => {
        this.dateTo = e.target.value;
        this.renderFeed();
      });
    }
  }
};
```

- [ ] **Step 5: Verify syntax**

Run: `node --check js/feed.js`
Expected: no output (exit code 0)

- [ ] **Step 6: Manual browser verification**

Serve the repo (`python3 -m http.server 8000` from the repo root) and open `http://localhost:8000/`. On the Feed view:
- Confirm two new date inputs appear next to the sort dropdown.
- Set "From" to a date after some advisories' dates and confirm the list shrinks to only newer items; confirm `#feedCount` text updates.
- Set "To" to a date before today and confirm older-than-that-date items disappear.
- Clear both dates and confirm the full list returns.

- [ ] **Step 7: Commit**

```bash
git add index.html js/feed.js
git commit -m "Add date-range filter to Feed view"
```

---

### Task 3: Adversaries date-range filter

**Files:**
- Modify: `index.html:265-270` (Adversaries controls-bar)
- Modify: `js/adversary.js:6-9` (state), inside `renderCollection()` around line 30, inside `bindEvents()` around line 250

**Interfaces:**
- Produces: `AdversaryView.dateFrom` (string, default `''`), `AdversaryView.dateTo` (string, default `''`)
- Filters on `a.lastSeen`, which is not present in `ADVERSARY_SCHEMA` (only seed data has it) — guard with `a.lastSeen &&` so AI-ingested adversaries without the field are simply excluded from range-filtered results rather than throwing.

- [ ] **Step 1: Add the date inputs**

In `index.html`, find:

```html
        <select class="control-select" id="advFilter" aria-label="Filter by adversary type">
          <option value="all">All Types</option>
          <option value="apt">APT</option>
          <option value="criminal">Criminal</option>
          <option value="hacktivist">Hacktivist</option>
        </select>
        <button class="btn btn-primary btn-sm admin-only" onclick="AdversaryView.openIngestForm()">
```

Change to:

```html
        <select class="control-select" id="advFilter" aria-label="Filter by adversary type">
          <option value="all">All Types</option>
          <option value="apt">APT</option>
          <option value="criminal">Criminal</option>
          <option value="hacktivist">Hacktivist</option>
        </select>
        <div class="date-range-group">
          <input type="date" class="control-select date-input" id="advDateFrom" aria-label="Filter from last-seen date">
          <span>–</span>
          <input type="date" class="control-select date-input" id="advDateTo" aria-label="Filter to last-seen date">
        </div>
        <button class="btn btn-primary btn-sm admin-only" onclick="AdversaryView.openIngestForm()">
```

- [ ] **Step 2: Add state fields**

In `js/adversary.js`, change:

```javascript
const AdversaryView = {
  searchQuery: '',
  filterType: 'all',
  detailId: null,
```

to:

```javascript
const AdversaryView = {
  searchQuery: '',
  filterType: 'all',
  dateFrom: '',
  dateTo: '',
  detailId: null,
```

- [ ] **Step 3: Apply the filter in `renderCollection()`**

Find:

```javascript
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      adversaries = adversaries.filter(a =>
        (a.name + ' ' + a.aliases.join(' ') + ' ' + a.origin + ' ' + a.sectors.join(' ')).toLowerCase().includes(q)
      );
    }
```

Add immediately after:

```javascript
    if (this.dateFrom) {
      adversaries = adversaries.filter(a => a.lastSeen && a.lastSeen >= this.dateFrom);
    }
    if (this.dateTo) {
      adversaries = adversaries.filter(a => a.lastSeen && a.lastSeen <= this.dateTo);
    }
```

- [ ] **Step 4: Wire up the inputs in `bindEvents()`**

Find:

```javascript
    const filter = document.getElementById('advFilter');
    if (filter) {
      filter.addEventListener('change', (e) => {
        this.filterType = e.target.value;
        this.renderCollection();
      });
    }
  }
};
```

Change to:

```javascript
    const filter = document.getElementById('advFilter');
    if (filter) {
      filter.addEventListener('change', (e) => {
        this.filterType = e.target.value;
        this.renderCollection();
      });
    }

    const dateFrom = document.getElementById('advDateFrom');
    if (dateFrom) {
      dateFrom.addEventListener('change', (e) => {
        this.dateFrom = e.target.value;
        this.renderCollection();
      });
    }

    const dateTo = document.getElementById('advDateTo');
    if (dateTo) {
      dateTo.addEventListener('change', (e) => {
        this.dateTo = e.target.value;
        this.renderCollection();
      });
    }
  }
};
```

- [ ] **Step 5: Verify syntax**

Run: `node --check js/adversary.js`
Expected: no output (exit code 0)

- [ ] **Step 6: Manual browser verification**

On the Adversaries view: confirm the date inputs appear before the "Ingest Adversary" button; set a From date later than some adversaries' `lastSeen` and confirm those adversaries disappear from the grid; clear and confirm they return.

- [ ] **Step 7: Commit**

```bash
git add index.html js/adversary.js
git commit -m "Add date-range filter to Adversaries view"
```

---

### Task 4: Dark Web date-range filter

**Files:**
- Modify: `index.html:323-335` (`#dwControls`)
- Modify: `js/darkweb.js:6-10` (state), inside `renderFeed()` around line 88, inside `bindEvents()` around line 496

**Interfaces:**
- Produces: `DarkWebView.dateFrom` (string, default `''`), `DarkWebView.dateTo` (string, default `''`)

- [ ] **Step 1: Add the date inputs**

In `index.html`, find:

```html
        <select class="control-select" id="dwSort" aria-label="Sort dark web intel">
          <option value="date">Newest</option>
          <option value="relevance">Relevance</option>
          <option value="flagged">Flagged first</option>
        </select>
      </div>
```

Change to:

```html
        <select class="control-select" id="dwSort" aria-label="Sort dark web intel">
          <option value="date">Newest</option>
          <option value="relevance">Relevance</option>
          <option value="flagged">Flagged first</option>
        </select>
        <div class="date-range-group">
          <input type="date" class="control-select date-input" id="dwDateFrom" aria-label="Filter from date">
          <span>–</span>
          <input type="date" class="control-select date-input" id="dwDateTo" aria-label="Filter to date">
        </div>
      </div>
```

- [ ] **Step 2: Add state fields**

In `js/darkweb.js`, change:

```javascript
const DarkWebView = {
  searchQuery: '',
  filterType: 'all',
  sortBy: 'date',
  detailId: null,
```

to:

```javascript
const DarkWebView = {
  searchQuery: '',
  filterType: 'all',
  sortBy: 'date',
  dateFrom: '',
  dateTo: '',
  detailId: null,
```

- [ ] **Step 3: Apply the filter in `renderFeed()`**

Find:

```javascript
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(i =>
        (i.title + ' ' + i.snippet + ' ' + i.source + ' ' + i.tags.join(' ')).toLowerCase().includes(q)
      );
    }
```

Add immediately after:

```javascript
    if (this.dateFrom) {
      items = items.filter(i => i.date >= this.dateFrom);
    }
    if (this.dateTo) {
      items = items.filter(i => i.date <= this.dateTo);
    }
```

- [ ] **Step 4: Wire up the inputs in `bindEvents()`**

Find:

```javascript
    const sort = document.getElementById('dwSort');
    if (sort) {
      sort.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderFeed();
      });
    }
  }
};
```

Change to:

```javascript
    const sort = document.getElementById('dwSort');
    if (sort) {
      sort.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderFeed();
      });
    }

    const dateFrom = document.getElementById('dwDateFrom');
    if (dateFrom) {
      dateFrom.addEventListener('change', (e) => {
        this.dateFrom = e.target.value;
        this.renderFeed();
      });
    }

    const dateTo = document.getElementById('dwDateTo');
    if (dateTo) {
      dateTo.addEventListener('change', (e) => {
        this.dateTo = e.target.value;
        this.renderFeed();
      });
    }
  }
};
```

- [ ] **Step 5: Verify syntax**

Run: `node --check js/darkweb.js`
Expected: no output (exit code 0)

- [ ] **Step 6: Manual browser verification**

On the Dark Web Intelligence view: confirm the date inputs appear after the sort dropdown; apply a range that excludes some items and confirm `#dwCount` and the list update; clear and confirm the full list returns; confirm the stat tiles above (Total Intel, Flagged, etc.) still reflect unfiltered totals (those come from `renderStats()`, which is intentionally unaffected by the date filter — this is existing behavior, since `renderStats()` already ignores `searchQuery` too).

- [ ] **Step 7: Commit**

```bash
git add index.html js/darkweb.js
git commit -m "Add date-range filter to Dark Web Intelligence view"
```

---

### Task 5: Hunt Lab Hypotheses date-range filter

**Files:**
- Modify: `js/huntlab.js:6-9` (state), `js/huntlab.js` inside `renderHypothesesTab()` around lines 58-63 and 91-97

**Interfaces:**
- Produces: `HuntLabView.dateFrom` (string, default `''`), `HuntLabView.dateTo` (string, default `''`)
- Filters on `h.createdAt`, stamped by `DataManager.addHypothesis` (not part of `HYPOTHESIS_SCHEMA`, but always present on stored records, same as the existing `App.formatDate(hypo.createdAt)` usage a few lines below in `renderHypothesisCard`).

This view is fully client-rendered (no `bindEvents()` — the existing status `<select>` uses an inline `onchange`), so the new inputs follow that same inline pattern.

- [ ] **Step 1: Add state fields**

In `js/huntlab.js`, change:

```javascript
const HuntLabView = {
  activeTab: 'hypotheses',
  searchQuery: '',
  filterStatus: 'all',
```

to:

```javascript
const HuntLabView = {
  activeTab: 'hypotheses',
  searchQuery: '',
  filterStatus: 'all',
  dateFrom: '',
  dateTo: '',
```

- [ ] **Step 2: Apply the filter in `renderHypothesesTab()`**

Find:

```javascript
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      hypotheses = hypotheses.filter(h =>
        (h.title + ' ' + h.description + ' ' + h.mitreTactic + ' ' + h.mitreTechnique).toLowerCase().includes(q)
      );
    }
```

Add immediately after:

```javascript
    if (this.dateFrom) {
      hypotheses = hypotheses.filter(h => h.createdAt >= this.dateFrom);
    }
    if (this.dateTo) {
      hypotheses = hypotheses.filter(h => h.createdAt <= this.dateTo);
    }
```

- [ ] **Step 3: Add the inline date inputs to the controls bar**

Find:

```javascript
        <select class="control-select" onchange="HuntLabView.filterStatus=this.value;HuntLabView.renderMain()">
          <option value="all" ${this.filterStatus === 'all' ? 'selected' : ''}>All Status</option>
          <option value="draft" ${this.filterStatus === 'draft' ? 'selected' : ''}>Draft</option>
          <option value="active" ${this.filterStatus === 'active' ? 'selected' : ''}>Active</option>
          <option value="validated" ${this.filterStatus === 'validated' ? 'selected' : ''}>Validated</option>
          <option value="archived" ${this.filterStatus === 'archived' ? 'selected' : ''}>Archived</option>
        </select>
      </div>
```

Change to:

```javascript
        <select class="control-select" onchange="HuntLabView.filterStatus=this.value;HuntLabView.renderMain()">
          <option value="all" ${this.filterStatus === 'all' ? 'selected' : ''}>All Status</option>
          <option value="draft" ${this.filterStatus === 'draft' ? 'selected' : ''}>Draft</option>
          <option value="active" ${this.filterStatus === 'active' ? 'selected' : ''}>Active</option>
          <option value="validated" ${this.filterStatus === 'validated' ? 'selected' : ''}>Validated</option>
          <option value="archived" ${this.filterStatus === 'archived' ? 'selected' : ''}>Archived</option>
        </select>
        <div class="date-range-group">
          <input type="date" class="control-select date-input" value="${this.dateFrom}" onchange="HuntLabView.dateFrom=this.value;HuntLabView.renderMain()" aria-label="Filter from date">
          <span>–</span>
          <input type="date" class="control-select date-input" value="${this.dateTo}" onchange="HuntLabView.dateTo=this.value;HuntLabView.renderMain()" aria-label="Filter to date">
        </div>
      </div>
```

- [ ] **Step 4: Verify syntax**

Run: `node --check js/huntlab.js`
Expected: no output (exit code 0)

- [ ] **Step 5: Manual browser verification**

On Hunt Lab → Hypothesis Repository tab: confirm the two date inputs render after the status dropdown; set a From/To range and confirm the hypothesis list and count update; confirm switching to the "DataPrime Queries" or "Query Templates" tab and back preserves your chosen dates (state lives on `HuntLabView`, not reset by `switchTab`).

- [ ] **Step 6: Commit**

```bash
git add js/huntlab.js
git commit -m "Add date-range filter to Hunt Lab Hypothesis Repository"
```

---

### Task 6: Tweetfeed date-range filter

**Files:**
- Modify: `js/tweetfeed.js:10-13` (state), `js/tweetfeed.js` inside `renderList()` (lines 37-69)

**Interfaces:**
- Produces: `TweetfeedView.dateFrom` (string, default `''`), `TweetfeedView.dateTo` (string, default `''`)
- Behavior change: the controls-bar currently only renders when `accounts.length > 1`. It must now always render (so the date filter is available even with a single tracked account), but the account `<select>` itself stays conditional.

- [ ] **Step 1: Add state fields**

Change:

```javascript
const TweetfeedView = {
  detailId: null,
  activeAccount: 'all',
  REPO_ACCOUNTS_URL: 'https://github.com/sharma005/TIP/edit/main/js/tweetfeed-accounts.js',
```

to:

```javascript
const TweetfeedView = {
  detailId: null,
  activeAccount: 'all',
  dateFrom: '',
  dateTo: '',
  REPO_ACCOUNTS_URL: 'https://github.com/sharma005/TIP/edit/main/js/tweetfeed-accounts.js',
```

- [ ] **Step 2: Apply the date filter and rebuild the controls bar in `renderList()`**

Find the whole current body:

```javascript
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
```

Replace with:

```javascript
  renderList() {
    this.showListUI(true);
    const container = document.getElementById('tweetfeedContent');
    if (!container) return;

    const accounts = this.getKnownAccounts();
    const allItems = TIP_DATA.tweetfeedItems.filter(t => this.activeAccount === 'all' || t.username === this.activeAccount);
    let items = allItems;
    if (this.dateFrom) items = items.filter(t => t.date >= this.dateFrom);
    if (this.dateTo) items = items.filter(t => t.date <= this.dateTo);
    items = items.sort((a, b) => new Date(b.date) - new Date(a.date));

    const filterHtml = TIP_DATA.tweetfeedItems.length ? `
      <div class="controls-bar" id="tweetfeedControls">
        ${accounts.length > 1 ? `
        <select class="control-select" id="tweetfeedAccountFilter" onchange="TweetfeedView.setAccountFilter(this.value)">
          <option value="all" ${this.activeAccount === 'all' ? 'selected' : ''}>All accounts</option>
          ${accounts.map(a => `<option value="${App.escapeHtml(a)}" ${this.activeAccount === a ? 'selected' : ''}>@${App.escapeHtml(a)}</option>`).join('')}
        </select>` : ''}
        <div class="date-range-group">
          <input type="date" class="control-select date-input" value="${this.dateFrom}" onchange="TweetfeedView.dateFrom=this.value;TweetfeedView.renderList()" aria-label="Filter from date">
          <span>–</span>
          <input type="date" class="control-select date-input" value="${this.dateTo}" onchange="TweetfeedView.dateTo=this.value;TweetfeedView.renderList()" aria-label="Filter to date">
        </div>
      </div>` : '';

    let listHtml;
    if (!allItems.length) {
      listHtml = `<div class="empty-state">
          <div class="empty-icon">📭</div>
          No posts yet. Claude will research new activity from tracked accounts on the next fetch cycle.
        </div>`;
    } else if (!items.length) {
      listHtml = `<div class="empty-state">
          <div class="empty-icon">📭</div>
          No posts match this date range.
        </div>`;
    } else {
      listHtml = `<section class="feed-list">${items.map(item => this.renderCard(item)).join('')}</section>`;
    }

    container.innerHTML = `
      <div class="admin-actions admin-only">
        <button class="btn btn-primary btn-sm" onclick="TweetfeedView.openAccountsModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6"/></svg>
          Manage Accounts
        </button>
      </div>
      ${filterHtml}
      ${listHtml}
    `;
  },
```

- [ ] **Step 3: Verify syntax**

Run: `node --check js/tweetfeed.js`
Expected: no output (exit code 0)

- [ ] **Step 4: Manual browser verification**

On the Tweetfeed view: confirm the date inputs now show even with only one tracked account; confirm they didn't show before this change if you check against `git stash` (optional sanity check); apply a range and confirm the post list and empty-state messaging (distinguishing "no posts yet" vs "no posts match this date range") behave correctly.

- [ ] **Step 5: Commit**

```bash
git add js/tweetfeed.js
git commit -m "Add date-range filter to Tweetfeed view"
```

---

### Task 7: Connectors (per-connector detail) date-range filter

**Files:**
- Modify: `js/connectors.js:51-53` (state), `js/connectors.js` inside `renderDetail()` (lines 117-156)

**Interfaces:**
- Produces: `ConnectorsView.dateFrom` (string, default `''`), `ConnectorsView.dateTo` (string, default `''`)
- This is the only view where a controls-bar is introduced from scratch. The top-level Connectors grid (`renderList()`, the 5-card overview) is untouched — it has no dated items of its own.

- [ ] **Step 1: Add state fields**

Change:

```javascript
const ConnectorsView = {
  detailKey: null,
  itemId: null,
```

to:

```javascript
const ConnectorsView = {
  detailKey: null,
  itemId: null,
  dateFrom: '',
  dateTo: '',
```

- [ ] **Step 2: Apply the filter and add the controls bar in `renderDetail()`**

Find:

```javascript
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
```

Replace with:

```javascript
    const allItems = TIP_DATA.connectorIntel.filter(c => c.connector === connector.key);
    let items = allItems;
    if (this.dateFrom) items = items.filter(c => c.date >= this.dateFrom);
    if (this.dateTo) items = items.filter(c => c.date <= this.dateTo);
    items = items.sort((a, b) => new Date(b.date) - new Date(a.date));

    const controlsHtml = allItems.length ? `
      <div class="controls-bar">
        <div class="date-range-group">
          <input type="date" class="control-select date-input" value="${this.dateFrom}" onchange="ConnectorsView.dateFrom=this.value;ConnectorsView.renderDetail()" aria-label="Filter from date">
          <span>–</span>
          <input type="date" class="control-select date-input" value="${this.dateTo}" onchange="ConnectorsView.dateTo=this.value;ConnectorsView.renderDetail()" aria-label="Filter to date">
        </div>
      </div>` : '';

    let listHtml;
    if (!allItems.length) {
      listHtml = `<div class="empty-state">
          <div class="empty-icon">📭</div>
          No ${App.escapeHtml(connector.name)} intel yet. Claude will research new activity on the next fetch cycle.
        </div>`;
    } else if (!items.length) {
      listHtml = `<div class="empty-state">
          <div class="empty-icon">📭</div>
          No ${App.escapeHtml(connector.name)} intel matches this date range.
        </div>`;
    } else {
      listHtml = `<section class="feed-list">${items.map(item => this.renderIntelCard(item)).join('')}</section>`;
    }

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
      ${controlsHtml}
      ${listHtml}
    `;
  },
```

- [ ] **Step 3: Verify syntax**

Run: `node --check js/connectors.js`
Expected: no output (exit code 0)

- [ ] **Step 4: Manual browser verification**

Navigate to Connectors → any connector card (e.g. MISP) → confirm the date inputs render under "Emerging Threats" (only if that connector has at least one item); apply a range and confirm the item list updates and the two empty-state messages ("no intel yet" vs. "no intel matches this date range") appear in the right cases; confirm the top-level Connectors grid page is unaffected.

- [ ] **Step 5: Commit**

```bash
git add js/connectors.js
git commit -m "Add date-range filter to Connectors detail view"
```

---

### Task 8: Snowbit date-range filter

**Files:**
- Modify: `js/snowbit.js:6-8` (state), `js/snowbit.js` inside `renderList()` (lines 24-35)

**Interfaces:**
- Produces: `SnowbitView.dateFrom` (string, default `''`), `SnowbitView.dateTo` (string, default `''`)
- This is the second view where a controls-bar is introduced from scratch.

- [ ] **Step 1: Add state fields**

Change:

```javascript
const SnowbitView = {
  detailId: null,
```

to:

```javascript
const SnowbitView = {
  detailId: null,
  dateFrom: '',
  dateTo: '',
```

- [ ] **Step 2: Apply the filter and add the controls bar in `renderList()`**

Find:

```javascript
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
```

Replace with:

```javascript
  renderList() {
    this.showListUI(true);
    const container = document.getElementById('snowbitContent');
    if (!container) return;

    const allItems = DataManager.getSnowbitAdvisories();
    if (!allItems.length) {
      container.innerHTML = `<div class="empty-state">No Snowbit advisories yet.</div>`;
      return;
    }

    let items = allItems;
    if (this.dateFrom) items = items.filter(i => i.date >= this.dateFrom);
    if (this.dateTo) items = items.filter(i => i.date <= this.dateTo);

    const controlsHtml = `
      <div class="controls-bar" id="snowbitControls">
        <div class="date-range-group">
          <input type="date" class="control-select date-input" value="${this.dateFrom}" onchange="SnowbitView.dateFrom=this.value;SnowbitView.renderList()" aria-label="Filter from date">
          <span>–</span>
          <input type="date" class="control-select date-input" value="${this.dateTo}" onchange="SnowbitView.dateTo=this.value;SnowbitView.renderList()" aria-label="Filter to date">
        </div>
      </div>`;

    const listHtml = items.length
      ? `<section class="feed-list">${items.map(item => this.renderCard(item)).join('')}</section>`
      : `<div class="empty-state">No advisories match this date range.</div>`;

    container.innerHTML = controlsHtml + listHtml;
  },
```

- [ ] **Step 3: Verify syntax**

Run: `node --check js/snowbit.js`
Expected: no output (exit code 0)

- [ ] **Step 4: Manual browser verification**

On the Snowbit Advisory view: confirm the date inputs render above the advisory list; apply a range and confirm the list and empty-state message update; clear and confirm the full list returns.

- [ ] **Step 5: Commit**

```bash
git add js/snowbit.js
git commit -m "Add date-range filter to Snowbit Advisory view"
```

---

### Task 9: Full cross-view manual regression pass

**Files:** none (verification only)

- [ ] **Step 1: Run every remaining syntax check together**

Run: `for f in js/feed.js js/adversary.js js/darkweb.js js/huntlab.js js/tweetfeed.js js/connectors.js js/snowbit.js; do node --check "$f" || echo "FAILED: $f"; done`
Expected: no `FAILED` lines printed.

- [ ] **Step 2: Serve and manually walk every section**

Run: `python3 -m http.server 8000` from the repo root, open `http://localhost:8000/` in a browser, and for each of Feed, Adversaries, Dark Web, Hunt Lab (Hypotheses tab), Tweetfeed, Connectors (open one connector with items), and Snowbit:
- Confirm a From/To date pair is visible in the controls area.
- Apply a range that should exclude at least one item and confirm the visible list narrows.
- Clear both fields and confirm the original full list returns.
- Confirm existing filters (status/type/search/sort) still combine correctly with the date range (e.g. on Hunt Lab, pick a status AND a date range together and confirm both apply).

This step has no automated substitute — call out explicitly in the final report that verification was manual, since this repo has no browser test runner.

- [ ] **Step 3: Final commit (only if Step 2 surfaced fixes)**

If manual verification required any fixes, stage and commit them individually per the file(s) touched, following the same commit-message style as the tasks above. If no fixes were needed, skip this step — there is nothing to commit.
