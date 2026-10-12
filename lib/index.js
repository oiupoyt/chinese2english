import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const name = "chinese2english";
const inject = [];
function apply(ctx) {
  try {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const scriptPath = join(currentDir, "..", "patch-plugins.py");
    const child = spawn("python3", [scriptPath], { stdio: "ignore" });
    child.on("close", (code) => {
      console.log(`[chinese2english] Plugin patcher settled (exit ${code}).`);
    });
  } catch (err) {
    console.error("[chinese2english] Plugin patcher error:", err);
  }
}
export {
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
