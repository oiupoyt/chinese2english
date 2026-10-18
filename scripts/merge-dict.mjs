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

// Curated supplement, measured against the real served bundles. Merged after
// the harvested sources so it overrides anything they got wrong.
const extraPath = join(root, "src", "dictionary.extra.json");
if (existsSync(extraPath)) {
  const data = JSON.parse(readFileSync(extraPath, "utf8"));
  for (const [zh, en] of Object.entries(data)) pairs.set(zh, en);
}

// Machine translations of the literals harvested from installed bundles, filled
// by `npm run mt`. Lower confidence than the curated sources above, so it is
// merged after `dictionary.extra.json` and before the author-written pairs.
const mtPath = join(root, "src", "dictionary.mt.json");
if (existsSync(mtPath)) {
  const data = JSON.parse(readFileSync(mtPath, "utf8"));
  for (const [zh, en] of Object.entries(data)) pairs.set(zh, en);
}

// Machine translations of the literals that the harvested bundles still left in
// Chinese, measured by scripts/analyze over the served bundle set.
const residualPath = join(root, "src", "dictionary.residual.json");
if (existsSync(residualPath)) {
  const data = JSON.parse(readFileSync(residualPath, "utf8"));
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

// Some harvested keys are already bilingual, e.g. `中文说明 / English text`.
// Translating the whole key produces a translation of the Chinese half glued to
// the English half, so the human-written tail is used verbatim instead. The
// tail must be substantial, otherwise a slash is just punctuation inside a
// sentence.
function bilingualTail(zh) {
  const halves = zh.split(/\s+\/\s+/);
  if (halves.length < 2) return undefined;
  const head = halves.slice(0, -1).join(" / ");
  const tail = halves[halves.length - 1].trim();
  if ((head.match(/[\u4e00-\u9fa5]/g) ?? []).length < 6) return undefined;
  if (tail.length < 12 || !/^[\x20-\x7e]+$/.test(tail) || !/[A-Za-z]/.test(tail)) return undefined;
  if (/[\u4e00-\u9fa5]/.test(tail)) return undefined;
  return tail;
}

const clean = {};
let dropped = 0;
let rewroteBilingual = 0;
for (const [zh, en] of pairs) {
  // Guard the substitution contract: a key must be Chinese and must actually
  // differ from its replacement, otherwise rewriting is a no-op with risk.
  if (!/[\u4e00-\u9fa5]/.test(zh) || !en || zh === en) {
    dropped++;
    continue;
  }
  const tail = bilingualTail(zh);
  if (tail !== undefined && tail !== en) {
    rewroteBilingual++;
    clean[zh] = tail;
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
    ` (dropped ${dropped}, bilingual ${rewroteBilingual}), key length ${Math.min(...lengths)}-${Math.max(...lengths)}`,
);
