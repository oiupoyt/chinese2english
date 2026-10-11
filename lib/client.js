window.__ModuleLoader__.load({ id: "dsh-plugin-english", factory: (require) => { var module = { exports: {} }; var exports = module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name,
  translateElement: () => translateElement,
  translateText: () => translateText
});
module.exports = __toCommonJS(index_exports);

// src/client/dictionary.ts
var DICTIONARY = {
  // DSH Marketplace & Store
  "\u63D2\u4EF6\u5E02\u573A": "Plugin Marketplace",
  "\u901B\u4E00\u901B\uFF0C\u70B9\u4E00\u4E0B\uFF0C\u88C5\u597D\u3002": "Browse, click, and install.",
  "\u5168\u90E8\u63D2\u4EF6": "All Plugins",
  "\u5DF2\u5B89\u88C5\u63D2\u4EF6": "Installed Plugins",
  "\u63D2\u4EF6": "Plugins",
  "\u5E02\u573A": "Marketplace",
  "\u70ED\u95E8\u63D2\u4EF6": "Popular Plugins",
  "\u6700\u65B0\u4E0A\u67B6": "Recently Added",
  "\u63A8\u8350\u63D2\u4EF6": "Recommended Plugins",
  "\u4E0B\u8F7D\u91CF": "Downloads",
  "\u8BC4\u5206": "Rating",
  "\u4F5C\u8005": "Author",
  "\u5B89\u88C5\u91CF": "Installs",
  "\u5B89\u88C5\u63D2\u4EF6": "Install Plugin",
  "\u5378\u8F7D\u63D2\u4EF6": "Uninstall Plugin",
  "\u66F4\u65B0\u63D2\u4EF6": "Update Plugin",
  "\u7B2C\u4E09\u65B9\u63D2\u4EF6": "Third-Party Plugins",
  "\u5B98\u65B9\u63D2\u4EF6": "Official Plugins",
  "\u641C\u7D22\u63D2\u4EF6": "Search plugins...",
  "\u641C\u7D22\u63D2\u4EF6\u540D\u79F0\u6216\u4F5C\u8005": "Search by plugin name or author...",
  "\u4E00\u952E\u5B89\u88C5": "Install",
  "\u4E00\u952E\u66F4\u65B0": "Update",
  "\u6B63\u5728\u4E0B\u8F7D": "Downloading...",
  "\u6B63\u5728\u5B89\u88C5": "Installing...",
  "\u5B89\u88C5\u5B8C\u6210": "Installed",
  "\u5378\u8F7D\u5B8C\u6210": "Uninstalled",
  // Skills Manager Navigation & Tabs
  "\u6280\u80FD\u7BA1\u7406": "Skills Manager",
  "\u6280\u80FD\u7BA1\u7406\u5668": "Skills Manager",
  "\u7EDF\u4E00\u52A0\u8F7D\u548C\u7BA1\u7406\u672C\u673A Agent Skills\u3002": "Load and manage Agent Skills on this machine in one place.",
  "\u6280\u80FD\u5217\u8868": "Skills List",
  "\u5DF2\u5B89\u88C5\u6280\u80FD": "Installed Skills",
  "\u53EF\u7528\u6280\u80FD": "Available Skills",
  "\u53D1\u73B0\u6280\u80FD": "Discover Skills",
  "\u4ED3\u5E93\u8BA2\u9605": "Repositories",
  "\u4ED3\u5E93\u7BA1\u7406": "Repositories",
  "\u6280\u80FD\u6765\u6E90": "Skill Sources",
  "\u5168\u5C40\u6280\u80FD": "Global Skills",
  "\u9879\u76EE\u6280\u80FD": "Project Skills",
  "\u516C\u5171 Agent": "Shared Agent",
  "\u9879\u76EE Agent": "Project Agent",
  "\u9879\u76EE Skills": "Project Skills",
  "\u4F1A\u8BDD\u6280\u80FD": "Session Skills",
  "\u56DE\u6536\u7AD9": "Trash",
  "\u8BCA\u65AD\u5F02\u5E38": "Diagnostics",
  "\u5F02\u5E38\u8BCA\u65AD": "Diagnostics",
  "\u6E90\u6587\u4EF6\u53EA\u8BFB": "Read-only",
  "\u53EA\u8BFB": "Read-only",
  "\u521B\u5EFA\u4F4D\u7F6E": "Location",
  "\u5168\u5C40 DSH": "Global DSH",
  "\u9879\u76EE DSH": "Project DSH",
  "DSH \u6280\u80FD": "DSH Skills",
  // Actions & Buttons
  "\u521B\u5EFA\u6280\u80FD": "Create Skill",
  "\u521B\u5EFA\u65B0\u6280\u80FD": "Create Skill",
  "\u65B0\u5EFA\u6280\u80FD": "New Skill",
  "\u7ACB\u5373\u521B\u5EFA": "Create Now",
  "\u5BFC\u5165\u6280\u80FD": "Import Skill",
  "\u5BFC\u51FA\u6280\u80FD": "Export Skill",
  "\u5BFC\u5165": "Import",
  "\u5BFC\u51FA": "Export",
  "\u5237\u65B0": "Refresh",
  "\u68C0\u67E5\u66F4\u65B0": "Check Updates",
  "\u6B63\u5728\u68C0\u67E5\u66F4\u65B0\u2026": "Checking for updates...",
  "\u6B63\u5728\u68C0\u67E5\u66F4\u65B0...": "Checking for updates...",
  "\u68C0\u67E5\u5E76\u66F4\u65B0": "Check & Update",
  "\u66F4\u65B0": "Update",
  "\u7BA1\u7406\u66F4\u65B0": "Manage Updates",
  "\u7ACB\u5373\u66F4\u65B0": "Update Now",
  "\u786E\u8BA4\u66F4\u65B0": "Confirm Update",
  "\u56DE\u6EDA": "Rollback",
  "\u786E\u8BA4\u56DE\u6EDA": "Confirm Rollback",
  "\u6062\u590D": "Restore",
  "\u79FB\u5230\u56DE\u6536\u7AD9": "Move to Trash",
  "\u79FB\u5165\u56DE\u6536\u7AD9": "Move to Trash",
  "\u6C38\u4E45\u5220\u9664": "Delete Forever",
  "\u6E05\u7A7A\u56DE\u6536\u7AD9": "Empty Trash",
  "\u5220\u9664": "Delete",
  "\u542F\u7528": "Enable",
  "\u505C\u7528": "Disable",
  "\u5DF2\u542F\u7528": "Enabled",
  "\u5DF2\u505C\u7528": "Disabled",
  "\u5168\u90E8\u542F\u7528": "Enable All",
  "\u5168\u90E8\u505C\u7528": "Disable All",
  "\u542F\u505C\u6765\u6E90": "Toggle Source",
  "\u542F\u505C\u6280\u80FD": "Toggle Skill",
  "\u5B89\u88C5": "Install",
  "\u5DF2\u5B89\u88C5": "Installed",
  "\u5378\u8F7D": "Uninstall",
  "\u67E5\u770B\u8BE6\u60C5": "View Details",
  "\u67E5\u770B\u8BF4\u660E": "View Docs",
  "\u67E5\u770B": "View",
  "\u66F4\u591A": "More",
  "\u53D6\u6D88": "Cancel",
  "\u4FDD\u5B58": "Save",
  "\u5173\u95ED": "Close",
  "\u786E\u5B9A": "OK",
  "\u590D\u5236": "Copy",
  "\u5DF2\u590D\u5236": "Copied",
  "\u590D\u5236\u6210\u529F": "Copied",
  "\u641C\u7D22": "Search",
  "\u91CD\u8BD5": "Retry",
  "\u9009\u62E9\u6587\u4EF6": "Choose File",
  "\u9009\u62E9\u6587\u4EF6\u5939": "Choose Folder",
  "\u95EE\u9898\u53CD\u9988": "Issues",
  "\u8BBE\u7F6E": "Settings",
  // Status & Filters
  "\u5168\u90E8\u6765\u6E90": "All Sources",
  "\u5168\u90E8\u72B6\u6001": "All Statuses",
  "\u8C03\u7528\u72B6\u6001": "Invocation Status",
  "\u72B6\u6001": "Status",
  "\u6765\u6E90": "Source",
  "\u88AB\u8986\u76D6": "Shadowed",
  "\u540D\u79F0": "Name",
  "\u7248\u672C": "Version",
  "\u5927\u5C0F": "Size",
  "\u7C7B\u578B": "Type",
  "\u64CD\u4F5C": "Actions",
  "\u8BE6\u60C5": "Details",
  "\u63CF\u8FF0": "Description",
  "\u7B80\u4ECB": "Description",
  "\u6B63\u6587": "Body",
  "\u6E90\u6587\u4EF6": "Source File",
  "\u66F4\u65B0\u65F6\u95F4": "Updated",
  "\u521B\u5EFA\u65F6\u95F4": "Created",
  "\u5220\u9664\u4E8E": "Deleted at",
  "\u6765\u6E90\uFF1A": "Source: ",
  // Empty & Loading States
  "\u6B63\u5728\u52A0\u8F7D\u6280\u80FD\u2026": "Loading skills...",
  "\u6B63\u5728\u52A0\u8F7D\u6280\u80FD...": "Loading skills...",
  "\u6B63\u5728\u52A0\u8F7D\u2026": "Loading...",
  "\u6B63\u5728\u52A0\u8F7D...": "Loading...",
  "\u52A0\u8F7D\u4E2D\u2026": "Loading...",
  "\u52A0\u8F7D\u4E2D...": "Loading...",
  "\u6B63\u5728\u8BFB\u53D6\u8BF4\u660E\u2026": "Loading documentation...",
  "\u6B63\u5728\u8BFB\u53D6\u8BF4\u660E...": "Loading documentation...",
  "\u6CA1\u6709\u5339\u914D\u7684\u6280\u80FD\u3002": "No matching skills.",
  "\u6CA1\u6709\u5339\u914D\u7684\u6280\u80FD": "No matching skills",
  "\u8BE5\u6765\u6E90\u76EE\u5F55\u4E0D\u5B58\u5728\u6216\u6682\u65F6\u6CA1\u6709\u6280\u80FD\u3002": "This source directory does not exist or has no skills.",
  "\u56DE\u6536\u7AD9\u4E3A\u7A7A\u3002": "Trash is empty.",
  "\u56DE\u6536\u7AD9\u4E3A\u7A7A": "Trash is empty",
  "\u6682\u65E0\u6280\u80FD": "No skills available",
  "\u6682\u65E0\u6570\u636E": "No data available",
  "\u672A\u63D0\u4F9B\u7B80\u4ECB": "No description provided",
  "\u672A\u53D1\u73B0\u8BCA\u65AD\u95EE\u9898\u3002": "No diagnostic issues found.",
  // Upload & Import Modal
  "\u62D6\u62FD\u6280\u80FD\u5230\u6B64\u5904": "Drop skill here",
  "\u652F\u6301 .zip\u3001\u6280\u80FD\u6587\u4EF6\u5939\u6216\u5355\u4E2A SKILL.md": "Supports .zip, a skill folder, or single SKILL.md",
  "\u6587\u4EF6\u8981\u6C42": "Requirements",
  "\u538B\u7F29\u5305\u6216\u6587\u4EF6\u5939\u9700\u5305\u542B SKILL.md": "Archives or folders must contain SKILL.md",
  "SKILL.md \u9700\u5305\u542B YAML \u683C\u5F0F\u7684\u6280\u80FD\u540D\u79F0\u548C\u63CF\u8FF0": "SKILL.md must include YAML name and description",
  "\u5BFC\u5165\u65F6\u590D\u5236\u5B8C\u6574\u5185\u5BB9\uFF0C\u4E0D\u4FEE\u6539\u539F\u59CB\u6765\u6E90": "Import copies full content without modifying source",
  "\u5BFC\u5165\u5230\u5168\u5C40 DSH": "Import to global DSH",
  "\u79FB\u9664\u6240\u9009\u5185\u5BB9": "Remove selection",
  "\u8BF7\u9009\u62E9 .zip \u6216\u5355\u4E2A SKILL.md\u3002": "Please choose a .zip or single SKILL.md.",
  "\u6240\u9009\u6587\u4EF6\u5939\u4E2D\u6CA1\u6709\u627E\u5230 SKILL.md\u3002": "No SKILL.md found in the selected folder.",
  // Creation Form
  "\u4F8B\u5982 code-review-helper": "e.g. code-review-helper",
  "\u4E00\u53E5\u8BDD\u8BF4\u660E\u4EC0\u4E48\u65F6\u5019\u4F7F\u7528": "One sentence describing when to use it",
  "\u6B63\u6587\uFF08Markdown\uFF09": "Body (Markdown)",
  "\u5199\u4E0B\u6280\u80FD\u8981\u9075\u5FAA\u7684\u6307\u4EE4\u3001\u6B65\u9AA4\u548C\u8FB9\u754C\u2026": "Write the instructions, steps, and boundaries...",
  "\u521B\u5EFA\u548C\u5BFC\u5165\u5747\u4FDD\u5B58\u5230\u5168\u5C40 DSH\uFF0C\u8DE8\u9879\u76EE\u53EF\u7528\u3002": "Created and imported skills are saved to global DSH and available across projects.",
  // General Settings & UI
  "\u901A\u7528\u8BBE\u7F6E": "General Settings",
  "\u6A21\u578B\u8BBE\u7F6E": "Model Settings",
  "\u5916\u89C2\u8BBE\u7F6E": "Appearance",
  "\u8BED\u8A00\u8BBE\u7F6E": "Language",
  "\u5FEB\u6377\u952E": "Shortcuts",
  "\u5173\u4E8E": "About",
  "\u7248\u672C\u53F7": "Version",
  "\u68C0\u67E5\u65B0\u7248\u672C": "Check for updates",
  "\u8BED\u8A00": "Language",
  "\u7B80\u4F53\u4E2D\u6587": "Simplified Chinese",
  "\u82F1\u6587": "English",
  "\u6DF1\u8272\u6A21\u5F0F": "Dark Mode",
  "\u6D45\u8272\u6A21\u5F0F": "Light Mode",
  "\u8DDF\u968F\u7CFB\u7EDF": "Follow System",
  "\u9000\u51FA": "Exit",
  "\u91CD\u542F": "Restart",
  // Model & Chat Concepts
  "\u6A21\u578B": "Models",
  "\u4F1A\u8BDD": "Sessions",
  "\u65B0\u4F1A\u8BDD": "New Session",
  "\u5386\u53F2\u4F1A\u8BDD": "History",
  "\u5DE5\u4F5C\u533A": "Workspace",
  "\u6682\u65E0\u4F1A\u8BDD": "No sessions",
  "\u53D1\u9001": "Send",
  "\u505C\u6B62\u751F\u6210": "Stop generating",
  "\u91CD\u65B0\u751F\u6210": "Regenerate",
  "\u8017\u65F6": "Duration",
  "\u6B65\u9AA4": "Steps",
  "\u8F6E\u6B21": "Turns"
};
var SORTED_PAIRS = Object.entries(DICTIONARY).sort(
  (a, b) => b[0].length - a[0].length
);
var DYNAMIC_PATTERNS = [
  [/(\d+)\s*个技能/g, "$1 skills"],
  [/(\d+)\s*个已启用/g, "$1 enabled"],
  [/(\d+)\s*个已停用/g, "$1 disabled"],
  [/(\d+)\s*个被覆盖/g, "$1 shadowed"],
  [/(\d+)\s*个诊断异常/g, "$1 issues"],
  [/(\d+)\s*个文件/g, "$1 files"],
  [/(\d+)\s*个待处理技能/g, "$1 pending skills"],
  [/来源：/g, "Source: "],
  [/创建于\s*([0-9:\-\/ ]+)/g, "Created at $1"],
  [/更新于\s*([0-9:\-\/ ]+)/g, "Updated at $1"],
  [/删除于\s*([0-9:\-\/ ]+)/g, "Deleted at $1"],
  [/被\s*(.+?)\s*覆盖/g, "Shadowed by $1"]
];

// src/client/index.ts
var name = "dsh-plugin-english-client";
var inject = ["locale"];
var CHINESE_REGEX = /[\u4e00-\u9fa5]/;
function translateText(text) {
  if (!text || !CHINESE_REGEX.test(text)) return text;
  const trimmed = text.trim();
  if (DICTIONARY[trimmed]) {
    return text.replace(trimmed, DICTIONARY[trimmed]);
  }
  for (const [pattern, replacement] of DYNAMIC_PATTERNS) {
    if (pattern.test(trimmed)) {
      return text.replace(trimmed, trimmed.replace(pattern, replacement));
    }
  }
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
var isTranslating = false;
function translateElement(root) {
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
  const el = root;
  const tag = el.tagName;
  if (tag === "SCRIPT" || tag === "STYLE" || tag === "PRE" || tag === "CODE") return;
  for (const attr of ["placeholder", "title", "aria-label", "alt"]) {
    const val = el.getAttribute(attr);
    if (val && CHINESE_REGEX.test(val)) {
      el.setAttribute(attr, translateText(val));
    }
  }
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
  document.documentElement.lang = "en";
  const queue = /* @__PURE__ */ new Set();
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
      attributeFilter: ["placeholder", "title", "aria-label", "alt"]
    });
  }
  setInterval(() => {
    if (document.body && !isTranslating) {
      isTranslating = true;
      try {
        translateElement(document.body);
      } finally {
        isTranslating = false;
      }
    }
  }, 1e3);
}
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
  } catch {
  }
}
function apply(ctx) {
  console.log("[dsh-plugin-english] Activating English locale & translation engine...");
  enforceEnglishStorage();
  if (ctx.locale) {
    try {
      if (typeof ctx.locale.setLocale === "function") {
        ctx.locale.setLocale("en");
      }
      if (typeof ctx.locale.resolveActive === "function") {
        ctx.locale.resolveActive = () => "en";
      }
      if (typeof ctx.locale.getSnapshot === "function") {
        const origSnap = ctx.locale.getSnapshot.bind(ctx.locale);
        ctx.locale.getSnapshot = () => {
          const s = origSnap();
          return s ? { ...s, active: "en" } : s;
        };
      }
      if (typeof ctx.locale.publish === "function") {
        ctx.locale.publish("en", true);
      }
      if (typeof ctx.locale.translate === "function") {
        const origTranslate = ctx.locale.translate.bind(ctx.locale);
        ctx.locale.translate = function(ns, key, params) {
          const val = origTranslate(ns, key, params);
          if (typeof val === "string" && CHINESE_REGEX.test(val)) {
            return translateText(val);
          }
          return val;
        };
      }
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
  if (typeof document !== "undefined") {
    document.documentElement.lang = "en";
    const observer = new MutationObserver(() => {
      if (document.documentElement.lang !== "en") {
        document.documentElement.lang = "en";
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }
  startDOMTranslator();
}
if (typeof window !== "undefined") {
  enforceEnglishStorage();
  startDOMTranslator();
}
return module.exports; } });
//# sourceMappingURL=client.js.map
