// localStorage-based persistence for subscriptions.
// Keys are prefixed with "ss:" to avoid collisions with other addons.

export type BillingCycle = "monthly" | "yearly" | "quarterly" | "weekly";

export const CATEGORIES = [
  "Entertainment",
  "Productivity",
  "Health & Fitness",
  "Finance",
  "News & Media",
  "Education",
  "Cloud & Storage",
  "Communication",
  "Shopping",
  "Utilities",
  "Other",
] as const;

export type SubscriptionCategory = (typeof CATEGORIES)[number];

export const CURRENCIES = [
  "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK",
  "NZD", "SGD", "HKD", "BRL", "MXN", "INR", "KRW", "PLN", "CZK", "HUF",
] as const;

export type Currency = (typeof CURRENCIES)[number];

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
  website?: string;    // optional — used to auto-fetch favicon
  startDate?: string;  // ISO date string
  notes?: string;
  active: boolean;
}

export const CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: "/ mo",
  yearly: "/ yr",
  quarterly: "/ qtr",
  weekly: "/ wk",
};

// Category colors — one distinct hue per category, no hue family repeated more than once.
export const CATEGORY_COLORS: Record<SubscriptionCategory, { bg: string; color: string }> = {
  "Entertainment":    { bg: "rgba(148,97,212,0.15)",  color: "#9461d4" },  // purple
  "Productivity":     { bg: "rgba(77,125,204,0.15)",  color: "#4d7dcc" },  // blue
  "Health & Fitness": { bg: "rgba(54,161,93,0.15)",   color: "#36a15d" },  // green
  "Finance":          { bg: "rgba(181,128,38,0.15)",  color: "#b58026" },  // amber
  "News & Media":     { bg: "rgba(198,83,133,0.15)",  color: "#c65385" },  // rose
  "Education":        { bg: "rgba(59,176,164,0.15)",  color: "#3bb0a4" },  // teal
  "Cloud & Storage":  { bg: "rgba(114,140,53,0.15)",  color: "#728c35" },  // olive
  "Communication":    { bg: "rgba(91,92,200,0.15)",   color: "#5b5cc8" },  // indigo
  "Shopping":         { bg: "rgba(175,140,44,0.15)",  color: "#af8c2c" },  // gold
  "Utilities":        { bg: "rgba(210,114,45,0.15)",  color: "#d2722d" },  // orange
  "Other":            { bg: "rgba(128,149,179,0.12)", color: "#8095b3" },  // slate
};

// ─── Bills ────────────────────────────────────────────────────────────────────

export const BILL_CATEGORIES = [
  "Electricity",
  "Water",
  "Gas",
  "Internet",
  "Phone",
  "Rent",
  "Insurance",
  "Other",
] as const;

export type BillCategory = (typeof BILL_CATEGORIES)[number];

export const BILL_CATEGORY_COLORS: Record<BillCategory, { bg: string; color: string }> = {
  "Electricity": { bg: "rgba(175,140,44,0.15)",  color: "#af8c2c" },  // gold
  "Water":       { bg: "rgba(59,176,164,0.15)",  color: "#3bb0a4" },  // teal
  "Gas":         { bg: "rgba(210,114,45,0.15)",  color: "#d2722d" },  // orange
  "Internet":    { bg: "rgba(91,92,200,0.15)",   color: "#5b5cc8" },  // indigo
  "Phone":       { bg: "rgba(198,83,133,0.15)",  color: "#c65385" },  // rose
  "Rent":        { bg: "rgba(200,64,64,0.15)",   color: "#c84040" },  // red
  "Insurance":   { bg: "rgba(54,161,93,0.15)",   color: "#36a15d" },  // green
  "Other":       { bg: "rgba(128,149,179,0.12)", color: "#8095b3" },  // slate
};

export interface Bill {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  category: BillCategory;
  date: string;   // ISO date — when the bill arrived / is due
  website?: string;
  notes?: string;
  paid: boolean;
  recurring: boolean;
  billingCycle?: BillingCycle; // only meaningful when recurring === true
}

const BILLS_KEY = "ss:bills";

export function getBills(): Bill[] {
  return load<Bill>(BILLS_KEY);
}

export function saveBill(bill: Bill): void {
  const all = load<Bill>(BILLS_KEY);
  const idx = all.findIndex((b) => b.id === bill.id);
  if (idx >= 0) {
    all[idx] = bill;
  } else {
    all.unshift(bill);
  }
  save(BILLS_KEY, all);
}

export function deleteBill(id: string): void {
  save(BILLS_KEY, load<Bill>(BILLS_KEY).filter((b) => b.id !== id));
}

// ─── Addon settings ───────────────────────────────────────────────────────────

export interface AddonSettings {
  billsEnabled: boolean;
  syncAccountId: string | null; // null = sync disabled
}

const SETTINGS_KEY = "ss:settings";
const DEFAULT_SETTINGS: AddonSettings = { billsEnabled: true, syncAccountId: null };

export function getSettings(): AddonSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AddonSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("ss:settings-changed"));
}

// ─── Sync log ─────────────────────────────────────────────────────────────────
// Maps "${subId}:${date}" → activityId so we never push the same charge twice.

const SYNC_LOG_KEY = "ss:sync-log";

export function getSyncLog(): Record<string, string> {
  try {
    const raw = localStorage.getItem(SYNC_LOG_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

export function updateSyncLog(entries: Record<string, string>): void {
  localStorage.setItem(SYNC_LOG_KEY, JSON.stringify({ ...getSyncLog(), ...entries }));
}

export function getSyncLogCount(): number {
  return Object.keys(getSyncLog()).length;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

/** Extract a clean hostname from a website string entered by the user. */
export function extractDomain(website: string): string {
  try {
    const url = website.startsWith("http") ? website : `https://${website}`;
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^www\./, "");
  }
}

/** Convert any billing cycle amount to its monthly equivalent. */
export function toMonthly(amount: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "weekly":    return (amount * 52) / 12;
    case "monthly":   return amount;
    case "quarterly": return amount / 3;
    case "yearly":    return amount / 12;
  }
}

/** Convert any billing cycle amount to its yearly equivalent. */
export function toYearly(amount: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "weekly":    return amount * 52;
    case "monthly":   return amount * 12;
    case "quarterly": return amount * 4;
    case "yearly":    return amount;
  }
}

/** Advance an ISO date string by one billing cycle. */
export function advanceDateByCycle(dateStr: string, cycle: BillingCycle): string {
  const d = new Date(dateStr);
  switch (cycle) {
    case "weekly":    d.setDate(d.getDate() + 7); break;
    case "monthly":   d.setMonth(d.getMonth() + 1); break;
    case "quarterly": d.setMonth(d.getMonth() + 3); break;
    case "yearly":    d.setFullYear(d.getFullYear() + 1); break;
  }
  return d.toISOString().slice(0, 10);
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const SUBS_KEY = "ss:subscriptions";

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export function getSubscriptions(): Subscription[] {
  return load<Subscription>(SUBS_KEY);
}

export function saveSubscription(sub: Subscription): void {
  const all = load<Subscription>(SUBS_KEY);
  const idx = all.findIndex((s) => s.id === sub.id);
  if (idx >= 0) {
    all[idx] = sub;
  } else {
    all.unshift(sub);
  }
  save(SUBS_KEY, all);
}

export function deleteSubscription(id: string): void {
  save(SUBS_KEY, load<Subscription>(SUBS_KEY).filter((s) => s.id !== id));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
