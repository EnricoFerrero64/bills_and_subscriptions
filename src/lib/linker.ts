import { ScanConfig, DetectedPattern, LinkRecord, DEFAULT_SCAN_CONFIG, savePattern, saveLink, getPatterns, getLinks, removeLink } from './linker-storage';

export interface Transaction {
  id: string; date: string; amount: number; description: string; vendor: string; accountId: string; type: 'debit' | 'credit';
}

export interface Suggestion {
  patternId: string; vendor: string; amount: number; frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'; confidence: number; lastSeen: string; isDismissed: boolean;
}

export function detectRecurringPatterns(transactions: Transaction[], config: ScanConfig = DEFAULT_SCAN_CONFIG): DetectedPattern[] {
  const groups = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const r = Math.round(tx.amount * 100) / 100;
    const key = `${tx.vendor.toLowerCase()}::${r}`;
    const e = groups.get(key) || []; e.push(tx); groups.set(key, e);
  }
  const patterns: DetectedPattern[] = [];
  const now = new Date();
  const keys = Array.from(groups.keys());
  for (const key of keys) {
    const txs = groups.get(key);
    if (!txs || txs.length < config.minOccurrences) continue;
    const sorted = txs.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const ws = new Date(now); ws.setMonth(ws.getMonth() - config.timeWindowMonths);
    const inW = sorted.filter(t => new Date(t.date) >= ws);
    if (inW.length < config.minOccurrences) continue;
    const ivls: number[] = [];
    for (let i = 1; i < sorted.length; i++) { const d1 = new Date(sorted[i].date).getTime(); const d0 = new Date(sorted[i-1].date).getTime(); ivls.push((d1 - d0) / 86400000); }
    const avgI = ivls.length ? ivls.reduce((a, b) => a + b, 0) / ivls.length : 30;
    const freq = intervalToFreq(avgI);
    const amounts = sorted.map(t => t.amount);
    const avgA = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const [v] = key.split('::');
    const p: DetectedPattern = { id: genId('p'), vendor: v, amount: Math.round(avgA * 100) / 100, frequency: freq, confidence: 0, occurrences: inW.length, lastSeen: sorted[sorted.length - 1].date, accounts: [], dismissed: false };
    savePattern(p); patterns.push(p);
  }
  return patterns;
}

export function linkTransactionToPattern(tx: Transaction, p: DetectedPattern): LinkRecord {
  const l: LinkRecord = { id: genId('l'), patternId: p.id, transactionId: tx.id, linkedAt: new Date().toISOString().split('T')[0] };
  saveLink(l); return l;
}

export function getSuggestions(patterns?: DetectedPattern[]): Suggestion[] {
  const list: DetectedPattern[] = patterns || getPatterns();
  return list.map(p => ({ patternId: p.id, vendor: p.vendor, amount: p.amount, frequency: p.frequency, confidence: Math.round(p.confidence * 100), lastSeen: p.lastSeen, isDismissed: p.dismissed }));
}

export function unlinkTransaction(id: string): boolean { return removeLink(id); }
export function getAllLinks(): LinkRecord[] { return getLinks(); }

function intervalToFreq(d: number): 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' {
  if (d <= 2) return 'daily'; if (d <= 8) return 'weekly'; if (d <= 16) return 'biweekly'; if (d <= 35) return 'monthly'; if (d <= 100) return 'quarterly'; return 'yearly';
}

function genId(p: string): string { return `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }