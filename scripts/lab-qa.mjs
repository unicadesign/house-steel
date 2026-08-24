import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:8080/lab";
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.text());
});
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector("canvas");
await page.waitForFunction(() => Boolean(window.__controlsTest), null, { timeout: 8000 });

await page.evaluate(() => {
  window.__controlsTest.setThrottle(1);
  window.__controlsTest.setSteer(0);
});
await page.waitForTimeout(400);
const speed = await page.evaluate(() => window.__controlsTest.getSpeed());
console.log("speed", speed);
if (!(speed > 0.15)) {
  console.error("FAIL speed");
  process.exit(1);
}

const y0 = await page.evaluate(() => window.__controlsTest.getYaw());
await page.evaluate(() => window.__controlsTest.setSteer(1));
await page.waitForTimeout(250);
const yA = await page.evaluate(() => window.__controlsTest.getYaw());
const dA = wrap(yA - y0);
console.log("yaw A (left)", y0, yA, dA);
if (!(dA > 0.05)) {
  console.error("FAIL A should increase yaw (left / CCW)");
  process.exit(1);
}

await page.evaluate(() => window.__controlsTest.setSteer(-1));
await page.waitForTimeout(250);
const yD = await page.evaluate(() => window.__controlsTest.getYaw());
const dD = wrap(yD - yA);
console.log("yaw D (right)", yA, yD, dD);
if (!(dD < -0.05)) {
  console.error("FAIL D should decrease yaw (right / CW)");
  process.exit(1);
}

await page.evaluate(() => {
  window.__controlsTest.setSteer(0);
  window.__controlsTest.setThrottle(0);
});

await page.getByRole("button", { name: "PLAY" }).click();
await page.waitForTimeout(800);
const notice = await page.locator("aside p.font-mono").first().textContent();
console.log("play notice", notice);

await page.getByRole("button", { name: "RECORD" }).click();
await page.waitForTimeout(50);
await page.keyboard.down("KeyW");
await page.keyboard.down("KeyJ");
await page.waitForTimeout(1200);
await page.keyboard.up("KeyJ");
await page.keyboard.up("KeyW");
await page.getByRole("button", { name: "RECORD" }).click();
await page.waitForSelector("input[aria-label='Move name']");
await page.fill("input[aria-label='Move name']", "CREWJAB");
await page.getByRole("button", { name: "SAVE" }).click();
await page.waitForTimeout(300);
const saved = await page.locator("aside li").filter({ hasText: "CREWJAB" }).count();
console.log("saved clips", saved);
if (saved < 1) {
  console.error("FAIL named clip not in library");
  process.exit(1);
}

await page.screenshot({ path: "/workspace/screenshots/lab-after-record.png" });
console.log("PASS");
await browser.close();
