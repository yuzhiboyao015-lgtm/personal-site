"use client";

import { motion } from "motion/react";
import { site } from "@/lib/site";
import { Icon } from "@/components/icons";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const MARQUEE = [
  "交互动效",
  "WebGL / 3D",
  "Next.js",
  "设计系统",
  "AI 工具链",
  "性能优化",
  "随手造轮子",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      {/* 背景装饰：网格 + 两团缓慢游动的光 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div className="animate-floaty absolute -left-24 top-10 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgb(var(--glow)/0.22),transparent_65%)] blur-2xl" />
        <div
          className="animate-floaty absolute -right-16 top-40 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgb(var(--glow)/0.16),transparent_65%)] blur-2xl"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      <div className="container-page">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="eyebrow mb-6 flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-[var(--accent)]" />
            {site.role}
          </motion.p>

          <motion.h1
            variants={item}
            className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            你好，我是
            <span className="text-gradient">{site.name}</span>
            <br />
            我把想法做成
            <span className="relative inline-block">
              会动的东西
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.9, ease: EASE }}
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-[var(--accent-3)] to-transparent"
              />
            </span>
            。
          </motion.h1>

          <motion.div variants={item} className="mt-9 max-w-2xl space-y-4">
            {site.bio.map((line) => (
              <p key={line} className="text-base leading-relaxed text-[var(--fg-muted)] sm:text-lg">
                {line}
              </p>
            ))}
          </motion.div>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn-primary">
              看看作品
              <Icon name="arrow" />
            </a>
            <a href="/lab" className="btn-ghost">
              进实验室
              <Icon name="spark" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* 底部滚动字幕：一点点动感，别太多 */}
      <div
        aria-hidden
        className="relative mt-20 flex overflow-hidden border-y border-[var(--line)] py-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      >
        <div className="animate-marquee flex shrink-0 gap-10 pr-10">
          {[...MARQUEE, ...MARQUEE].map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="whitespace-nowrap text-sm tracking-wide text-[var(--fg-dim)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
