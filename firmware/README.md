# ATOM-0 firmware (ESP32-S3)

Newline-delimited JSON on USB serial. Same object as `src/lib/protocol/types.ts` and `include/protocol.h`.

```json
{"v":0,"drive":{"left":0.3,"right":0.3},"arm":{"extend":0},"kill":false}
```

Kill (`kill: true` or GPIO 5 to GND) zeros both wheels and retracts the servo.

Flash with PlatformIO when the board exists. Do not invent a second protocol.
