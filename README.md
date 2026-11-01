# Creator Validator MCP — influencer vetting MCP server for Claude, ChatGPT, Grok, Gemini and Cursor

Vet influencers before a campaign without leaving the chat: creator vetting, who a creator's audience really is and whether it acts on their recommendations, momentum, and creator due diligence for influencer campaigns. [Creator Validator](https://www.soniaia.com/tools/creator-validator) is a human-reviewed influencer vetting service by SoniaIA: a qualitative and quantitative assessment on real-time data of commercial intent (whether the audience acts on what the creator recommends), who the audience is, momentum, personality and vibe, and authenticity signals, with a Creator Dossier and a clear verdict per creator against your brief.

**Server URL:** `https://mcp.soniaia.com/mcp` (Streamable HTTP, no auth)

## What gets checked

A qualitative and quantitative assessment of each creator on real-time data, reviewed by a person:

- **Commercial intent:** how the audience relates to the creator, and whether it acts on what they recommend
- **Audience:** who their audience is
- **Momentum:** alive, peaking, flat or inflated
- **Personality and vibe:** tone, style and the kind of content they make
- **Authenticity signals:** whether the followers and engagement look real

One verdict per creator against your brief: approve for shortlist, caution (conditions apply), or cut or hold.

**Want help selecting creators? Find + Vet** finds and vets them for you: the right creators for your brief (brand style, audience, campaign objective), selected on real-time data (right audience age and location, growing, high engagement), each vetted with a verdict, plus the angles and formats working in your niche now. €1,000 launch price for 10 creators, starts with a 15-minute call.

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
| `start_order` | Give the creator handles or profile links, the brief and the buyer email (the assistant confirms it first); returns one link that opens Stripe payment with the order inside it. Once paid, the order goes in automatically and a confirmation email follows |
| `book_find_and_vet` | No shortlist yet? Returns the booking link for a 15-minute call and a pre-written email with the brief |

The server takes no payment, holds no keys and stores nothing. Payment happens on Stripe; the order travels inside the Stripe payment and is submitted by soniaia.com once paid. Price is set by soniaia.com from the pack (Validate 5 €300, Rank 10 €500), never by the link.

## Connect

**Claude Code**

```
claude mcp add --transport http creator-validator https://mcp.soniaia.com/mcp
```

**Claude / ChatGPT / Grok:** add a custom connector with the server URL above.

**Cursor / Gemini CLI:** add the server URL in your MCP settings.

Instagram, TikTok and YouTube. English and Spanish.

## About

Creator Validator by [Sonia Tamayo, AI marketing consultant](https://www.soniaia.com/ai-marketing-consultant) · [soniaia.com](https://www.soniaia.com)

Questions: hello@soniaia.com
