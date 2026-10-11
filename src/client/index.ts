import { DICTIONARY, SORTED_PAIRS, DYNAMIC_PATTERNS } from "./dictionary.js";

export const name = "dsh-plugin-english-client";
export const inject = ["locale"];

const CHINESE_REGEX = /[\u4e00-\u9fa5]/;

/**
 * Translates a text string safely without corrupting sentences:
 * 1. Checks exact match on the entire string first.
 * 2. Matches full dynamic count/date patterns.
 * 3. Matches multi-word phrases from longest to shortest (never single characters).
 */
export function translateText(text: string): string {
  if (!text || !CHINESE_REGEX.test(text)) return text;

  const trimmed = text.trim();
  // 1. Direct exact dictionary match (highest fidelity)
  if (DICTIONARY[trimmed]) {
    return text.replace(trimmed, DICTIONARY[trimmed]);
  }

  // 2. Dynamic patterns (e.g. "3 个已启用" -> "3 enabled")
  for (const [pattern, replacement] of DYNAMIC_PATTERNS) {
    if (pattern.test(trimmed)) {
      return text.replace(trimmed, trimmed.replace(pattern, replacement));
    }
  }

  // 3. Multi-word phrase matches (2+ characters only, longest first)
  let result = text;
  let changed = false;
  for (const [cn, en] of SORTED_PAIRS) {
    if (cn.length >= 2 && result.includes(cn)) {
      result = result.replaceAll(cn, en);
      changed = true;
      if (!CHINESE_REGEX.test(result)) break;
    }
  }

  return changed ? result : text;
}

let isTranslating = false;

/**
 * Traverses elements using TreeWalker and translates whole text nodes.
 */
export function translateElement(root: Node) {
  if (!root) return;

  if (root.nodeType === Node.TEXT_NODE) {
    const val = root.nodeValue;
    if (val && CHINESE_REGEX.test(val)) {
      const t = translateText(val);
      if (t !== val) root.nodeValue = t;
    }
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as HTMLElement;

  const tag = el.tagName;
  // Ignore code, pre, scripts, styles
  if (tag === "SCRIPT" || tag === "STYLE" || tag === "PRE" || tag === "CODE") return;

  // Attributes (placeholder, title, aria-label)
  for (const attr of ["placeholder", "title", "aria-label", "alt"]) {
    const val = el.getAttribute(attr);
    if (val && CHINESE_REGEX.test(val)) {
      el.setAttribute(attr, translateText(val));
    }
  }

  // Fast native TreeWalker
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  let textNode = walker.nextNode();
  while (textNode) {
    const val = textNode.nodeValue;
    if (val && CHINESE_REGEX.test(val)) {
      const parent = textNode.parentElement;
      if (parent) {
        const pTag = parent.tagName;
        if (pTag !== "SCRIPT" && pTag !== "STYLE" && pTag !== "PRE" && pTag !== "CODE") {
          const t = translateText(val);
          if (t !== val) textNode.nodeValue = t;
        }
      }
    }
    textNode = walker.nextNode();
  }
}

function startDOMTranslator() {
  if (typeof document === "undefined") return;

  // Force document language to English immediately
  document.documentElement.lang = "en";

  const queue = new Set<Node>();
  let frameRequested = false;

  const flush = () => {
    frameRequested = false;
    isTranslating = true;
    try {
      const nodes = Array.from(queue);
      queue.clear();
      for (const n of nodes) {
        if (n.isConnected) translateElement(n);
      }
    } finally {
      isTranslating = false;
    }
  };

  const observer = new MutationObserver((mutations) => {
    if (isTranslating) return;

    for (const m of mutations) {
      if (m.type === "childList") {
        for (let i = 0; i < m.addedNodes.length; i++) {
          queue.add(m.addedNodes[i]);
        }
      } else if (m.type === "characterData") {
        if (m.target.nodeValue && CHINESE_REGEX.test(m.target.nodeValue)) {
          queue.add(m.target);
        }
      } else if (m.type === "attributes") {
        queue.add(m.target);
      }
    }
    if (!frameRequested && queue.size > 0) {
      frameRequested = true;
      requestAnimationFrame(flush);
    }
  });

  const root = document.documentElement || document.body;
  if (root) {
    translateElement(root);
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt"],
    });
  }

  // Periodic safety check every 1s to sweep any lazily mounted modal content
  setInterval(() => {
    if (document.body && !isTranslating) {
      isTranslating = true;
      try {
        translateElement(document.body);
      } finally {
        isTranslating = false;
      }
    }
  }, 1000);
}

// Force English locale in localStorage across known plugin keys
function enforceEnglishStorage() {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes("lang") || key.includes("locale") || key.includes("all-usage") || key.includes("dsh"))) {
        const val = localStorage.getItem(key);
        if (val === "zh" || val === "zh-CN") {
          localStorage.setItem(key, "en");
        }
      }
    }
  } catch {}
}

export function apply(ctx: any) {
  console.log("[dsh-plugin-english] Activating English locale & translation engine...");

  enforceEnglishStorage();

  // 1. Force DSH core locale service to English
  if (ctx.locale) {
    try {
      // Force active locale to "en"
      if (typeof ctx.locale.setLocale === "function") {
        ctx.locale.setLocale("en");
      }
      if (typeof ctx.locale.resolveActive === "function") {
        ctx.locale.resolveActive = () => "en";
      }

      // Intercept snapshot
      if (typeof ctx.locale.getSnapshot === "function") {
        const origSnap = ctx.locale.getSnapshot.bind(ctx.locale);
        ctx.locale.getSnapshot = () => {
          const s = origSnap();
          return s ? { ...s, active: "en" } : s;
        };
      }

      // Publish active: "en" to trigger all native bilingual plugin updates
      if (typeof ctx.locale.publish === "function") {
        ctx.locale.publish("en", true);
      }

      // Intercept translate function
      if (typeof ctx.locale.translate === "function") {
        const origTranslate = ctx.locale.translate.bind(ctx.locale);
        ctx.locale.translate = function (ns: string, key: string, params: any) {
          const val = origTranslate(ns, key, params);
          if (typeof val === "string" && CHINESE_REGEX.test(val)) {
            return translateText(val);
          }
          return val;
        };
      }

      // Auto-patch all plugin registered dictionaries with English translations
      if (ctx.locale.dicts && typeof ctx.locale.dicts.entries === "function") {
        for (const [ns, localesMap] of ctx.locale.dicts.entries()) {
          const zh = localesMap?.get("zh");
          let en = localesMap?.get("en");
          if (!en) {
            en = {};
            localesMap?.set("en", en);
          }
          if (zh) {
            for (const [k, v] of Object.entries(zh)) {
              if ((!en[k] || en[k] === k || CHINESE_REGEX.test(en[k])) && typeof v === "string") {
                en[k] = translateText(v) || v;
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("[dsh-plugin-english] Locale patch error:", err);
    }
  }

  // 2. Keep document.documentElement.lang set to "en"
  if (typeof document !== "undefined") {
    document.documentElement.lang = "en";
    const observer = new MutationObserver(() => {
      if (document.documentElement.lang !== "en") {
        document.documentElement.lang = "en";
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  // 3. Start DOM translation engine
  startDOMTranslator();
}

// Start immediately on script load as well
if (typeof window !== "undefined") {
  enforceEnglishStorage();
  startDOMTranslator();
}
