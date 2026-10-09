"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 顶部的阅读进度条
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 路由变化时收起移动端菜单
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 菜单开着的时候锁住滚动
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <>
      {/* 滚动进度：一条从头划到尾的光 */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-[var(--accent-3)] via-[var(--accent)] to-[var(--accent-2)]"
      />

      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav className="container-page flex h-16 items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--line-strong)] bg-[rgb(var(--glow)/0.12)] text-[var(--accent)] transition-transform duration-300 group-hover:rotate-[12deg]">
              <Icon name="spark" className="h-4 w-4" />
            </span>
            <span style={{ fontFamily: "var(--font-display)" }}>{site.handle}</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm text-[var(--fg-muted)] transition-colors hover:bg-[rgb(var(--glow)/0.08)] hover:text-[var(--fg)]"
              >
                {item.label}
              </Link>
            ))}
            <span className="mx-1 h-5 w-px bg-[var(--line)]" />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "关闭菜单" : "打开菜单"}
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--fg)]"
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </nav>
      </header>

      {/* 移动端全屏菜单 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-30 bg-[color-mix(in_srgb,var(--bg)_96%,transparent)] pt-20 backdrop-blur-xl md:hidden"
          >
            <div className="container-page flex flex-col">
              {site.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-between border-b border-[var(--line)] py-5 text-2xl font-medium"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.label}
                    <Icon name="arrow" className="h-5 w-5 text-[var(--fg-dim)]" />
                  </Link>
                </motion.div>
              ))}
              <p className="pt-8 text-xs text-[var(--fg-dim)]">
                © {new Date().getFullYear()} {site.name}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
