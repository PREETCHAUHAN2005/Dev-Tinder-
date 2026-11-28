import { ESLint } from "eslint";
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const base = execFileSync("git", ["merge-base", "HEAD", process.argv[2] || "origin/main"], { encoding: "utf8" }).trim();
const eslint = new ESLint();
const current = await eslint.lintFiles(["src", "vite.config.js", "eslint.config.js"]);
const baseline = [];
for (const result of current) {
  const file = path.relative(process.cwd(), result.filePath).replaceAll("\\", "/");
  let content = "";
  try { content = execFileSync("git", ["show", base + ":devtinder-frontend/" + file], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch { /* New file: baseline has no diagnostics. */ }
  baseline.push(...await eslint.lintText(content, { filePath: result.filePath }));
}
const counts = (results) => {
  const map = new Map();
  for (const result of results) {
    const file = path.relative(process.cwd(), result.filePath).replaceAll("\\", "/");
    for (const message of result.messages) {
      const key = file + " | " + (message.ruleId || "parse") + " | " + message.severity;
      map.set(key, (map.get(key) || 0) + 1);
    }
  }
  return map;
};
const before = counts(baseline);
const after = counts(current);
const regressions = [...after].filter(([key, count]) => count > (before.get(key) || 0));
await fs.mkdir("test-results", { recursive: true });
await fs.writeFile("test-results/lint-comparison.json", JSON.stringify({ base, baseline, current }, null, 2));
console.log("ESLint findings: baseline=" + baseline.reduce((n, r) => n + r.messages.length, 0) + ", current=" + current.reduce((n, r) => n + r.messages.length, 0));
if (regressions.length) {
  console.error("New lint findings:", regressions);
  process.exitCode = 1;
} else {
  console.log("No new lint findings. Existing findings are retained in the report.");
}
