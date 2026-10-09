# personal-site

个人网站：作品集 + 博客 + 交互实验场。有动效、有 3D，静态导出、能直接丢到 Vercel / Cloudflare Pages。

- **技术栈**：Next.js 15（App Router，webpack 构建）· React 19 · TypeScript · Tailwind CSS v4 · motion（原 Framer Motion）· three.js + React Three Fiber
- **构建产物**：全静态（10 条路由预渲染），不需要服务器、不需要数据库
- **字体**：自托管 woff2（`public/fonts/`，约 230 KB），构建时不联网

## 快速开始

```powershell
cd C:\dev\personal-site
pnpm install
pnpm dev          # http://localhost:3000
```

其他命令：

```powershell
pnpm build        # 生产构建
pnpm start        # 跑构建产物
pnpm typecheck    # TypeScript 检查
pnpm lint         # ESLint
```

> ⚠️ 这个项目**必须放在纯 ASCII 路径下**（现在是 `C:\dev\personal-site`）。
> 放在含中文的目录里（例如 `E:\deep工作\...`）会让 Next 的构建报
> `Could not find the Next.js package`。原因和排查过程见 `DEVELOPMENT.md`。
> 工作区里的 `E:\deep工作\personal-site` 是指向这里的目录链接，方便打开，但**构建请用 `C:\dev\personal-site`**。

## 我要改哪里？

| 想改什么 | 改哪个文件 |
| --- | --- |
| 名字、头衔、自我介绍、邮箱、社交链接、导航 | `src/lib/site.ts` |
| 作品列表 | `src/content/projects.ts` |
| 文章 | `src/content/posts.ts`（写在数组里，支持 `##` 标题、`-` 列表、`>` 引用、代码块、`**粗体**`、`` `行内代码` ``） |
| 配色、字体栈 | `src/app/globals.css` 顶部的 CSS 变量（`--accent` 等） |
| 首页各区块的顺序 / 要不要显示 | `src/app/page.tsx` |
| 实验场里的 demo | `src/app/lab/page.tsx` + `src/components/lab/` |
| 头像 / 图片 | 丢进 `public/`，用绝对路径引用，例如 `/me.jpg` |

`TODO(你)` 搜一下就能找到所有需要替换的占位内容。

## 目录结构

```
src/
├── app/
│   ├── layout.tsx          根布局：元数据、主题引导脚本、导航与页脚
│   ├── globals.css         设计变量 + @font-face + 组件类 + 动画关键帧
│   ├── page.tsx            首页：Hero → 作品 → 文章 → 关于
│   ├── blog/page.tsx       文章列表（带标签筛选）
│   ├── blog/[slug]/page.tsx 文章详情（阅读进度、自动目录、上下篇）
│   ├── lab/page.tsx        实验室
│   ├── not-found.tsx       404
│   └── icon.svg            favicon
├── components/
│   ├── nav.tsx             固定导航 + 滚动进度条 + 移动端全屏菜单
│   ├── hero.tsx            首屏动效
│   ├── work.tsx            作品卡片
│   ├── writing.tsx         文章列表（首页用）
│   ├── about.tsx           关于
│   ├── footer.tsx          页脚
│   ├── motion-primitives.tsx  复用的入场/级联/逐字动效
│   ├── cursor-glow.tsx     鼠标跟随光晕
│   ├── theme-toggle.tsx    亮暗切换
│   ├── post-list.tsx       文章列表 + 标签筛选
│   ├── post-renderer.tsx   极简 Markdown 渲染
│   ├── post-aside.tsx      阅读进度 + 目录
│   └── lab/                3D 粒子场景、点阵涟漪
├── content/                内容数据（作品、文章）
└── lib/site.ts             站点配置
```

## 部署

### Cloudflare Pages（当前选定的方案）

站点已配置成**静态导出**（见 `next.config.ts` 的 `output: "export"`），构建产物是纯 HTML，静态托管直接吃。

Web 端配置（Cloudflare Dashboard → Workers & Pages → Create → Pages → 连接 Git 仓库）：

| 项 | 值 |
| --- | --- |
| Framework preset | `Next.js (Static HTML Export)` |
| Build command | `pnpm build` |
| Build output directory | `out` |
| 环境变量 | `NODE_VERSION` = `22` |
| 环境变量（可选） | `NEXT_PUBLIC_SITE_URL` = `https://你的域名` |

部署完成后会先拿到一个 `xxx.pages.dev` 的免费域名，能马上访问。绑定自己的域名：
Pages 项目 → Custom domains → 输入域名 → 按提示加 DNS 记录（域名托管在 Cloudflare 的话是一键）。

> 为什么不用 Vercel：`*.vercel.app` 的默认域名在国内被 DNS 污染，自定义域名解析到 Vercel 也不稳。
> Cloudflare 的全球网络在国内可用性更好，且 Pages 免费额度是无限带宽。

### 本地预览构建产物

```powershell
pnpm build
pnpm serve     # 静态服务器跑在 http://localhost:4173
```

### 推 GitHub

```powershell
cd C:\dev\personal-site
git add -A
git commit -m "feat: ..."
git remote add origin https://github.com/<用户名>/personal-site.git   # 只需一次
git push -u origin main
```

本机直连 GitHub 会失败，推送要带代理：

```powershell
git -c http.sslBackend=openssl -c http.proxy=http://127.0.0.1:7890 push -u origin main
```

## 许可

字体来自 [@fontsource](https://fontsource.org/)（Inter / Space Grotesk / JetBrains Mono），均为 SIL Open Font License，可自由用于商用项目。
