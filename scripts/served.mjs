// Resolves the client bundles the browser actually receives.
//
// Reads a save of the boot HTML (the page dsh web serves at `/`) and writes the
// on-disk path of every bundle in its combo URLs. This exists because working
// from a plugin root instead of the served set silently under-measures: 55 of
// the 58 bundles live in the dsh install tree, not the profile tree, so a scan
// of the profile tree alone reports nearly everything translated while whole
// screens stay Chinese.
//
// Usage: node scripts/served.mjs <boot.html> [out.json]
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const [, , htmlPath, outPath = "served.json"] = process.argv;
if (!htmlPath) {
  console.error("usage: node scripts/served.mjs <boot.html> [out.json]");
  process.exit(2);
}

const roots = (
  process.env.C2E_BUNDLE_ROOTS ??
  "/home/oiupoyt/.dsh/profiles/web/node_modules/:" +
    "/home/oiupoyt/.npm-global/lib/node_modules/@deepseek-ai/dsh/node_modules/"
)
  .split(/[:,]/)
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => (entry.endsWith("/") ? entry : entry + "/"));

const html = readFileSync(htmlPath, "utf8");
const urls = [
  ...new Set((html.match(/plugins\/\?\?[^"'\\ ]+/g) ?? []).map((u) => u.replace(/&amp;/g, "&"))),
];

const entries = new Set();
for (const url of urls) {
  const list = url.slice(url.indexOf("??") + 2).split("&")[0];
  for (const raw of list.split(",")) {
    const entry = decodeURIComponent(raw.trim());
    if (entry) entries.add(entry);
  }
}

// A served URL is `<pkg>/client.js`; the built file may sit in lib/, client/,
// dist/ or beside package.json depending on the plugin's own build.
const SUFFIXES = ["", "lib/", "client/", "dist/"];
const served = [];
const missing = [];
for (const entry of entries) {
  const tail = entry.slice(entry.lastIndexOf("/") + 1);
  const head = entry.slice(0, entry.lastIndexOf("/") + 1);
  let hit;
  for (const root of roots) {
    for (const dir of SUFFIXES) {
      const candidate = root + head + dir + tail;
      if (existsSync(candidate)) { hit = candidate; break; }
    }
    if (hit) break;
  }
  if (hit) served.push(hit);
  else missing.push(entry);
}

writeFileSync(outPath, JSON.stringify(served, null, 1) + "\n");
console.log(`served: ${served.length} bundles resolved, ${missing.length} missing -> ${outPath}`);
for (const m of missing) console.log(`  missing: ${m}`);
if (missing.length) process.exitCode = 1;
