import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scanLiterals, isObjectKeyPosition, decodeRaw } from "../src/strings.ts";

/**
 * Fills the dictionary with machine translations of the Chinese literals that
 * are actually present in installed plugin bundles.
 *
 * The rewrite seam resolves a string by exact dictionary lookup first, so a
 * whole-sentence key is a whole-sentence translation: no segmentation, no word
 * concatenation, no risk of English word soup. That makes offline MT the right
 * tool for the long tail the six curated sources never covered.
 *
 * Runs at build time only. Nothing here executes in the browser or in the
 * plugin server, so the shipped bundle stays dependency-free and offline.
 *
 * Existing entries are kept and only unknown literals are sent, so rerunning
 * after new plugins are installed costs one request per new string.
 */

const ENDPOINT =
  "https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t";
const CJK = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;
const PLACEHOLDER = /\{[^{}]*\}|%[sdif]/g;
const MAX_KEY = 1200;
const BATCH = 20;
const CONCURRENCY = 3;
const ATTEMPTS = 3;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Composed profiles only carry the plugins the operator installed; the core
 * client bundles that make up the bulk of a served combo live in the dsh
 * install tree. Scanning just the profile tree left every literal in those
 * bundles untranslated, so both roots are walked by default. The env var
 * takes a list separated by `:` (or `,`) for other layouts.
 */
const pluginsRoots = (
  process.env.C2E_PLUGINS_ROOT ??
  "/home/oiupoyt/.dsh/profiles/web/node_modules:" +
    "/home/oiupoyt/.npm-global/lib/node_modules/@deepseek-ai/dsh/node_modules"
)
  .split(/[:,]/)
  .map((entry) => entry.trim())
  .filter(Boolean);

function readJson(file) {
  if (!fs.existsSync(file)) return {};
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(data) ? Object.fromEntries(data) : data;
}

function walk(dir, depth, out) {
  if (depth > 6) return;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules" && depth > 0) continue;
    if (entry.name === ".git") continue;
    const full = join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      walk(full, depth + 1, out);
      continue;
    }
    if (!entry.name.endsWith(".js")) continue;
    if (entry.name.includes(".map") || entry.name.includes(".bak")) continue;
    out.push(full);
  }
}

/** Every Chinese literal the rewriter would see, with its occurrence count. */
function harvest(known) {
  const files = [];
  for (const pluginsRoot of pluginsRoots) walk(pluginsRoot, 0, files);
  const counts = new Map();
  for (const file of files) {
    let src;
    try {
      src = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (!CJK.test(src)) continue;
    let spans;
    try {
      spans = scanLiterals(src);
    } catch {
      continue;
    }
    for (const span of spans) {
      if (span.quote === "`") continue;
      if (span.raw.includes("${")) continue;
      let value;
      try {
        value = decodeRaw(span.raw);
      } catch {
        continue;
      }
      if (!CJK.test(value)) continue;
      try {
        if (isObjectKeyPosition(src, span)) continue;
      } catch {
        continue;
      }
      if (known[value] !== undefined) continue;
      if (bilingualTail(value) !== undefined) continue;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([zh, n]) => ({ zh, n }));
}

function placeholders(value) {
  return value.match(PLACEHOLDER) ?? [];
}

// Keys that already carry their own English after a slash, e.g.
// `中文说明 / English text`. Translating one produces a translation of the
// Chinese half glued to the English half, so the tail is the correct answer and
// the key is skipped here (merge-dict resolves it from the tail).
function bilingualTail(value) {
  const halves = value.split(/\s+\/\s+/);
  if (halves.length < 2) return undefined;
  const head = halves.slice(0, -1).join(" / ");
  const tail = halves[halves.length - 1].trim();
  if ((head.match(CJK) ?? []).length < 6) return undefined;
  if (tail.length < 12 || !/^[\x20-\x7e]+$/.test(tail) || !/[A-Za-z]/.test(tail)) return undefined;
  if (CJK.test(tail)) return undefined;
  return tail;
}

function acceptable(zh, en) {
  if (!en || !CJK.test(zh)) return false;
  if (en.trim() === zh.trim()) return false;
  // A translation with no Latin letters is a transliteration or a rejection
  // notice, not UI copy.
  if (!/[A-Za-z]/.test(en)) return false;
  // Shell and ICU placeholders are load-bearing: a display string whose `{tool}`
  // was dropped would render a sentence with a hole in it.
  for (const token of placeholders(zh)) {
    if (!en.includes(token)) return false;
  }
  return true;
}

async function request(lines) {
  const body = new URLSearchParams({ q: lines.join("\n") }).toString();
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      "user-agent": "Mozilla/5.0",
    },
    body,
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`upstream ${response.status}`);
  const payload = await response.json();
  if (!Array.isArray(payload?.[0])) throw new Error("unexpected payload");
  return payload[0].map((chunk) => chunk[0]).join("").split("\n");
}

/**
 * Translates a batch, halving on line-count mismatch until each line stands
 * alone. Google occasionally merges two lines into one chunk; a merged reply
 * would silently pair every following translation with the wrong source string,
 * so a mismatch is retried rather than trusted.
 */
async function translateBatch(lines, into) {
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    let out;
    try {
      out = await request(lines);
    } catch (error) {
      if (attempt === ATTEMPTS - 1) {
        if (lines.length === 1) {
          console.warn(`  drop (request failed): ${JSON.stringify(lines[0].slice(0, 60))}`);
          return;
        }
        break;
      }
      await sleep(1000 * (attempt + 1));
      continue;
    }
    if (out.length === lines.length) {
      lines.forEach((zh, index) => into.set(zh, out[index]));
      return;
    }
    if (lines.length === 1) {
      console.warn(`  drop (line count): ${JSON.stringify(lines[0].slice(0, 60))}`);
      return;
    }
    break;
  }
  const middle = Math.ceil(lines.length / 2);
  await translateBatch(lines.slice(0, middle), into);
  await translateBatch(lines.slice(middle), into);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mtPath = join(root, "src", "dictionary.mt.json");
const known = { ...readJson(join(root, "src", "dictionary.json")), ...readJson(mtPath) };
const previous = readJson(mtPath);

const missing = harvest(known);
const pending = missing.filter(({ zh }) => zh.length <= MAX_KEY && !zh.includes("\n"));
// Newlines divide a batch, so any key carrying one is translated on its own.
const singles = missing.filter(({ zh }) => zh.length <= MAX_KEY && zh.includes("\n"));
console.log(
  `mt-fill: ${pending.length} batched, ${singles.length} single, ` +
    `${Object.keys(previous).length} already translated`,
);

const raw = new Map();
const batches = [];
for (let i = 0; i < pending.length; i += BATCH) {
  batches.push(pending.slice(i, i + BATCH).map(({ zh }) => zh));
}

let done = 0;
let cursor = 0;
async function worker() {
  while (cursor < batches.length) {
    const batch = batches[cursor++];
    await translateBatch(batch, raw);
    done++;
    if (done % 20 === 0) console.log(`  ${done}/${batches.length} batches`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

for (const { zh } of singles) {
  await translateBatch([zh], raw);
}

const next = { ...previous };
let added = 0;
let rejected = 0;
for (const [zh, out] of raw) {
  if (out === undefined) continue;
  const lead = zh.match(/^\s*/)[0];
  const trail = zh.match(/\s*$/)[0];
  const en = lead + out.trim() + trail;
  if (!acceptable(zh, en)) {
    rejected++;
    continue;
  }
  if (next[zh] === en) continue;
  next[zh] = en;
  added++;
}

const sorted = Object.fromEntries(
  Object.entries(next).sort((a, b) => b[0].length - a[0].length || a[0].localeCompare(b[0])),
);
fs.writeFileSync(mtPath, JSON.stringify(sorted, null, 2) + "\n");
console.log(
  `mt-fill: wrote ${Object.keys(sorted).length} entries ` +
    `(+${added} new, ${rejected} rejected of ${raw.size} returned)`,
);
