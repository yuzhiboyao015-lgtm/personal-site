"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate, readingTime, type Post } from "@/content/posts";
import { Icon } from "@/components/icons";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PostList({ posts }: { posts: Post[] }) {
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [posts]);

  const list = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  return (
    <div>
      {/* 标签筛选：加上 data 属性后想接 URL 参数也很容易 */}
      <div className="mb-10 flex flex-wrap gap-2">
        <FilterChip active={tag === null} onClick={() => setTag(null)}>
          全部
        </FilterChip>
        {tags.map((t) => (
          <FilterChip key={t} active={tag === t} onClick={() => setTag(t)}>
            {t}
          </FilterChip>
        ))}
      </div>

      <motion.ul layout className="flex flex-col">
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((post) => (
            <motion.li
              key={post.slug}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 border-t border-[var(--line)] py-7 transition-colors hover:border-[rgb(var(--glow)/0.45)] sm:flex-row sm:items-baseline sm:gap-8"
              >
                <time className="shrink-0 text-xs tracking-wide text-[var(--fg-dim)] sm:w-28">
                  {formatDate(post.date)}
                </time>
                <div className="flex-1">
                  <h2
                    className="text-lg font-medium tracking-tight transition-colors group-hover:text-[var(--accent)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {post.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--fg-muted)]">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-[0.7rem] tracking-wide text-[var(--fg-dim)]">
                    <span>{readingTime(post.body)} 分钟</span>
                    <span className="h-3 w-px bg-[var(--line)]" />
                    <span>{post.tags.join(" · ")}</span>
                  </div>
                </div>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--fg-dim)] transition-all duration-300 group-hover:translate-x-1 group-hover:border-[rgb(var(--glow)/0.6)] group-hover:text-[var(--accent)]">
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {list.length === 0 && (
        <p className="py-16 text-center text-sm text-[var(--fg-dim)]">
          这个标签下还没有文章。
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300 ${
        active
          ? "border-[rgb(var(--glow)/0.7)] bg-[rgb(var(--glow)/0.14)] text-[var(--fg)]"
          : "border-[var(--line)] text-[var(--fg-dim)] hover:border-[var(--line-strong)] hover:text-[var(--fg-muted)]"
      }`}
    >
      {children}
    </button>
  );
}
