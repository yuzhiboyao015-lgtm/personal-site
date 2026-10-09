"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // 挂载后再读，避免服务端和客户端渲染结果不一致
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* 隐私模式下 localStorage 可能不可用，忽略即可 */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "切换到亮色" : "切换到暗色"}
      title={theme === "dark" ? "亮色" : "暗色"}
      className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--fg-muted)] transition-all duration-300 hover:rotate-12 hover:border-[rgb(var(--glow)/0.6)] hover:text-[var(--accent)]"
    >
      <Icon name={theme === "dark" ? "moon" : "sun"} />
    </button>
  );
}
