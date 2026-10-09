import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatDate,
  getPost,
  posts,
  readingTime,
  sortedPosts,
} from "@/content/posts";
import { PostBody } from "@/components/post-renderer";
import { ReadingProgress, TableOfContents } from "@/components/post-aside";
import { Icon } from "@/components/icons";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "文章不存在" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = sortedPosts.findIndex((p) => p.slug === post.slug);
  const prev = sortedPosts[index + 1];
  const next = sortedPosts[index - 1];

  return (
    <>
      <ReadingProgress />

      <article className="pt-32 pb-16 sm:pt-40">
        <div className="container-page">
          <div className="grid gap-16 xl:grid-cols-[minmax(0,1fr)_200px]">
            <div className="mx-auto w-full max-w-2xl xl:mx-0">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs text-[var(--fg-dim)] transition-colors hover:text-[var(--accent)]"
              >
                <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" />
                返回文章列表
              </Link>

              <header className="mt-8 border-b border-[var(--line)] pb-8">
                <div className="flex flex-wrap items-center gap-3 text-xs tracking-wide text-[var(--fg-dim)]">
                  <time>{formatDate(post.date)}</time>
                  <span className="h-3 w-px bg-[var(--line)]" />
                  <span>{readingTime(post.body)} 分钟阅读</span>
                </div>
                <h1
                  className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {post.title}
                </h1>
                <p className="mt-5 leading-relaxed text-[var(--fg-muted)]">{post.excerpt}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--line)] px-2.5 py-1 text-[0.7rem] text-[var(--fg-dim)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </header>

              <PostBody source={post.body} />

              {/* 上一篇 / 下一篇 */}
              <nav className="mt-16 grid gap-3 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
                {prev ? (
                  <Link
                    href={`/blog/${prev.slug}`}
                    className="surface group p-5 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <span className="eyebrow">上一篇</span>
                    <p className="mt-2 text-sm font-medium transition-colors group-hover:text-[var(--accent)]">
                      {prev.title}
                    </p>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link
                    href={`/blog/${next.slug}`}
                    className="surface group p-5 text-right transition-transform duration-300 hover:-translate-y-1"
                  >
                    <span className="eyebrow">下一篇</span>
                    <p className="mt-2 text-sm font-medium transition-colors group-hover:text-[var(--accent)]">
                      {next.title}
                    </p>
                  </Link>
                )}
              </nav>
            </div>

            <aside className="hidden xl:block">
              <div className="sticky top-28">
                <TableOfContents />
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
