#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   TIP — Local/manual-run CLI for the auto-fetch pipeline.

   In production this logic runs on a 6-hour AWS Lambda + EventBridge
   Scheduler schedule (lambda/fetch-intel/index.mjs), which writes
   straight to the S3 origin. This CLI is the local-dev equivalent —
   useful for testing schema/prompt changes without touching AWS —
   and writes the same four js/autofeed*.js files to disk.

   Calls Claude with the web_search tool for each content type
   (feed, hunt-lab hypotheses, adversary profiles, dark web intel),
   forces strict JSON output, sanitizes it, and regenerates the
   corresponding js/autofeed*.js file wholesale. DataManager's
   mergeAutoFetched* methods (js/data.js) merge new items on page load.
   ═══════════════════════════════════════════════════════════════════ */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CONTENT_TYPES, runContentType, renderAutofeedFile } from '../lib/intel/contentTypes.mjs';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ANTHROPIC_API_KEY is not set. In CI, set it as a GitHub Actions secret; locally, put it in .env and source it.');
  process.exit(1);
}

const client = new Anthropic({ apiKey });

async function main() {
  for (const type of CONTENT_TYPES) {
    const records = await runContentType(client, type);
    const outPath = fileURLToPath(new URL(`../js/${type.fileName}`, import.meta.url));
    writeFileSync(outPath, renderAutofeedFile(type, records));
    console.log(`[${type.label}] wrote ${records.length} item(s) to js/${type.fileName}`);
  }
}

main().catch((err) => {
  console.error('fetch-intel failed:', err);
  process.exit(1);
});
