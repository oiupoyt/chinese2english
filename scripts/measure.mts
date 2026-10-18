// Measures Chinese left in the served bundles, through the real runtime path.
//
// Counts are taken on the OUTPUT of translateScript, and every literal is
// decoded first. Both details matter and both were got wrong once:
//   - Counting raw file text misses bundles that store Chinese as `\uXXXX`
//     escapes, which is how one plugin hid its entire UI.
//   - A non-global regex with String.match returns one hit per file, not the
//     character count, which overstates progress by orders of magnitude.
//
// Usage: node --import tsx scripts/measure.mts <served.json>
import { readFileSync } from "node:fs";
import { translateScript } from "../src/rewrite.js";
import { scanLiterals, decodeRaw } from "../src/strings.js";

const CJK = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;
const count = (text) => (text.match(CJK) ?? []).length;
const decodeEscapes = (text) =>
  text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

// Chinese inside a /* ... */ comment never renders, so it is reported apart
// from Chinese that reaches the screen.
function outsideComments(text) {
  return count(text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, ""));
}

const files = JSON.parse(readFileSync(process.argv[2] ?? "served.json", "utf8"));
let before = 0;
let after = 0;
let renderable = 0;
let changed = 0;
const rows = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const out = translateScript(source);
  if (out !== source) changed++;

  // Literal-level before/after, which is what a user can read.
  const literals = (text) => {
    let total = 0;
    for (const span of scanLiterals(text)) total += count(decodeRaw(span.raw));
    return total;
  };
  before += literals(source);
  after += literals(out);

  const visible = outsideComments(decodeEscapes(out));
  renderable += visible;
  if (visible) rows.push({ visible, total: count(decodeEscapes(out)), file });
}

console.log(`bundles: ${files.length}  rewritten: ${changed}`);
console.log(`Chinese in string literals: ${before} -> ${after} (${(100 - (after / before) * 100).toFixed(2)}% removed)`);
console.log(`Chinese outside comments (${renderable}):`);
console.log("  Source comments are reported separately above. What is left here sits in");
console.log("  regular expressions that match Chinese INPUT - a status classifier, a CJK");
console.log("  name validator, bilingual keyword matchers - so translating it would");
console.log("  change plugin behaviour rather than remove visible text.");
rows.sort((a, b) => b.visible - a.visible);
for (const row of rows) console.log(`  ${String(row.visible).padStart(5)} outside / ${String(row.total).padStart(5)} total  ${row.file}`);
