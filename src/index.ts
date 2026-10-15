import { translatesEndpoint, translateJson } from "./json.js";
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

/** Rewrites `/plugins/...` JavaScript responses in place. */
function wrapBundles(ctx: any) {
  const registry = ctx.clientModules;
  if (!registry || typeof registry.bundleResource !== "function") {
    console.error("[chinese2english] clientModules.bundleResource unavailable; bundle translation disabled");
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

/**
 * Rewrites server-authored UI copy returned by the `/api` RPC gateway.
 *
 * Plugin descriptors and model/provider names reach the browser as JSON, not as
 * bundle strings, so the bundle seam cannot see them. The gateway resolves its
 * own `dispatchRpc` per request, so overriding the instance method intercepts
 * every `/api` call without claiming the interceptor slot the gateway owns.
 */
function wrapRpc(ctx: any) {
  const gateway = ctx.get("typertGateway");
  if (!gateway || typeof gateway.dispatchRpc !== "function") {
    console.warn("[chinese2english] typertGateway unavailable; API copy left untranslated");
    return;
  }

  const original = gateway.dispatchRpc;

  gateway.dispatchRpc = async function (endpoint: string, ...rest: any[]) {
    const result = await original.call(this, endpoint, ...rest);
    if (!translatesEndpoint(endpoint)) return result;
    if (!result || typeof result !== "object" || result.ok !== true) return result;
    try {
      const value = translateJson(result.value);
      return value === result.value ? result : { ...result, value };
    } catch (error) {
      console.error(`[chinese2english] could not translate ${endpoint}:`, error);
      return result;
    }
  };
}

/**
 * Renders Chinese UI text as English.
 *
 * Two seams, because the text arrives two ways: plugin bundle source over
 * `/plugins/...`, and server-authored copy over `/api`. Both are rewritten
 * before the bytes leave the process, so no client-side ordering, DOM walking,
 * or React tree mutation is involved.
 */
export function apply(ctx: any) {
  wrapBundles(ctx);

  // The gateway may not be mounted in every composition; load without it.
  if (ctx.get("typertGateway") !== undefined) wrapRpc(ctx);
  else ctx.inject(["typertGateway"], (gatewayCtx: any) => wrapRpc(gatewayCtx));
}
