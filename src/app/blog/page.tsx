import type { Metadata } from "next";
import { sortedPosts } from "@/content/posts";
import { PostList } from "@/components/post-list";
import { Reveal } from "@/components/motion-primitives";

export const metadata: Metadata = {
  title: "文章",
  description: "踩坑记录、折腾笔记，以及一些没什么用但我很想说的话。",
};

export default function BlogPage() {
  return (
    <div className="pt-32 pb-16 sm:pt-40">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-4">Writing</p>
          <h1
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            写下来的东西
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--fg-muted)]">
            踩坑记录、折腾笔记，以及一些没什么用但我很想说的话。写得慢，但每篇都是真遇到的事。
          </p>
        </Reveal>

        <div className="mt-14">
          <PostList posts={sortedPosts} />
        </div>
      </div>
    </div>
  );
}
