/* ═══════════════════════════════════════════════════════════════════
   TIP — Accumulation pool for the auto-fetch pipeline.

   Each js/autofeed*.js file is a durable, capped pool of everything
   fetched so far — not just the latest run's results. Without this,
   every run would wholesale-overwrite the file with only what Claude
   found in that one run, so a first-time visitor (or anyone who
   clears localStorage) between two scheduled runs would never see
   items an earlier run already found. Appending + capping instead of
   replacing means the pool always reflects recent history, and
   per-browser dedup (DataManager.mergeAutoFetched*) still decides
   what's actually new to that visitor.
   ═══════════════════════════════════════════════════════════════════ */

import { existsSync, readFileSync } from 'node:fs';

// Parses a previously-written js/autofeed*.js file back into its record
// array. These files are always `const NAME = <JSON array>;` (see
// renderAutofeedFile) so a substring extraction is safe — no eval needed,
// and it degrades to an empty pool rather than throwing on anything
// unexpected (hand-edited file, corrupted write, first-ever run).
export function readExistingPool(filePath) {
  if (!existsSync(filePath)) return [];
  try {
    const text = readFileSync(filePath, 'utf8');
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1 || end < start) return [];
    const parsed = JSON.parse(text.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn(`Failed to read existing pool at ${filePath}, starting fresh:`, e.message);
    return [];
  }
}

// Adds genuinely-new records (deduped by id against the existing pool) and
// caps the result to maxPoolSize, dropping the oldest by fetchedAt first.
export function mergeAndCapPool(existing, fresh, maxPoolSize) {
  const knownIds = new Set(existing.map((r) => r.id));
  const newOnes = fresh.filter((r) => !knownIds.has(r.id));
  const combined = [...existing, ...newOnes];
  combined.sort((a, b) => new Date(b.fetchedAt) - new Date(a.fetchedAt));
  return { pool: combined.slice(0, maxPoolSize), addedCount: newOnes.length };
}

// Reads the admin-managed tracked-account list (js/tweetfeed-accounts.js,
// always `const TWEETFEED_ACCOUNTS = [...];`) the same safe way as
// readExistingPool above — substring extraction, no eval — so a hand-edited
// or missing file degrades to `fallback` instead of throwing.
export function readTrackedAccounts(filePath, fallback) {
  if (!existsSync(filePath)) return fallback;
  try {
    const text = readFileSync(filePath, 'utf8');
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1 || end < start) return fallback;
    const parsed = JSON.parse(text.slice(start, end + 1));
    return Array.isArray(parsed) && parsed.every((a) => typeof a === 'string') ? parsed : fallback;
  } catch (e) {
    console.warn(`Failed to read tracked accounts at ${filePath}, using fallback:`, e.message);
    return fallback;
  }
}
