// Prefill payload <-> URL. The payload rides in the buyer's own browser only:
// first in the URL fragment (fragments are never sent to any server), then in the
// buyer's sessionStorage after they click to pay. This MCP stores NOTHING.

import { PACKS, PackId, SITE } from "./content.js";

export interface PrefillCreator {
  url: string;
  platform: string; // Instagram | TikTok | YouTube
}

export interface PrefillPayload {
  v: 1;
  pack: PackId;
  package: string; // the form's packageType value
  creators: PrefillCreator[];
  brief?: { product: string; goal: string; market: string };
  email?: string;
}

// base64url with no deps.
function toBase64Url(s: string): string {
  return Buffer.from(s, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Direct-to-Stripe order link (2026-11-01): soniaia.com/tools/creator-validator/pay reads the order from
// the fragment and POSTs it to /api/cv/pay, which validates it, creates a
// Stripe Checkout with the order inside it, and redirects straight to payment. The Stripe webhook
// submits the order, so the buyer can close the page after paying. Price is set server-side by pack.
export function buildPayLink(payload: PrefillPayload, notes?: string): string {
  const order = {
    v: 1,
    pack: payload.pack,
    creators: payload.creators,
    brief: payload.brief,
    email: payload.email,
    ...(notes ? { notes } : {}),
  };
  // Order rides in the URL FRAGMENT (never sent to servers or logs); the pay page POSTs it.
  return `${SITE}/tools/creator-validator/pay#o=${toBase64Url(JSON.stringify(order))}`;
}

export function buildPrefillLink(payload: PrefillPayload): string {
  const pack = PACKS[payload.pack];
  const encoded = toBase64Url(JSON.stringify(payload));
  // Points at the real post-payment form page. The fragment (#cvprefill=) is decoded
  // client-side by the (additive, backward-compatible) success page.
  return `${SITE}/tools/fake-check/success?package=${pack.formPackage}#cvprefill=${encoded}`;
}

// A human-readable block the buyer can paste into the current form TODAY (zero site change).
export function buildPasteBlock(payload: PrefillPayload): string {
  const lines: string[] = [];
  payload.creators.forEach((c, i) => lines.push(`${i + 1}. ${c.url} (${c.platform})`));
  const brief = payload.brief
    ? [
        "",
        "Campaign brief:",
        `- Product/service: ${payload.brief.product}`,
        `- Objective: ${payload.brief.goal}`,
        `- Market/language: ${payload.brief.market}`,
      ]
    : [];
  return [...lines, ...brief].join("\n");
}
