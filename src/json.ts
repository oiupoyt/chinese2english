import { hasChinese, substitute } from "./rewrite.js";

/**
 * RPC endpoints whose payload is server-authored UI copy: plugin descriptors,
 * model and provider names, and settings schema descriptions.
 *
 * This is an allowlist on purpose. Other endpoints carry user content —
 * `/api/session/list` returns the operator's own prompts and transcripts — and
 * rewriting those would corrupt displayed history.
 */
const TRANSLATED_ENDPOINTS = new Set([
  "pluginManager/listBundles",
  "pluginManager/listPlugins",
  "pluginInventory/list",
  "session/modelCatalog",
  "llm/listProviders",
  "settings/describe",
]);

const LOCALE_KEY = /^(zh|zh-cn|zh_cn|zh-hans|zh-hant)$/i;
const ENGLISH_KEY = /^en(-|$)/i;

/**
 * Keys whose string values are display copy. Dictionary rewriting is confined
 * to these: an enum member or an id that happens to contain Chinese must never
 * be rewritten, because those values are compared, not shown.
 */
const DISPLAY_KEYS = new Set([
  "name",
  "description",
  "title",
  "label",
  "summary",
  "subtitle",
  "tooltip",
  "hint",
  "caption",
]);

/**
 * Bilingual descriptors are published as one string with both languages joined
 * by ` · ` — `"… community plugins. · DSH 可视化插件市场：逛一逛，点一下，装好。"`.
 * Dropping the Chinese half keeps the author's own English, which is better
 * than any dictionary pass and works for every such descriptor at once.
 */
const BILINGUAL_SEPARATOR = " · ";

function preferEnglishHalf(value: string): string | undefined {
  if (!value.includes(BILINGUAL_SEPARATOR)) return undefined;
  const halves = value.split(BILINGUAL_SEPARATOR);
  if (halves.length !== 2) return undefined;
  const [left, right] = halves;
  const leftChinese = hasChinese(left);
  const rightChinese = hasChinese(right);
  if (leftChinese === rightChinese) return undefined;
  return (rightChinese ? left : right).trim() || undefined;
}

export function translatesEndpoint(endpoint: string): boolean {
  return TRANSLATED_ENDPOINTS.has(endpoint);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Rewrites server-authored UI copy inside an RPC result.
 *
 * A locale map (`{ zh, en }`) is resolved rather than translated: the author's
 * own English beats a dictionary pass, so the Chinese side is overwritten with
 * the English sibling. Consumers that read `.zh` directly — which is why this
 * text stayed Chinese with the active locale already `en` — then render
 * English, while consumers that resolve through the locale chain are unaffected
 * because they already picked `.en`.
 *
 * Chinese with no English sibling falls back to the dictionary, which leaves it
 * untouched unless every character is covered.
 */
export function translateJson<T>(value: T): T {
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item) => {
      const translated = translateJson(item);
      if (translated !== item) changed = true;
      return translated;
    });
    return (changed ? next : value) as unknown as T;
  }

  if (!isPlainObject(value)) return value;

  let out: Record<string, unknown> | undefined;
  const edit = () => (out ??= { ...value });

  const keys = Object.keys(value);
  const englishKey = keys.find((key) => ENGLISH_KEY.test(key));
  const english = englishKey === undefined ? undefined : value[englishKey];
  const hasEnglish = typeof english === "string" && english.length > 0;
  // A locale map is any object offering a language-tagged key. Every string
  // inside one is display copy, whatever the sibling key happens to be named.
  const isLocaleMap = keys.some((key) => LOCALE_KEY.test(key) || ENGLISH_KEY.test(key));

  for (const key of keys) {
    const current = value[key];

    if (typeof current === "string" && hasChinese(current)) {
      if (LOCALE_KEY.test(key)) {
        // An English sibling wins, but only when it is itself free of Chinese.
        // Some plugins publish the same bilingual string under both keys, and
        // copying that across would leave the Chinese in place.
        if (hasEnglish && !hasChinese(english)) {
          edit()[key] = english;
          continue;
        }
        edit()[key] = preferEnglishHalf(current) ?? substitute(current);
        continue;
      }
      if (DISPLAY_KEYS.has(key) || isLocaleMap) {
        // `en` is not a locale key here, yet its value may still be bilingual:
        // plugins occasionally swap their own keys, leaving Chinese under `en`.
        edit()[key] = preferEnglishHalf(current) ?? substitute(current);
        continue;
      }
    }

    const translated = translateJson(current);
    if (translated !== current) edit()[key] = translated;
  }

  return (out ?? value) as unknown as T;
}
