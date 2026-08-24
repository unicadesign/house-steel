# AGENTS — House Steel

You are talking to a pit-crew lab, not a toy shop.

## Run
- Dev: `npm run dev` (serves the pit)
- Build: `npm run build`
- Twin: open `/lab`
- Firmware later: `cd firmware && pio run`

## Protocol
Single JSON `{ drive, arm, record, play, kill }` in:
- `src/lib/protocol/types.ts`
- `firmware/include/protocol.h`
- `docs/PROTOCOL.md`
- `/openapi.yaml`

Do not invent a second protocol. Do not fake a neural net. Do not claim vision.

## HTTP (agents never scrape the canvas)
- `GET /api/spec`
- `GET /api/moves`
- `GET /api/moves/{id}`
- `POST /api/moves/{id}/play`
- `POST /api/record/start`
- `POST /api/record/stop` (body: `{ name, frames }`)
- `POST /api/command`
- `GET /api/episodes` and `GET /api/episodes/ep-0`

## MCP
`node mcp/server.mjs` — tools: `list_moves`, `play_move`, `get_spec`, `get_episode`.
Set `HOUSE_STEEL_URL` if not local.

## Moves
Browser library is `localStorage`. Seed `JAB` is in `src/lib/protocol/library.ts`.
Record 1–3 seconds of drive + arm, name the clip, play it back.

## Taste
Pixel arcade pit. Graphite + amber. Not pastel. Not LEGO. Not STEM Saturday.
