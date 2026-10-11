import { DICTIONARY, SORTED_PAIRS, DYNAMIC_PATTERNS } from "./dictionary.js";

export const name = "dsh-plugin-english-client";
export const inject = [];

const CHINESE_REGEX = /[\u4e00-\u9fa5]/;

/**
 * Translates a single text string using dictionary and pattern matching.
 */
export function translateText(text: string): string {
  if (!text || !CHINESE_REGEX.test(text)) return text;

  const trimmed = text.trim();
  if (DICTIONARY[trimmed]) {
    return text.replace(trimmed, DICTIONARY[trimmed]);
  }

  let result = text;
  // Dynamic regex patterns (counts, numbers, time)
  for (const [pattern, replacement] of DYNAMIC_PATTERNS) {
    result = result.replace(pattern, replacement);
  }

  // Exact phrase search for substrings (longest phrases first)
  for (const [cn, en] of SORTED_PAIRS) {
    if (result.includes(cn)) {
      result = result.replaceAll(cn, en);
      if (!CHINESE_REGEX.test(result)) break;
    }
  }

  return result;
}

let isTranslating = false;

/**
 * Translates an element and all its children using native TreeWalker.
 */
export function translateElement(root: Node) {
  if (!root) return;

  if (root.nodeType === Node.TEXT_NODE) {
    const val = root.nodeValue;
    if (val && CHINESE_REGEX.test(val)) {
      const translated = translateText(val);
      if (translated !== val) {
        root.nodeValue = translated;
      }
    }
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as HTMLElement;

  const tag = el.tagName;
  if (tag === "SCRIPT" || tag === "STYLE" || tag === "PRE" || tag === "CODE") return;

  // Translate attributes
  for (const attr of ["placeholder", "title", "aria-label"]) {
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
      const parentTag = textNode.parentElement?.tagName;
      if (parentTag !== "SCRIPT" && parentTag !== "STYLE" && parentTag !== "PRE" && parentTag !== "CODE") {
        const translated = translateText(val);
        if (translated !== val) {
          textNode.nodeValue = translated;
        }
      }
    }
    textNode = walker.nextNode();
  }
}

function initTranslator() {
  if (typeof document === "undefined" || (window as any).__DSH_TRANSLATOR_ACTIVE__) return;
  (window as any).__DSH_TRANSLATOR_ACTIVE__ = true;

  console.log("[dsh-plugin-english] Universal English translator activated.");

  const queue = new Set<Node>();
  let frameRequested = false;

  const processQueue = () => {
    frameRequested = false;
    isTranslating = true;
    try {
      const nodes = Array.from(queue);
      queue.clear();
      for (const n of nodes) {
        if (n.isConnected) {
          translateElement(n);
        }
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
          const n = m.addedNodes[i];
          if (n.nodeType === Node.TEXT_NODE || n.nodeType === Node.ELEMENT_NODE) {
            queue.add(n);
          }
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
      requestAnimationFrame(processQueue);
    }
  });

  // Observe root
  const root = document.documentElement || document.body;
  if (root) {
    translateElement(root);
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
    });
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      translateElement(document.body);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["placeholder", "title", "aria-label"],
      });
    });
  }

  // Periodic safety check every 1s for any dynamically inserted lazy elements
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

// Start immediately when the bundle loads in browser
if (typeof window !== "undefined") {
  initTranslator();
}

export function apply(ctx: any) {
  initTranslator();
}
