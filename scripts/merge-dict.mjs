import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Merges the two translation sources already in this repo into one canonical
// dictionary payload. Dependency-free; rerun with `npm run dict`.

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pairs = new Map();

const marketPath = join(root, "dshmarket_dict.json");
if (existsSync(marketPath)) {
  const data = JSON.parse(readFileSync(marketPath, "utf8"));
  for (const [zh, en] of Object.entries(data)) pairs.set(zh, en);
}

// patch-plugins.py carries its pairs inline as `"zh": "en",` lines.
const patchPath = join(root, "patch-plugins.py");
if (existsSync(patchPath)) {
  const src = readFileSync(patchPath, "utf8");
  const body = src.slice(src.indexOf("UI_TRANSLATIONS = {"));
  const re = /^\s*"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*$/gm;
  let m;
  while ((m = re.exec(body))) pairs.set(m[1], m[2]);
}

// Curated supplement, measured against the real served bundles. Merged last so
// it overrides anything the harvested sources got wrong.
const extraPath = join(root, "src", "dictionary.extra.json");
if (existsSync(extraPath)) {
  const data = JSON.parse(readFileSync(extraPath, "utf8"));
  for (const [zh, en] of Object.entries(data)) pairs.set(zh, en);
}

// Author-authored `{ zh, en }` pairs lifted from plugin locale maps. This is the
// highest-quality source: a human wrote both sides, so it beats every
// machine-harvested pair and is merged last.
const localePairsPath = join(root, "locale-pairs.json");
if (existsSync(localePairsPath)) {
  const data = JSON.parse(readFileSync(localePairsPath, "utf8"));
  for (const [zh, en] of Object.entries(data)) pairs.set(zh, en);
}

// A handful of upstream entries are Malay, not English. Emitting them would
// inject foreign words into an English UI, so they are replaced by name.
const NON_ENGLISH = new Map([
  ["当前", "Current"],
  ["本地", "Local"],
]);

const clean = {};
let dropped = 0;
for (const [zh, en] of pairs) {
  // Guard the substitution contract: a key must be Chinese and must actually
  // differ from its replacement, otherwise rewriting is a no-op with risk.
  if (!/[\u4e00-\u9fa5]/.test(zh) || !en || zh === en) {
    dropped++;
    continue;
  }
  clean[zh] = NON_ENGLISH.get(zh) ?? en;
}

const sorted = Object.fromEntries(
  Object.entries(clean).sort((a, b) => b[0].length - a[0].length || a[0].localeCompare(b[0])),
);
writeFileSync(join(root, "src", "dictionary.json"), JSON.stringify(sorted, null, 2) + "\n");

const lengths = Object.keys(sorted).map((k) => k.length);
console.log(
  `dictionary: ${Object.keys(sorted).length} entries` +
    ` (dropped ${dropped}), key length ${Math.min(...lengths)}-${Math.max(...lengths)}`,
);
