import { execSync } from "node:child_process";

// --bundle inlines src/dictionary.json into the server output, so lib/ is the
// only thing that has to ship.
console.log("Building server backend...");
execSync(
  "npx esbuild src/index.ts --outfile=lib/index.js --platform=node --format=esm --target=node20 --bundle --sourcemap",
  { stdio: "inherit" },
);

console.log("Building client frontend bundle...");
const banner = 'window.__ModuleLoader__.load({ id: "chinese2english", factory: (require) => { var module = { exports: {} }; var exports = module.exports;';
const footer = 'return module.exports; } });';
execSync(
  `npx esbuild src/client/index.ts --outfile=lib/client.js --platform=browser --format=cjs --target=es2022 --bundle --banner:js='${banner}' --footer:js='${footer}' --sourcemap`,
  { stdio: "inherit" },
);

console.log("Build complete!");
