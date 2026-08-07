// Runs the unit suite once per timezone.
//
// A whole class of bug in this addon only appears west of Greenwich: every date
// is stored as "YYYY-MM-DD" and parsed as UTC, so any helper that renders it
// through the LOCAL calendar shows the previous day — which is how a February
// bill came to be filed under "January 2026". Node reads TZ when the process
// starts, so proving that requires one process per timezone, not one test.
//
// Any extra arguments are forwarded to vitest, e.g.:
//   npm test -- test/lib/storage.dates.test.ts
import { spawnSync } from "child_process";

const TIMEZONES = ["UTC", "America/New_York"];
const forwarded = process.argv.slice(2);

let failures = 0;

for (const timeZone of TIMEZONES) {
  console.log(`\n──  vitest run  (TZ=${timeZone})  ${"─".repeat(40)}`);
  const result = spawnSync("npx", ["vitest", "run", ...forwarded], {
    stdio: "inherit",
    env: { ...process.env, TZ: timeZone },
    shell: process.platform === "win32", // npx is a .cmd shim on Windows
  });
  if (result.status !== 0) {
    failures++;
    console.error(`\n❌  Suite failed under TZ=${timeZone}`);
  }
}

if (failures > 0) {
  console.error(`\n❌  ${failures} of ${TIMEZONES.length} timezone runs failed`);
  process.exit(1);
}

console.log(`\n✅  Suite green in all ${TIMEZONES.length} timezones: ${TIMEZONES.join(", ")}`);
