import { defineConfig } from "vitest/config";

/**
 * Test config, deliberately separate from vite.config.ts.
 *
 * The production build aliases "react" to src/react-host-shim.ts, which reads
 * window.React at call time — that only exists inside Wealthfolio. Tests here
 * cover the pure logic (dates, matching, storage, grouping), so they must NOT
 * inherit that alias: modules are imported with the real react package resolved
 * normally, which is enough to load a .tsx module without rendering anything.
 *
 * @wealthfolio/addon-sdk resolves fine under Node's ESM loader, but its entry
 * evaluates `window` at module scope, and src/lib/sync.ts imports it for a
 * value (QueryKeys). test/setup.ts installs the browser globals before any test
 * module is imported, so no alias or deps.inline entry is needed for it.
 */
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
    environment: "node",
    globals: false,
    setupFiles: ["./test/setup.ts"],
    restoreMocks: true,
  },
});
