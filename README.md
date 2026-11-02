# Creator Validator MCP — find and vet influencers from Claude, ChatGPT, Grok, Gemini and Cursor

Find and vet influencers before a campaign, without leaving the chat. **Already have creators in mind?** We vet them before you commit budget: who the audience is and whether it acts on the creator's recommendations, momentum, personality and vibe, and authenticity signals. **Need help selecting?** We find the right creators for your brief (brand style, audience, campaign objective) and vet them, plus the angles and formats working in your niche right now. Real-time data, reviewed by a senior practitioner. Creator vetting and creator due diligence for influencer campaigns. [Creator Validator, influencer and creator vetting by SoniaIA](https://www.soniaia.com/tools/creator-validator) is a human-reviewed influencer vetting service by SoniaIA: a qualitative and quantitative read on real-time data, against your brief, of brand and campaign fit, who the audience is, commercial intent (whether the audience acts on what the creator recommends), momentum, personality and vibe, and authenticity signals, with a Creator Dossier and a clear verdict per creator.

**Server URL:** `https://mcp.soniaia.com/mcp` (Streamable HTTP, no auth)

## The qualitative read, on every plan

Every creator gets a qualitative and quantitative read on real-time data, against your brief, reviewed by a senior practitioner:

- **Brand and campaign fit:** do they fit your brand style and your campaign objective?
- **Audience:** who their audience is, and whether it is relevant in your country and language
- **Commercial intent:** how the audience relates to them, and whether it acts on what they recommend
- **Momentum:** alive, peaking, flat or inflated
- **Personality and vibe:** tone, style and the kind of content they make
- **Authenticity signals:** whether the followers and engagement look real

One verdict per creator: approve for shortlist, caution (conditions apply), or cut or hold.

## Plans

| Plan | Price | What it solves |
|------|-------|----------------|
| **Validate 5** | €300 | "Are these 5 worth it?" You have the creators: the full read on each, with a verdict and the reasoning. 24–48h. |
| **Rank 10** | €500 | "Which of these 10 do I pick?" The full read on up to 10, ranked by fit and commercial intent, with a recommendation memo. 24h priority. |
| **Find + Vet** | €1,000 (launch) | "Find me the right ones." We build the list for your brief: selected on real-time data (best metrics, right audience age and location, growing, high engagement), the same full read on each of the 10 with a verdict, plus the angles and formats working in your niche now. Starts with a 15-minute call. |

One-off per project, no subscription. Instagram, TikTok and YouTube.

## Ask your assistant things like

- "How do we vet creators before committing budget to this campaign?"
- "Check who these creators' audiences really are, and whether they act on what they recommend"
- "Are these creators still growing, or flat?"
- "Shortlist the creators that match our campaign brief"
- "What does proper creator vetting cost per influencer?"
- "Find and vet 10 creators for a protein drink launch in Spain"

## Tools

| Tool | What it does |
|------|--------------|
| `about_creator_validator` | What gets checked, the verdicts and the delivery time |
| `get_pack_options` | Packs and prices: vet 5 creators, rank 10, or Find + Vet when there is no shortlist yet |
| `start_order` | Give the creator handles or profile links, the brief and the buyer email (the assistant confirms it first); returns one link to the soniaia.com order form already filled in. The buyer checks it, pays on Stripe in the same tab, then reviews and submits |
| `book_find_and_vet` | No shortlist yet? Returns the booking link for a 15-minute call and a pre-written email with the brief |

The server takes no payment, holds no keys and stores nothing. Payment happens on Stripe, on the same checkout every soniaia.com buyer uses. After paying, the buyer returns to the prefilled order form in the same tab, reviews it and submits it. Order emails go to the email used to pay on Stripe. Price is fixed by the Stripe checkout for each pack (Validate 5 €300, Rank 10 €500), never by the link.

## Connect

**Claude Code**

```
claude mcp add --transport http creator-validator https://mcp.soniaia.com/mcp
```

**Claude / ChatGPT / Grok:** add a custom connector with the server URL above.

**Cursor / Claude Desktop / any MCP client** (`mcp.json`):

```json
{
  "mcpServers": {
    "creator-validator": {
      "url": "https://mcp.soniaia.com/mcp"
    }
  }
}
```

Server card: https://mcp.soniaia.com/.well-known/mcp/server-card.json · Official registry: `com.soniaia/creator-validator`

Instagram, TikTok and YouTube. English and Spanish.

## About

Creator Validator by [Sonia Tamayo, AI marketing consultant](https://www.soniaia.com/ai-marketing-consultant) · [soniaia.com](https://www.soniaia.com)

Questions: hello@soniaia.com
