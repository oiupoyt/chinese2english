import { translateScript } from "./rewrite.js";

export const name = "chinese2english";
export const inject = ["clientModules"];

const JS_TYPE = /^text\/javascript\b/i;
// Combo requests look like `/plugins/??a/client.js,b/client.js&rev=...`: the
// path is only `/plugins/`, so the file names live in the query string and the
// test has to run against the whole URL. Source maps (`client.js.map`) do not
// match because `.js` is followed by `.`, not a separator.
const JS_URL = /\.js(?:[,&?]|$)/;
const MAX_BODY = 16 * 1024 * 1024;
const MAX_CACHE = 64;

function isScriptUrl(url: string): boolean {
  return JS_URL.test(url);
}

/**
 * Translates Chinese UI text at the bundle transport layer.
 *
 * Every third-party plugin bundle is served through `/plugins/...` by the
 * clientModules service, and combination bundles carry several plugins in one
 * body. Intercepting the response here reaches all of them at once, before any
 * code runs, without touching React trees or the locale store.
 *
 * `bundleResource` yields the body as a Buffer, so the wrapper decodes UTF-8,
 * rewrites, and hands the bytes back in the shape the server expects.
 */
export function apply(ctx: any) {
  const registry = ctx.clientModules;
  if (!registry || typeof registry.bundleResource !== "function") {
    console.error("[chinese2english] clientModules.bundleResource unavailable; translation disabled");
    return;
  }

  const original = registry.bundleResource;
  const cache = new Map<string, Buffer | string>();

  registry.bundleResource = async function (method: string, url: string, ...rest: any[]) {
    const response = await original.call(this, method, url, ...rest);

    if (response?.status !== 200) return response;
    if (!isScriptUrl(url)) return response;

    const raw = response.body;
    const isBuffer = Buffer.isBuffer(raw);
    if (!isBuffer && typeof raw !== "string") return response;

    const contentType = response.headers?.["content-type"];
    if (typeof contentType !== "string" || !JS_TYPE.test(contentType)) return response;
    if (raw.length > MAX_BODY) return response;

    try {
      let body = cache.get(url);
      if (body === undefined) {
        const source = isBuffer ? raw.toString("utf8") : raw;
        const rewritten = translateScript(source);
        // Preserve the incoming body type: the Web route accepts either, but
        // `fetchBundle` hands the value to `Uint8Array.from`.
        body = isBuffer ? Buffer.from(rewritten, "utf8") : rewritten;
        if (cache.size >= MAX_CACHE) {
          const oldest = cache.keys().next();
          if (!oldest.done) cache.delete(oldest.value);
        }
        cache.set(url, body);
      }
      if (method === "HEAD") return response;
      if (typeof body === "string") {
        if (body === raw) return response;
      } else if (body.length === raw.length && (!isBuffer || body.equals(raw))) {
        return response;
      }
      return {
        ...response,
        headers: { ...response.headers, "cache-control": "no-cache" },
        body,
      };
    } catch (error) {
      console.error(`[chinese2english] could not translate ${url}:`, error);
      return response;
    }
  };
}
