# HOUSE STEEL

Pit-crew lab log for **ATOM-0** — a 1 kg two-wheel punching robot.
Teachable jab. Pixel arcade twin. Not LEGO. Not a 2 m humanoid this quarter.

**Live:** (set after Vercel)

## Run locally

```bash
npm install
npm run dev
```

Open the pit, then **LAB**. Keyboard: WASD drive, J punch, Space kill, R record, P play.

## Firmware later

```bash
cd firmware
pio run -t upload
```

Same JSON as the twin. See `docs/PROTOCOL.md` and `firmware/include/protocol.h`.

## Agents

- [`/llms.txt`](./public/llms.txt)
- [`docs/AGENTS.md`](./docs/AGENTS.md)
- OpenAPI: `/openapi.yaml`
- MCP: `node mcp/server.mjs`

## Pages

| Path | What |
|---|---|
| `/` | Pit hero |
| `/lab` | Digital twin |
| `/spec` | BOM + protocol |
| `/log` | Episode 0 |
| `/crew` | Four stations |
| `/firmware` | ESP32-S3 |

Crew: Marko (lead), Drive (10), Arm (8), Test (6).
