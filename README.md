# HOUSE STEEL

Pit-crew lab log for **ATOM-0** — a 1 kg two-wheel punching robot.
Teachable jab. Pixel arcade twin. Not LEGO. Not a 2 m humanoid this quarter.

**Live:** [https://house-steel-omega.vercel.app](https://house-steel-omega.vercel.app)  
**Repo:** [unicadesign/house-steel](https://github.com/unicadesign/house-steel)

## Run locally

```bash
npm install
npm run dev
```

Open the pit, then **LAB**. Keyboard: WASD drive, J punch, Space kill, R record, P play. Gamepad works. Touch stick on phones.

## Firmware later

```bash
cd firmware
pio run -t upload
```

Same JSON as the twin. See `docs/PROTOCOL.md` and `firmware/include/protocol.h`.

## Agents

- [`/llms.txt`](https://house-steel-omega.vercel.app/llms.txt)
- [`docs/AGENTS.md`](./docs/AGENTS.md)
- OpenAPI: [`/openapi.yaml`](https://house-steel-omega.vercel.app/openapi.yaml)
- MCP: `HOUSE_STEEL_URL=https://house-steel-omega.vercel.app node mcp/server.mjs`

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
