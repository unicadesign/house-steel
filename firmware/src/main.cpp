#include <Arduino.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>
#include "protocol.h"

static Servo punch;
static HsCommand cmd = {0, 0, 0, 0};
static String line;

static float clampf(float v, float lo, float hi) {
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}

static void writeDrive(float left, float right) {
  auto wheel = [](float v, int pwm, int in1, int in2) {
    int mag = (int)(fabsf(v) * 255.0f);
    if (v > 0.02f) {
      digitalWrite(in1, HIGH);
      digitalWrite(in2, LOW);
    } else if (v < -0.02f) {
      digitalWrite(in1, LOW);
      digitalWrite(in2, HIGH);
    } else {
      digitalWrite(in1, LOW);
      digitalWrite(in2, LOW);
      mag = 0;
    }
    analogWrite(pwm, mag);
  };
  wheel(left, HS_PIN_PWMA, HS_PIN_AIN1, HS_PIN_AIN2);
  wheel(right, HS_PIN_PWMB, HS_PIN_BIN1, HS_PIN_BIN2);
}

static void applyKill() {
  cmd.left = 0;
  cmd.right = 0;
  cmd.extend = 0;
  cmd.kill = 1;
  writeDrive(0, 0);
  punch.write(20);
}

static void applyCommand() {
  if (cmd.kill || digitalRead(HS_PIN_KILL) == LOW) {
    applyKill();
    return;
  }
  writeDrive(cmd.left, cmd.right);
  int deg = (int)(20.0f + cmd.extend * 140.0f);
  punch.write(deg);
}

static void handleJson(const char *src) {
  JsonDocument doc;
  DeserializationError err = deserializeJson(doc, src);
  if (err) {
    Serial.println("{\"ok\":false,\"err\":\"json\"}");
    return;
  }
  int v = doc[HS_KEY_V] | HS_PROTOCOL_VERSION;
  if (v != HS_PROTOCOL_VERSION) {
    Serial.println("{\"ok\":false,\"err\":\"protocol\"}");
    return;
  }
  if (doc[HS_KEY_KILL] | false) {
    applyKill();
    Serial.println("{\"ok\":true,\"kill\":true}");
    return;
  }
  JsonObject drive = doc[HS_KEY_DRIVE];
  JsonObject arm = doc[HS_KEY_ARM];
  cmd.left = clampf(drive[HS_KEY_LEFT] | 0.0f, -1, 1);
  cmd.right = clampf(drive[HS_KEY_RIGHT] | 0.0f, -1, 1);
  cmd.extend = clampf(arm[HS_KEY_EXTEND] | 0.0f, 0, 1);
  cmd.kill = 0;
  applyCommand();

  if (doc[HS_KEY_RECORD].is<JsonObject>()) {
    const char *action = doc[HS_KEY_RECORD][HS_KEY_ACTION] | "start";
    Serial.printf("{\"ok\":true,\"record\":\"%s\"}\n", action);
    return;
  }
  if (doc[HS_KEY_PLAY].is<JsonObject>()) {
    const char *name = doc[HS_KEY_PLAY][HS_KEY_NAME] | "";
    Serial.printf("{\"ok\":true,\"play\":\"%s\"}\n", name);
    return;
  }
  Serial.println("{\"ok\":true}");
}

void setup() {
  Serial.begin(115200);
  pinMode(HS_PIN_PWMA, OUTPUT);
  pinMode(HS_PIN_AIN1, OUTPUT);
  pinMode(HS_PIN_AIN2, OUTPUT);
  pinMode(HS_PIN_PWMB, OUTPUT);
  pinMode(HS_PIN_BIN1, OUTPUT);
  pinMode(HS_PIN_BIN2, OUTPUT);
  pinMode(HS_PIN_KILL, INPUT_PULLUP);
  punch.setPeriodHertz(50);
  punch.attach(HS_PIN_SERVO, 500, 2500);
  applyKill();
  cmd.kill = 0;
  Serial.println("{\"boot\":\"ATOM-0\",\"v\":0}");
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      handleJson(line.c_str());
      line = "";
    } else if (c != '\r') {
      if (line.length() < 512) line += c;
    }
  }
  if (digitalRead(HS_PIN_KILL) == LOW) applyKill();
}
