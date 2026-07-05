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

const client = new Anthropic({ apiKey });

async function main() {
  for (const type of CONTENT_TYPES) {
    const fresh = await runContentType(client, type);
    const outPath = fileURLToPath(new URL(`../js/${type.fileName}`, import.meta.url));
    const existing = readExistingPool(outPath);
    const { pool, addedCount } = mergeAndCapPool(existing, fresh, type.maxPoolSize);
    writeFileSync(outPath, renderAutofeedFile(type, pool));
    console.log(`[${type.label}] +${addedCount} new (pool: ${pool.length}/${type.maxPoolSize}) -> js/${type.fileName}`);
  }
}

main().catch((err) => {
  console.error('fetch-intel failed:', err);
  process.exit(1);
});
