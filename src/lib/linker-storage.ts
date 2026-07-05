import type { DetectedPattern, ScanConfig } from './linker';
import { DEFAULT_SCAN_CONFIG } from './linker';

const SCAN_CONFIG_KEY = 'ss:scan-config';
const DETECTED_PATTERNS_KEY = 'ss:detected-patterns';
const IGNORED_PATTERN_KEYS_KEY = 'ss:ignored-pattern-keys';

export function getScanConfig(): ScanConfig {
  try {
    const raw = localStorage.getItem(SCAN_CONFIG_KEY);
    if (!raw) return { ...DEFAULT_SCAN_CONFIG };
    return { ...DEFAULT_SCAN_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SCAN_CONFIG };
  }
}

export function saveScanConfig(config: ScanConfig): void {
  localStorage.setItem(SCAN_CONFIG_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent('ss:scan-config-changed'));
}

export function getDetectedPatterns(): DetectedPattern[] {
  try {
    const raw = localStorage.getItem(DETECTED_PATTERNS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDetectedPatterns(patterns: DetectedPattern[]): void {
  localStorage.setItem(DETECTED_PATTERNS_KEY, JSON.stringify(patterns));
}

export function getIgnoredPatternKeys(): string[] {
  try {
    const raw = localStorage.getItem(IGNORED_PATTERN_KEYS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addIgnoredPatternKey(key: string): void {
  const keys = getIgnoredPatternKeys();
  if (!keys.includes(key)) {
    keys.push(key);
    localStorage.setItem(IGNORED_PATTERN_KEYS_KEY, JSON.stringify(keys));
  }
}

export function removeIgnoredPatternKey(key: string): void {
  const keys = getIgnoredPatternKeys();
  localStorage.setItem(IGNORED_PATTERN_KEYS_KEY, JSON.stringify(keys.filter(k => k !== key)));
}

export function isPatternIgnored(key: string): boolean {
  return getIgnoredPatternKeys().includes(key);
}

// Generate a unique key for a pattern (used for ignoring)
export function patternKey(name: string, amount: number, currency: string): string {
  return `${name}||${amount}||${currency}`;
}

// Generate a unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Format currency
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Frequency label
export function frequencyLabel(freq: 'weekly' | 'monthly' | 'quarterly' | 'yearly'): string {
  switch (freq) {
    case 'weekly': return '/ week';
    case 'monthly': return '/ month';
    case 'quarterly': return '/ quarter';
    case 'yearly': return '/ year';
  }
}

// Confidence label
export function confidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.6) return 'Medium';
  return 'Good';
}

// Confidence color
export function confidenceColor(confidence: number): string {
  if (confidence >= 0.8) return '#36a15d'; // green
  if (confidence >= 0.6) return '#b58026'; // amber
  return '#d2722d'; // orange
}

// ─── Linked transactions ──────────────────────────────────────────────────────

export interface LinkedTransaction {
  subscriptionId: string;
  activityId: string;
  activityDate: string;
  amount: number;
  currency: string;
  description: string;
  accountName: string;
  linkedAt: string;
}

const LINKS_KEY = 'blink:links';

export function getLinks(): LinkedTransaction[] {
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLinksForSubscription(subscriptionId: string): LinkedTransaction[] {
  return getLinks().filter(l => l.subscriptionId === subscriptionId);
}

export function saveLink(link: LinkedTransaction): void {
  const all = getLinks().filter(
    l => !(l.subscriptionId === link.subscriptionId && l.activityId === link.activityId)
  );
  all.push(link);
  localStorage.setItem(LINKS_KEY, JSON.stringify(all));
}

export function removeLink(subscriptionId: string, activityId: string): void {
  const all = getLinks().filter(
    l => !(l.subscriptionId === subscriptionId && l.activityId === activityId)
  );
  localStorage.setItem(LINKS_KEY, JSON.stringify(all));
}

export function isLinked(subscriptionId: string, activityId: string): boolean {
  return getLinks().some(l => l.subscriptionId === subscriptionId && l.activityId === activityId);
}