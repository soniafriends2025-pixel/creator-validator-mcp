// Product facts + bilingual texts for the Creator Validator MCP.
//
// SOURCE OF TRUTH: the live page https://www.soniaia.com/tools/creator-validator
// (pulled 2026-10-20 via Accept: text/markdown), EXCEPT the lead: commercial intent is the
// core differentiator (Sonia 2026-08-04, re-confirmed 2026-10-20) and leads here even though
// the markdown twin (markdown-mirrors.ts) still leads with "QA layer". Commercial intent = the engine's commerciality
// read; no intent score is claimed (the Commercial Intent Index is design-only). We name WHAT Creator Validator checks, never HOW
// (the method is Sonia's IP). No prices, deliverables or verdict words are invented here.

export const SITE = "https://www.soniaia.com";
export const CV_PAGE = "https://www.soniaia.com/tools/creator-validator";
export const CONTACT = "hello@soniaia.com";

// The two paid-by-link packs (no 20-pack, no single). Find+Vet is separate: call first.
export type PackId = "validate5" | "rank10";

export interface Pack {
  id: PackId;
  creators: 5 | 10;
  priceEUR: number;
  perCreatorEUR: number;
  // packageType value the soniaia.com form + submit route already understand.
  formPackage: string;
  paymentLink: string;
  turnaround_en: string;
  turnaround_es: string;
  name_en: string;
  name_es: string;
  includes_en: string;
  includes_es: string;
}

export const PACKS: Record<PackId, Pack> = {
  validate5: {
    id: "validate5",
    creators: 5,
    priceEUR: 300,
    perCreatorEUR: 60,
    formPackage: "validate5",
    paymentLink: "https://buy.stripe.com/00waEW1EH4aW59cf2U6Vq03",
    turnaround_en: "24-48h",
    turnaround_es: "24-48h",
    name_en: "Validate My Shortlist (5 creators)",
    name_es: "Valida mi shortlist (5 creadores)",
    includes_en:
      "5 creators you already have in mind: commercial intent, audience quality, authenticity risk, and one clear verdict on each. You send the handles.",
    includes_es:
      "5 creadores que ya tienes en mente: intención comercial, calidad de audiencia, riesgo de autenticidad y un veredicto claro por cada uno. Tú envías los handles.",
  },
  rank10: {
    id: "rank10",
    creators: 10,
    priceEUR: 500,
    perCreatorEUR: 50,
    formPackage: "rank10",
    paymentLink: "https://buy.stripe.com/7sY00i3MPfTEfNQ1c46Vq04",
    turnaround_en: "24h (priority)",
    turnaround_es: "24h (prioridad)",
    name_en: "Rank My Shortlist (10 creators)",
    name_es: "Ordena mi shortlist (10 creadores)",
    includes_en:
      "10 creators validated and ranked by fit and commercial intent, with a recommendation memo and the reasoning behind each call.",
    includes_es:
      "10 creadores validados y ordenados por encaje e intención comercial, con un memo de recomendación y el razonamiento detrás de cada decisión.",
  },
};

// Find + Vet (Sonia 2026-11-01): the premium tier. No payment link: it starts with a
// 15-minute call booked on Google Calendar. Launch price. Texts mirror the live card.
export const BOOKING_URL =
  "https://calendar.app.google/HnzBFkMAEHVidghC9";
export const FIND_VET = {
  priceEUR: 1000,
  creators: 10,
  name_en: "Find + Vet My Shortlist (10 creators)",
  name_es: "Find + Vet: buscamos y validamos tu shortlist (10 creadores)",
  includes_en:
    "No shortlist yet? A 15-minute call with Sonia about your campaign. Then the market is filtered on real-time data: " +
    "quality, fit with your brand and campaign, and where the audience really is (in a US test, 3,031 creators became 26). " +
    "Each one goes through Creator Validator against your brief: who their audience is and what it actually does, with a " +
    "verdict. Plus a guide to what is working right now in your niche, so you can adapt your content strategy to proven cases and negotiate better.",
  includes_es:
    "¿Aún no tienes shortlist? Una llamada de 15 minutos con Sonia sobre tu campaña. Después filtramos el mercado con datos " +
    "en tiempo real: calidad, encaje con tu marca y tu campaña, y dónde está de verdad la audiencia (en una prueba en EE. UU., " +
    "de 3.031 creadores quedaron 26). Cada uno pasa por Creator Validator según tu brief: quién es su audiencia y qué hace de " +
    "verdad, con un veredicto. Y recibes una guía de lo que está funcionando ahora en tu nicho, para adaptar tu estrategia de " +
    "contenido a casos probados y negociar mejor.",
};

// Verdict words — VERBATIM from the live page. Do not paraphrase.
export const VERDICTS_EN = ["approve for shortlist", "caution (conditions apply)", "cut or hold"];
export const VERDICTS_ES = ["aprobar para shortlist", "cautela (con condiciones)", "descartar o esperar"];

// What CreatorValidator checks (WHAT, never HOW). Commercial intent first — it is the
// differentiator; authenticity stays in the list as supporting signal + search vocabulary.
export const CHECKS_EN = [
  "commercial intent (whether the audience acts on what the creator recommends)",
  "audience quality",
  "authenticity risk (fake followers, bought engagement)",
  "creator personality",
  "momentum",
];
export const CHECKS_ES = [
  "intención comercial (si la audiencia actúa sobre lo que el creador recomienda)",
  "calidad de audiencia",
  "riesgo de autenticidad (seguidores falsos, engagement comprado)",
  "personalidad del creador",
  "momentum",
];

export const ABOUT_EN =
  "Creator Validator reads a creator's commercial intent before you hire them: whether their audience actually " +
  "acts on what they recommend, or just watches. It runs before a creator reaches the deck, the gifting list or a " +
  "paid campaign. You send TikTok, Instagram or YouTube handles; a proprietary system reads the content and audience " +
  "in depth on live data pulled at order time, and a senior practitioner reviews every read and makes the call. " +
  "Each creator gets one verdict: approve for shortlist, caution (conditions apply), or cut or hold. Alongside " +
  "commercial intent it checks audience quality, authenticity risk, creator personality and momentum. " +
  "You get a Creator Dossier: a human-readable PDF report plus an agent-ready .md summary per creator. " +
  "Human-reviewed, delivered in 24-48h. Reviewed by Sonia Tamayo Díaz (SoniaIA): 20 years in growth marketing across global " +
  "agencies (WPP, Publicis, Dentsu), SMBs and her own projects.";

export const ABOUT_ES =
  "Creator Validator lee la intención comercial de un creador antes de contratarlo: si su audiencia de verdad " +
  "actúa sobre lo que recomienda, o solo mira. Se hace antes de que el creador entre en la presentación, en la " +
  "lista de gifting o en una campaña de pago. Tú envías los handles de TikTok, Instagram o YouTube; un sistema " +
  "propio lee el contenido y la audiencia en profundidad con datos en vivo tomados en el momento del pedido, y una " +
  "profesional sénior revisa cada lectura y decide. Cada creador recibe un veredicto: aprobar para shortlist, " +
  "cautela (con condiciones), o descartar o esperar. Además de la intención comercial revisa calidad de audiencia, " +
  "riesgo de autenticidad, personalidad del creador y momentum. Recibes un Creator Dossier: " +
  "un informe PDF legible más un resumen .md listo para agentes por cada creador. Revisado por una persona, " +
  "entregado en 24-48h. Lo revisa Sonia Tamayo Díaz (SoniaIA): 20 años en growth marketing entre " +
  "grandes agencias internacionales (WPP, Publicis, Dentsu), empresas medianas y pequeñas y proyectos propios.";

// One Creator Dossier per order. Deliverables line (both languages).
export const DOSSIER_EN =
  "Deliverable: one Creator Dossier per order. A human-readable influencer report (PDF) plus an agent-ready .md " +
  "summary per creator that teams drop into Sheets, Notion, Airtable, Slack or an internal agent workflow.";
export const DOSSIER_ES =
  "Entregable: un Creator Dossier por pedido. Un informe de influencer legible (PDF) y un resumen .md listo para " +
  "agentes por cada creador, para pegar en Sheets, Notion, Airtable, Slack o un flujo de agentes interno.";
