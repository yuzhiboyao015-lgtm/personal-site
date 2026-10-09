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

### Cloudflare（当前选定的方案）

站点已配置成**静态导出**（见 `next.config.ts` 的 `output: "export"`），并且带了 `wrangler.jsonc`
告诉 Cloudflare 产物在 `out/`。

> **注意**：Cloudflare 现在把 Pages 往 **Workers** 合并了，Dashboard 里点进
> Workers & Pages → Create 走的就是 Workers 流程（有 `Deploy command: npx wrangler deploy` 那一栏）。
> 这是对的，不用去找 Pages 入口——只要仓库里有 `wrangler.jsonc` 就行。

Dashboard 上创建项目时按下表填（仓库连 `personal-site`）：

| 字段 | 值 |
| --- | --- |
| Project name | `wangyao`（**必须和 `wrangler.jsonc` 里的 `name` 一致**） |
| Build command | `pnpm build` |
| Deploy command | `npx wrangler deploy`（默认值，不用改） |
| Preview command | `npx wrangler preview`（默认值，不用改） |
| 环境变量（可选） | `NODE_VERSION` = `22` |

连上之后，每次 `git push` 到 `main`，Cloudflare 会自动构建 + 部署。

**关键配置在 `wrangler.jsonc`**：

```jsonc
{
  "name": "wangyao",                    // 和 Dashboard 的项目名一致
  "assets": {
    "directory": "./out",               // Next 静态导出的产物目录
    "not_found_handling": "404-page"    // 用我们自己的 404 页面
  }
}
```

- 刻意**没有 `main` 字段**：本站没有任何 Worker 脚本，纯静态资源。
- 刻意**不用 `single-page-application` 模式**：本站是多页面静态站，SPA 模式会把不存在的地址
  一律返回 200 + 首页，对 SEO 是错的。

改完配置想本地验证（不会真的部署）：

```powershell
pnpm build
pnpm exec wrangler deploy --dry-run
```

看到 `Read N files from the assets directory .../out` 且无 error，就说明配置没问题。

### ⚠️ 依赖不能"太新"（Cloudflare 构建失败的常见原因）

Cloudflare 构建时执行 `pnpm install --frozen-lockfile`，而它的环境默认开启了 pnpm 的
`minimumReleaseAge` 策略（**24 小时**）：任何一个依赖的**发布时间晚于"现在 - 24 小时"**，
安装就会被拒绝，构建直接失败，报：

```
[ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION] N lockfile entries failed verification:
  wrangler@4.149.0 was published 2026-10-08T18:24:00Z, within the minimumReleaseAge cutoff
```

**所以升级依赖后、推送前，先跑一次审计**（会去 npm 逐个核对发布时间）：

```powershell
node scripts/audit-release-age.mjs
```

- 输出 `✅ 全部核实完毕` 才能推
- 输出 `❌ 有 N 个包太新` 就把那几个包**钉到更旧的版本**（去掉 `^`，写死版本号），
  重新 `pnpm install` 让锁文件同步，再跑一次审计

> 本机 pnpm 的 `minimumReleaseAge` 是 `0`（不检查），**所以本机能装成功不代表 Cloudflare 能装成功**——
> 这就是第一次部署失败的原因：`wrangler@4.149.0` 是当天刚发布的版本。
> 现在 `wrangler` 已钉死在 `4.148.0`（不加 `^`），别随手升它。

### ⚠️ 依赖的构建脚本必须显式放行（`pnpm-workspace.yaml`）

pnpm 10.3 起 `strictDepBuilds` **默认为 true**：只要有任何依赖带"未审核的构建脚本"，
`pnpm install` 就以非零退出码结束——

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@0.28.1, unrs-resolver@1.12.2, workerd@1.20261006.1
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

在 Cloudflare 上表现为 `Failed: error occurred while installing tools or dependencies`（第二次部署失败的原因）。

**本机很难发现这个问题**：`node_modules` 已存在时 pnpm 走缓存路径，不会报错；**只有全新安装才会触发**。
本地复现方式（也是推送前的推荐动作）：

```powershell
Remove-Item node_modules -Recurse -Force
pnpm install --frozen-lockfile      # 退出码必须是 0
```

修法写在 `pnpm-workspace.yaml` 的 `allowBuilds` 里（**值必须是布尔 `true`**）：

```yaml
allowBuilds:
  esbuild: true
  workerd: true
  unrs-resolver: true
```

- v11 已移除 `onlyBuiltDependencies` / `neverBuiltDependencies`，统一用 `allowBuilds`
- **不要**图省事用 `dangerouslyAllowAllBuilds: true`——那等于放行所有依赖（含未来的）的安装脚本
- 新增依赖如果带了构建脚本，pnpm 会自动往这个文件里追加**占位符**
  （`set this to true or false`），**占位符不算审核通过，安装照样失败**，要手动改成 `true`/`false`

绑定自己的域名：Cloudflare Dashboard → 该 Worker → Settings → Domains & Routes → Add → Custom domain。

> 为什么不用 Vercel：`*.vercel.app` 的默认域名在国内被 DNS 污染，自定义域名解析到 Vercel 也不稳。
> Cloudflare 的全球网络在国内可用性更好，且静态资源额度免费不限量。

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
