# chinese2english

> Renders Chinese UI text in [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) third-party plugins as English.

Most community plugins ship hardcoded Chinese, and the interface language setting
does not reach it. This plugin rewrites that text server-side, before any of it
reaches the browser.

---

## How it works

The text arrives by two routes, so there are two seams.

**Plugin bundles.** `clientModules` serves every plugin bundle over
`/plugins/...`. Wrapping `clientModules.bundleResource` decodes each JavaScript
response, rewrites the Chinese string literals it can translate, and returns the
result. One interception covers every plugin, including combination bundles that
carry dozens, and it runs before any plugin code is evaluated.

**API copy.** Plugin descriptors, model and provider names, and settings
descriptions never appear in bundles at all: they reach the browser as JSON over
`/api`. The gateway resolves its own `dispatchRpc` per request, so overriding
that instance method intercepts those responses without claiming the interceptor
slot the gateway already owns.

Three deliberate choices:

- **All-or-nothing literals.** Chinese has no word boundaries, so replacing known
  words wherever they appear corrupts larger words (`当前工作区` would become
  `Saat IniWorkspace`). A literal is translated only when every Chinese character
  in it is covered by a dictionary entry; anything else is left in Chinese, since
  half-translated text reads worse than untranslated text.
- **A compile gate.** Each rewritten bundle is parsed with `new Function` before
  it is served. If a rewrite ever produced invalid JavaScript, the original bytes
  are served instead, so a bad dictionary entry cannot break the UI.
- **An endpoint allowlist.** Only endpoints returning server-authored copy are
  rewritten. `/api/session/list`, for example, returns your own prompts and
  transcripts, and is left untouched.

Where an author already wrote English, that English is used rather than the
dictionary: locale maps (`{ zh, en }`) resolve to the English sibling, and
bilingual descriptors joined by ` · ` keep their English half.

The client half does one thing: it selects the `en` locale through
`ctx.locale.setLocale`, which persists the preference. It never touches the DOM.

---

## What it does not cover

- Text rendered inside an `<img>`, canvas, or other non-text payload.
- Content fetched from a third-party server at runtime (announcements, remote
  catalogs) rather than from DSH itself.
- The long tail of one-off strings the dictionary does not yet cover.

The shipped dictionary holds roughly 1,570 entries. Coverage is concentrated on
strings that appear repeatedly; rare one-off sentences are usually left in
Chinese, which is why the all-or-nothing rule matters.


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

Dictionary sources, merged in this order (later wins):

1. `dshmarket_dict.json` — harvested pairs.
2. `UI_TRANSLATIONS` in `patch-plugins.py` — harvested pairs.
3. `src/dictionary.extra.json` — curated entries.
4. `locale-pairs.json` — author-written `{ zh, en }` pairs lifted from plugin
   locale maps; highest quality, so it overrides everything above.

Add or fix translations in `src/dictionary.extra.json`, then run
`npm run dict && npm run build`.

---

## License

MIT © [oiupoyt](https://git.oiupoyt.space/oiupoyt)
