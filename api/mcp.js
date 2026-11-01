// Hosted MCP endpoint (Vercel function, served at /mcp via vercel.json).
// Stateless: a fresh server + transport per request, no sessions, nothing stored.
// Same tools as the local stdio build (dist/server.js, compiled from src/server.ts).
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createServer } from "../dist/server.js";

const MAX_BODY_BYTES = 64 * 1024; // tool calls are tiny; refuse anything bigger before parsing

async function handle(request) {
  const len = Number(request.headers.get("content-length") || 0);
  if (len > MAX_BODY_BYTES) return new Response("Request too large", { status: 413 });
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await createServer().connect(transport);
  return transport.handleRequest(request);
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
