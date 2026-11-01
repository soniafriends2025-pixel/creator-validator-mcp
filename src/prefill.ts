// Prefill payload <-> URL. The payload rides in the buyer's own browser only:
// first in the URL fragment (fragments are never sent to any server), then in the
// buyer's sessionStorage after they click to pay. This MCP stores NOTHING.

import { PACKS, PackId } from "./content.js";

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

export function buildPrefillLink(payload: PrefillPayload): string {
  const pack = PACKS[payload.pack];
  const encoded = toBase64Url(JSON.stringify(payload));
  // Points at the real post-payment form page. The fragment (#cvprefill=) is decoded
  // client-side by the (additive, backward-compatible) success page.
  return `${"https://www.soniaia.com"}/tools/fake-check/success?package=${pack.formPackage}#cvprefill=${encoded}`;
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
