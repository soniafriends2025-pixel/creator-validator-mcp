/**
 * Local test harness: spawns the built server over stdio and calls each tool.
 * Prints the exact text a buyer (via Claude) would see. Takes no payment.
 *   node dist/test-client.js
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, "index.js");

function show(title: string, res: unknown) {
  const content = (res as { content?: Array<{ type: string; text?: string }> }).content ?? [];
  const body = content.map((c) => c.text ?? "").join("\n");
  console.log(`\n===== ${title} =====\n${body}`);
}

async function main() {
  const transport = new StdioClientTransport({ command: process.execPath, args: [serverPath] });
  const client = new Client({ name: "cv-test-client", version: "0.1.0" });
  await client.connect(transport);

  const tools = await client.listTools();
  console.log("TOOLS:", tools.tools.map((t) => t.name).join(", "));

  show("about_creator_validator (en)", await client.callTool({ name: "about_creator_validator", arguments: { language: "en" } }));
  show("about_creator_validator (es)", await client.callTool({ name: "about_creator_validator", arguments: { language: "es" } }));
  show("get_pack_options (es)", await client.callTool({ name: "get_pack_options", arguments: { language: "es" } }));
  show("book_find_and_vet with brief (en)", await client.callTool({ name: "book_find_and_vet", arguments: { brief: { product: "A plant protein brand", goal: "qualified visits to the shop", market: "Spain, Spanish", platforms: "TikTok, Instagram" }, email: "agency@example.com", language: "en" } }));
  show("book_find_and_vet no brief (es)", await client.callTool({ name: "book_find_and_vet", arguments: { language: "es" } }));

  show(
    "start_order 5-pack with brief (en)",
    await client.callTool({
      name: "start_order",
      arguments: {
        pack: 5,
        creators: [
          "https://www.tiktok.com/@creatorone",
          "https://instagram.com/creatortwo",
          { handle: "https://youtube.com/@creatorthree", platform: "YouTube" },
          "https://instagram.com/creatorfour",
          "https://www.tiktok.com/@creatorfive",
        ],
        brief: { product: "A plant protein brand", goal: "qualified visits to the shop", market: "Spain, Spanish" },
        email: "agency@example.com",
        language: "en",
      },
    })
  );

  show(
    "start_order wrong pack size (es)",
    await client.callTool({ name: "start_order", arguments: { pack: 7, creators: ["a", "b"], brief: { product: "A plant protein brand", goal: "qualified visits", market: "Spain, Spanish" }, email: "agency@example.com", language: "es" } })
  );

  show(
    "start_order too many creators (en)",
    await client.callTool({
      name: "start_order",
      arguments: { pack: 5, creators: ["1", "2", "3", "4", "5", "6"], brief: { product: "A plant protein brand", goal: "qualified visits", market: "Spain, Spanish" }, email: "agency@example.com", language: "en" },
    })
  );

  show(
    "start_order missing brief + email (agent must ask)",
    await client.callTool({ name: "start_order", arguments: { pack: 5, creators: ["@a"], language: "en" } })
  );

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
