import { beforeEach } from "vitest";
import { installBrowserGlobals } from "./browser-globals";

// Installed at setup time — before any test module (and therefore before
// @wealthfolio/addon-sdk, which touches `window` while it is evaluated) loads.
const storage = installBrowserGlobals();

// One shared store, wiped between tests, so no test file has to shim it and no
// test can leak state into the next one.
beforeEach(() => {
  storage.reset();
});
