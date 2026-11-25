import fs from "node:fs/promises";
import path from "node:path";

async function findFiles(directory) {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await findFiles(full));
    else result.push(full);
  }
  return result;
}
const files = await findFiles("test-results");
for (const [label, project, image] of [
  ["desktop-discover", "desktop", "screen-0.jpg"],
  ["mobile-discover", "mobile", "screen-0.jpg"],
  ["desktop-profile", "desktop", "screen-1.jpg"],
  ["desktop-membership", "desktop", "screen-6.jpg"],
  ["desktop-login", "desktop", "login.jpg"],
]) {
  const file = files.find((item) => item.includes(project) && item.endsWith(image));
  if (file) console.log("DT_PREVIEW_" + label + " " + await fs.readFile(file, "base64"));
}
