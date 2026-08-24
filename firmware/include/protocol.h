#pragma once
// Lockstep with src/lib/protocol/types.ts
// JSON keys: v, drive.left, drive.right, arm.extend, record, play, kill

#ifndef HS_PROTOCOL_VERSION
#define HS_PROTOCOL_VERSION 0
#endif

#define HS_SAMPLE_HZ 50
#define HS_RECORD_MIN_MS 1000
#define HS_RECORD_MAX_MS 3000

#define HS_KEY_V "v"
#define HS_KEY_DRIVE "drive"
#define HS_KEY_LEFT "left"
#define HS_KEY_RIGHT "right"
#define HS_KEY_ARM "arm"
#define HS_KEY_EXTEND "extend"
#define HS_KEY_RECORD "record"
#define HS_KEY_PLAY "play"
#define HS_KEY_KILL "kill"
#define HS_KEY_ACTION "action"
#define HS_KEY_NAME "name"
#define HS_KEY_ID "id"
#define HS_KEY_DURATION "durationSec"

#define HS_PIN_PWMA 7
#define HS_PIN_AIN1 8
#define HS_PIN_AIN2 9
#define HS_PIN_PWMB 10
#define HS_PIN_BIN1 11
#define HS_PIN_BIN2 12
#define HS_PIN_SERVO 4
#define HS_PIN_KILL 5

typedef struct {
  float left;   // -1 .. 1
  float right;  // -1 .. 1
  float extend; // 0 .. 1
  int kill;     // 0/1
} HsCommand;
