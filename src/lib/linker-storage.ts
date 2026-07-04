/**
 * linker-storage.ts — Storage layer for the Bill Linking feature.
 *
 * Defines ScanConfig, DetectedPattern, and LinkRecord interfaces plus
 * static methods for CRUD operations against an in-memory store.
 */

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

let _patterns: Map<string, DetectedPattern> = new Map();
let _links: Map<string, LinkRecord> = new Map();
let _config: ScanConfig = { ...DEFAULT_SCAN_CONFIG };

export function getScanConfig(): ScanConfig {
  return _config;
}

export function setScanConfig(config: Partial<ScanConfig>): ScanConfig {
  _config = { ..._config, ...config };
  return getScanConfig();
}

export function savePattern(pattern: DetectedPattern): DetectedPattern {
  _patterns.set(pattern.id, pattern);
  return pattern;
}

export function getPatterns(): DetectedPattern[] {
  return Array.from(_patterns.values());
}

export function getPatternById(id: string): DetectedPattern | undefined {
  return _patterns.get(id);
}

export function saveLink(record: LinkRecord): LinkRecord {
  _links.set(record.id, record);
  return record;
}

export function getLinks(): LinkRecord[] {
  return Array.from(_links.values());
}

export function removeLink(id: string): boolean {
  return _links.delete(id);
}

export function resetStore(): void {
  _patterns.clear();
  _links.clear();
  _config = { ...DEFAULT_SCAN_CONFIG };
}