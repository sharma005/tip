# Date Range Filter — Design Spec

## Goal
Add a date-range filter (From / To) to every list view's controls bar, alongside the existing status/type filter dropdowns and search boxes.

## UI Pattern
Two `<input type="date">` elements, class `control-select date-input`, wrapped in a `.date-range-group` flex container with an em-dash separator between them. Placed in each section's controls-bar, after the existing `<select>` filter(s).

- Empty input = no bound on that side.
- Both empty = no date filtering applied (current behavior, unchanged).
- Range is inclusive on both ends (`from <= item.date <= to`).
- Combines with AND against whatever search/type/status filter is already active.
- No separate "Clear" button — native date inputs already show a clear affordance in supported browsers when a value is set.

### CSS
- `.date-range-group`: flex row, small gap, centered items, `–` separator span.
- `.control-select.date-input`: same visual treatment as `.control-select` (background/border/radius/padding), explicit `color-scheme: dark` under the default (dark) theme and `color-scheme: light` under `[data-theme="light"]` so the native calendar-picker icon stays visible in both themes.

## Per-Section Implementation

| # | Section | Files | State fields | Filtered field | Existing controls-bar? |
|---|---|---|---|---|---|
| 1 | Feed | `index.html`, `js/feed.js` | `FeedView.dateFrom`, `FeedView.dateTo` | `date` | Yes (`#feedControls`) |
| 2 | Adversaries | `index.html`, `js/adversary.js` | `AdversaryView.dateFrom`, `AdversaryView.dateTo` | `lastSeen` | Yes |
| 3 | Dark Web Intel | `index.html`, `js/darkweb.js` | `DarkWebView.dateFrom`, `DarkWebView.dateTo` | `date` | Yes (`#dwControls`) |
| 4 | Hunt Lab — Hypotheses | `js/huntlab.js` | `HuntLabView.dateFrom`, `HuntLabView.dateTo` | `createdAt` | Yes (inline-rendered) |
| 5 | Tweetfeed | `js/tweetfeed.js` | `TweetfeedView.dateFrom`, `TweetfeedView.dateTo` | `date` | Partial — currently only renders when >1 known account; will always render now |
| 6 | Connectors (per-connector detail) | `js/connectors.js` (`renderDetail`) | `ConnectorsView.dateFrom`, `ConnectorsView.dateTo` | `date` | No — new controls-bar added. Top-level Connectors grid page is untouched (no dated items there). |
| 7 | Snowbit | `js/snowbit.js` (`renderList`) | `SnowbitView.dateFrom`, `SnowbitView.dateTo` | `date` | No — new controls-bar added |

For sections 1–3 (native `<select>` in `index.html`, event binding in a `bindEvents()` function), the new date inputs get ids (`feedDateFrom`/`feedDateTo`, `advDateFrom`/`advDateTo`, `dwDateFrom`/`dwDateTo`) and listeners are added alongside the existing search/filter listeners.

For sections 4–7 (fully client-rendered controls-bar via template strings), the date inputs use inline `onchange` handlers consistent with the existing pattern in those files (e.g. Hunt Lab's status `<select>`).

State resets: `dateFrom`/`dateTo` default to `''` (unset) and are not persisted across page reloads, matching how `searchQuery`/`filterType`/`sortBy` already behave in every one of these controllers.

## Out of Scope
- No relative-date presets (Today / Last 7 days / etc.) — explicit From/To only, per user preference.
- No changes to the `HYPOTHESIS_SCHEMA` / other AI-generation schemas — `createdAt` is already stamped at storage time and used as-is.
- No new date field added to the adversary data schema — `lastSeen` is used as-is since it's the only date-like field present.
