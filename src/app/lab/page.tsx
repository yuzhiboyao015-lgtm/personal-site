import type { Metadata } from "next";
import { ParticleCanvas } from "@/components/lab/particle-canvas";
import { DotGrid } from "@/components/lab/dot-grid";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion-primitives";

export const metadata: Metadata = {
  title: "实验室",
  description: "放半成品和交互实验的地方：3D 粒子、指针涟漪，以及各种不一定有用的点子。",
};

const ROADMAP = [
  {
    title: "文字拆解动画",
    note: "把标题按笔画或字符打散，滚动时重新拼回来。",
    status: "想试试",
  },
  {
    title: "鼠标拖拽的物理卡片墙",
    note: "卡片能被拖着甩出去，带惯性和碰撞。",
    status: "想试试",
  },
  {
    title: "主题切换的扩散过渡",
    note: "点亮的瞬间从点击位置扩散到全屏，而不是淡入淡出。",
    status: "在琢磨",
  },
  {
    title: "音频可视化",
    note: "丢一段音频进去，看波形长成什么样。",
    status: "排队中",
  },
];

export default function LabPage() {
  return (
    <div className="pt-32 pb-16 sm:pt-40">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-4">Lab</p>
          <h1
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            实验场
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--fg-muted)]">
            这里放的是半成品：做出来好玩、但不一定有用，也不保证在每台设备上都顺。
            想看某个效果怎么实现的，源码都在仓库里。
          </p>
        </Reveal>

        <div className="mt-16 space-y-16">
          <Reveal>
            <section>
              <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h2
                    className="text-xl font-semibold tracking-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    粒子云
                  </h2>
                  <p className="mt-1.5 text-sm text-[var(--fg-muted)]">
                    六千个点在着色器里各自呼吸，鼠标决定整片云往哪转。
                  </p>
                </div>
                <span className="eyebrow">WebGL · three.js</span>
              </header>
              <ParticleCanvas />
            </section>
          </Reveal>

          <Reveal>
            <section>
              <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h2
                    className="text-xl font-semibold tracking-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    点阵涟漪
                  </h2>
                  <p className="mt-1.5 text-sm text-[var(--fg-muted)]">
                    指针划过去，附近八百个点被依次推开——纯 DOM，没用 canvas。
                  </p>
                </div>
                <span className="eyebrow">指针交互 · motion</span>
              </header>
              <DotGrid />
            </section>
          </Reveal>
        </div>

        {/* 排队中的点子：先把想法写下来，比记在备忘录里靠谱 */}
        <section className="mt-24">
          <Reveal>
            <h2
              className="text-2xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              排队中的点子
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[var(--fg-muted)]">
              写在这里当成给自己的待办。做完了会搬上去，做不出来就永远待在这儿。
            </p>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2">
            {ROADMAP.map((item) => (
              <RevealItem key={item.title}>
                <div className="surface flex h-full items-start justify-between gap-4 p-5">
                  <div>
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--fg-dim)]">
                      {item.note}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[var(--line)] px-2.5 py-1 text-[0.65rem] tracking-wide text-[var(--fg-dim)]">
                    {item.status}
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      </div>
    </div>
  );
}
