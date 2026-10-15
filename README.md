# chinese2english

> Renders Chinese UI text in [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) third-party plugins as English.

Most community plugins ship hardcoded Chinese inside their client bundles. Those
strings never reach DSH's locale dictionaries, so they stay Chinese even when the
interface language is English. This plugin translates them at the transport
layer, before any of that code runs.

---

## How it works

Plugin bundles are served by DSH's `clientModules` service over `/plugins/...`.
This plugin wraps `clientModules.bundleResource`, decodes each JavaScript
response, rewrites the Chinese string literals it can translate, and returns the
result. Because interception happens server-side, it covers every plugin at once,
including combination bundles that carry dozens of them, and it runs before any
plugin code is evaluated.

Two deliberate choices:

- **All-or-nothing literals.** Chinese has no word boundaries, so replacing known
  words wherever they appear corrupts larger words (`当前工作区` would become
  `Saat IniWorkspace`). A literal is translated only when every Chinese character
  in it is covered by a dictionary entry; anything else is left in Chinese, since
  half-translated text reads worse than untranslated text.
- **A compile gate.** Each rewritten bundle is parsed with `new Function` before
  it is served. If a rewrite ever produced invalid JavaScript, the original bytes
  are served instead, so a bad dictionary entry cannot break the UI.

The client half does one thing: it selects the `en` locale through
`ctx.locale.setLocale`, which persists the preference. It never touches the DOM.

---

## What it does not cover

Translation works on string literals inside served bundles. Text that arrives
another way stays as it is:

- Plugin **descriptors** in `package.json` and `README.md` files (marketplace
  listings, plugin titles).
- **Server-side API prose** that is fetched as JSON at runtime.
- The long tail of one-off literals that the dictionary does not yet cover.

The shipped dictionary holds roughly 1,200 entries and covers about 45% of the
Chinese literals in a typical plugin set. Coverage is concentrated on strings
that appear repeatedly; rare one-off sentences are usually left in Chinese.

---

## Installation

```bash
dsh plugin --profile web add chinese2english
```

Remove it with `dsh plugin --profile web remove chinese2english`.

Restart DSH after installing, so the plugin is loaded and its transport wrapper
is installed before the first bundle request.

---

## Development

```bash
npm run dict    # rebuild src/dictionary.json from its sources
npm run build   # bundle the server and client halves into lib/
```

Dictionary sources, merged in this order:

1. `dshmarket_dict.json` — harvested pairs.
2. `UI_TRANSLATIONS` in `patch-plugins.py` — harvested pairs.
3. `src/dictionary.extra.json` — curated entries, merged last so they win.

Add or fix translations in `src/dictionary.extra.json`, then run
`npm run dict && npm run build`.

---

## License

MIT © [oiupoyt](https://git.oiupoyt.space/oiupoyt)
