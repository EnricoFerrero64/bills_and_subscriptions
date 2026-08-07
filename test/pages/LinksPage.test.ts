import { describe, expect, it } from "vitest";
import { buildLinkGroups, formatLinkDate } from "../../src/pages/LinksPage";
import { formatCurrency, formatDayLabel, type Bill, type Subscription } from "../../src/lib/storage";
import type { LinkedTransaction } from "../../src/lib/linker-storage";

function link(over: Partial<LinkedTransaction> = {}): LinkedTransaction {
  return {
    entityId: "sub-1",
    entityType: "subscription",
    activityId: "act-1",
    activityDate: "2026-02-01",
    amount: 15.99,
    currency: "USD",
    description: "NETFLIX",
    accountName: "Checking",
    linkedAt: "2026-02-02T10:00:00.000Z",
    ...over,
  };
}

function sub(over: Partial<Subscription> = {}): Subscription {
  return {
    id: "sub-1",
    name: "Netflix",
    amount: 15.99,
    currency: "USD",
    billingCycle: "monthly",
    category: "Entertainment",
    active: true,
    ...over,
  };
}

function bill(over: Partial<Bill> = {}): Bill {
  return {
    id: "bill-1",
    name: "Electricity",
    amount: 82.4,
    currency: "EUR",
    category: "Electricity",
    date: "2026-02-01",
    paid: false,
    recurring: false,
    ...over,
  };
}

describe("buildLinkGroups", () => {
  it("returns BOTH bill and subscription links", () => {
    // The shipped bug: links were resolved against subscriptions only, so every
    // bill link vanished from this page with no way to remove it.
    const groups = buildLinkGroups(
      [
        link({ entityId: "sub-1", entityType: "subscription", activityId: "a1" }),
        link({ entityId: "bill-1", entityType: "bill", activityId: "a2" }),
      ],
      [sub()],
      [bill()],
    );

    expect(groups.map((g) => [g.kind, g.name])).toEqual([
      ["subscription", "Netflix"],
      ["bill", "Electricity"],
    ]);
    expect(groups.flatMap((g) => g.links.map((l) => l.activityId)).sort()).toEqual(["a1", "a2"]);
  });

  it("puts a link whose entity was deleted in the orphaned group", () => {
    const groups = buildLinkGroups(
      [
        link({ entityId: "sub-1", activityId: "a1" }),
        link({ entityId: "gone", activityId: "a2" }),
        link({ entityId: "also-gone", entityType: "bill", activityId: "a3" }),
      ],
      [sub()],
      [bill()],
    );

    const orphans = groups.filter((g) => g.kind === "orphaned");
    expect(orphans).toHaveLength(1); // one bucket, not one per dead entity
    expect(orphans[0]!.links.map((l) => l.activityId).sort()).toEqual(["a2", "a3"]);
    expect(orphans[0]!.detail).toMatch(/deleted/i);
  });

  it("accounts for every link exactly once", () => {
    const links = [
      link({ entityId: "sub-1", activityId: "a1" }),
      link({ entityId: "sub-1", activityId: "a2" }),
      link({ entityId: "bill-1", entityType: "bill", activityId: "a3" }),
      link({ entityId: "gone", activityId: "a4" }),
    ];
    const groups = buildLinkGroups(links, [sub()], [bill()]);
    const placed = groups.flatMap((g) => g.links);
    expect(placed).toHaveLength(links.length);
    expect(new Set(placed.map((l) => l.activityId)).size).toBe(links.length);
  });

  it("groups several links under one entity", () => {
    const groups = buildLinkGroups(
      [link({ activityId: "a1" }), link({ activityId: "a2" })],
      [sub()],
      [],
    );
    expect(groups).toHaveLength(1);
    expect(groups[0]!.links).toHaveLength(2);
  });

  it("orders subscriptions, then bills, then orphans; alphabetically within a kind", () => {
    const groups = buildLinkGroups(
      [
        link({ entityId: "gone", activityId: "a0" }),
        link({ entityId: "bill-z", entityType: "bill", activityId: "a1" }),
        link({ entityId: "bill-a", entityType: "bill", activityId: "a2" }),
        link({ entityId: "sub-z", activityId: "a3" }),
        link({ entityId: "sub-a", activityId: "a4" }),
      ],
      [sub({ id: "sub-z", name: "Zulu" }), sub({ id: "sub-a", name: "Alpha" })],
      [bill({ id: "bill-z", name: "Zebra" }), bill({ id: "bill-a", name: "Aqua" })],
    );

    expect(groups.map((g) => g.name)).toEqual([
      "Alpha",
      "Zulu",
      "Aqua",
      "Zebra",
      "Orphaned links",
    ]);
  });

  it("sorts links inside a group newest-first, breaking ties on activityId", () => {
    const groups = buildLinkGroups(
      [
        link({ activityId: "b", activityDate: "2026-01-01" }),
        link({ activityId: "c", activityDate: "2026-03-01" }),
        link({ activityId: "a", activityDate: "2026-01-01" }),
      ],
      [sub()],
      [],
    );
    expect(groups[0]!.links.map((l) => l.activityId)).toEqual(["c", "a", "b"]);
  });

  it("keys a bill and a subscription apart even when they share an id", () => {
    const groups = buildLinkGroups(
      [
        link({ entityId: "shared", entityType: "subscription", activityId: "a1" }),
        link({ entityId: "shared", entityType: "bill", activityId: "a2" }),
      ],
      [sub({ id: "shared", name: "Sub side" })],
      [bill({ id: "shared", name: "Bill side" })],
    );

    expect(groups.map((g) => g.key)).toEqual(["subscription:shared", "bill:shared"]);
    expect(new Set(groups.map((g) => g.key)).size).toBe(2);
  });

  it("falls back to the other store for a mislabelled link instead of orphaning it", () => {
    const groups = buildLinkGroups(
      [link({ entityId: "bill-1", entityType: "subscription", activityId: "a1" })],
      [sub()],
      [bill()],
    );
    expect(groups.map((g) => g.kind)).toEqual(["bill"]);
  });

  it("describes each group with its own entity's amount and currency", () => {
    const groups = buildLinkGroups(
      [
        link({ entityId: "sub-1", activityId: "a1" }),
        link({ entityId: "bill-1", entityType: "bill", activityId: "a2" }),
      ],
      [sub()],
      [bill()],
    );

    expect(groups[0]!.detail).toContain(formatCurrency(15.99, "USD"));
    expect(groups[0]!.detail).toContain("monthly");
    expect(groups[1]!.detail).toContain(formatCurrency(82.4, "EUR"));
  });

  it("returns [] for no links", () => {
    expect(buildLinkGroups([], [sub()], [bill()])).toEqual([]);
  });
});

describe("formatLinkDate", () => {
  it("omits the year for the current year and shows it otherwise", () => {
    expect(formatLinkDate("2026-02-01", 2026)).toBe(formatDayLabel("2026-02-01"));
    expect(formatLinkDate("2024-02-01", 2026)).toBe(`${formatDayLabel("2024-02-01")} 2024`);
  });

  it("falls back to the raw string it was given rather than blanking it", () => {
    expect(formatLinkDate("whenever", 2026)).toBe("whenever");
    expect(formatLinkDate("", 2026)).toBe("");
  });
});
