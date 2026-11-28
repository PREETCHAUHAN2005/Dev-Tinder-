import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { parse } from "espree";

const root = process.cwd();
const base = execFileSync("git", ["merge-base", "HEAD", process.argv[2] || "origin/main"], { encoding: "utf8" }).trim();
const readBase = (file) => execFileSync("git", ["show", base + ":devtinder-frontend/" + file], { encoding: "utf8" });
function contracts(source) {
  const results = [];
  const ast = parse(source, { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true }, range: true });
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === "CallExpression") {
      const object = node.callee?.object?.name;
      const method = node.callee?.property?.name;
      if ((object === "axios" && ["get", "post", "patch"].includes(method)) ||
          (["socket", "rzp"].includes(object) && ["emit", "on", "disconnect"].includes(method)) ||
          node.callee?.name === "dispatch") {
        results.push(source.slice(...node.range).replace(/\s+/g, " ").trim());
      }
    }
    if (node.type === "VariableDeclarator" && node.id?.name === "options" && node.init?.type === "ObjectExpression") {
      results.push("checkout: " + source.slice(...node.init.range).replace(/\s+/g, " ").trim());
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === "range") continue;
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object") walk(value);
    }
  }
  walk(ast);
  return results.sort();
}
const components = ["Body", "Navbar", "Feed", "UserCard", "Login", "EditProfile", "Connections", "Requests", "Chat", "Premium"];
for (const name of components) {
  const file = "src/components/" + name + ".jsx";
  assert.deepEqual(contracts(await fs.readFile(path.join(root, file), "utf8")), contracts(readBase(file)), file + ": request, dispatch, socket, or checkout contract changed");
}
for (const file of ["appStore.js", "constants.js", "userSlice.js", "feedSlice.js", "connectionSlice.js", "requestSlice.js"]) {
  const relative = "src/utils/" + file;
  assert.equal(await fs.readFile(path.join(root, relative), "utf8"), readBase(relative), relative + " must remain unchanged");
}
const routePaths = (source) => [...source.matchAll(/<Route\s+path="([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(routePaths(await fs.readFile("src/App.jsx", "utf8")), routePaths(readBase("src/App.jsx")), "Existing routes must be preserved");
console.log("Verified unchanged API arguments, dispatches, socket handlers, checkout options, Redux modules, API URL, and route paths against " + base);
