import { afterEach, describe, expect, it } from "vitest";
import { installBrowserGlobals } from "../browser-globals";
import {
  LINKS_KEY,
  SCHEMA_VERSION,
  exportData,
  getBills,
  getSettings,
  getSubscriptions,
  getSyncLog,
  importData,
  runMigrations,
  saveBill,
  saveSettings,
  saveSubscription,
  setStorageErrorHandler,
  updateSyncLog,
  type Bill,
  type Subscription,
} from "../../src/lib/storage";

const storage = installBrowserGlobals();

const LEGACY_LINKS_KEY = "blink:links";
const SCHEMA_VERSION_KEY = "ss:schema-version";

function sub(over: Partial<Subscription> = {}): Subscription {
  return {
    id: "sub-1",
    name: "Netflix",
    amount: 15.99,
    currency: "USD",
    billingCycle: "monthly",
    category: "Entertainment",
    active: true,
    startDate: "2026-01-31",
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
    recurring: true,
    billingCycle: "monthly",
    ...over,
  };
}

function readJSON(key: string): unknown {
  const raw = storage.getItem(key);
  return raw === null ? null : JSON.parse(raw);
}

afterEach(() => {
  setStorageErrorHandler(null);
});

describe("runMigrations", () => {
  it("moves blink:links to ss:links and rewrites subscriptionId to entityId + entityType", () => {
    storage.setItem(
      LEGACY_LINKS_KEY,
      JSON.stringify([
        {
          subscriptionId: "sub-1",
          activityId: "act-1",
          activityDate: "2026-01-31",
          amount: 15.99,
          currency: "USD",
          description: "NETFLIX",
          accountName: "Checking",
          linkedAt: "2026-02-01T00:00:00.000Z",
        },
      ]),
    );

    runMigrations();

    expect(readJSON(LINKS_KEY)).toEqual([
      {
        entityId: "sub-1",
        entityType: "subscription",
        activityId: "act-1",
        activityDate: "2026-01-31",
        amount: 15.99,
        currency: "USD",
        description: "NETFLIX",
        accountName: "Checking",
        linkedAt: "2026-02-01T00:00:00.000Z",
      },
    ]);
    // The legacy key must be gone, or a later re-run would resurrect deleted links.
    expect(storage.getItem(LEGACY_LINKS_KEY)).toBeNull();
    expect(readJSON(SCHEMA_VERSION_KEY)).toBe(SCHEMA_VERSION);
  });

  it("merges legacy links with existing ss:links and de-duplicates by entity + activity", () => {
    storage.setItem(
      LINKS_KEY,
      JSON.stringify([{ entityId: "sub-1", entityType: "subscription", activityId: "act-1" }]),
    );
    storage.setItem(
      LEGACY_LINKS_KEY,
      JSON.stringify([
        { subscriptionId: "sub-1", activityId: "act-1" }, // duplicate of the above
        { subscriptionId: "sub-2", activityId: "act-2" },
      ]),
    );

    runMigrations();

    expect(readJSON(LINKS_KEY)).toEqual([
      { entityId: "sub-1", entityType: "subscription", activityId: "act-1" },
      { entityId: "sub-2", entityType: "subscription", activityId: "act-2" },
    ]);
  });

  it("leaves already-migrated links untouched", () => {
    const links = [
      { entityId: "bill-1", entityType: "bill", activityId: "act-9", amount: 5 },
    ];
    storage.setItem(LEGACY_LINKS_KEY, JSON.stringify(links));

    runMigrations();

    expect(readJSON(LINKS_KEY)).toEqual(links);
  });

  it("is idempotent — running twice changes nothing", () => {
    storage.setItem(
      LEGACY_LINKS_KEY,
      JSON.stringify([{ subscriptionId: "sub-1", activityId: "act-1" }]),
    );

    runMigrations();
    const afterFirst = storage.getItem(LINKS_KEY);
    runMigrations();

    expect(storage.getItem(LINKS_KEY)).toBe(afterFirst);
    expect(readJSON(SCHEMA_VERSION_KEY)).toBe(SCHEMA_VERSION);
  });

  it("does not re-run once the schema version is stamped, even if a legacy key reappears", () => {
    runMigrations(); // stamps the version on a fresh install
    storage.setItem(
      LEGACY_LINKS_KEY,
      JSON.stringify([{ subscriptionId: "zombie", activityId: "act-z" }]),
    );

    runMigrations();

    expect(storage.getItem(LINKS_KEY)).toBeNull();
  });

  it("creates no links key when there is nothing to migrate", () => {
    runMigrations();
    expect(storage.getItem(LINKS_KEY)).toBeNull();
  });

  it("skips silently on a corrupt legacy payload", () => {
    storage.setItem(LEGACY_LINKS_KEY, "{not json");

    expect(() => runMigrations()).not.toThrow();
    expect(storage.getItem(LINKS_KEY)).toBeNull();
    expect(readJSON(SCHEMA_VERSION_KEY)).toBe(SCHEMA_VERSION);
  });

  it("reports a failed write instead of throwing into the caller", () => {
    const seen: string[] = [];
    setStorageErrorHandler((_err, key) => seen.push(key));
    storage.failNextWrites(1);

    expect(() => runMigrations()).not.toThrow();
    expect(seen).toEqual([SCHEMA_VERSION_KEY]);
  });
});

describe("exportData / importData", () => {
  it("round-trips every slice this addon owns", () => {
    saveSubscription(sub());
    saveSubscription(sub({ id: "sub-2", name: "Spotify", currency: "EUR", amount: 9.99 }));
    saveBill(bill());
    storage.setItem(
      LINKS_KEY,
      JSON.stringify([{ entityId: "sub-1", entityType: "subscription", activityId: "act-1" }]),
    );
    saveSettings({ billsEnabled: false, syncAccountId: "acc-7" });
    updateSyncLog({ "sub-1:2026-01-31": "act-1" });

    const backup = exportData();
    const before = {
      subs: getSubscriptions(),
      bills: getBills(),
      links: readJSON(LINKS_KEY),
      settings: getSettings(),
      syncLog: getSyncLog(),
    };

    storage.clear();
    const summary = importData(backup);

    expect(summary).toEqual({ subscriptions: 2, bills: 1, links: 1 });
    expect(getSubscriptions()).toEqual(before.subs);
    expect(getBills()).toEqual(before.bills);
    expect(readJSON(LINKS_KEY)).toEqual(before.links);
    expect(getSettings()).toEqual(before.settings);
    expect(getSyncLog()).toEqual(before.syncLog);
    expect(readJSON(SCHEMA_VERSION_KEY)).toBe(SCHEMA_VERSION);
  });

  it("exports a stable, self-describing envelope", () => {
    saveSubscription(sub());
    const payload = JSON.parse(exportData());
    expect(payload.schemaVersion).toBe(SCHEMA_VERSION);
    expect(typeof payload.exportedAt).toBe("string");
    expect(new Date(payload.exportedAt).toString()).not.toBe("Invalid Date");
    expect(payload.subscriptions).toHaveLength(1);
    expect(payload.links).toEqual([]);
  });

  it("upgrades pre-v2 links when restoring an old backup", () => {
    // importData stamps the schema version, so runMigrations() never gets a
    // second chance: if the import does not rewrite subscriptionId here, every
    // restored link is orphaned for good.
    const summary = importData(
      JSON.stringify({
        schemaVersion: 1,
        subscriptions: [],
        bills: [],
        links: [
          { subscriptionId: "sub-1", activityId: "act-1", amount: 15.99 },
          { entityId: "bill-1", entityType: "bill", activityId: "act-2" },
        ],
      }),
    );

    expect(summary.links).toBe(2);
    expect(readJSON(LINKS_KEY)).toEqual([
      { entityId: "sub-1", entityType: "subscription", activityId: "act-1", amount: 15.99 },
      { entityId: "bill-1", entityType: "bill", activityId: "act-2" },
    ]);
    // Idempotent: re-importing the already-upgraded export changes nothing.
    const again = readJSON(LINKS_KEY);
    importData(exportData());
    expect(readJSON(LINKS_KEY)).toEqual(again);
  });

  it("de-duplicates links on import", () => {
    const backup = JSON.stringify({
      subscriptions: [],
      bills: [],
      links: [
        { entityId: "a", activityId: "1" },
        { entityId: "a", activityId: "1" },
        { entityId: "a", activityId: "2" },
        "garbage",
      ],
    });

    expect(importData(backup).links).toBe(2);
  });

  for (const [label, payload] of [
    ["not JSON at all", "{ nope"],
    ["a JSON array", "[]"],
    ["a JSON scalar", "42"],
    ["null", "null"],
    ["an object with no lists", '{"exportedAt":"now"}'],
    ["subscriptions but no bills", '{"subscriptions":[]}'],
    ["a non-array subscriptions field", '{"subscriptions":{},"bills":[]}'],
  ] as const) {
    it(`throws a readable message for ${label} and leaves existing data untouched`, () => {
      saveSubscription(sub());
      saveBill(bill());

      expect(() => importData(payload)).toThrowError(/\w+/);
      expect(() => importData(payload)).toThrowError(
        /isn't valid JSON|isn't a Subscriptions & Bills backup|missing its subscriptions or bills/,
      );

      expect(getSubscriptions()).toEqual([sub()]);
      expect(getBills()).toEqual([bill()]);
    });
  }

  it("keeps default settings for a backup that omits them", () => {
    const summary = importData(JSON.stringify({ subscriptions: [], bills: [] }));
    expect(summary).toEqual({ subscriptions: 0, bills: 0, links: 0 });
    expect(getSettings()).toEqual({ billsEnabled: true, syncAccountId: null });
    expect(getSyncLog()).toEqual({});
  });
});

describe("write path", () => {
  it("routes a quota failure to the registered handler and does not notify listeners", () => {
    const errors: Array<{ key: string; message: string }> = [];
    setStorageErrorHandler((err, key) =>
      errors.push({ key, message: err instanceof Error ? err.message : String(err) }),
    );
    storage.failNextWrites(1);

    expect(() => saveSubscription(sub())).not.toThrow();
    expect(errors).toEqual([{ key: "ss:subscriptions", message: "QuotaExceededError" }]);
    expect(getSubscriptions()).toEqual([]);
  });

  it("upserts by id and keeps newest-first order for new rows", () => {
    saveSubscription(sub({ id: "a", name: "A" }));
    saveSubscription(sub({ id: "b", name: "B" }));
    saveSubscription(sub({ id: "a", name: "A renamed" }));

    expect(getSubscriptions().map((s) => [s.id, s.name])).toEqual([
      ["b", "B"],
      ["a", "A renamed"],
    ]);
  });
});
