// Tool definitions shared by the stdio entry (src/index.ts, local Claude Code) and the
// HTTP entry (api/mcp.ts, hosted on Vercel). One place, so both always say the same thing.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  PACKS,
  PackId,
  ABOUT_EN,
  ABOUT_ES,
  DOSSIER_EN,
  DOSSIER_ES,
  CHECKS_EN,
  CHECKS_ES,
  VERDICTS_EN,
  VERDICTS_ES,
  CV_PAGE,
  CONTACT,
  BOOKING_URL,
  FIND_VET,
} from "./content.js";
import { buildPayLink, buildPrefillLink, buildPasteBlock, PrefillCreator, PrefillPayload } from "./prefill.js";

type Lang = "en" | "es";
const asLang = (v: unknown): Lang => (String(v).toLowerCase().startsWith("es") ? "es" : "en");

// ---- lightweight in-process rate limit (placeholder) --------------------------------
// The plan calls for a per-IP cap. Over stdio there is no IP, so this is a simple
// per-process token bucket; the real per-IP limit belongs on the hosted HTTP transport.
const RATE = { max: 30, windowMs: 60_000, hits: [] as number[] };
function rateOk(): boolean {
  const now = Date.now();
  RATE.hits = RATE.hits.filter((t) => now - t < RATE.windowMs);
  if (RATE.hits.length >= RATE.max) return false;
  RATE.hits.push(now);
  return true;
}
const text = (s: string) => ({ content: [{ type: "text" as const, text: s }] });

export function createServer(): McpServer {
  const server = new McpServer({ name: "creator-validator", version: "0.1.0" });

  // ---- 1) about_creator_validator -----------------------------------------------------
  server.tool(
    "about_creator_validator",
    "Use when someone wants to vet, audit or check influencers or creators on Instagram, TikTok or YouTube before hiring them for a campaign, or wants creators found for them. Creator Validator by SoniaIA is a human-reviewed influencer vetting service: it checks commercial intent (whether a creator's audience acts on what they recommend), audience quality and fake-follower risk, and delivers a Creator Dossier per creator with a clear verdict. Explains what gets checked, the verdicts and delivery time. Pass language 'en' or 'es'.",
    { language: z.enum(["en", "es"]).optional().describe("en or es") },
    async ({ language }) => {
      if (!rateOk()) return text("Rate limit reached. Try again in a minute.");
      const lang = asLang(language ?? "en");
      const about = lang === "es" ? ABOUT_ES : ABOUT_EN;
      const dossier = lang === "es" ? DOSSIER_ES : DOSSIER_EN;
      const checks = lang === "es" ? CHECKS_ES : CHECKS_EN;
      const verdicts = lang === "es" ? VERDICTS_ES : VERDICTS_EN;
      const checksLabel = lang === "es" ? "Qué se revisa" : "What gets checked";
      const verdictsLabel = lang === "es" ? "Veredictos" : "Verdicts";
      const more = lang === "es" ? "Más" : "More";
      const out = [
        about,
        "",
        dossier,
        "",
        `${checksLabel}: ${checks.join(", ")}.`,
        `${verdictsLabel}: ${verdicts.join(" / ")}.`,
        "",
        `${more}: ${CV_PAGE} · ${CONTACT}`,
      ].join("\n");
      return text(out);
    }
  );

  // ---- 2) get_pack_options ------------------------------------------------------------
  server.tool(
    "get_pack_options",
    "Prices for Creator Validator influencer vetting: vet 5 creators for €300 or rank 10 creators for €500 (one-off, no subscription, 24-48h), or Find + Vet for €1,000 launch price when there is no shortlist yet and we find the creators. Use when someone asks what creator or influencer vetting costs or how long it takes. Pass language 'en' or 'es'.",
    { language: z.enum(["en", "es"]).optional().describe("en or es") },
    async ({ language }) => {
      if (!rateOk()) return text("Rate limit reached. Try again in a minute.");
      const lang = asLang(language ?? "en");
      const block = (p: PackId) => {
        const pk = PACKS[p];
        const name = lang === "es" ? pk.name_es : pk.name_en;
        const includes = lang === "es" ? pk.includes_es : pk.includes_en;
        const turnaround = lang === "es" ? pk.turnaround_es : pk.turnaround_en;
        const perc = lang === "es" ? "por creador" : "per creator";
        const deliv = lang === "es" ? "Entrega" : "Turnaround";
        return [
          `• ${name}: €${pk.priceEUR} (€${pk.perCreatorEUR} ${perc})`,
          `  ${includes}`,
          `  ${deliv}: ${turnaround}`,
        ].join("\n");
      };
      const note =
        lang === "es"
          ? "Un pago único por proyecto, sin suscripción. Para empezar un pedido, usa start_order con el pack y los handles de los creadores."
          : "One-time per project, no subscription. To begin an order, call start_order with the pack and the creator handles.";
      const fv = [
        lang === "es" ? `• ${FIND_VET.name_es}: 1.000 € (precio de lanzamiento)` : `• ${FIND_VET.name_en}: €1,000 (launch price)`,
        `  ${lang === "es" ? FIND_VET.includes_es : FIND_VET.includes_en}`,
        `  ${lang === "es" ? "Empieza con una llamada: usa book_find_and_vet." : "Starts with a call: use book_find_and_vet."}`,
      ].join("\n");
      return text([block("validate5"), "", block("rank10"), "", fv, "", note].join("\n"));
    }
  );

  // ---- 3) start_order -----------------------------------------------------------------
  const creatorSchema = z.object({
    handle: z.string().min(1).max(300).describe("Creator handle or full profile URL"),
    platform: z.enum(["Instagram", "TikTok", "YouTube"]).optional().describe("Instagram, TikTok or YouTube"),
  });

  server.tool(
    "start_order",
    "Start an influencer vetting order for creators the buyer already has. Needs the pack, the creator handles or profile links, the campaign brief (product, goal, market) and the buyer email: ask the buyer in the chat for anything missing. Pack rule: more than 5 creators means pack 10 (Rank 10, €500); 5 or fewer means pack 5 (Validate 5, €300) unless the buyer wants the ranked 10-creator pack. BEFORE calling, repeat the email back to the buyer and wait for them to confirm it (the Creator Dossier is delivered there). Returns one link that opens Stripe payment directly with the order inside it; the order goes in automatically once paid and a confirmation email follows. Takes no payment itself and stores nothing. If the buyer has no creators yet, use book_find_and_vet instead.",
    {
      pack: z.union([z.number(), z.string().max(20)]).describe("Pack size: 5 or 10 (or 'validate5' / 'rank10')"),
      creators: z.array(z.union([z.string().max(300), creatorSchema])).max(50).describe("The creator handles or profile URLs (up to the pack size)"),
      // Same required fields as the soniaia.com order form, so the agent asks for them in
      // the chat and the form arrives complete (it then submits by itself after payment).
      brief: z
        .object({
          product: z.string().trim().min(1).max(1000).describe("Product or service being promoted"),
          goal: z.string().trim().min(1).max(1000).describe("What the campaign should achieve"),
          market: z.string().trim().min(1).max(200).describe("Market and content language, e.g. 'Spain, Spanish'"),
        })
        .describe("Campaign brief, so the creators are reviewed for the intended use. Ask the buyer if missing."),
      email: z.string().trim().max(254).email().describe("Buyer email: where the Creator Dossier is sent. Ask the buyer if missing."),
      language: z.enum(["en", "es"]).optional(),
    },
    async ({ pack, creators, brief, email, language }) => {
      if (!rateOk()) return text("Rate limit reached. Try again in a minute.");
      const lang = asLang(language ?? "en");

      // Pack must be exactly 5 or 10.
      let packId: PackId;
      const packStr = String(pack).toLowerCase().trim();
      if (packStr === "5" || packStr === "validate5") packId = "validate5";
      else if (packStr === "10" || packStr === "rank10") packId = "rank10";
      else return text(lang === "es" ? "Los packs son de 5 o 10 creadores." : "The packs are 5 or 10 creators.");

      const pk = PACKS[packId];

      // Normalize creators.
      // Scheme-less platform links ("tiktok.com/@name") get https:// so the pay page accepts them.
      const withScheme = (v: string) =>
        /^(www\.|m\.)?(instagram|tiktok|youtube)\.com\//i.test(v) ? `https://${v}` : v;
      const normalized: PrefillCreator[] = creators.map((c) => {
        if (typeof c === "string") return { url: withScheme(c.trim()), platform: guessPlatform(c) };
        return { url: withScheme(c.handle.trim()), platform: c.platform ?? guessPlatform(c.handle) };
      });

      if (normalized.length === 0) {
        return text(lang === "es" ? "Añade al menos un creador." : "Add at least one creator.");
      }
      if (normalized.length > pk.creators) {
        return text(
          lang === "es"
            ? `Este pack admite hasta ${pk.creators} creadores. Has enviado ${normalized.length}.`
            : `This pack supports up to ${pk.creators} creators. You sent ${normalized.length}.`
        );
      }

      const payload: PrefillPayload = {
        v: 1,
        pack: packId,
        package: pk.formPackage,
        creators: normalized,
        brief,
        email,
      };

      const payLink = buildPayLink(payload);
      const pasteBlock = buildPasteBlock(payload);
      const fewer = normalized.length < pk.creators;

      const name = lang === "es" ? pk.name_es : pk.name_en;

      const en = [
        `${name}: €${pk.priceEUR}. ${normalized.length} creator${normalized.length === 1 ? "" : "s"} in this order${
          fewer ? ` (the pack covers up to ${pk.creators}; you can send the rest later by replying to the confirmation email)` : ""
        }.`,
        "",
        "1) Open this link to pay on Stripe. Your order is already inside it:",
        `   ${payLink}`,
        "",
        "2) Pay. That's it: your order goes in automatically, you can close the page after paying.",
        "",
        `3) Right after payment you'll get a confirmation email at ${email} with your order summary. If it doesn't arrive within a few minutes, check your spam or write to ${CONTACT}.`,
        "",
        "Your order:",
        pasteBlock
          .split("\n")
          .map((l) => `   ${l}`)
          .join("\n"),
        "",
        `Delivery: ${pk.turnaround_en}, reviewed by Sonia, to ${email}.`,
      ].join("\n");

      const es = [
        `${name}: €${pk.priceEUR}. ${normalized.length} creador${normalized.length === 1 ? "" : "es"} en este pedido${
          fewer ? ` (el pack cubre hasta ${pk.creators}; puedes enviar el resto después respondiendo al email de confirmación)` : ""
        }.`,
        "",
        "1) Abre este enlace para pagar en Stripe. Tu pedido ya va dentro:",
        `   ${payLink}`,
        "",
        "2) Paga. Nada más: tu pedido entra solo y puedes cerrar la página después de pagar.",
        "",
        `3) Justo después del pago recibirás un email de confirmación en ${email} con el resumen de tu pedido. Si no llega en unos minutos, mira en spam o escribe a ${CONTACT}.`,
        "",
        "Tu pedido:",
        pasteBlock
          .split("\n")
          .map((l) => `   ${l}`)
          .join("\n"),
        "",
        `Entrega: ${pk.turnaround_es}, revisado por Sonia, en ${email}.`,
      ].join("\n");

      return text(lang === "es" ? es : en);
    }
  );

  function guessPlatform(s: string): PrefillCreator["platform"] {
    const v = s.toLowerCase();
    if (v.includes("tiktok")) return "TikTok";
    if (v.includes("youtube") || v.includes("youtu.be")) return "YouTube";
    return "Instagram";
  }

  // ---- 4) book_find_and_vet -------------------------------------------------------------
  server.tool(
    "book_find_and_vet",
    "Use when the buyer has no shortlist yet and wants influencers or creators found and vetted for a campaign. Find + Vet by SoniaIA, €1,000 launch price for 10 creators, starts with a 15-minute call with Sonia. Give the campaign brief (product, goal, market, platforms) and optionally an email. Returns the booking link for the call and a pre-written email with the brief so Sonia arrives prepared. Takes no payment and stores nothing.",
    {
      brief: z
        .object({
          product: z.string().max(1000).describe("Product or service being promoted"),
          goal: z.string().max(1000).describe("What the campaign should achieve"),
          market: z.string().max(200).describe("Market and content language, e.g. 'Spain, Spanish'"),
          platforms: z.string().max(200).optional().describe("Platforms, e.g. 'TikTok, Instagram'"),
        })
        .optional()
        .describe("Campaign brief, if the buyer has one"),
      email: z.string().max(254).email().optional().describe("Optional buyer email"),
      language: z.enum(["en", "es"]).optional(),
    },
    async ({ brief, email, language }) => {
      if (!rateOk()) return text("Rate limit reached. Try again in a minute.");
      const lang = asLang(language ?? "en");
      const briefLines = brief
        ? [
            `Product/service: ${brief.product}`,
            `Objective: ${brief.goal}`,
            `Market/language: ${brief.market}`,
            ...(brief.platforms ? [`Platforms: ${brief.platforms}`] : []),
            ...(email ? [`Email: ${email}`] : []),
          ]
        : [];
      const mail = `mailto:${CONTACT}?subject=${encodeURIComponent("Find + Vet")}&body=${encodeURIComponent(
        ["Find + Vet: 10 creators for this campaign.", "", ...briefLines].join("\n")
      )}`;
      const en = [
        `${FIND_VET.name_en}: €1,000 launch price.`,
        "",
        "1) Book the 15-minute call with Sonia:",
        `   ${BOOKING_URL}`,
        "",
        ...(brief
          ? ["2) Send the brief ahead so the call starts from it:", `   ${mail}`, ...briefLines.map((l) => `   ${l}`), ""]
          : ["2) No brief yet? Fine. You build it on the call.", ""]),
        "After the call: the creators are found on real-time data, filtered and run through Creator Validator; you get 10 with a verdict on each plus a guide to what is working right now in your niche.",
        `Questions: ${CONTACT}.`,
      ].join("\n");
      const es = [
        `${FIND_VET.name_es}: 1.000 € (precio de lanzamiento).`,
        "",
        "1) Reserva la llamada de 15 minutos con Sonia:",
        `   ${BOOKING_URL}`,
        "",
        ...(brief
          ? ["2) Envía el brief antes para que la llamada empiece desde ahí:", `   ${mail}`, ...briefLines.map((l) => `   ${l}`), ""]
          : ["2) ¿Aún sin brief? No pasa nada, se saca en la llamada.", ""]),
        "Después de la llamada: se buscan los creadores con datos en tiempo real, se filtran y pasan por Creator Validator; recibes 10 con un veredicto cada uno y una guía de lo que está funcionando ahora en tu nicho.",
        `Dudas: ${CONTACT}.`,
      ].join("\n");
      return text(lang === "es" ? es : en);
    }
  );
  return server;
}
