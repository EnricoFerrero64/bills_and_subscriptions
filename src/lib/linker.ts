// Transaction matching: finds the real bank movement behind a bill or a
// subscription charge.
//
// The design point of this module is the load/match split. Activity history is
// fetched ONCE per account set (server-side filtered, paginated, cached) and
// every target is then scored against that in-memory snapshot by the pure,
// synchronous matchAgainst(). A page with N bills does 1 request, not N.

import type { ActivityDetails, ActivitySearchFilters } from "@wealthfolio/addon-sdk";
import { getContext } from "../context";
import { ADDON_SOURCE, getSyncLog, isValidISODate } from "./storage";

// ─── Types ────────────────────────────────────────────────────────────────────

/** An expense-side activity, normalised for matching. */
export interface ExpenseTx {
  activityId: string;
  accountId: string;
  accountName: string;
  date: string;        // YYYY-MM-DD
  amount: number;      // ALWAYS positive (host sign convention is not guaranteed)
  currency: string;
  comment: string;     // raw, for display
  activityType: string;
  isSynthetic: boolean; // written by this addon's sync — never offer as a match
}

export interface TransactionMatch {
  activityId: string;
  accountId: string;
  accountName: string;
  activityDate: string;
  amount: number;
  currency: string;
  comment: string;
  activityType: string;
  confidence: number;  // 0..1
}

export interface MatchTarget {
  name: string;
  amount: number;
  currency: string;
  date?: string;       // the bill's due date / the subscription's charge date
}

export interface MatchOptions {
  excludeActivityIds?: Set<string>;  // e.g. activities already linked elsewhere
  limit?: number;                    // default 25
}

// ─── Tuning constants ─────────────────────────────────────────────────────────

/** Confidence at or above which the UI may auto-suggest a match without asking. */
export const MIN_SUGGEST_CONFIDENCE = 0.45;

/** Activity types that can represent paying a bill or a subscription. */
const EXPENSE_TYPES = ["WITHDRAWAL", "FEE"] as const;

const MAX_AMOUNT_DIFF = 0.2;   // reject beyond 20% off the expected amount
const MIN_NAME_SIMILARITY = 0.3;
const DATE_SCORE_WINDOW_DAYS = 45;
const DEFAULT_LIMIT = 25;

const PAGE_SIZE = 500;
/** Hard stop so a host that ignores `page` cannot spin us forever. */
const MAX_PAGES = 40;

// ─── Activity cache ───────────────────────────────────────────────────────────

/**
 * Keyed by account set, because callers legitimately ask for different sets: a
 * page loads the union of active accounts, while a bill pinned to one account
 * asks for just that one. A single-entry cache turns that alternation into a
 * 0% hit rate — each narrow request evicts the union snapshot and the next wide
 * request re-downloads everything. Small bound: the sets in play are few.
 */
const MAX_CACHE_ENTRIES = 8;

const cache = new Map<string, Promise<ExpenseTx[]>>();

function cacheKey(accountIds: string[]): string {
  return [...accountIds].sort().join("|");
}

/** Drop the cache — call after the addon writes activities (sync). */
export function invalidateActivityCache(): void {
  cache.clear();
}

/**
 * Fetch every expense-side activity for these accounts, ONCE, and cache it.
 * Uses activities.search() with backend-side accountIds + activityTypes
 * filters and follows pagination. Concurrent callers with the same account set
 * share one in-flight promise. Falls back to activities.getAll() per account if
 * search() is unavailable or throws.
 */
export async function loadExpenseActivities(accountIds: string[]): Promise<ExpenseTx[]> {
  if (accountIds.length === 0) return [];

  const key = cacheKey(accountIds);
  const cached = cache.get(key);
  if (cached) return cached;

  const promise = fetchExpenseActivities(accountIds);
  // Evict the oldest first: Map preserves insertion order, so the first key is
  // the least recently added.
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next();
    if (!oldest.done) cache.delete(oldest.value);
  }
  cache.set(key, promise);
  // A failed fetch must not be cached, or the page never recovers from a blip.
  promise.catch(() => {
    if (cache.get(key) === promise) cache.delete(key);
  });
  return promise;
}

async function fetchExpenseActivities(accountIds: string[]): Promise<ExpenseTx[]> {
  const syntheticIds = getSyncedActivityIds();
  let raw: ActivityDetails[];
  try {
    raw = await searchAllPages(accountIds);
  } catch {
    raw = await getAllPerAccount(accountIds);
  }

  const out: ExpenseTx[] = [];
  const seen = new Set<string>();
  for (const a of raw) {
    if (!isExpenseType(a.activityType)) continue;
    if (seen.has(a.id)) continue; // paginated hosts can repeat rows across pages
    seen.add(a.id);
    out.push(toExpenseTx(a, syntheticIds));
  }
  return out;
}

async function searchAllPages(accountIds: string[]): Promise<ActivityDetails[]> {
  const api = getContext().api.activities;
  if (typeof api.search !== "function") throw new Error("activities.search unavailable");

  const filters: ActivitySearchFilters = {
    accountIds,                          // one request covers every account
    activityTypes: [...EXPENSE_TYPES],    // filtered by the backend, not by us
  };

  const all: ActivityDetails[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await api.search(page, PAGE_SIZE, filters, "");
    const rows = res?.data ?? [];
    all.push(...rows);
    const total = res?.meta?.totalRowCount;
    if (rows.length < PAGE_SIZE) break;
    if (typeof total === "number" && all.length >= total) break;
  }
  return all;
}

async function getAllPerAccount(accountIds: string[]): Promise<ActivityDetails[]> {
  const api = getContext().api.activities;
  const perAccount = await Promise.all(accountIds.map((id) => api.getAll(id)));
  return perAccount.flat();
}

/**
 * Activity ids this addon created. Two signals, because neither alone is
 * complete: new writes carry metadata.source, but rows synced before that
 * stamp existed only appear in the sync log.
 */
function getSyncedActivityIds(): Set<string> {
  return new Set(Object.values(getSyncLog()));
}

function isExpenseType(activityType: string): boolean {
  return (EXPENSE_TYPES as readonly string[]).includes(activityType);
}

function isSyntheticActivity(a: ActivityDetails, syncedIds: Set<string>): boolean {
  if (syncedIds.has(a.id)) return true;
  const source = a.metadata?.source;
  return typeof source === "string" && source === ADDON_SOURCE;
}

function toExpenseTx(a: ActivityDetails, syncedIds: Set<string>): ExpenseTx {
  return {
    activityId: a.id,
    accountId: a.accountId,
    accountName: a.accountName,
    date: toISODate(a.date),
    amount: Math.abs(Number(a.amount ?? 0)) || 0,
    currency: a.currency,
    comment: a.comment ?? "",
    activityType: a.activityType,
    isSynthetic: isSyntheticActivity(a, syncedIds),
  };
}

/** The SDK types `date` as Date, but hosts that cross a JSON boundary hand back
 *  an ISO string. Accept both rather than crash on toISOString. */
function toISODate(value: Date | string): string {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") return value.slice(0, 10);
  return "";
}

// ─── Matching ─────────────────────────────────────────────────────────────────

interface ScoredMatch extends TransactionMatch {
  dayDistance: number; // tie-breaker only, not part of the public shape
}

/** Pure and synchronous: rank `activities` against one target. */
export function matchAgainst(
  target: MatchTarget,
  activities: ExpenseTx[],
  opts?: MatchOptions,
): TransactionMatch[] {
  const exclude = opts?.excludeActivityIds;
  const limit = opts?.limit ?? DEFAULT_LIMIT;
  const targetDays = target.date && isValidISODate(target.date) ? isoToDays(target.date) : null;
  const normalizedName = normalizeComment(target.name);

  const scored: ScoredMatch[] = [];
  for (const tx of activities) {
    if (tx.isSynthetic) continue;
    if (exclude?.has(tx.activityId)) continue;
    if (tx.currency !== target.currency) continue;

    const pctDiff = Math.abs(tx.amount - target.amount) / Math.max(target.amount, 0.01);
    if (pctDiff > MAX_AMOUNT_DIFF) continue;

    const ns = similarity(normalizedName, normalizeComment(tx.comment));
    if (ns < MIN_NAME_SIMILARITY) continue;

    const dayDistance =
      targetDays !== null && isValidISODate(tx.date)
        ? Math.abs(isoToDays(tx.date) - targetDays)
        : 0;
    const amountScore = 1 - Math.min(pctDiff / MAX_AMOUNT_DIFF, 1);
    // No target date means date carries no information — stay neutral rather
    // than penalise every candidate equally.
    const dateScore =
      targetDays === null ? 0.5 : Math.max(0, 1 - dayDistance / DATE_SCORE_WINDOW_DAYS);

    scored.push({
      activityId: tx.activityId,
      accountId: tx.accountId,
      accountName: tx.accountName,
      activityDate: tx.date,
      amount: tx.amount,
      currency: tx.currency,
      comment: tx.comment,
      activityType: tx.activityType,
      confidence: clamp01(0.5 * ns + 0.3 * dateScore + 0.2 * amountScore),
      dayDistance,
    });
  }

  scored.sort(
    (a, b) =>
      b.confidence - a.confidence ||
      a.dayDistance - b.dayDistance ||
      compareDatesDesc(a.activityDate, b.activityDate),
  );

  return scored.slice(0, Math.max(0, limit)).map(stripInternals);
}

/** Convenience: loadExpenseActivities + matchAgainst. */
export async function findMatches(
  target: MatchTarget,
  accountIds: string[],
  opts?: MatchOptions,
): Promise<TransactionMatch[]> {
  if (accountIds.length === 0) return [];
  return matchAgainst(target, await loadExpenseActivities(accountIds), opts);
}

function stripInternals({ dayDistance: _dayDistance, ...match }: ScoredMatch): TransactionMatch {
  return match;
}

function compareDatesDesc(a: string, b: string): number {
  if (a === b) return 0;
  return a > b ? -1 : 1;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

const MS_PER_DAY = 86_400_000;

/** Whole days since the epoch for a "YYYY-MM-DD" string, parsed as UTC so the
 *  viewer's timezone can never shift a comparison by a day. */
function isoToDays(iso: string): number {
  return Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) / MS_PER_DAY;
}

// ─── Comment normalisation & similarity ───────────────────────────────────────

/** Tokens banks staple onto a description that say nothing about the merchant. */
const NOISE_TOKENS = new Set([
  "ref", "refno", "reference", "txn", "trn", "tx", "trans", "auth", "authno",
  "id", "no", "nr", "num", "seq", "pos", "xxxx", "xx",
]);

/**
 * Reduce a description to its alphabetic core.
 *
 * Real bank comments look like "NETFLIX 12/03 REF 88213" — the digits and the
 * reference tokens change on every charge, so leaving them in means two
 * charges for the same service never look similar. The raw comment is kept
 * separately on ExpenseTx for display.
 */
function normalizeComment(comment: string): string {
  return comment
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")  // drop combining accents
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 0 && !isNoiseToken(token))
    .join(" ");
}

function isNoiseToken(token: string): boolean {
  if (NOISE_TOKENS.has(token)) return true;
  if (!/[a-z]/.test(token)) return true;              // pure digits, date fragments
  return /\d/.test(token) && token.length > 3;        // reference codes: "inv12345"
}

/** 0..1 similarity of two already-normalised strings. */
function similarity(na: string, nb: string): number {
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.7;

  const longer = na.length >= nb.length ? na : nb;
  const shorter = na.length >= nb.length ? nb : na;
  // Levenshtein is at least the length gap, so similarity can never exceed
  // shorter/longer. Skip the DP entirely when that ceiling misses the gate.
  const ceiling = shorter.length / longer.length;
  if (ceiling < MIN_NAME_SIMILARITY) return 0;

  const maxDist = Math.floor(longer.length * (1 - MIN_NAME_SIMILARITY));
  const dist = levenshtein(longer, shorter, maxDist);
  if (dist > maxDist) return 0;
  return Math.max(0, 1 - dist / longer.length);
}

/**
 * Two-row Levenshtein: this runs over thousands of activities times N targets,
 * so a full matrix per comparison is not affordable. Bails out with
 * `maxDist + 1` as soon as every cell in a row exceeds maxDist.
 */
function levenshtein(a: string, b: string, maxDist: number): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const n = b.length;
  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      const v = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      curr[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > maxDist) return maxDist + 1;
    const swap = prev;
    prev = curr;
    curr = swap;
  }
  return prev[n];
}
