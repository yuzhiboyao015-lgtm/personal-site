import Link from "next/link";
import { formatDate, sortedPosts } from "@/content/posts";
import { Icon } from "@/components/icons";
import { Reveal, RevealGroup, RevealItem, WordReveal } from "@/components/motion-primitives";

export function Writing({ limit = 3 }: { limit?: number }) {
  const recent = sortedPosts.slice(0, limit);

  return (
    <section id="writing" className="scroll-mt-24 py-24">
      <div className="container-page">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">最近在写</p>
              <h2
                className="text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <WordReveal text="写下来的东西" />
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--accent)]"
            >
              全部文章
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <RevealGroup className="flex flex-col">
          {recent.map((post) => (
            <RevealItem key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 border-t border-[var(--line)] py-7 transition-colors hover:border-[rgb(var(--glow)/0.45)] sm:flex-row sm:items-baseline sm:gap-8"
              >
                <time className="shrink-0 text-xs tracking-wide text-[var(--fg-dim)] sm:w-28">
                  {formatDate(post.date)}
                </time>
                <div className="flex-1">
                  <h3
                    className="text-lg font-medium tracking-tight transition-colors group-hover:text-[var(--accent)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {post.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--fg-muted)]">
                    {post.excerpt}
                  </p>
                </div>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--fg-dim)] transition-all duration-300 group-hover:translate-x-1 group-hover:border-[rgb(var(--glow)/0.6)] group-hover:text-[var(--accent)]">
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
