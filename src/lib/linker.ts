import { getContext } from '../context';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DetectedPattern {
  id: string;
  name: string;
  amount: number;
  currency: string;
  activityType: string;
  dates: string[];
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  confidence: number;
  lastSeen: string;
  nextExpected: string;
  isIncome: boolean;
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
  confidence: number;
}

export interface ScanConfig {
  enabled: boolean;
  accountIds: string[];
  monthsBack: number;
  minOccurrences: number;
  amountTolerance: number;
}

export const DEFAULT_SCAN_CONFIG: ScanConfig = {
  enabled: true,
  accountIds: [],
  monthsBack: 6,
  minOccurrences: 3,
  amountTolerance: 0.05,
};

// ─── Detection ───────────────────────────────────────────────────────────────

export async function detectPatterns(config: ScanConfig): Promise<DetectedPattern[]> {
  if (!config.enabled || config.accountIds.length === 0) return [];

  const ctx = getContext();
  const txs: Array<{date: string; amount: number; currency: string; comment: string; activityType: string}> = [];
  for (const accountId of config.accountIds) {
    const activities = await ctx.api.activities.getAll(accountId);
    for (const a of activities) {
      const d = a.date;
      const now = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - config.monthsBack);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      if (d < start || d > now) continue;
      txs.push({
        date: d.toISOString().slice(0, 10),
        amount: Number(a.amount),
        currency: a.currency,
        comment: a.comment || '',
        activityType: a.activityType,
      });
    }
  }

  const patterns: DetectedPattern[] = [];
  const groups = groupByComment(txs);
  for (const key of groups.keys()) {
    const txns = groups.get(key);
    if (!txns || txns.length < config.minOccurrences) continue;
    const clusters = clusterAmounts(txns, config.amountTolerance);
    for (let ci = 0; ci < clusters.length; ci++) {
      const cluster = clusters[ci];
      if (cluster.length < config.minOccurrences) continue;
      const sorted = cluster.sort((a, b) => a.date < b.date ? -1 : 1);
      const dates = sorted.map(tx => tx.date);
      const intervals = calcIntervals(dates);
      const frequency = detectFrequency(intervals);
      const confidence = scoreConfidence(cluster.length, intervals, frequency);
      if (frequency && confidence >= 0.4) {
        const lastDate = dates[dates.length - 1];
        patterns.push({
          id: sorted[0].date + ':' + sorted[0].amount + ':' + sorted[0].currency,
          name: sorted[0].comment,
          amount: sorted[0].amount,
          currency: sorted[0].currency,
          activityType: sorted[0].activityType,
          dates,
          frequency,
          confidence,
          lastSeen: lastDate,
          nextExpected: predictNext(lastDate, frequency),
          isIncome: sorted[0].activityType === 'DEPOSIT',
        });
      }
    }
  }

  return patterns.sort((a, b) => b.confidence - a.confidence);
}

// ─── Matching ─────────────────────────────────────────────────────────────────

export async function findMatches(
  target: { name: string; amount: number; currency: string; date?: string; startDate?: string },
  accountIds: string[]
): Promise<TransactionMatch[]> {
  if (!accountIds.length) return [];

  const ctx = getContext();
  const EXPENSE_TYPES = new Set(['WITHDRAWAL', 'FEE']);
  const matches: TransactionMatch[] = [];
  for (const accountId of accountIds) {
    const activities = await ctx.api.activities.getAll(accountId);
    for (const a of activities) {
      if (!EXPENSE_TYPES.has(a.activityType)) continue;
      const pctDiff = Math.abs(Number(a.amount) - target.amount) / Math.max(target.amount, 0.01);
      if (pctDiff > 0.2) continue;
      const nameScore = commentSimilarity(target.name, a.comment || '');
      if (nameScore < 0.1) continue;

      matches.push({
        activityId: a.id,
        accountId: a.accountId,
        accountName: a.accountName,
        activityDate: a.date.toISOString().slice(0, 10),
        amount: Number(a.amount),
        currency: a.currency,
        comment: a.comment || '',
        activityType: a.activityType,
        confidence: nameScore,
      });
    }
  }
  return matches.sort((a, b) => b.confidence - a.confidence);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeComment(comment: string): string {
  return comment.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function groupByComment(
  txns: Array<{date: string; amount: number; currency: string; comment: string; activityType: string}>
): Map<string, Array<{date: string; amount: number; currency: string; comment: string; activityType: string}>> {
  const groups: Map<string, Array<{date: string; amount: number; currency: string; comment: string; activityType: string}>> = new Map();
  for (let i = 0; i < txns.length; i++) {
    const tx = txns[i];
    const key = normalizeComment(tx.comment);
    const existing = groups.get(key);
    if (existing) existing.push(tx);
    else groups.set(key, [tx]);
  }
  return groups;
}

function clusterAmounts(
  txns: Array<{date: string; amount: number; currency: string; comment: string; activityType: string}>,
  tolerance: number
): Array<Array<{date: string; amount: number; currency: string; comment: string; activityType: string}>> {
  const sorted = [...txns].sort((a, b) => a.amount - b.amount);
  const clusters: Array<Array<{date: string; amount: number; currency: string; comment: string; activityType: string}>> = [];
  let current: Array<{date: string; amount: number; currency: string; comment: string; activityType: string}> = [];
  let sum = 0;
  let count = 0;
  for (let i = 0; i < sorted.length; i++) {
    const tx = sorted[i];
    const avg = count > 0 ? sum / count : 0;
    if (count === 0 || Math.abs(tx.amount - avg) / Math.max(avg, 0.01) <= tolerance) {
      current.push(tx);
      sum += tx.amount;
      count++;
    } else {
      if (current.length > 0) clusters.push(current);
      current = [tx];
      sum = tx.amount;
      count = 1;
    }
  }
  if (current.length > 0) clusters.push(current);
  return clusters;
}

function calcIntervals(dates: string[]): number[] {
  const sorted = [...dates].sort();
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const d1 = new Date(sorted[i]);
    const d0 = new Date(sorted[i - 1]);
    const diff = (d1.getTime() - d0.getTime()) / (1000 * 60 * 60 * 24);
    if (diff > 0) intervals.push(diff);
  }
  return intervals;
}

function detectFrequency(intervals: number[]): 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null {
  if (intervals.length < 2) return null;
  const avg = intervals.reduce((a, b) => a + b) / intervals.length;
  const variance = intervals.reduce((s, i) => s + Math.pow(i - avg, 2), 0) / intervals.length;
  const cv = Math.sqrt(variance) / Math.max(avg, 1);
  if (cv > 0.4) return null;
  if (avg < 21) return 'weekly';
  if (avg < 45) return 'monthly';
  if (avg < 150) return 'quarterly';
  return 'yearly';
}

function scoreConfidence(count: number, intervals: number[], frequency: string): number {
  if (intervals.length < 2 || !frequency) return 0.4;
  const avg = intervals.reduce((a, b) => a + b) / intervals.length;
  const variance = intervals.reduce((s, i) => s + Math.pow(i - avg, 2), 0) / intervals.length;
  const cv = Math.sqrt(variance) / Math.max(avg, 1);
  let score = 0.4;
  if (count >= 6) score += 0.15;
  else if (count >= 3) score += 0.1;
  if (cv < 0.1) score += 0.2;
  else if (cv < 0.25) score += 0.1;
  return Math.min(score, 0.95);
}

function predictNext(lastDate: string, frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly'): string {
  const d = new Date(lastDate);
  switch (frequency) {
    case 'weekly': d.setDate(d.getDate() + 7); break;
    case 'monthly': d.setMonth(d.getMonth() + 1); break;
    case 'quarterly': d.setMonth(d.getMonth() + 3); break;
    case 'yearly': d.setFullYear(d.getFullYear() + 1); break;
  }
  return d.toISOString().slice(0, 10);
}

function commentSimilarity(a: string, b: string): number {
  const na = normalizeComment(a);
  const nb = normalizeComment(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1.0;
  if (na.includes(nb) || nb.includes(na)) return 0.7;
  const longer = na.length > nb.length ? na : nb;
  const shorter = na.length > nb.length ? nb : na;
  const dist = levenshtein(longer, shorter);
  return 1 - dist / longer.length;
}

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const m = a.length;
  const n = b.length;
  const dp: number[][] = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = [];
    for (let j = 0; j <= n; j++) dp[i][j] = 0;
  }
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}