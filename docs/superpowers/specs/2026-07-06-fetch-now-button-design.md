# Manual "Fetch Now" Button — Design Spec

## Goal
Add a button to the Security Advisory Feed header that lets anyone trigger the intel fetch immediately, instead of waiting for the next scheduled run of `.github/workflows/fetch-intel.yml` (currently every 6h).

## Why the browser can't fetch directly
`scripts/fetch-intel.mjs` calls Claude with `ANTHROPIC_API_KEY` and then `git commit`/`git push`es the results into `js/autofeed*.js`. Both the API key and git-push rights are only available inside the GitHub Actions runner — they must never be embedded in the shipped static site. The workflow already declares `workflow_dispatch: {}`, so a manual run is possible today via the Actions tab; this feature exposes that same trigger from within the app instead of requiring a trip to GitHub.

Because one workflow run loops over every `CONTENT_TYPE` (`lib/intel/contentTypes.mjs`), a single trigger refreshes advisories, Hunt Lab, Adversary, Dark Web, Connectors, and Tweetfeed pools together — there's no way to fetch just one. The button lives only in the Feed view, per user preference, but its effect isn't scoped to advisories.

## UI
- New button in `#feedHeader .page-meta` ([index.html:156-161](../../../index.html#L156-L161)), after the "Refresh every 6h" pill: `⟳ Fetch Now`.
- An inline status span next to it, hidden until a trigger is in flight, showing one of: `Triggering…` → `Queued on GitHub…` → `Running…` → `✅ Done — reload to see new items` (with a `Reload` button) → `❌ Failed — view run` (link to the run's `html_url`) → `⚠ Invalid token` (link that reopens the token modal).
- Button is `disabled` for the entire trigger+poll cycle to prevent double-dispatch from a double-click. No visibility gating — the button is visible to all visitors (per explicit user decision), since a visitor without a saved token simply gets the token-entry modal and can't do anything destructive without one.

## Token setup
- New modal `#fetchTokenModal` (same markup/JS pattern as the existing `#adminLoginModal` in `js/app.js`'s `openModal`/`closeModal`).
- Copy: explains a GitHub PAT is needed, scoped to `sharma005/tip` with **Actions: Read and write**, with a link to `https://github.com/settings/personal-access-tokens/new`.
- On submit, token is saved to `localStorage['tip-gh-pat']` (mirrors the existing `tip-admin-hash-override` pattern in `js/app.js`) and the pending fetch proceeds immediately.
- A "change token" affordance (small link/icon next to the Fetch Now button) reopens the same modal to overwrite the stored token.

## Trigger + poll flow
1. If no token in `localStorage['tip-gh-pat']`, open the token modal and stop; resume automatically once a token is saved.
2. `POST https://api.github.com/repos/sharma005/tip/actions/workflows/fetch-intel.yml/dispatches` with body `{ "ref": "main" }` and header `Authorization: Bearer <token>`. Record `triggeredAt = new Date().toISOString()` beforehand.
3. On `204`: begin polling `GET https://api.github.com/repos/sharma005/tip/actions/workflows/fetch-intel.yml/runs?per_page=5` every 5s, up to a 3-minute cap.
   - Find the run with the latest `created_at >= triggeredAt`.
   - Map `status`/`conclusion` to the status span: `queued`/`in_progress` → "Queued…"/"Running…"; `completed` + `conclusion === 'success'` → done state; `completed` + anything else → failed state, linking `run.html_url`.
   - No matching run found before the 3-minute cap → fall back to "Triggered — check GitHub Actions" with a static link to the workflow page (`https://github.com/sharma005/tip/actions/workflows/fetch-intel.yml`).
4. On `401`/`403` from the dispatch call: show the "Invalid token" state; do not poll.
5. On any other network/HTTP error from the dispatch call: show a generic failure state with the same static Actions-page link as the timeout fallback.

## Why no live in-page update on success
The page's data model (`js/data.js` `DataManager.init()`) merges `TIP_AUTOFEED`/etc. from the `<script>` tags loaded at page load; those files only change once the workflow commits+pushes and GitHub Pages redeploys, typically ~1 min after the run finishes. So "done" means "reload to see new items," not an automatic DOM update.

## Files touched
- `index.html` — button + status span markup in the feed header; new `#fetchTokenModal` markup.
- `js/fetch-now.js` (new) — token modal open/save, dispatch call, polling, status rendering. Exposes one object (e.g. `FetchNow`) called from an `onclick` on the new button, following the existing `App`/`FeedView`/`AdminView` module pattern.
- `css/styles.css` — button/status-span styles consistent with existing `.btn`/`.pill-live` treatments; spinner animation for the in-flight state.

## Out of scope
- No change to `scripts/fetch-intel.mjs`, `lib/intel/*`, or the workflow YAML — the manual trigger uses the existing `workflow_dispatch` entry point as-is.
- No server-side proxy/new hosting dependency — token is held client-side only, per user decision.
- No admin-mode gating on the button itself (explicit user decision — visible to all visitors).
- No extra cooldown beyond "disabled while a trigger is in flight" — GitHub's own `concurrency: { group: fetch-intel, cancel-in-progress: false }` already serializes overlapping runs.
