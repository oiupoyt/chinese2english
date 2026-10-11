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
  name: () => name
});
module.exports = __toCommonJS(index_exports);

// src/client/dictionary.ts
var DICTIONARY = {
  // Navigation & Core Concepts
  "\u6280\u80FD\u7BA1\u7406": "Skills Manager",
  "\u6280\u80FD\u7BA1\u7406\u5668": "Skills Manager",
  "\u6280\u80FD\u5217\u8868": "Skills List",
  "\u5DF2\u5B89\u88C5\u6280\u80FD": "Installed Skills",
  "\u53EF\u7528\u6280\u80FD": "Available Skills",
  "\u53D1\u73B0\u6280\u80FD": "Discover Skills",
  "\u4ED3\u5E93\u8BA2\u9605": "Repository Subscriptions",
  "\u4ED3\u5E93\u7BA1\u7406": "Repositories",
  "\u6280\u80FD\u6765\u6E90": "Skill Sources",
  "\u5168\u5C40\u6280\u80FD": "Global Skills",
  "\u9879\u76EE\u6280\u80FD": "Project Skills",
  "\u4F1A\u8BDD\u6280\u80FD": "Session Skills",
  "\u56DE\u6536\u7AD9": "Trash",
  "\u8BCA\u65AD\u5F02\u5E38": "Diagnostics",
  "\u5F02\u5E38\u8BCA\u65AD": "Diagnostics",
  // Actions & Buttons
  "\u68C0\u67E5\u66F4\u65B0": "Check Updates",
  "\u6B63\u5728\u68C0\u67E5\u66F4\u65B0\u2026": "Checking for updates...",
  "\u6B63\u5728\u68C0\u67E5\u66F4\u65B0...": "Checking for updates...",
  "\u68C0\u67E5\u5E76\u66F4\u65B0": "Check & Update",
  "\u66F4\u65B0": "Update",
  "\u5DF2\u662F\u6700\u65B0": "Up to date",
  "\u53EF\u66F4\u65B0": "Update Available",
  "\u7ACB\u5373\u66F4\u65B0": "Update Now",
  "\u786E\u8BA4\u66F4\u65B0": "Confirm Update",
  "\u56DE\u6EDA": "Rollback",
  "\u786E\u8BA4\u56DE\u6EDA": "Confirm Rollback",
  "\u6062\u590D": "Restore",
  "\u5220\u9664": "Delete",
  "\u6C38\u4E45\u5220\u9664": "Permanently Delete",
  "\u6E05\u7A7A\u56DE\u6536\u7AD9": "Empty Trash",
  "\u79FB\u5165\u56DE\u6536\u7AD9": "Move to Trash",
  "\u5BFC\u5165": "Import",
  "\u5BFC\u5165\u6280\u80FD": "Import Skill",
  "\u5BFC\u51FA": "Export",
  "\u5BFC\u51FA\u6280\u80FD": "Export Skill",
  "\u65B0\u5EFA\u6280\u80FD": "New Skill",
  "\u521B\u5EFA\u6280\u80FD": "Create Skill",
  "\u5237\u65B0": "Refresh",
  "\u542F\u7528": "Enable",
  "\u505C\u7528": "Disable",
  "\u5DF2\u542F\u7528": "Enabled",
  "\u5DF2\u505C\u7528": "Disabled",
  "\u5168\u90E8\u542F\u7528": "Enable All",
  "\u5168\u90E8\u505C\u7528": "Disable All",
  "\u5B89\u88C5": "Install",
  "\u5DF2\u5B89\u88C5": "Installed",
  "\u5378\u8F7D": "Uninstall",
  "\u67E5\u770B": "View",
  "\u67E5\u770B\u8BE6\u60C5": "View Details",
  "\u67E5\u770B\u8BF4\u660E": "View Docs",
  "\u4FDD\u5B58": "Save",
  "\u53D6\u6D88": "Cancel",
  "\u5173\u95ED": "Close",
  "\u786E\u5B9A": "OK",
  "\u590D\u5236": "Copy",
  "\u590D\u5236\u6210\u529F": "Copied",
  "\u641C\u7D22": "Search",
  "\u91CD\u8BD5": "Retry",
  // Status & Counts
  "\u5168\u90E8": "All",
  "\u72B6\u6001": "Status",
  "\u7C7B\u578B": "Type",
  "\u540D\u79F0": "Name",
  "\u7248\u672C": "Version",
  "\u64CD\u4F5C": "Actions",
  "\u6765\u6E90": "Source",
  "\u8DEF\u5F84": "Path",
  "\u63CF\u8FF0": "Description",
  "\u8BE6\u60C5": "Details",
  "\u5927\u5C0F": "Size",
  "\u66F4\u65B0\u65F6\u95F4": "Updated",
  "\u521B\u5EFA\u65F6\u95F4": "Created",
  "\u4E2A\u6280\u80FD": " skills",
  "\u4E2A\u5DF2\u542F\u7528": " enabled",
  "\u4E2A\u5DF2\u505C\u7528": " disabled",
  "\u4E2A\u88AB\u8986\u76D6": " shadowed",
  "\u4E2A\u5F85\u5904\u7406\u6280\u80FD": " pending skills",
  "\u4E2A\u8BCA\u65AD\u5F02\u5E38": " diagnostic issues",
  // Form Fields & Hints
  "\u6280\u80FD\u540D\u79F0": "Skill Name",
  "\u6280\u80FD\u63CF\u8FF0": "Description",
  "\u6280\u80FD\u5185\u5BB9": "Skill Body",
  "\u6280\u80FD\u6B63\u6587": "Skill Body",
  "\u4ED3\u5E93\u5730\u5740": "Repository URL",
  "\u641C\u7D22\u6280\u80FD": "Search skills...",
  "\u641C\u7D22\u6280\u80FD\u540D\u79F0\u3001\u63CF\u8FF0\u6216\u6765\u6E90": "Search skills by name, description, or source...",
  "\u8BF7\u8F93\u5165\u4ED3\u5E93\u5730\u5740": "Enter repository URL...",
  "\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684\u6280\u80FD": "No matching skills found",
  "\u6682\u65E0\u6280\u80FD": "No skills available",
  "\u56DE\u6536\u7AD9\u4E3A\u7A7A": "Trash is empty",
  "\u52A0\u8F7D\u4E2D\u2026": "Loading...",
  "\u52A0\u8F7D\u4E2D...": "Loading...",
  "\u6B63\u5728\u8BFB\u53D6\u8BF4\u660E\u2026": "Loading documentation...",
  // Settings & Configuration
  "\u901A\u7528\u8BBE\u7F6E": "General Settings",
  "\u6A21\u578B\u8BBE\u7F6E": "Model Settings",
  "\u5916\u89C2\u8BBE\u7F6E": "Appearance",
  "\u5FEB\u6377\u952E": "Shortcuts",
  "\u8BED\u8A00": "Language",
  "\u7B80\u4F53\u4E2D\u6587": "Simplified Chinese",
  "\u82F1\u6587": "English",
  // Common Notification & Messages
  "\u64CD\u4F5C\u6210\u529F": "Operation successful",
  "\u64CD\u4F5C\u5931\u8D25": "Operation failed",
  "\u66F4\u65B0\u6210\u529F": "Updated successfully",
  "\u5220\u9664\u6210\u529F": "Deleted successfully",
  "\u521B\u5EFA\u6210\u529F": "Created successfully",
  "\u5BFC\u5165\u6210\u529F": "Imported successfully",
  "\u5907\u4EFD\u5DF2\u4FDD\u5B58": "Backup saved",
  "\u6B63\u5728\u52A0\u8F7D": "Loading"
};
var PHRASE_PATTERNS = [
  [/(\d+)\s*个技能/g, "$1 skills"],
  [/(\d+)\s*个已启用/g, "$1 enabled"],
  [/(\d+)\s*个已停用/g, "$1 disabled"],
  [/(\d+)\s*个被覆盖/g, "$1 shadowed"],
  [/(\d+)\s*个文件/g, "$1 files"],
  [/(\d+)\s*个待处理技能/g, "$1 pending skills"],
  [/(\d+)\s*个诊断异常/g, "$1 diagnostic issues"],
  [/正在检查更新[…\.]*/g, "Checking for updates..."],
  [/正在读取说明[…\.]*/g, "Loading documentation..."],
  [/暂无可用技能/g, "No skills available"],
  [/暂无数据/g, "No data available"],
  [/暂无更新/g, "No updates available"],
  [/无法恢复/g, "cannot be restored"],
  [/已被覆盖/g, "is shadowed"],
  [/移入回收站/g, "Move to Trash"],
  [/永久删除/g, "Permanently Delete"]
];

// src/client/index.ts
var name = "dsh-plugin-english-client";
var inject = ["locale", "slots"];
var CHINESE_REGEX = /[\u4e00-\u9fa5]/;
function translateText(text) {
  if (!text || !CHINESE_REGEX.test(text)) return text;
  const trimmed = text.trim();
  if (DICTIONARY[trimmed]) {
    return text.replace(trimmed, DICTIONARY[trimmed]);
  }
  let result = text;
  for (const [pattern, replacement] of PHRASE_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  for (const [cn, en] of Object.entries(DICTIONARY)) {
    if (result.includes(cn)) {
      result = result.replaceAll(cn, en);
    }
  }
  return result;
}
function translateNode(node) {
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
    const el = node;
    const tagName = el.tagName;
    if (tagName === "SCRIPT" || tagName === "STYLE" || tagName === "PRE" || tagName === "CODE") {
      return;
    }
    for (const attr of ["title", "placeholder", "aria-label", "alt"]) {
      const val = el.getAttribute(attr);
      if (val && CHINESE_REGEX.test(val)) {
        el.setAttribute(attr, translateText(val));
      }
    }
    let child = el.firstChild;
    while (child) {
      translateNode(child);
      child = child.nextSibling;
    }
  }
}
function apply(ctx) {
  if (ctx.locale && typeof ctx.locale.register === "function") {
    ctx.effect(() => {
      if (typeof ctx.locale.subscribe === "function") {
        ctx.locale.subscribe(() => {
          if (typeof document !== "undefined") {
            translateNode(document.body);
          }
        });
      }
    }, "dsh-plugin-english: locale observer");
  }
  if (typeof document !== "undefined") {
    let pending = false;
    const queue = /* @__PURE__ */ new Set();
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
    translateNode(document.body);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["title", "placeholder", "aria-label", "alt"]
    });
  }
}
return module.exports; } });
//# sourceMappingURL=client.js.map
