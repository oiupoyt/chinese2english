import { execSync } from "node:child_process";

console.log("Building server backend...");
execSync("npx esbuild src/index.ts --outfile=lib/index.js --platform=node --format=esm --target=node20 --sourcemap", { stdio: "inherit" });

console.log("Building client frontend bundle...");
const banner = 'window.__ModuleLoader__.load({ id: "dsh-plugin-english", factory: (require) => { var module = { exports: {} }; var exports = module.exports;';
const footer = 'return module.exports; } });';
execSync(`npx esbuild src/client/index.ts --outfile=lib/client.js --platform=browser --format=cjs --target=es2022 --bundle --banner:js='${banner}' --footer:js='${footer}' --sourcemap`, { stdio: "inherit" });

console.log("Build complete!");
