/* ═══════════════════════════════════════════════════════════════════
   TIP — Shared Claude-calling helper for the auto-fetch pipeline.
   Wraps the web_search + strict-JSON call pattern so scripts/fetch-intel.mjs
   (local CLI) and lambda/fetch-intel (AWS Lambda) don't duplicate it.
   ═══════════════════════════════════════════════════════════════════ */

const DEFAULT_MODEL = 'claude-opus-4-8';
const WEB_SEARCH_TOOL = 'web_search_20260209';

// Calls Claude with web_search + a forced JSON schema, returns the parsed
// { items: [...] } object. Returns { items: [] } on a safety refusal (treated
// as "nothing to report this run", not a hard failure) or on any output that
// isn't complete, well-formed JSON, so one bad content type doesn't take
// down the other three in the same run.
export async function fetchContent(client, { label, schema, systemPrompt, userPrompt, model = DEFAULT_MODEL, maxUses = 8, maxTokens = 4096 }) {
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    tools: [{ type: WEB_SEARCH_TOOL, name: 'web_search', max_uses: maxUses }],
    output_config: { format: { type: 'json_schema', schema } },
    messages: [{ role: 'user', content: userPrompt }],
  });

  if (response.stop_reason === 'refusal') {
    console.warn(`[${label}] request declined by safety classifiers — no update this run.`);
    return { items: [] };
  }

  const textBlocks = response.content.filter((b) => b.type === 'text');
  const finalText = textBlocks.at(-1)?.text;
  if (!finalText) {
    console.error(`[${label}] no text block in response:`, JSON.stringify(response.content));
    return { items: [] };
  }

  try {
    const parsed = JSON.parse(finalText);
    return { items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch (e) {
    console.error(`[${label}] failed to parse model output as JSON:`, finalText);
    return { items: [] };
  }
}
