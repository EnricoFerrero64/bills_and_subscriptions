import { describe, expect, it } from "vitest";
import {
  advanceDateByCycle,
  cycleSeries,
  formatDayLabel,
  formatFullDate,
  formatMonthLabel,
  isValidISODate,
  monthKey,
  monthKeyToDate,
  toMonthly,
  toYearly,
  type BillingCycle,
} from "../../src/lib/storage";

describe("cycleSeries", () => {
  it("keeps the day-of-month anchored when a month is short (the Jan 31 regression)", () => {
    // The previous setMonth()-based walk turned Jan 31 into Mar 3 and then
    // locked every later occurrence to the 3rd, silently dropping February.
    expect(cycleSeries("2026-01-31", "monthly", "2026-06-30")).toEqual([
      "2026-01-31",
      "2026-02-28",
      "2026-03-31",
      "2026-04-30",
      "2026-05-31",
      "2026-06-30",
    ]);
  });

  it("clamps into a leap February and back out to 31", () => {
    expect(cycleSeries("2028-01-31", "monthly", "2028-03-31")).toEqual([
      "2028-01-31",
      "2028-02-29",
      "2028-03-31",
    ]);
  });

  it("steps weekly by exactly 7 days across a month boundary", () => {
    expect(cycleSeries("2026-02-19", "weekly", "2026-03-12")).toEqual([
      "2026-02-19",
      "2026-02-26",
      "2026-03-05",
      "2026-03-12",
    ]);
  });

  it("steps quarterly by 3 months with day clamping", () => {
    expect(cycleSeries("2026-01-31", "quarterly", "2026-12-31")).toEqual([
      "2026-01-31",
      "2026-04-30",
      "2026-07-31",
      "2026-10-31",
    ]);
  });

  it("steps yearly and clamps Feb 29 on non-leap years without losing the 29th", () => {
    expect(cycleSeries("2028-02-29", "yearly", "2032-12-31")).toEqual([
      "2028-02-29",
      "2029-02-28",
      "2030-02-28",
      "2031-02-28",
      "2032-02-29",
    ]);
  });

  it("includes an occurrence that lands exactly on the end date", () => {
    expect(cycleSeries("2026-01-15", "monthly", "2026-02-15")).toEqual([
      "2026-01-15",
      "2026-02-15",
    ]);
  });

  it("returns the start alone when start === until", () => {
    expect(cycleSeries("2026-02-01", "monthly", "2026-02-01")).toEqual(["2026-02-01"]);
  });

  it("returns [] instead of throwing for an invalid start", () => {
    // 2026 is not a leap year, so Feb 30 / Feb 29 are not real dates.
    expect(cycleSeries("2026-02-30", "monthly", "2026-12-31")).toEqual([]);
    expect(cycleSeries("2026-02-29", "monthly", "2026-12-31")).toEqual([]);
    expect(cycleSeries("not a date", "monthly", "2026-12-31")).toEqual([]);
    expect(cycleSeries("", "monthly", "2026-12-31")).toEqual([]);
    expect(cycleSeries("2026-1-1", "monthly", "2026-12-31")).toEqual([]);
  });

  it("returns [] for an invalid end date", () => {
    expect(cycleSeries("2026-01-01", "monthly", "nope")).toEqual([]);
  });

  it("returns [] when the start is after the end date", () => {
    expect(cycleSeries("2026-06-01", "monthly", "2026-01-01")).toEqual([]);
  });

  it("honours the maxCount cap", () => {
    const capped = cycleSeries("2026-01-01", "monthly", "2030-01-01", 5);
    expect(capped).toEqual([
      "2026-01-01",
      "2026-02-01",
      "2026-03-01",
      "2026-04-01",
      "2026-05-01",
    ]);
    expect(cycleSeries("2026-01-01", "monthly", "2030-01-01", 0)).toEqual([]);
    expect(cycleSeries("2026-01-01", "weekly", "2030-01-01", -3)).toEqual([]);
  });

  it("stays bounded for a far-past weekly start", () => {
    const series = cycleSeries("1990-01-01", "weekly", "2026-01-01");
    expect(series.length).toBeLessThanOrEqual(2000);
    expect(series[0]).toBe("1990-01-01");
    // Every entry is a real, strictly increasing ISO date.
    expect(series.every(isValidISODate)).toBe(true);
    expect([...series].sort()).toEqual(series);
    expect(new Set(series).size).toBe(series.length);
  });
});

describe("advanceDateByCycle", () => {
  it("clamps the day into a shorter month", () => {
    expect(advanceDateByCycle("2026-01-31", "monthly")).toBe("2026-02-28");
    expect(advanceDateByCycle("2028-01-31", "monthly")).toBe("2028-02-29");
    expect(advanceDateByCycle("2026-11-30", "quarterly")).toBe("2027-02-28");
    expect(advanceDateByCycle("2028-02-29", "yearly")).toBe("2029-02-28");
  });

  it("advances weekly and yearly across boundaries", () => {
    expect(advanceDateByCycle("2026-02-26", "weekly")).toBe("2026-03-05");
    expect(advanceDateByCycle("2026-12-31", "weekly")).toBe("2027-01-07");
    expect(advanceDateByCycle("2026-03-15", "yearly")).toBe("2027-03-15");
  });

  it("uses anchorDay in preference to the day of the given date", () => {
    // A series clamped to Feb 28 must recover its 31st, not stay on the 28th.
    expect(advanceDateByCycle("2026-02-28", "monthly", 31)).toBe("2026-03-31");
    expect(advanceDateByCycle("2026-01-10", "monthly", 15)).toBe("2026-02-15");
  });

  it("clamps a nonsensical anchorDay instead of producing a bogus date", () => {
    expect(advanceDateByCycle("2026-01-10", "monthly", 0)).toBe("2026-02-01");
    expect(advanceDateByCycle("2026-01-10", "monthly", 99)).toBe("2026-02-28");
    expect(advanceDateByCycle("2026-01-10", "monthly", 15.9)).toBe("2026-02-15");
  });

  it("falls back to the date's own day for a non-finite anchorDay", () => {
    expect(advanceDateByCycle("2026-01-10", "monthly", Number.NaN)).toBe("2026-02-10");
    expect(advanceDateByCycle("2026-01-10", "monthly", Number.POSITIVE_INFINITY)).toBe("2026-02-10");
  });

  it('returns "" for invalid input and never throws', () => {
    for (const bad of ["", "garbage", "2026-13-01", "2026-02-30", "2026/02/01", "20260201"]) {
      expect(advanceDateByCycle(bad, "monthly")).toBe("");
    }
    expect(advanceDateByCycle(undefined as unknown as string, "monthly")).toBe("");
    expect(advanceDateByCycle(null as unknown as string, "monthly")).toBe("");
  });
});

// ─── Timezone-sensitive formatting ────────────────────────────────────────────
// These are the assertions that failed west of Greenwich: the old code built a
// Date from the ISO string and rendered it in the LOCAL zone, so 2026-02-01 came
// out as "January 2026" in America/New_York. The suite is run once per timezone
// by scripts/test-timezones.mjs, so this block is exercised in both.

const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const isEnglish = Intl.DateTimeFormat().resolvedOptions().locale.startsWith("en");

/** How a UTC-pinned calendar date must render, whatever the host zone is. */
function utcReference(y: number, m: number, d: number, opts: Intl.DateTimeFormatOptions): string {
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, { ...opts, timeZone: "UTC" });
}

describe(`date formatting is timezone-independent (TZ=${localZone})`, () => {
  it("keeps the first of the month in that month", () => {
    expect(monthKey("2026-02-01")).toBe("2026-02");
    expect(monthKey("2026-01-01")).toBe("2026-01");
    expect(monthKey("2026-12-31")).toBe("2026-12");
  });

  it("labels 2026-02 as February, not the month before it", () => {
    const february = formatMonthLabel("2026-02");
    expect(february).toBe(utcReference(2026, 2, 1, { month: "long", year: "numeric" }));
    expect(february).toContain("2026");
    expect(february).not.toBe(formatMonthLabel("2026-01"));
    expect(february).not.toBe(formatMonthLabel("2026-03"));
  });

  it("labels the first day of a month without slipping to the previous day", () => {
    expect(formatDayLabel("2026-02-01")).toBe(
      utcReference(2026, 2, 1, { day: "numeric", month: "short" }),
    );
    expect(formatDayLabel("2026-02-01")).toContain("1");
    expect(formatDayLabel("2026-01-01")).not.toBe(formatDayLabel("2025-12-31"));
  });

  it("appends the year from the ISO string, never from a re-parsed Date", () => {
    expect(formatFullDate("2026-02-01")).toBe(`${formatDayLabel("2026-02-01")} 2026`);
    expect(formatFullDate("2026-01-01")).toBe(`${formatDayLabel("2026-01-01")} 2026`);
  });

  it.runIf(isEnglish)("renders the expected English labels", () => {
    expect(formatMonthLabel("2026-02")).toBe("February 2026");
    expect(formatMonthLabel("2026-01")).toBe("January 2026");
    expect(formatDayLabel("2026-02-01")).toMatch(/^(Feb 1|1 Feb)$/);
    expect(formatFullDate("2026-02-01")).toMatch(/^(Feb 1|1 Feb) 2026$/);
  });

  it('returns "" for anything unparseable rather than "Invalid Date"', () => {
    for (const bad of ["", "2026-13", "2026-1", "nope", "2026-02-01"]) {
      expect(formatMonthLabel(bad)).toBe("");
    }
    for (const bad of ["", "2026-02", "2026-02-30", "nope"]) {
      expect(formatDayLabel(bad)).toBe("");
      expect(formatFullDate(bad)).toBe("");
    }
    expect(monthKey("nope")).toBe("");
    expect(monthKey(undefined as unknown as string)).toBe("");
  });

  it("round-trips a month key through monthKeyToDate", () => {
    expect(monthKeyToDate("2026-02")).toBe("2026-02-01");
    expect(monthKey(monthKeyToDate("2026-02"))).toBe("2026-02");
    expect(monthKeyToDate("2026-13")).toBe("");
    expect(monthKeyToDate("")).toBe("");
  });
});

describe("isValidISODate", () => {
  it("accepts real calendar dates only", () => {
    expect(isValidISODate("2028-02-29")).toBe(true); // leap
    expect(isValidISODate("2026-02-29")).toBe(false); // not leap
    expect(isValidISODate("2026-02-28")).toBe(true);
    expect(isValidISODate("2026-04-31")).toBe(false);
    expect(isValidISODate("2026-12-31")).toBe(true);
    expect(isValidISODate("2026-00-10")).toBe(false);
    expect(isValidISODate("2026-2-01")).toBe(false); // must be zero-padded
    expect(isValidISODate("2026-02-01T00:00:00Z")).toBe(false);
  });
});

describe("toMonthly / toYearly", () => {
  it("converts each cycle", () => {
    expect(toMonthly(12, "monthly")).toBe(12);
    expect(toMonthly(120, "yearly")).toBe(10);
    expect(toMonthly(30, "quarterly")).toBe(10);
    expect(toMonthly(12, "weekly")).toBeCloseTo(52, 10);

    expect(toYearly(10, "monthly")).toBe(120);
    expect(toYearly(120, "yearly")).toBe(120);
    expect(toYearly(30, "quarterly")).toBe(120);
    expect(toYearly(10, "weekly")).toBe(520);
  });

  it("keeps toYearly === toMonthly * 12 for every cycle", () => {
    const cycles: BillingCycle[] = ["weekly", "monthly", "quarterly", "yearly"];
    for (const cycle of cycles) {
      expect(toMonthly(99.99, cycle) * 12).toBeCloseTo(toYearly(99.99, cycle), 10);
    }
  });

  it("does not silently turn a zero or negative amount into something else", () => {
    expect(toMonthly(0, "weekly")).toBe(0);
    expect(toYearly(-10, "monthly")).toBe(-120);
  });
});
