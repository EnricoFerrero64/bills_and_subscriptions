export interface ScanConfig {
  minOccurrences: number;
  amountVariance: number;
  timeWindowMonths: number;
}

export interface DetectedPattern {
  id: string;
  vendor: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  confidence: number;
  occurrences: number;
  lastSeen: string;
  accounts: string[];
  dismissed: boolean;
}

export interface LinkRecord {
  id: string;
  patternId: string;
  transactionId: string;
  linkedAt: string;
}

export const DEFAULT_SCAN_CONFIG: ScanConfig = {
  minOccurrences: 3,
  amountVariance: 0.1,
  timeWindowMonths: 12,
};

const _patterns: Map<string, DetectedPattern> = new Map();
const _links: Map<string, LinkRecord> = new Map();
let _config: ScanConfig = { ...DEFAULT_SCAN_CONFIG };

export function getScanConfig(): ScanConfig { return _config; }
export function setScanConfig(c: Partial<ScanConfig>): ScanConfig { _config = { ..._config, ...c }; return getScanConfig(); }
export function savePattern(p: DetectedPattern): DetectedPattern { _patterns.set(p.id, p); return p; }
export function getPatterns(): DetectedPattern[] { return Array.from(_patterns.values()); }
export function getPatternById(id: string): DetectedPattern | undefined { return _patterns.get(id); }
export function saveLink(r: LinkRecord): LinkRecord { _links.set(r.id, r); return r; }
export function getLinks(): LinkRecord[] { return Array.from(_links.values()); }
export function removeLink(id: string): boolean { return _links.delete(id); }
export function resetStore(): void { _patterns.clear(); _links.clear(); _config = { ...DEFAULT_SCAN_CONFIG }; }