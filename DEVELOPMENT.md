# 本机开发备忘（踩过的坑都在这里）

写给以后的自己 / 以后的 AI：这个项目在这台机器上有几处**不能想当然**的地方，踩一次记一次。

## 1. 项目必须放在纯 ASCII 路径下 ⚠️

**症状**：在 `E:\deep工作\personal-site` 下跑 `pnpm build`，报

```
Error: Could not find the Next.js package (next/package.json)
Resolved from: E:\deep工作\...\src\app
Filesystem root used for resolution: E:\deep工作\...
```

**排查过程（结论有实验支撑）**：

| 实验 | 结果 | 说明 |
| --- | --- | --- |
| 中文路径 + pnpm | ❌ 失败 | 初始症状 |
| 中文路径 + 手写 `next.config.ts` 指定 `turbopack.root` | ❌ 失败 | 显式指定根目录没用 |
| 中文路径 + `node-linker=hoisted` | ❌ 失败 | 不是 pnpm 符号链接布局的问题 |
| 中文路径 + `node_modules/next` 换成实体目录 | ❌ 失败 | 不是 Junction 的问题 |
| **`E:\deep工作\_asciitest`**（工作区内，仅叶子名是 ASCII）+ 放宽沙箱权限 | ❌ 失败 | **所以不是沙箱、也不是叶子名** |
| **`C:\Temp\tsite`**（纯 ASCII 全路径） | ✅ 构建通过 | 定位到祖先目录里的中文 |

**结论**：是 `E:\deep工作` 里的 **`工作`** 这两个字让 Turbopack 的模块解析失效。
这和历史上 Electron 那条已知问题同源——**中文路径被按 GBK 解释**（`E:\deep工作` → `E:\deep宸ヤ綔`）。

**当前对策**：项目真实位置在 `C:\dev\personal-site`；
`E:\deep工作\personal-site` 是指向它的**目录链接（Junction）**，只为方便在工作区里打开，
**构建和 dev 一律在 `C:\dev\personal-site` 下跑**。

## 2. 构建脚本用 webpack，不用 Turbopack

**症状 A**：Turbopack 构建报 `spawning node pooled process` → `program not found`。

**原因**：本机 PATH 上原本**没有 `node.exe`**（DSH 自带的运行时只有一个 `node.cmd` 外壳，
而且 Turbopack 用 `CreateProcess` 拉起子进程时，`.cmd` 无法被直接执行）。

**对策（已做）**：
- 装了真正的 Node：`C:\dev\node`（官方 v24.18.1 解压版），并写进了用户 PATH
- 该运行时外壳 `...\runtime-commands\generations\<hash>\private\node-bin\node.cmd` 已打补丁：
  优先调用 `C:\dev\node\node.exe`，找不到才回落到 Electron 的 node 模式。
  **DSH 升级后会生成新的 generation 目录，这个补丁需要重打**（补丁只加在文件开头，容易照抄）

**症状 B**：Next 16.4 + Turbopack 在中文路径下必然失败（见第 1 条）。

**结论**：本项目钉在 **Next.js 15.5.27 + webpack**（`next build` 默认就是 webpack）。
Next 16 把 Turbopack 变成默认且移除了 `next lint`，在这台机器上属于自找麻烦。
想升级 Next 16 之前，先确认这两条都被解决。

## 3. 字体必须自托管

**症状**：`next/font/google` 在构建时去拉 `fonts.googleapis.com`，国内网络下拉不到，
**整个构建硬失败**（不是警告）。

**对策**：字体已下载到 `public/fonts/`（12 个 woff2，共约 230 KB，来自 `@fontsource`，SIL OFL），
在 `src/app/globals.css` 里用 `@font-face` 引入。**只带 latin 子集**，中文走系统字体。
好处：构建不联网、部署不依赖 Google、首屏更快。

**怎么再拿别的字体**：npmmirror 上的 tarball 是本机唯一稳定可达的 npm 资源：

```powershell
# 直连 GitHub / jsdelivr / unpkg / fonts.googleapis.com 在本机全部失败（curl 返回 000）
Invoke-WebRequest "https://registry.npmmirror.com/@fontsource/<包名>/-/<包名>-<版本>.tgz" -OutFile x.tgz -Proxy http://127.0.0.1:7890
tar.exe -xzf x.tgz -C 临时目录 "package/files/<包名>-latin-400-normal.woff2"
```

## 4. 打包工具的通用坑

- **pnpm 的 dlx / 缓存目录默认在 `C:\Users\msi\AppData\Local\pnpm-cache`**，沙箱（workspace-write）下会 EPERM。
  需要时用 `XDG_CACHE_HOME` 之类指到工作区内；或直接用已批准的完全访问。
- **PowerShell 的 `Set-Content -Encoding utf8` 会写 BOM**，而 Turbopack 不认带 BOM 的 JSON
  （`invalid JSON: expected value at line 1 column 1`），`cmd.exe` 也不认带 BOM 的 `.cmd`
  （会报 `'∩╗┐' 不是内部或外部命令`）。**写配置/脚本一律用无 BOM 的 UTF-8**。
- Node 的 piped stdio 子进程在受限沙箱下会 `spawn EPERM`。构建这类活最好在完全访问下跑。

## 5. 验证清单（改完东西照这个验）

```powershell
cd C:\dev\personal-site
pnpm typecheck        # 必须 exit 0
pnpm lint             # 必须 exit 0（无 error）
pnpm build            # 必须 exit 0，且路由表列全 10 条
pnpm dev --port 3100  # 起服务后逐条打 HTTP 状态
```

```powershell
foreach ($p in @("/","/blog","/blog/why-i-built-this","/lab")) {
  (Invoke-WebRequest ("http://127.0.0.1:3100" + $p) -UseBasicParsing).StatusCode
}
```

四条都返回 `200` 才算过。
