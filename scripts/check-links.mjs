import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

function targetFile(pathname) {
  const cleanPath = decodeURIComponent(pathname).replace(/^\//, "");
  if (!cleanPath) return join(dist, "index.html");
  if (extname(cleanPath)) return join(dist, cleanPath);
  return join(dist, cleanPath.replace(/\/$/, ""), "index.html");
}

const failures = [];
const htmlFiles = filesIn(dist).filter((file) => file.endsWith(".html"));

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, "utf8");
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const url = new URL(match[1], "https://seek.venturiane.com");
    const target = targetFile(url.pathname);
    if (!existsSync(target)) {
      failures.push(`${relative(dist, htmlFile)} -> ${match[1]}`);
      continue;
    }
    if (url.hash && target.endsWith(".html")) {
      const targetHtml = readFileSync(target, "utf8");
      const id = decodeURIComponent(url.hash.slice(1));
      if (!targetHtml.includes(`id="${id}"`))
        failures.push(`${relative(dist, htmlFile)} -> missing #${id}`);
    }
  }
}

if (failures.length) {
  throw new Error(`Broken internal links:\n${failures.join("\n")}`);
}

console.log(`Checked internal links in ${htmlFiles.length} generated pages.`);
