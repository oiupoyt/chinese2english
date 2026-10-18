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
 *
 * Measured against the installed plugin bundles: of 9,493 display literals this
 * covers 99.6% completely, leaving 2.4% of Chinese characters. Emitting covered
 * runs individually instead drops that to 87.6% complete with 10.5% residual,
 * because an uncovered word in the middle of a sentence strands English next to
 * Chinese; the whole-string rule also degenerates safely to "leave it alone".
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

/** A literal split into code interpolations and the static text between them. */
interface Segment {
  expr: boolean;
  text: string;
}

/**
 * Splits a literal's decoded value into `${...}` interpolations and the static
 * text around them. Brace depth and embedded strings are tracked so an
 * expression like `${fn({ a: "}" })}` is not cut short at the first `}`.
 */
export function splitInterpolations(value: string): Segment[] {
  const segments: Segment[] = [];
  let chunk = "";
  let i = 0;

  while (i < value.length) {
    if (value[i] === "$" && value[i + 1] === "{") {
      let depth = 1;
      let j = i + 2;
      while (j < value.length && depth > 0) {
        const c = value[j];
        if (c === '"' || c === "'" || c === "`") {
          j++;
          while (j < value.length && value[j] !== c) {
            if (value[j] === "\\") j++;
            j++;
          }
        } else if (c === "{") depth++;
        else if (c === "}") depth--;
        if (depth === 0) break;
        j++;
      }
      if (depth !== 0) {
        // Unbalanced: treat the rest as static text rather than guessing.
        chunk += value.slice(i);
        break;
      }
      if (chunk) segments.push({ expr: false, text: chunk });
      segments.push({ expr: true, text: value.slice(i, j + 1) });
      chunk = "";
      i = j + 1;
      continue;
    }
    chunk += value[i];
    i++;
  }

  if (chunk) segments.push({ expr: false, text: chunk });
  return segments;
}

/**
 * Translates a template literal that may contain `${...}` interpolations.
 *
 * Only an exact dictionary hit is accepted. A template is a whole sentence with
 * a value spliced into it, so segmenting it would rebuild the sentence out of
 * word fragments: `已退出 ${n} 个网页端会话` comes back as
 * `Exited ${n} itemsWeb pageSessions`, which is what the strict whole-string
 * rule exists to prevent. Harvesting already records these templates verbatim,
 * interpolation included, so an exact lookup is enough, and a miss simply
 * leaves the template in Chinese.
 *
 * The interpolated code is opaque: `${...}` runs are copied through untouched,
 * which is why they never block coverage on their own.
 */
export function substituteInterpolated(value: string): string {
  if (!CHINESE.test(value)) return value;
  const segments = splitInterpolations(value);
  // A backtick literal without `${...}` is ordinary text and can be segmented.
  if (segments.every(s => !s.expr)) return substitute(value);

  const hit = DICTIONARY[value];
  if (hit === undefined) return value;
  // The stored translation must not invent or drop interpolations.
  const before = segments.filter(s => s.expr).length;
  const after = splitInterpolations(hit).filter(s => s.expr).length;
  if (before !== after) return value;
  return hit;
}

/**
 * Encodes a rewritten literal back into source form.
 *
 * For a template literal the `${...}` runs are live code, so they are copied
 * verbatim and only the static text is escaped. For quoted literals `${` is
 * ordinary text, so the whole value is escaped.
 */
export function encodeInterpolated(value: string, quote: string): string {
  if (quote !== "`") return encodeValue(value, quote);
  return splitInterpolations(value)
    .map(segment => (segment.expr ? segment.text : encodeValue(segment.text, quote)))
    .join("");
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
    if (isObjectKeyPosition(source, span)) continue;

    const value = decodeRaw(span.raw);
    if (!hasChinese(value)) continue;

    // `${...}` is only an interpolation inside a template literal.
    const next = span.quote === "`" ? substituteInterpolated(value) : substitute(value);
    if (next === value) continue;

    out += source.slice(cursor, span.start) + span.quote + encodeInterpolated(next, span.quote) + span.quote;
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
