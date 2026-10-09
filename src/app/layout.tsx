import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CursorGlow } from "@/components/cursor-glow";
import "./globals.css";

// 字体走 globals.css 里的 @font-face 自托管，见那里的说明

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.bio[0],
  keywords: ["个人网站", "作品集", "前端", "交互", "3D", "WebGL"],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · ${site.role}`,
    description: site.bio[0],
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.role}`,
    description: site.bio[0],
  },
};

export const viewport: Viewport = {
  themeColor: "#04070f",
  colorScheme: "dark light",
};

/**
 * 这段脚本在页面渲染前跑，用来把上次选的主题恢复回去。
 * 没有它的话，选了亮色的人每次刷新都会先闪一下暗色（FOUC）。
 */
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="dark";}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="bg-grain antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          跳到主内容
        </a>

        <CursorGlow />
        <Nav />

        <main id="main" className="relative">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
