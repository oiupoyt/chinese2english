import { DICTIONARY, PHRASE_PATTERNS } from "./dictionary.js";

export const name = "dsh-plugin-english-client";
export const inject = ["locale", "slots"];

const CHINESE_REGEX = /[\u4e00-\u9fa5]/;

/**
 * Translates a single text string using dictionary and pattern matching.
 */
function translateText(text: string): string {
  if (!text || !CHINESE_REGEX.test(text)) return text;

  const trimmed = text.trim();
  if (DICTIONARY[trimmed]) {
    return text.replace(trimmed, DICTIONARY[trimmed]);
  }

  let result = text;
  // Apply regex patterns
  for (const [pattern, replacement] of PHRASE_PATTERNS) {
    result = result.replace(pattern, replacement);
  }

  // Exact phrase search for substrings
  for (const [cn, en] of Object.entries(DICTIONARY)) {
    if (result.includes(cn)) {
      result = result.replaceAll(cn, en);
    }
  }

  return result;
}

/**
 * Recursively translates text nodes inside a DOM element.
 */
function translateNode(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const val = node.nodeValue;
    if (val && CHINESE_REGEX.test(val)) {
      const translated = translateText(val);
      if (translated !== val) {
        node.nodeValue = translated;
      }
    }
    return;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const tagName = el.tagName;
    // Don't translate code blocks or scripts
    if (tagName === "SCRIPT" || tagName === "STYLE" || tagName === "PRE" || tagName === "CODE") {
      return;
    }

    // Translate common attributes
    for (const attr of ["title", "placeholder", "aria-label", "alt"]) {
      const val = el.getAttribute(attr);
      if (val && CHINESE_REGEX.test(val)) {
        el.setAttribute(attr, translateText(val));
      }
    }

    // Translate child nodes
    let child = el.firstChild;
    while (child) {
      translateNode(child);
      child = child.nextSibling;
    }
  }
}

export function apply(ctx: any) {
  // 1. Hook DSH ctx.locale to inject English fallback into any registered namespace
  if (ctx.locale && typeof ctx.locale.register === "function") {
    ctx.effect(() => {
      // Whenever locale state changes or plugins register dictionaries,
      // hook locale to return English translations for known Chinese keys
      if (typeof ctx.locale.subscribe === "function") {
        ctx.locale.subscribe(() => {
          if (typeof document !== "undefined") {
            translateNode(document.body);
          }
        });
      }
    }, "dsh-plugin-english: locale observer");
  }

  // 2. High-performance DOM MutationObserver for real-time translation
  if (typeof document !== "undefined") {
    let pending = false;
    const queue = new Set<Node>();

    const flushTranslations = () => {
      pending = false;
      const nodes = Array.from(queue);
      queue.clear();
      for (const n of nodes) {
        if (n.isConnected) {
          translateNode(n);
        }
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          for (let i = 0; i < m.addedNodes.length; i++) {
            const n = m.addedNodes[i];
            if (n.nodeType === Node.TEXT_NODE || n.nodeType === Node.ELEMENT_NODE) {
              queue.add(n);
            }
          }
        } else if (m.type === "characterData") {
          queue.add(m.target);
        } else if (m.type === "attributes") {
          queue.add(m.target);
        }
      }

      if (!pending && queue.size > 0) {
        pending = true;
        window.requestAnimationFrame(flushTranslations);
      }
    });

    // Initial translation pass on document body
    translateNode(document.body);

    // Observe document for dynamically rendered modals, dialogs, and components
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["title", "placeholder", "aria-label", "alt"],
    });
  }
}
