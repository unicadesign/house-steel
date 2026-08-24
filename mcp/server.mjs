#!/usr/bin/env node
/**
 * House Steel MCP — wraps the HTTP API.
 * Tools: list_moves, play_move, get_spec, get_episode
 * Stdio JSON-RPC 2.0 (MCP initialize / tools/list / tools/call)
 */
const BASE = process.env.HOUSE_STEEL_URL || "http://127.0.0.1:8080";

const TOOLS = [
  {
    name: "list_moves",
    description: "List named teachable moves (seed + server library).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "play_move",
    description: "Fetch frames for a named move. Does not scrape the canvas.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Move id or name, e.g. seed-jab or JAB" },
        name: { type: "string" },
      },
    },
  },
  {
    name: "get_spec",
    description: "ATOM-0 spec and protocol keys.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_episode",
    description: "Pit log episode. Default ep-0.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Episode id, default ep-0" } },
    },
  },
];

async function callTool(name, args = {}) {
  if (name === "list_moves") {
    const r = await fetch(`${BASE}/api/moves`);
    return await r.json();
  }
  if (name === "get_spec") {
    const r = await fetch(`${BASE}/api/spec`);
    return await r.json();
  }
  if (name === "get_episode") {
    const id = args.id || "ep-0";
    const r = await fetch(`${BASE}/api/episodes/${id}`);
    if (!r.ok) throw new Error(`episode ${id} not found`);
    return await r.json();
  }
  if (name === "play_move") {
    const id = encodeURIComponent(args.id || args.name || "seed-jab");
    const r = await fetch(`${BASE}/api/moves/${id}/play`, { method: "POST" });
    if (!r.ok) throw new Error(`move ${id} not found`);
    return await r.json();
  }
  throw new Error(`unknown tool ${name}`);
}

function send(msg) {
  const json = JSON.stringify(msg);
  process.stdout.write(`Content-Length: ${Buffer.byteLength(json)}\r\n\r\n${json}`);
}

function handle(msg) {
  if (!msg || typeof msg !== "object") return;
  const { id, method, params } = msg;
  const reply = (result) => {
    if (id !== undefined) send({ jsonrpc: "2.0", id, result });
  };
  const fail = (code, message) => {
    if (id !== undefined) send({ jsonrpc: "2.0", id, error: { code, message } });
  };

  if (method === "initialize") {
    reply({
      protocolVersion: params?.protocolVersion || "2024-11-05",
      serverInfo: { name: "house-steel", version: "0" },
      capabilities: { tools: {} },
    });
    return;
  }
  if (method === "notifications/initialized") return;
  if (method === "tools/list") {
    reply({ tools: TOOLS });
    return;
  }
  if (method === "tools/call") {
    const name = params?.name;
    const args = params?.arguments || {};
    callTool(name, args)
      .then((result) =>
        reply({
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }),
      )
      .catch((err) => fail(-32000, String(err.message || err)));
    return;
  }
  if (method === "ping") {
    reply({});
    return;
  }
  fail(-32601, `unknown method ${method}`);
}

let buf = Buffer.alloc(0);
process.stdin.on("data", (chunk) => {
  buf = Buffer.concat([buf, chunk]);
  while (true) {
    const headerEnd = buf.indexOf("\r\n\r\n");
    if (headerEnd < 0) {
      const nl = buf.indexOf("\n");
      if (nl >= 0 && !buf.subarray(0, nl).toString().includes("Content-Length")) {
        const line = buf.subarray(0, nl).toString().trim();
        buf = buf.subarray(nl + 1);
        if (line) {
          try {
            handle(JSON.parse(line));
          } catch {
            /* ignore */
          }
        }
        continue;
      }
      break;
    }
    const header = buf.subarray(0, headerEnd).toString();
    const m = header.match(/Content-Length:\s*(\d+)/i);
    if (!m) {
      buf = buf.subarray(headerEnd + 4);
      continue;
    }
    const len = Number(m[1]);
    const start = headerEnd + 4;
    if (buf.length < start + len) break;
    const body = buf.subarray(start, start + len).toString();
    buf = buf.subarray(start + len);
    try {
      handle(JSON.parse(body));
    } catch (err) {
      send({ jsonrpc: "2.0", error: { code: -32700, message: String(err) } });
    }
  }
});

process.stdin.resume();
