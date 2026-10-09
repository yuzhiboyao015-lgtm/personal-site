import { site } from "@/lib/site";
import { Icon } from "@/components/icons";
import { Reveal, RevealGroup, RevealItem, WordReveal } from "@/components/motion-primitives";

const NOW = [
  { label: "在学", value: "WebGL 与着色器，想把粒子场景调得更顺" },
  { label: "在折腾", value: "把自己的工具链和工作流一点点自动化" },
  { label: "在找", value: "有意思的实习，偏前端 / 交互方向" },
];

const STACK = [
  "TypeScript",
  "React / Next.js",
  "Tailwind CSS",
  "Motion",
  "Three.js",
  "Node.js",
  "Git",
  "Python",
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <p className="eyebrow mb-4">关于我</p>
              <h2
                className="text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <WordReveal text="一个还在长本事的人" />
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 space-y-4 text-[var(--fg-muted)]">
                <p className="leading-relaxed">
                  我在读大学，大部分时间花在两件事上：把界面做得更好玩，以及研究工具怎么能帮我少干重复活。
                  这个站本身就是这两件事的产物。
                </p>
                <p className="leading-relaxed">
                  我更愿意把时间花在「做出来」上：一个能跑的原型，比一份漂亮的方案文档有用得多。
                  所以这里放的多半是半成品、实验品，和几篇踩坑记录。
                </p>
              </div>
            </Reveal>

            <RevealGroup className="mt-10 space-y-3">
              {NOW.map((row) => (
                <RevealItem key={row.label}>
                  <div className="flex items-baseline gap-5 border-b border-[var(--line)] py-3">
                    <span className="w-16 shrink-0 text-xs tracking-widest text-[var(--fg-dim)]">
                      {row.label}
                    </span>
                    <span className="text-sm text-[var(--fg-muted)]">{row.value}</span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div className="space-y-5">
            <Reveal delay={0.15}>
              <div className="surface relative overflow-hidden p-6">
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgb(var(--glow)/0.28),transparent_65%)] blur-xl"
                />
                <p className="eyebrow mb-4">常用工具</p>
                <div className="flex flex-wrap gap-2">
                  {STACK.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[var(--line)] bg-[rgb(var(--glow)/0.05)] px-3 py-1.5 text-xs text-[var(--fg-muted)] transition-colors hover:border-[rgb(var(--glow)/0.5)] hover:text-[var(--fg)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="surface p-6">
                <p className="eyebrow mb-4">想聊聊？</p>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-sm text-[var(--fg)] transition-colors hover:text-[var(--accent)]"
                >
                  <Icon name="mail" />
                  {site.email}
                </a>
                <p className="mt-4 text-xs leading-relaxed text-[var(--fg-dim)]">
                  回信可能不快，但只要不是群发广告我都会看。
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
