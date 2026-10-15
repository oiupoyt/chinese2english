export const name = "chinese2english";
export const inject = ["locale"];

/**
 * Pins the UI language to English.
 *
 * Hardcoded Chinese inside plugin bundles is handled on the server by the
 * bundle-transport rewrite in `src/index.ts`. Text that flows through the
 * locale service is only English when the active locale is `en`, so this half
 * makes that selection explicit and durable. Walking the DOM is deliberately
 * avoided: it corrupts React trees and cannot reach text that arrives as data.
 */
export function apply(ctx: any) {
  const locale = ctx.locale;
  if (!locale || typeof locale.setLocale !== "function") {
    console.warn("[chinese2english] locale service unavailable; UI language left unchanged");
    return;
  }

  const pin = (reason: string) => {
    try {
      if (locale.getLocale?.().active === "en") return;
      locale.setLocale("en");
    } catch (error) {
      console.error(`[chinese2english] could not select English (${reason}):`, error);
    }
  };

  pin("initial");

  // A late language pack or an external preference can republish the snapshot
  // with another active locale; re-assert English when that happens.
  ctx.effect(
    () =>
      ctx.on("locale/change", (snapshot: any) => {
        if (snapshot?.active !== "en") pin("locale change");
      }),
    "chinese2english: keep the UI locale on English",
  );
}
