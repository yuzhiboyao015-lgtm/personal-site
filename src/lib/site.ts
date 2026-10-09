/**
 * 站点总配置 —— 改这里就够了，别去动组件。
 *
 * TODO(你)：把 name / role / bio / socials 换成你自己的。
 * 留空的地方我会在页面上显示成占位文案，方便你先看效果。
 */
export const site = {
  /** 站点 URL。部署到 Vercel 后换成你的正式域名，例如 https://example.com */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",

  /** 你的名字 / 昵称 */
  name: "你的名字",

  /** 英文名或 ID，用于 Logo 和页脚 */
  handle: "yourname",

  /** 一句话头衔 */
  role: "学生 · 折腾前端与 AI 工具",

  /** 首页 Hero 的自我介绍，两三句就好，别写成简历 */
  bio: [
    "我在折腾浏览器里会动的东西：交互动效、3D 场景，以及各种把想法直接变成页面的工具。",
    "这里放我的作品、一些写给自己看的文章，还有一个专门用来试坏点子的实验室。",
  ],

  /** 页脚/联系区显示。不需要的删掉即可 */
  email: "you@example.com",

  /** 社交链接：icon 可用 "github" | "mail" | "rss" | "link" */
  socials: [
    { label: "GitHub", href: "https://github.com/yourname", icon: "github" as const },
    { label: "Email", href: "mailto:you@example.com", icon: "mail" as const },
  ],

  /** 顶部导航 */
  nav: [
    { label: "作品", href: "/#work" },
    { label: "文章", href: "/blog" },
    { label: "实验室", href: "/lab" },
    { label: "关于", href: "/#about" },
  ],
} as const;

export type Social = (typeof site.socials)[number];
