"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// 3D 场景只在浏览器里跑，所以动态导入并关掉 SSR
const ParticleScene = dynamic(() => import("@/components/lab/particle-scene"), {
  ssr: false,
});

const PRESETS = [
  { name: "稀薄", count: 2500, speed: 0.8 },
  { name: "标准", count: 6000, speed: 1.4 },
  { name: "浓密", count: 12000, speed: 2.1 },
];

/** 亮暗主题下用不同的粒子配色，暗色更亮眼 */
function useThemeColors() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setLight(el.dataset.theme === "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return light
    ? { a: "#0284c7", b: "#7c3aed" }
    : { a: "#22d3ee", b: "#6366f1" };
}

export function ParticleCanvas() {
  const [mounted, setMounted] = useState(false);
  const [preset, setPreset] = useState(1);
  const [ready, setReady] = useState(false);
  const colors = useThemeColors();

  useEffect(() => setMounted(true), []);

  // 首帧渲染完再淡入，避免闪一下白
  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, [mounted]);

  return (
    <div>
      <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[radial-gradient(ellipse_at_50%_40%,rgb(var(--glow)/0.10),transparent_70%)] sm:h-[460px]">
        {mounted && (
          <ParticleScene
            count={PRESETS[preset].count}
            speed={PRESETS[preset].speed}
            accentA={colors.a}
            accentB={colors.b}
          />
        )}

        <AnimatePresence>
          {!ready && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 grid place-items-center bg-[var(--bg)]"
            >
              <span className="animate-pulse-soft text-xs tracking-[0.3em] text-[var(--fg-dim)]">
                正在点亮粒子
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="eyebrow">粒子密度</span>
        <div className="flex gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setPreset(i)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300 ${
                preset === i
                  ? "border-[rgb(var(--glow)/0.7)] bg-[rgb(var(--glow)/0.14)] text-[var(--fg)]"
                  : "border-[var(--line)] text-[var(--fg-dim)] hover:text-[var(--fg-muted)]"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[0.7rem] text-[var(--fg-dim)]">
          手机上调低一档会更顺
        </span>
      </div>
    </div>
  );
}
