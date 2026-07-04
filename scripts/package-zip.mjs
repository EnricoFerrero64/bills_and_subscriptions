// Builds the addon and packages it into a zip ready to share.
// Output: releases/bills-and-subscriptions-<version>.zip
// Contents: bills-and-subscriptions/addon.js + bills-and-subscriptions/manifest.json
//
// Usage: npm run package

import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import { createWriteStream } from "fs";
import { createGzip } from "zlib";

const ROOT = join(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "..");
const DIST = join(ROOT, "dist");
const RELEASES = join(ROOT, "releases");

// Read version from manifest
const manifest = JSON.parse(readFileSync(join(ROOT, "manifest.json"), "utf-8"));
const version = manifest.version ?? "1.0.0";
const ADDON_ID = "bills-and-subscriptions";
const ZIP_NAME = `${ADDON_ID}-v${version}.zip`;
const ZIP_PATH = join(RELEASES, ZIP_NAME);

// Build first
console.log("🔨  Building…");
execSync("npm run build", { stdio: "inherit", cwd: ROOT });

// Inline CSS into addon.js (same logic as deploy.mjs)
const addonJsPath = join(DIST, "addon.js");
let addonJs = readFileSync(addonJsPath, "utf-8");

const cssPath = join(DIST, "bills-and-subscriptions.css");
if (existsSync(cssPath)) {
  const cssContent = readFileSync(cssPath, "utf-8");
  const rootBlockRe = /(?::root|:host)(?:\s*,\s*(?::root|:host))*\s*\{[^}]*\}/g;
  const rootBlocks = cssContent.match(rootBlockRe) ?? [];
  const bodyOnly = cssContent.replace(rootBlockRe, "");
  const globalCss = rootBlocks.join("\n");
  const scopedCss = `${globalCss}\n@scope (.bills-and-subscriptions-root) {\n${bodyOnly}\n}`;
  const injection = `(function(){var s=document.createElement('style');s.textContent=${JSON.stringify(scopedCss)};document.head.appendChild(s);})();\n`;
  addonJs = injection + addonJs;
}

// Write patched addon.js to a temp staging dir
const STAGING = join(ROOT, ".staging");
const ADDON_DIR = join(STAGING, ADDON_ID);
mkdirSync(ADDON_DIR, { recursive: true });
writeFileSync(join(ADDON_DIR, "addon.js"), addonJs);

// Write manifest (with source: local)
const outManifest = { ...manifest, enabled: true, installedAt: new Date().toISOString(), source: "local" };
writeFileSync(join(ADDON_DIR, "manifest.json"), JSON.stringify(outManifest, null, 2));

// Create zip using PowerShell (available on all modern Windows)
mkdirSync(RELEASES, { recursive: true });
if (existsSync(ZIP_PATH)) rmSync(ZIP_PATH);

console.log(`📦  Zipping…`);
execSync(
  `powershell -Command "Compress-Archive -Path '${ADDON_DIR}' -DestinationPath '${ZIP_PATH}'"`,
  { stdio: "inherit" }
);

// Cleanup staging
rmSync(STAGING, { recursive: true, force: true });

console.log(`\n✅  Created: releases/${ZIP_NAME}`);
console.log(`   Share this file. The user extracts it into:`);
console.log(`   %APPDATA%\\com.teymz.wealthfolio\\addons\\`);
