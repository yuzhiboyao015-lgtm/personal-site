import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 静态导出：`next build` 会把整站输出到 `out/`，纯 HTML/JS/CSS，不需要 Node 服务器。
   * 为什么这么做：
   *   - Cloudflare Pages / 任何静态托管都能直接吃，白嫖无限带宽
   *   - 部署零冷启动、零运行时费用、也不会有"函数超时"这类破事
   * 副作用（目前都不影响我们）：
   *   - 不能用 next/image 的默认优化器 → 图片自己压缩好再放进 public/
   *   - 不能有 Route Handler / Server Action / 中间件
   *   - 每篇文章要能静态生成（我们的 posts 是本地数据，天然满足）
   */
  output: "export",

  /** 静态导出时，/blog/xxx 会输出成 blog/xxx/index.html，URL 不带 .html 后缀 */
  trailingSlash: true,

  /** 构建时不做图片优化（静态导出要求） */
  images: { unoptimized: true },
};

export default nextConfig;
