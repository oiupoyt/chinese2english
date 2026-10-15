import DICTIONARY from "./dictionary.json";
import { decodeRaw, encodeValue, isObjectKeyPosition, scanLiterals } from "./strings.js";

const CHINESE = /[\u4e00-\u9fa5]/;

// Longest key first so the segmentation below prefers `缓存命中率` over `缓存命中`.
const KEYS = Object.keys(DICTIONARY).sort((a, b) => b.length - a.length);

// Keys grouped by their first character: the cover search only ever needs to
// try keys that can actually start at the current offset.
const BY_FIRST = new Map<string, string[]>();
for (const key of KEYS) {
  const first = key[0];
  const bucket = BY_FIRST.get(first);
  if (bucket) bucket.push(key);
  else BY_FIRST.set(first, [key]);
}

/**
 * Translates a Chinese string only when the whole string is accounted for.
 *
 * Chinese has no word boundaries, so replacing known keys wherever they occur
 * rewrites fragments of larger words: `当前工作区` would become
 * `Saat IniWorkspace`. Instead the string is segmented left to right, and a
 * translation is emitted only when every Chinese character is covered by a
 * dictionary key. Anything else is left in Chinese, because half-translated
 * text is worse than untranslated text.
 */
export function substitute(value: string): string {
  if (!CHINESE.test(value)) return value;
  if (DICTIONARY[value] !== undefined) return DICTIONARY[value];

  const pieces: string[] = [];
  let i = 0;

  while (i < value.length) {
    const char = value[i];
    if (!CHINESE.test(char)) {
      // Non-Chinese glue (spaces, ASCII, punctuation, placeholders) is copied
      // through; it never blocks coverage on its own.
      let j = i;
      while (j < value.length && !CHINESE.test(value[j])) j++;
      pieces.push(value.slice(i, j));
      i = j;
      continue;
    }

    const candidates = BY_FIRST.get(char);
    let match: string | undefined;
    if (candidates) {
      for (const key of candidates) {
        if (value.startsWith(key, i)) {
          match = key;
          break;
        }
      }
    }
    if (match === undefined) return value;
    pieces.push(DICTIONARY[match]);
    i += match.length;
  }

  return pieces.join("");
}

export function hasChinese(text: string): boolean {
  return CHINESE.test(text);
}

/**
 * Rewrites Chinese UI text inside JavaScript string literals.
 *
 * Returns the original string unchanged when nothing was translated, so the
 * caller can skip rebuilding the response. Object keys are deliberately left
 * alone: translating `{ "中文": 1 }` would break the lookup that reads it.
 */
export function rewriteScript(source: string): string {
  if (!hasChinese(source)) return source;

  const spans = scanLiterals(source);
  let out = "";
  let cursor = 0;
  let changed = false;

  for (const span of spans) {
    if (span.quote === "`") continue;
    if (span.raw.includes("${")) continue;
    if (isObjectKeyPosition(source, span)) continue;

    const value = decodeRaw(span.raw);
    if (!hasChinese(value)) continue;

    const next = substitute(value);
    if (next === value) continue;

    out += source.slice(cursor, span.start) + span.quote + encodeValue(next, span.quote) + span.quote;
    cursor = span.end;
    changed = true;
  }

  return changed ? out + source.slice(cursor) : source;
}

/** Compiles the candidate so a bad rewrite can never reach the browser. */
export function compiles(source: string): boolean {
  try {
    new Function(source);
    return true;
  } catch {
    return false;
  }
}

export function translateScript(source: string): string {
  const next = rewriteScript(source);
  if (next === source) return source;
  return compiles(next) ? next : source;
}
