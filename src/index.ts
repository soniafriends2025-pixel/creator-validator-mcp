#!/usr/bin/env node
/**
 * Creator Validator MCP server (LOCAL TEST-ONLY prototype).
 *
 * Phase 1 of PLANS/CV_MCP_PLAN_2026-10-14.md. Three read-only tools:
 *   - about_creator_validator  : what the service is + Creator Dossier + verdicts (no method).
 *   - get_pack_options         : the two packs (5 / 10), price, what's included.
 *   - start_order              : validates pack (exactly 5 or 10), returns the prefill link
 *                                (form filled -> Pay & continue -> Stripe -> order submits by
 *                                itself when complete) + an order summary. Takes NO payment,
 *                                writes nothing.
 *
 *   - book_find_and_vet        : Find + Vet (no shortlist yet): booking link for the 15-min call +
 *                                a pre-written email with the brief. No payment.
 *
 * The server holds NO keys (no Stripe, Gemini, ScrapeCreators or SMTP) and NO client data.
 * No network writes. No logging of handles or briefs. Nothing to steal, nothing to burn.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

async function main() {
  const transport = new StdioServerTransport();
  await createServer().connect(transport);
  // stderr only; never log client data.
  console.error("creator-validator MCP (local test-only) ready on stdio");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
