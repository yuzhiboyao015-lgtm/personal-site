/**
 * 本地预览静态导出产物（out/），用来在部署前确认真实构建结果没问题。
 *
 * 用法：pnpm build && pnpm serve   →  http://localhost:4173
 *
 * 为什么不用 `npx serve`：本机网络拉包麻烦，而 Node 自带 http 模块足够干这件事。
 * 行为对齐 Cloudflare Pages：目录请求找 index.html，找不到就回 404.html。
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const ROOT = resolve(process.cwd(), "out");
const PORT = Number(process.env.PORT ?? 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

/** 把 URL 路径映射到 out/ 里的真实文件；目录则找 index.html */
async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const relative = normalize(clean).replace(/^([/\\])+/, "");
  if (relative.includes("..")) return null;

  const candidates = [
    join(ROOT, relative),
    join(ROOT, relative, "index.html"),
    join(ROOT, `${relative}.html`),
  ];

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      /* 继续试下一个 */
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const urlPath = req.url ?? "/";
  const file = await resolveFile(urlPath);

  if (!file) {
    try {
      const notFound = await readFile(join(ROOT, "404.html"));
      res.writeHead(404, { "content-type": MIME[".html"] });
      res.end(notFound);
    } catch {
      res.writeHead(404, { "content-type": MIME[".txt"] });
      res.end("404");
    }
    return;
  }

  const body = await readFile(file);
  const type = MIME[extname(file).toLowerCase()] ?? "application/octet-stream";
  // 带 hash 的构建产物可以长缓存，HTML 不缓存
  const cache = file.endsWith(".html") ? "no-cache" : "public, max-age=31536000, immutable";
  res.writeHead(200, { "content-type": type, "cache-control": cache });
  res.end(body);
});

server.listen(PORT, () => {
  console.log(`静态预览: http://localhost:${PORT}  (root: ${ROOT})`);
});
