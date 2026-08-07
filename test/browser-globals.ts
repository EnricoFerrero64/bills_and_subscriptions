/**
 * The browser globals the addon's data layer needs, installed once per test
 * process. Imported by test/setup.ts (which resets storage between tests) and
 * by any test that wants a handle on the store itself.
 *
 * Provided here rather than by switching to a DOM environment because nothing
 * under test renders: storage.ts needs `localStorage`, its change-notification
 * needs a `window` that can dispatch events, and @wealthfolio/addon-sdk reads
 * `window` at module scope.
 */

export interface MemoryStorage {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  /** Make the next `count` setItem calls throw, to exercise quota handling. */
  failNextWrites(count: number, err?: unknown): void;
  /** Back to empty and non-failing. */
  reset(): void;
}

function createMemoryStorage(): MemoryStorage {
  const entries = new Map<string, string>();
  let failuresLeft = 0;
  let failure: unknown = new Error("QuotaExceededError");

  return {
    get length() {
      return entries.size;
    },
    key(index) {
      return [...entries.keys()][index] ?? null;
    },
    getItem(key) {
      const value = entries.get(String(key));
      return value === undefined ? null : value;
    },
    setItem(key, value) {
      if (failuresLeft > 0) {
        failuresLeft--;
        throw failure;
      }
      entries.set(String(key), String(value));
    },
    removeItem(key) {
      entries.delete(String(key));
    },
    clear() {
      entries.clear();
    },
    failNextWrites(count, err) {
      failuresLeft = count;
      if (err !== undefined) failure = err;
    },
    reset() {
      entries.clear();
      failuresLeft = 0;
    },
  };
}

let installed: MemoryStorage | null = null;

/** Idempotent: repeated calls return the same store that is already installed. */
export function installBrowserGlobals(): MemoryStorage {
  if (installed) return installed;

  const storage = createMemoryStorage();
  const globals = globalThis as unknown as Record<string, unknown>;

  // A real EventTarget, so onDataChanged/persist notifications behave as they
  // do in the host instead of being swallowed by a stub.
  const win = (globals.window as Record<string, unknown> | undefined) ?? (new EventTarget() as unknown as Record<string, unknown>);
  win.localStorage = storage;
  globals.window = win;
  globals.localStorage = storage;

  installed = storage;
  return storage;
}
