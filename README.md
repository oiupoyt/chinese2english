# chinese2english

> Universal English translation patch for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) third-party plugins.

Automatically intercepts and translates Chinese UI strings, buttons, dialogs, and labels in third-party community plugins (like `@michengai/dsh-skills-manager`, model routers, etc.) into clean English in real-time.

---

## The Problem It Solves

Most DeepSeek Harness community plugins are authored in Chinese with either missing English dictionaries or hardcoded Chinese strings inside their React components. Even when your DSH interface is set to English, those plugins remain in Chinese.

**`chinese2english`** fixes this globally across all your installed plugins using an intelligent real-time translation observer and comprehensive technical DSH dictionary.

---

## Features

- **Real-Time DOM Translation:** Detects dynamically mounted modals, tabs, dialogs, and tooltips and translates Chinese text on the fly.
- **DSH Locale Integration:** Intercepts DSH's `ctx.locale` to provide English fallbacks for untranslated namespaces.
- **Preserves Code Blocks:** Intelligently ignores `<pre>`, `<code>`, inputs, and script tags so actual code and user inputs are never modified.
- **Zero Configuration:** Works automatically out-of-the-box upon installation.

---

## Installation

Install directly with the official DSH CLI:

```bash
dsh plugin --profile web add chinese2english
```

*(To remove later: `dsh plugin --profile web remove chinese2english`)*

---

## License

MIT © [oiupoyt](https://git.oiupoyt.space/oiupoyt)
