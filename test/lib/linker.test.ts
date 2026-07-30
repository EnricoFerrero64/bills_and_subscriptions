import { describe, expect, it } from "vitest";
import {
  MIN_SUGGEST_CONFIDENCE,
  matchAgainst,
  type ExpenseTx,
  type MatchTarget,
} from "../../src/lib/linker";

function tx(over: Partial<ExpenseTx> = {}): ExpenseTx {
  return {
    activityId: "act-1",
    accountId: "acc-1",
    accountName: "Checking",
    date: "2026-02-01",
    amount: 15.99,
    currency: "USD",
    comment: "NETFLIX 12/03 REF 88213",
    activityType: "WITHDRAWAL",
    isSynthetic: false,
    ...over,
  };
}

const netflix: MatchTarget = {
  name: "Netflix",
  amount: 15.99,
  currency: "USD",
  date: "2026-02-01",
};

const ids = (matches: { activityId: string }[]) => matches.map((m) => m.activityId);

describe("matchAgainst — hard rejections", () => {
  it("rejects a transaction in a different currency", () => {
    // A EUR bill used to match a USD withdrawal of the same numeric amount.
    const eurBill: MatchTarget = { ...netflix, currency: "EUR" };
    expect(matchAgainst(eurBill, [tx({ currency: "USD" })])).toEqual([]);
    expect(ids(matchAgainst(eurBill, [tx({ currency: "EUR" })]))).toEqual(["act-1"]);
  });

  it("rejects this addon's own synthetic activities", () => {
    expect(matchAgainst(netflix, [tx({ isSynthetic: true })])).toEqual([]);
  });

  it("honours excludeActivityIds", () => {
    const activities = [tx({ activityId: "act-1" }), tx({ activityId: "act-2" })];
    expect(ids(matchAgainst(netflix, activities))).toEqual(["act-1", "act-2"]);
    expect(
      ids(matchAgainst(netflix, activities, { excludeActivityIds: new Set(["act-1"]) })),
    ).toEqual(["act-2"]);
  });

  it("rejects a description that is nothing like the target name", () => {
    expect(matchAgainst(netflix, [tx({ comment: "SHELL FUEL STATION 4471" })])).toEqual([]);
    expect(matchAgainst(netflix, [tx({ comment: "" })])).toEqual([]);
  });

  it("rejects an amount outside the tolerance but keeps the boundary itself", () => {
    const target: MatchTarget = { ...netflix, amount: 10 };
    // 20% is the documented limit: exactly 20% off is still a candidate.
    expect(ids(matchAgainst(target, [tx({ amount: 12 })]))).toEqual(["act-1"]);
    expect(ids(matchAgainst(target, [tx({ amount: 8 })]))).toEqual(["act-1"]);
    expect(matchAgainst(target, [tx({ amount: 12.01 })])).toEqual([]);
    expect(matchAgainst(target, [tx({ amount: 7.99 })])).toEqual([]);
  });

  it("does not divide by zero on a zero-amount target", () => {
    const target: MatchTarget = { ...netflix, amount: 0 };
    expect(matchAgainst(target, [tx({ amount: 0 })])).toHaveLength(1);
    expect(matchAgainst(target, [tx({ amount: 5 })])).toEqual([]);
  });
});

describe("matchAgainst — real-world descriptions", () => {
  it("matches a noisy bank description against the subscription name", () => {
    const [match] = matchAgainst(netflix, [tx({ comment: "NETFLIX 12/03 REF 88213" })]);
    expect(match).toBeDefined();
    expect(match!.confidence).toBeGreaterThanOrEqual(MIN_SUGGEST_CONFIDENCE);
    expect(match!.confidence).toBeGreaterThan(0.9);
    // The raw comment is preserved for display, noise and all.
    expect(match!.comment).toBe("NETFLIX 12/03 REF 88213");
  });

  it("matches when the description merely contains the name", () => {
    const target: MatchTarget = { ...netflix, name: "Amazon Prime", amount: 8.99 };
    const [match] = matchAgainst(target, [
      tx({ comment: "AMAZON PRIME VIDEO AUTH 000123", amount: 8.99 }),
    ]);
    expect(match).toBeDefined();
    expect(match!.confidence).toBeGreaterThanOrEqual(MIN_SUGGEST_CONFIDENCE);
  });

  it("tolerates a small spelling difference", () => {
    const [match] = matchAgainst({ ...netflix, name: "Spotify", amount: 11.99 }, [
      tx({ comment: "SPOTIFV AB", amount: 11.99 }),
    ]);
    expect(match).toBeDefined();
  });

  it("returns the public shape only — no internal ranking fields leak", () => {
    const [match] = matchAgainst(netflix, [tx()]);
    expect(Object.keys(match!).sort()).toEqual([
      "accountId",
      "accountName",
      "activityDate",
      "activityId",
      "activityType",
      "amount",
      "comment",
      "confidence",
      "currency",
    ]);
  });
});

describe("matchAgainst — ranking", () => {
  it("ranks the nearer date first when the target has a date", () => {
    const activities = [
      tx({ activityId: "far", date: "2026-02-20" }),
      tx({ activityId: "near", date: "2026-02-02" }),
    ];
    expect(ids(matchAgainst(netflix, activities))).toEqual(["near", "far"]);
    expect(matchAgainst(netflix, activities)[0]!.confidence).toBeGreaterThan(
      matchAgainst(netflix, activities)[1]!.confidence,
    );
  });

  it("ranks a closer amount first when dates tie", () => {
    const activities = [
      tx({ activityId: "loose", amount: 14.5 }),
      tx({ activityId: "exact", amount: 15.99 }),
    ];
    expect(ids(matchAgainst(netflix, activities))).toEqual(["exact", "loose"]);
  });

  it("falls back to newest-first when the target has no date", () => {
    const undated: MatchTarget = { name: "Netflix", amount: 15.99, currency: "USD" };
    const activities = [
      tx({ activityId: "old", date: "2024-01-05" }),
      tx({ activityId: "new", date: "2026-02-01" }),
    ];
    const matches = matchAgainst(undated, activities);
    expect(ids(matches)).toEqual(["new", "old"]);
    // Date carries no information here, so both score identically.
    expect(matches[0]!.confidence).toBe(matches[1]!.confidence);
  });

  it("ignores an unparseable target date rather than skewing the ranking", () => {
    const activities = [
      tx({ activityId: "old", date: "2024-01-05" }),
      tx({ activityId: "new", date: "2026-02-01" }),
    ];
    expect(ids(matchAgainst({ ...netflix, date: "not-a-date" }, activities))).toEqual([
      "new",
      "old",
    ]);
  });

  it("survives an activity with a missing date", () => {
    expect(ids(matchAgainst(netflix, [tx({ activityId: "no-date", date: "" })]))).toEqual([
      "no-date",
    ]);
  });

  it("caps the result list", () => {
    const many = Array.from({ length: 30 }, (_, i) =>
      tx({ activityId: `act-${i}`, date: "2026-02-01" }),
    );
    expect(matchAgainst(netflix, many)).toHaveLength(25); // documented default
    expect(matchAgainst(netflix, many, { limit: 3 })).toHaveLength(3);
    expect(matchAgainst(netflix, many, { limit: 0 })).toEqual([]);
    expect(matchAgainst(netflix, many, { limit: -5 })).toEqual([]);
  });

  it("returns [] for an empty activity list", () => {
    expect(matchAgainst(netflix, [])).toEqual([]);
  });
});
