import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const name = "chinese2english";
export const inject = [];

export function apply(ctx: any) {
  // Automatically patch third-party plugins to native English on startup
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
