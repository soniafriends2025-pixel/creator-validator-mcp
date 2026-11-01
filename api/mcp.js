// Hosted MCP endpoint (Vercel function, served at /mcp via vercel.json).
// Stateless: a fresh server + transport per request, no sessions, nothing stored.
// Same tools as the local stdio build (dist/server.js, compiled from src/server.ts).
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createServer } from "../dist/server.js";

const MAX_BODY_BYTES = 64 * 1024; // tool calls are tiny; refuse anything bigger before parsing

// Read the body counting bytes as they arrive, so the cap holds even when the client
// sends no Content-Length (chunked). Returns null once the cap is passed.
async function readCapped(request) {
  if (!request.body) return new Uint8Array(0);
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.byteLength;
  }
  return out;
}

async function handle(request) {
  if (Number(request.headers.get("content-length") || 0) > MAX_BODY_BYTES) {
    return new Response("Request too large", { status: 413 });
  }
  let req = request;
  if (request.method === "POST") {
    const body = await readCapped(request);
    if (body === null) return new Response("Request too large", { status: 413 });
    req = new Request(request.url, { method: "POST", headers: request.headers, body });
  }
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await createServer().connect(transport);
  return transport.handleRequest(req);
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
