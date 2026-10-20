// Builds src/dictionary.comments.json from the translated comments.
//
// The committed dictionary is the source of truth: it is loaded first, then any
// newer translation passes overlay it. Earlier this read only the scratch files
// in ~/.cache, so once those were cleared a rebuild silently produced a smaller
// dictionary and translated comments reverted to Chinese.
//
// Overlays, when present:
//   ~/.cache/c2e/cmt-authored.json  {wholeComment: translatedComment}
//   ~/.cache/c2e/css-authored.json  {body: translatedBody}  (delimiters added)
//   ~/.cache/c2e/c2-authored.json   {wholeComment: translatedComment}
//
// Output: src/dictionary.comments.json  {wholeComment: translatedComment}
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const C2E = "/home/oiupoyt/.cache/c2e";
const OUT = "/home/oiupoyt/my stuff yea/projects/chinese2english/src/dictionary.comments.json";

const HAN = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
const BOX = /[\u2500-\u257f\u2580-\u259f]/g;
const boxOf = (t) => (t.match(BOX) ?? []).sort().join("");
const newlines = (t) => (t.match(/\n/g) ?? []).length;

function load(name, fallback) {
  const path = `${C2E}/${name}`;
  if (!existsSync(path)) return fallback ?? {};
  return JSON.parse(readFileSync(path, "utf8"));
}

const pairs = new Map();

// Existing committed translations survive a rebuild.
if (existsSync(OUT)) {
  for (const [zh, en] of Object.entries(JSON.parse(readFileSync(OUT, "utf8")))) pairs.set(zh, en);
}

for (const [zh, en] of Object.entries(load("cmt-authored.json"))) pairs.set(zh, en);
for (const [zh, en] of Object.entries(load("c2-authored.json"))) pairs.set(zh, en);
for (const [zh, en] of Object.entries(load("css-authored.json"))) {
  // A stylesheet body is stored without delimiters; the emitted key carries them.
  if (zh.includes("/*")) pairs.set(zh, en);
  else pairs.set(`/*${zh}*/`, `/*${en}*/`);
}

const clean = {};
const reasons = { cjk: 0, latin: 0, identity: 0, box: 0, lines: 0, syntax: 0 };

for (const [zh, en] of pairs) {
  if (typeof en !== "string" || !en.trim()) continue;
  if (HAN.test(en)) { reasons.cjk++; continue; }
  if (!/[A-Za-z]/.test(en)) { reasons.latin++; continue; }
  if (en === zh) { reasons.identity++; continue; }
  // Replacing a comment must keep it a well-formed comment, or the emitted
  // bundle stops parsing.
  if (zh.includes("/*") !== en.includes("/*")) { reasons.syntax++; continue; }
  if (zh.includes("*/") !== en.includes("*/")) { reasons.syntax++; continue; }
  if (zh.startsWith("//") !== en.startsWith("//")) { reasons.syntax++; continue; }
  // Box-drawing runs are the structure of block comments, where they align the
  // `*` column. In a single-line `//` banner the run is pure decoration and its
  // length shifts freely with the translated text.
  const isLineComment = zh.startsWith("//");
  if (!isLineComment && boxOf(zh) !== boxOf(en)) { reasons.box++; continue; }
  if (newlines(zh) !== newlines(en)) { reasons.lines++; continue; }
  clean[zh] = en;
}

const sorted = Object.fromEntries(
  Object.entries(clean).sort((a, b) => b[0].length - a[0].length || a[0].localeCompare(b[0])),
);
writeFileSync(OUT, JSON.stringify(sorted, null, 1) + "\n");
const dropped = Object.values(reasons).reduce((a, b) => a + b, 0);
console.log(
  `comments: ${Object.keys(sorted).length} entries (dropped ${dropped}` +
    Object.entries(reasons).filter(([, v]) => v).map(([k, v]) => `, ${k} ${v}`).join("") +
    ")",
);
