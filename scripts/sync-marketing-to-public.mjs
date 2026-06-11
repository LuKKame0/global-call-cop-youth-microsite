import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "sites", "marketing");
const TARGET = path.join(ROOT, "public", "marketing");

const TEXT_EXTENSIONS = new Set([".html", ".css", ".js"]);

function rewriteMarketingPaths(content) {
  const origin = (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://theglobalcall.org"
  );

  return content
    .replace(/href="\.\/build-the-future\.html"/g, 'href="/buildthefuture"')
    .replace(/href="\.\/index\.html"/g, 'href="/"')
    .replace(/"\.\/assets\//g, '"/marketing/assets/')
    .replace(/'\.\/assets\//g, "'/marketing/assets/")
    .replace(/href="\.\//g, 'href="/marketing/')
    .replace(/src="\.\//g, 'src="/marketing/')
    .replace(/https:\/\/youthframework\.theglobalcall\.org\/framework/g, `${origin}/insights`)
    .replace(/https:\/\/youthframework\.theglobalcall\.org\/faq/g, `${origin}/faq`)
    .replace(/https:\/\/youthframework\.theglobalcall\.org\/?/g, `${origin}/insights`);
}

function copyEntry(relativePath) {
  const sourcePath = path.join(SOURCE, relativePath);
  const targetPath = path.join(TARGET, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  const extension = path.extname(relativePath).toLowerCase();

  // vendor/ holds third-party bundles (three.js) — copy verbatim, never rewrite
  if (relativePath.split(path.sep)[0] === "vendor") {
    fs.copyFileSync(sourcePath, targetPath);
    return;
  }

  if (TEXT_EXTENSIONS.has(extension)) {
    const content = fs.readFileSync(sourcePath, "utf8");
    fs.writeFileSync(targetPath, rewriteMarketingPaths(content), "utf8");
    return;
  }

  fs.copyFileSync(sourcePath, targetPath);
}

function walk(relativeDir = "") {
  const absoluteDir = path.join(SOURCE, relativeDir);
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });

  for (const entry of entries) {
    const nextRelative = path.join(relativeDir, entry.name);

    if (entry.name === "api" || entry.name === "vercel.json" || entry.name === ".env.example") {
      continue;
    }

    if (entry.isDirectory()) {
      walk(nextRelative);
      continue;
    }

    copyEntry(nextRelative);
  }
}

if (!fs.existsSync(SOURCE)) {
  console.error("[sync-marketing] Missing source directory:", SOURCE);
  process.exit(1);
}

fs.rmSync(TARGET, { recursive: true, force: true });
fs.mkdirSync(TARGET, { recursive: true });
walk("");
console.info("[sync-marketing] Synced sites/marketing → public/marketing");
