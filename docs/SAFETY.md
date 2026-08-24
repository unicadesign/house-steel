# SAFETY — House Steel v0

This is a real fighting robot, 1 kg, 3S LiPo, spinning wheels, punching arm. Treat it as live metal.

## Battery
- 3S LiPo only in a fire-safe bag when not in the bot.
- Never charge unattended. Never puncture. Never run a swollen pack.
- Balance charge on a proper LiPo charger, not a USB brick.

## Kill
- Hardware kill is a normally-closed switch on GPIO 5. Open = motors off.
- Software kill is Space in the twin and `{"kill":true}` on the wire.
- Both must work. Software-only is not a kill.

## Pit
- Eye protection when the wheels can spin.
- No fingers in the arm travel while armed.
- Powered tests on a 1.8 m taped square, not the dining table.
- One person is pit boss (lead). One person is on kill.

## Kids on crew
- Ages 10 / 8 / 6 run stations with the lead present.
- No solo LiPo work. No live-power soldering. No "just a quick spin" without kill coverage.

## Not this robot
- No weapon spinner. No 2 m humanoid. No public demo without a cage or taped pit and a kill drill.
