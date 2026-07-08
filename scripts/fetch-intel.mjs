#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   TIP — Automated threat intel fetch (runs 4x/day via GitHub Actions,
   see .github/workflows/fetch-intel.yml; also runnable locally via
   `npm run fetch-intel` for testing schema/prompt changes).

   Calls Claude with the web_search tool for each content type
   (feed, hunt-lab hypotheses, adversary profiles, dark web intel),
   forces strict JSON output, and sanitizes it. Each js/autofeed*.js
   file is a capped, accumulating pool — this run's new items are
   merged into whatever the file already had (deduped by id), not a
   wholesale replacement, so a first-time visitor between two
   scheduled runs still sees recent history rather than only the
   latest run's results. DataManager's mergeAutoFetched* methods
   (js/data.js) then merge from that pool into a given browser's own
   data on page load.
   ═══════════════════════════════════════════════════════════════════ */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CONTENT_TYPES, runContentType, renderAutofeedFile } from '../lib/intel/contentTypes.mjs';
import { readExistingPool, mergeAndCapPool } from '../lib/intel/pool.mjs';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ANTHROPIC_API_KEY is not set. In CI, set it as a GitHub Actions secret; locally, put it in .env and source it.');
  process.exit(1);
}

// Short timeout + a single retry so a sustained 529 (overload) on one
// content type fails fast instead of the SDK's default ~10min timeout and
// Retry-After-driven backoff eating the whole run's budget.
const client = new Anthropic({ apiKey, timeout: 30_000, maxRetries: 1 });
const PER_TYPE_DEADLINE_MS = 45_000;
// Content types are independent, so run them in concurrent batches rather
// than one at a time — bounds worst-case wall time to
// ceil(CONTENT_TYPES.length / BATCH_SIZE) * PER_TYPE_DEADLINE_MS instead of
// CONTENT_TYPES.length * PER_TYPE_DEADLINE_MS, while still capping how many
// requests hit the API at once.
const BATCH_SIZE = 3;
// A 529 overload is often a short-lived spike, not a full outage — retry
// failed content types a couple of times with a cooldown in between rather
// than giving up after one pass. Bounded so a sustained outage still fails
// in ~10min instead of stalling the run (the GitHub Actions schedule's
// `concurrency: cancel-in-progress: false` group already keeps a stuck run
// from blocking the next scheduled tick).
const MAX_ATTEMPTS = 3;
const COOLDOWN_SCHEDULE_MS = [120_000, 240_000]; // before attempt 2, before attempt 3

function withDeadline(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`[${label}] exceeded ${ms}ms deadline`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Returns null on success, or the type itself on failure so callers can
// collect just the failed subset for a retry pass.
async function processType(type) {
  try {
    const fresh = await withDeadline(runContentType(client, type), PER_TYPE_DEADLINE_MS, type.label);
    const outPath = fileURLToPath(new URL(`../js/${type.fileName}`, import.meta.url));
    const existing = readExistingPool(outPath);
    const { pool, addedCount } = mergeAndCapPool(existing, fresh, type.maxPoolSize);
    writeFileSync(outPath, renderAutofeedFile(type, pool));
    console.log(`[${type.label}] +${addedCount} new (pool: ${pool.length}/${type.maxPoolSize}) -> js/${type.fileName}`);
    return null;
  } catch (err) {
    // Isolate failures per content type (network error, API 4xx/5xx, etc.)
    // so one bad call doesn't take out the rest of its batch or later batches.
    console.error(`[${type.label}] run failed, skipping this content type:`, err);
    return type;
  }
}

// Runs `types` in BATCH_SIZE concurrent chunks, returns the ones that failed.
async function runBatches(types) {
  const failed = [];
  for (let i = 0; i < types.length; i += BATCH_SIZE) {
    const batch = types.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(processType));
    failed.push(...results.filter(Boolean));
  }
  return failed;
}

async function main() {
  let pending = CONTENT_TYPES;
  let attempt = 1;
  while (pending.length && attempt <= MAX_ATTEMPTS) {
    if (attempt > 1) {
      const cooldown = COOLDOWN_SCHEDULE_MS[attempt - 2];
      console.log(`Retrying ${pending.length} failed content type(s) after ${cooldown / 1000}s cooldown (attempt ${attempt}/${MAX_ATTEMPTS}): ${pending.map((t) => t.label).join(', ')}`);
      await sleep(cooldown);
    }
    pending = await runBatches(pending);
    attempt++;
  }
  if (pending.length) {
    console.error(`fetch-intel finished with ${pending.length}/${CONTENT_TYPES.length} content type(s) still failing after ${attempt - 1} attempt(s): ${pending.map((t) => t.label).join(', ')}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('fetch-intel failed:', err);
  process.exit(1);
});
