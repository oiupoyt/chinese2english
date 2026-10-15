window.__ModuleLoader__.load({ id: "chinese2english", factory: (require) => { var module = { exports: {} }; var exports = module.exports;
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
var name = "chinese2english";
var inject = ["locale"];
function apply(ctx) {
  const locale = ctx.locale;
  if (!locale || typeof locale.setLocale !== "function") {
    console.warn("[chinese2english] locale service unavailable; UI language left unchanged");
    return;
  }
  const pin = (reason) => {
    try {
      if (locale.getLocale?.().active === "en") return;
      locale.setLocale("en");
    } catch (error) {
      console.error(`[chinese2english] could not select English (${reason}):`, error);
    }
  };
  pin("initial");
  ctx.effect(
    () => ctx.on("locale/change", (snapshot) => {
      if (snapshot?.active !== "en") pin("locale change");
    }),
    "chinese2english: keep the UI locale on English"
  );
}
return module.exports; } });
//# sourceMappingURL=client.js.map
