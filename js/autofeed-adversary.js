/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat-intel pool: adversary. Hand-updated via an interactive
   Claude session (WebSearch) — see lib/intel/schemas.mjs
   (ADVERSARY_SCHEMA) and lib/intel/contentTypes.mjs (cap 60) as the
   source of truth. Append new items deduped by id, drop the oldest by
   fetchedAt past the cap.
   ═══════════════════════════════════════════════════════════════════ */
const TIP_AUTOFEED_ADVERSARY = [];
