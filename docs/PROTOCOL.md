# PROTOCOL v0

One JSON object. Twin, HTTP, MCP, ESP32-S3.

```json
{
  "v": 0,
  "drive": { "left": 0.0, "right": 0.0 },
  "arm": { "extend": 0.0 },
  "record": { "action": "start", "name": "JAB", "durationSec": 2 },
  "play": { "id": "seed-jab", "name": "JAB" },
  "kill": false
}
```

| Field | Range | Meaning |
|---|---|---|
| `v` | `0` | protocol version |
| `drive.left` | -1..1 | left wheel PWM |
| `drive.right` | -1..1 | right wheel PWM |
| `arm.extend` | 0..1 | 0 retracted, 1 full jab |
| `record.action` | start\|stop | clip capture 1–3 s @ 50 Hz |
| `play.id` / `play.name` | string | replay a named clip |
| `kill` | bool | zeros drive, retracts arm, aborts rec/play |

Types: `src/lib/protocol/types.ts`
Header: `firmware/include/protocol.h`
OpenAPI: `/openapi.yaml`
HTTP: `/api/spec` `/api/moves` `/api/moves/{id}/play` `/api/record/start` `/api/record/stop` `/api/command` `/api/episodes`

Clips in the browser live in `localStorage` key `house-steel.moves.v1`. Seed clip: `JAB`.
