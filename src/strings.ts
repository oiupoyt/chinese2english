// String-literal scanner: finds JavaScript string/template literals without a
// parser, skipping comments and regex literals so their contents stay intact.

const REGEX_PREFIX = new Set([
  "", "(", ",", "=", ":", "[", "!", "&", "|", "?", "{", "}", ";", "+", "-", "*", "%", "~", "^", "<", ">", "\n",
]);

export interface LiteralSpan {
  start: number;
  end: number;
  quote: string;
  raw: string;
}

/**
 * Finds the index just past the string literal starting at `start`.
 *
 * `depth` tracks unclosed `${` inside a template literal. While inside an
 * interpolation the content is code again, so nested strings and nested
 * template literals have to be skipped whole: otherwise
 * `` `a ${c ? `b` : ""}` `` ends at the inner backtick and the outer literal is
 * handed to the rewriter as a truncated fragment.
 *
 * Returns the length of `src` when the literal is unterminated.
 */
function scanLiteralEnd(src: string, start: number): number {
  const quote = src[start];
  const n = src.length;
  let depth = 0;
  let j = start + 1;

  while (j < n) {
    const d = src[j];
    if (d === "\\") {
      j += 2;
      continue;
    }
    if (quote === "`") {
      if (d === "{" && src[j - 1] === "$") {
        depth++;
        j++;
        continue;
      }
      if (depth > 0) {
        if (d === "}") {
          depth--;
          j++;
          continue;
        }
        if (d === '"' || d === "'" || d === "`") {
          j = scanLiteralEnd(src, j);
          continue;
        }
      } else if (d === "`") {
        return j + 1;
      }
      j++;
      continue;
    }
    if (d === quote) return j + 1;
    j++;
  }
  return n;
}

export function scanLiterals(src: string): LiteralSpan[] {
  const out: LiteralSpan[] = [];
  const n = src.length;
  let i = 0;
  let lastSig = "";
  while (i < n) {
    const c = src[i];
    if (c === "/" && src[i + 1] === "/") {
      const e = src.indexOf("\n", i);
      i = e < 0 ? n : e + 1;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      const e = src.indexOf("*/", i + 2);
      i = e < 0 ? n : e + 2;
      continue;
    }
    if (c === "/" && REGEX_PREFIX.has(lastSig)) {
      let j = i + 1;
      let inClass = false;
      let ok = false;
      while (j < n) {
        const d = src[j];
        if (d === "\\") {
          j += 2;
          continue;
        }
        if (d === "\n") break;
        if (d === "[") inClass = true;
        else if (d === "]") inClass = false;
        else if (d === "/" && !inClass) {
          ok = true;
          break;
        }
        j++;
      }
      if (ok) {
        i = j + 1;
        lastSig = "/";
        continue;
      }
    }
    if (c === '"' || c === "'" || c === "`") {
      const end = scanLiteralEnd(src, i);
      if (end <= n && src[end - 1] === c) {
        out.push({ start: i, end, quote: c, raw: src.slice(i + 1, end - 1) });
        i = end;
        lastSig = c;
        continue;
      }
      i = n;
      continue;
    }
    if (!/\s/.test(c)) lastSig = c;
    i++;
  }
  return out;
}

export function decodeRaw(raw: string): string {
  if (!raw.includes("\\")) return raw;
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c !== "\\") {
      out += c;
      continue;
    }
    const d = raw[++i];
    switch (d) {
      case "n": out += "\n"; break;
      case "r": out += "\r"; break;
      case "t": out += "\t"; break;
      case "b": out += "\b"; break;
      case "f": out += "\f"; break;
      case "v": out += "\v"; break;
      case "0": out += "\0"; break;
      case "x": out += String.fromCharCode(parseInt(raw.slice(i + 1, i + 3), 16)); i += 2; break;
      case "u":
        if (raw[i + 1] === "{") {
          const close = raw.indexOf("}", i + 2);
          if (close < 0) { out += "u"; break; }
          out += String.fromCodePoint(parseInt(raw.slice(i + 2, close), 16));
          i = close;
        } else {
          out += String.fromCharCode(parseInt(raw.slice(i + 1, i + 5), 16));
          i += 4;
        }
        break;
      case "\n": break;
      case "\r": if (raw[i + 1] === "\n") i++; break;
      default: out += d;
    }
  }
  return out;
}

export function encodeValue(value: string, quote: string): string {
  let out = "";
  for (const ch of value) {
    if (ch === "\\") out += "\\\\";
    else if (ch === quote) out += "\\" + quote;
    else if (ch === "\n") out += "\\n";
    else if (ch === "\r") out += "\\r";
    else if (ch === "\u2028") out += "\\u2028";
    else if (ch === "\u2029") out += "\\u2029";
    else out += ch;
  }
  if (quote === "`") out = out.replace(/\$\{/g, "\\${");
  return out;
}

// The character before this literal, ignoring whitespace/comments-free trivia.
// Used to spot a genuine object key (`{ "中文": …`) and leave it alone.
export function precedingSignificant(src: string, index: number): string {
  let i = index - 1;
  while (i >= 0 && /\s/.test(src[i])) i--;
  return i < 0 ? "" : src[i];
}

export function isObjectKeyPosition(src: string, span: LiteralSpan): boolean {
  const prev = precedingSignificant(src, span.start);
  if (prev !== "{" && prev !== ",") return false;
  let j = span.end;
  while (j < src.length && /\s/.test(src[j])) j++;
  return src[j] === ":";
}
