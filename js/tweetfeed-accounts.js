/* ═══════════════════════════════════════════════════════════════════
   TIP — Tracked Twitter/X accounts for the Tweetfeed connector.

   Source of truth for the scheduled fetch (scripts/fetch-intel.mjs) — this
   is a static site with no backend, so the cron job can only see what's
   committed here, not any admin's browser localStorage. Manage via the
   Tweetfeed view's "Manage Accounts" modal: changes there update your
   browser immediately and walk you through copying the updated array here
   and committing it on GitHub so the next scheduled run picks it up.
   ═══════════════════════════════════════════════════════════════════ */
const TWEETFEED_ACCOUNTS = ["Huntio"];
