"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/** 文章页顶部的阅读进度 + 右侧自动生成的小目录 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-[var(--accent-3)] via-[var(--accent)] to-[var(--accent-2)]"
    />
  );
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState("");

  // 从正文里抓出 h2，临时加 id 当作锚点
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLHeadingElement>(".prose-post h2"));
    const items = nodes.map((node, i) => {
      const id = `section-${i + 1}`;
      node.id = id;
      return { id, text: node.textContent ?? "" };
    });
    setHeadings(items);
  }, []);

  // 滚动时高亮当前章节
  useEffect(() => {
    if (headings.length === 0) return;
    const onScroll = () => {
      let current = headings[0].id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 160) current = h.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="目录" className="hidden text-sm xl:block">
      <p className="eyebrow mb-4">目录</p>
      <ul className="space-y-1 border-l border-[var(--line)]">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l-2 py-1.5 pl-4 transition-colors ${
                active === h.id
                  ? "border-[var(--accent)] text-[var(--fg)]"
                  : "border-transparent text-[var(--fg-dim)] hover:text-[var(--fg-muted)]"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
