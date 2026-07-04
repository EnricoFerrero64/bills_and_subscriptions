import {
  ScanConfig,
  DetectedPattern,
  LinkRecord,
  DEFAULT_SCAN_CONFIG,
  savePattern,
  saveLink,
  getPatterns,
  getLinks,
  removeLink,
  getScanConfig,
} from './linker-storage';

// ── Transaction schema (Wealthfolio) ────────────────────────────

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  vendor: string;
  accountId: string;
  type: 'debit' | 'credit';
}

// ── Suggestion model ─────────────────────────────────────────────

export interface Suggestion {
  patternId: string;
  vendor: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  confidence: number;   // 0–100
  lastSeen: string;
  isDismissed: boolean;
}

// ── 1. Detect Recurring Patterns ────────────────────────────────

export function detectRecurringPatterns(
  transactions: Transaction[],
  config: ScanConfig = DEFAULT_SCAN_CONFIG,
): DetectedPattern[] {
  const groups: Map<string, Transaction[]> = new Map();

  for (const tx of transactions) {
    const roundedAmount = Math.round(tx.amount * 100) / 100;
    const key = `${tx.vendor.toLowerCase()}::${roundedAmount}`;
    const existing = groups.get(key) || [];
    existing.push(tx);
    groups.set(key, existing);
  }

  const patterns: DetectedPattern[] = [];
  const now = new Date();

  const groupKeys = Array.from(groups.keys());
  for (const key of groupKeys) {
    const txs = groups.get(key);
    if (!txs) continue;
    if (txs.length < config.minOccurrences) continue;

    const sorted = txs.slice().sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const windowStart = new Date(now);
    windowStart.setMonth(windowStart.getMonth() - config.timeWindowMonths);
    const inWindow = sorted.filter(t => new Date(t.date) >= windowStart);
    if (inWindow.length < config.minOccurrences) continue;

    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const d1 = new Date(sorted[i].date).getTime();
      const d0 = new Date(sorted[i - 1].date).getTime();
      intervals.push((d1 - d0) / (1000 * 60 * 60 * 24));
    }

    const avgInterval = intervals.length
      ? intervals.reduce((a, b) => a + b, 0) / intervals.length
      : 30;
    const frequency = intervalToFrequency(avgInterval);

    const amounts = sorted.map(t => t.amount);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;

    const [vendor] = key.split('::');

    const pattern: DetectedPattern = {
      id: generateId('pattern'),
      vendor,
      amount: Math.round(avgAmount * 100) / 100,
      frequency,
      confidence: 0,
      occurrences: inWindow.length,
      lastSeen: sorted[sorted.length - 1].date,
      accounts: [],
      dismissed: false,
    };

    savePattern(pattern);
    patterns.push(pattern);
  }

  return patterns;
}

// ── 2. Link Transaction to Pattern ───────────────────────────────

export function linkTransactionToPattern(
  transaction: Transaction,
  pattern: DetectedPattern,
): LinkRecord {
  const link: LinkRecord = {
    id: generateId('link'),
    patternId: pattern.id,
    transactionId: transaction.id,
    linkedAt: new Date().toISOString().split('T')[0],
  };

  saveLink(link);
  return link;
}

// ── 3. Get Suggestions ───────────────────────────────────────────

export function getSuggestions(
  patterns?: DetectedPattern[],
  filter?: { vendor?: string; minConfidence?: number },
): Suggestion[] {
  const list: DetectedPattern[] = patterns !== undefined ? patterns : getPatterns();
  const suggestions: Suggestion[] = [];

  for (const pattern of list) {
    if (filter?.vendor && !pattern.vendor.toLowerCase().includes(filter.vendor.toLowerCase())) {
      continue;
    }

    suggestions.push({
      patternId: pattern.id,
      vendor: pattern.vendor,
      amount: pattern.amount,
      frequency: pattern.frequency,
      confidence: Math.round(pattern.confidence * 100),
      lastSeen: pattern.lastSeen,
      isDismissed: pattern.dismissed,
    });
  }

  return suggestions;
}

// ── Unlink ────────────────────────────────────────────────────────

export function unlinkTransaction(linkId: string): boolean {
  return removeLink(linkId);
}

// ── Get Links ─────────────────────────────────────────────────────

export function getAllLinks(): LinkRecord[] {
  return getLinks();
}

// ── Helpers ──────────────────────────────────────────────────────

function intervalToFrequency(
  days: number,
): 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' {
  if (days <= 2) return 'daily';
  if (days <= 8) return 'weekly';
  if (days <= 16) return 'biweekly';
  if (days <= 35) return 'monthly';
  if (days <= 100) return 'quarterly';
  return 'yearly';
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}