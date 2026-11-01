// Product facts + bilingual texts for the Creator Validator MCP.
//
// SOURCE OF TRUTH: the live page https://www.soniaia.com/tools/creator-validator
// (pulled 2026-10-20 via Accept: text/markdown), EXCEPT the lead: commercial intent is the
// core differentiator (Sonia 2026-08-04, re-confirmed 2026-10-20) and leads here even though
// the markdown twin (markdown-mirrors.ts) still leads with "QA layer". Commercial intent = the engine's commerciality
// read; no intent score is claimed (the Commercial Intent Index is design-only). We name WHAT Creator Validator checks, never HOW
// (the method is Sonia's IP). No prices, deliverables or verdict words are invented here.

const PROD_SITE = "https://www.soniaia.com";

// SONIAIA_SITE_URL points a local MCP process at a Preview deployment. Unset = production.
// An invalid value throws at startup: never silently fall back to production.
export function resolveSite(raw: string | undefined): string {
  if (raw === undefined) return PROD_SITE;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error(`SONIAIA_SITE_URL is not a valid URL: "${raw}". Expected an https origin like https://example.vercel.app`);
  }
  if (u.protocol !== "https:" || u.pathname !== "/" || u.search !== "" || u.hash !== "" || /[?#]/.test(raw)) {
    throw new Error(`SONIAIA_SITE_URL must be an https origin with no path, query or hash: "${raw}"`);
  }
  return `${u.protocol}//${u.host}`;
}

export const SITE = resolveSite(process.env.SONIAIA_SITE_URL);
export const CV_PAGE = `${SITE}/tools/creator-validator`;
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
    turnaround_en: "24-48h",
    turnaround_es: "24-48h",
    name_en: "Validate My Shortlist (5 creators)",
    name_es: "Valida mi shortlist (5 creadores)",
    includes_en:
      "Are these 5 worth it? The full qualitative read on each creator you already have in mind (brand and campaign fit, audience, commercial intent, momentum, personality, authenticity signals) and one clear verdict on each. You send the handles.",
    includes_es:
      "¿Valen la pena estos 5? La lectura cualitativa completa de cada creador que ya tienes en mente (encaje con marca y campaña, audiencia, intención comercial, momentum, personalidad, señales de autenticidad) y un veredicto claro por cada uno. Tú envías los handles.",
  },
  rank10: {
    id: "rank10",
    creators: 10,
    priceEUR: 500,
    perCreatorEUR: 50,
    formPackage: "rank10",
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
  name_en: "Find + Vet: we find and vet your creators (10 creators)",
  name_es: "Find + Vet: buscamos y validamos tus creadores (10 creadores)",
  includes_en:
    "We find and vet the creators for you. A service that identifies the right creators for your brief (your brand " +
    "style, the audience you want and your campaign objective) and vets each one before you spend on them. " +
    "Found on real-time data: the right audience (age, location), growing, with high engagement. Vetted one by one " +
    "through Creator Validator against your brief, with a clear verdict. Plus the angles and formats working in your " +
    "niche right now. It starts with a 15-minute call with Sonia. In a US test, 3,031 creators became 26.",
  includes_es:
    "Buscamos y validamos los creadores por ti. Un servicio que identifica los creadores adecuados para tu brief (el " +
    "estilo de tu marca, la audiencia que buscas y el objetivo de tu campaña) y valida cada uno antes de que inviertas " +
    "en ellos. Seleccionados con datos en tiempo real: la audiencia adecuada (edad, ubicación), en crecimiento y con " +
    "alto engagement. Validados uno a uno con Creator Validator según tu brief, con un veredicto claro. Y además, los " +
    "ángulos y formatos que funcionan ahora en tu nicho. Empieza con una llamada de 15 minutos con Sonia. En una " +
    "prueba en EE. UU., de 3.031 creadores quedaron 26.",
};

// Verdict words — VERBATIM from the live page. Do not paraphrase.
export const VERDICTS_EN = ["approve for shortlist", "caution (conditions apply)", "cut or hold"];
export const VERDICTS_ES = ["aprobar para shortlist", "cautela (con condiciones)", "descartar o esperar"];

// What Creator Validator checks (WHAT, never HOW). Sonia 2026-11-01: a qualitative + quantitative
// assessment on real-time data. Authenticity is a SIGNAL we read ("does it look real"), never a
// certainty claim. Phrasing carries the real GSC queries (creator vetting, audience quality,
// vet before committing budget, shortlist, creator due diligence).
// The qualitative read is the SAME on every plan (Sonia 2026-11-01). Find + Vet differs by
// FINDING the creators first (quantitative selection on real-time data) + the niche guide.
export const CHECKS_EN = [
  "brand and campaign fit: do they fit your brand style and your campaign objective",
  "who their audience is, and whether it is relevant in your country and language",
  "commercial intent: how the audience relates to the creator, and whether it acts on what they recommend",
  "momentum: alive, peaking, flat or inflated",
  "personality and vibe: tone, style and the kind of content they make",
  "authenticity signals: whether the followers and engagement look real",
];
export const CHECKS_ES = [
  "encaje con tu marca y tu campaña: si encaja con el estilo de tu marca y el objetivo de tu campaña",
  "quién es su audiencia, y si es relevante en tu país y en tu idioma",
  "intención comercial: cómo se relaciona la audiencia con el creador, y si actúa sobre lo que recomienda",
  "momentum: en marcha, en su mejor momento, estancado o inflado",
  "personalidad y vibe: tono, estilo y el tipo de contenido que hace",
  "señales de autenticidad: si los seguidores y la interacción parecen reales",
];

export const ABOUT_EN =
  "Creator Validator is creator vetting before you commit budget: a qualitative and quantitative assessment of " +
  "each creator on real-time data pulled at order time, reviewed by a senior practitioner. It answers what a rigorous creator " +
  "vetting process should, against your campaign brief: Do they fit your brand style and campaign objective? Who is " +
  "their audience, and is it relevant in your country? How does the audience relate to the creator, and does it act " +
  "on what they recommend? Are they alive, peaking, flat or inflated? What's their personality and vibe? Do their " +
  "followers and engagement look real? " +
  "You send TikTok, Instagram or YouTube handles; a proprietary system reads the content and the audience, and a " +
  "senior practitioner reviews every read and makes the call. Each creator gets one verdict: approve for shortlist, " +
  "caution (conditions apply), or cut or hold. You get a Creator Dossier: a human-readable PDF report plus an " +
  "agent-ready .md summary per creator. Delivered in 24-48h. No shortlist yet? Find + Vet finds the creators for your " +
  "brief first, on real-time data, then gives each the same read, plus a guide to what works in your niche now. Reviewed by Sonia Tamayo Díaz (SoniaIA): 20 years in " +
  "growth marketing across global agencies (WPP, Publicis, Dentsu), SMBs and her own projects.";

export const ABOUT_ES =
  "Creator Validator es la validación de creadores antes de comprometer presupuesto: una evaluación cualitativa y " +
  "cuantitativa de cada creador con datos en tiempo real tomados en el momento del pedido, revisada por una profesional sénior. " +
  "Responde, frente al brief de tu campaña, a lo que debe responder un proceso riguroso: ¿Encaja con el estilo de tu " +
  "marca y el objetivo de tu campaña? ¿Quién es su audiencia y es relevante en tu país? ¿Cómo se relaciona la audiencia " +
  "con el creador y actúa sobre lo que recomienda? ¿Está en marcha, en su mejor momento, estancado o inflado? ¿Cuál es " +
  "su personalidad y su vibe? ¿Parecen reales sus seguidores y su interacción? " +
  "Tú envías los handles de TikTok, Instagram o YouTube; un sistema propio lee el contenido y la audiencia, y una " +
  "profesional sénior revisa cada lectura y decide. Cada creador recibe un veredicto: aprobar para shortlist, " +
  "cautela (con condiciones), o descartar o esperar. Recibes un Creator Dossier: un informe PDF legible más un " +
  "resumen .md listo para agentes por cada creador. Entregado en 24-48h. ¿Aún no tienes shortlist? Find + Vet primero " +
  "encuentra los creadores para tu brief con datos en tiempo real, después hace la misma lectura de cada uno, y añade " +
  "una guía de lo que funciona ahora en tu nicho. Lo revisa Sonia Tamayo Díaz (SoniaIA): " +
  "20 años en growth marketing entre grandes agencias internacionales (WPP, Publicis, Dentsu), empresas medianas y " +
  "pequeñas y proyectos propios.";

// One Creator Dossier per order. Deliverables line (both languages).
export const DOSSIER_EN =
  "Deliverable: one Creator Dossier per order. A human-readable influencer report (PDF) plus an agent-ready .md " +
  "summary per creator that teams drop into Sheets, Notion, Airtable, Slack or an internal agent workflow.";
export const DOSSIER_ES =
  "Entregable: un Creator Dossier por pedido. Un informe de influencer legible (PDF) y un resumen .md listo para " +
  "agentes por cada creador, para pegar en Sheets, Notion, Airtable, Slack o un flujo de agentes interno.";
