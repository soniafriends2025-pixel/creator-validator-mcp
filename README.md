# Creator Validator MCP — influencer vetting in ChatGPT and Claude

Vet influencers and creators before you hire them, without leaving the chat. [Creator Validator](https://www.soniaia.com/tools/creator-validator) is a human-reviewed influencer vetting service by SoniaIA: it checks commercial intent (whether a creator's audience acts on what they recommend), audience quality and fake-follower risk, and delivers a Creator Dossier per creator with a clear verdict.

**Server URL:** `https://mcp.soniaia.com/mcp` (Streamable HTTP, no auth)

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

**Claude / ChatGPT:** add a custom connector with the server URL above.

Instagram, TikTok and YouTube. English and Spanish.

## About

Creator Validator by [Sonia Tamayo, AI marketing consultant](https://www.soniaia.com/ai-marketing-consultant) · [soniaia.com](https://www.soniaia.com)

Questions: hello@soniaia.com
