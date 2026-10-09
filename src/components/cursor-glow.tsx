"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 鼠标跟随光晕：一个跟着指针缓慢追上来的柔光球。
 * 触屏设备和「减少动态效果」偏好下自动关闭。
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let curX = window.innerWidth / 2;
    let curY = window.innerHeight / 3;
    let targetX = curX;
    let targetY = curY;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    const loop = () => {
      // 缓动跟随，比直接贴住鼠标更有"重量感"
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      el.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 opacity-0 transition-opacity duration-500"
      style={{ willChange: "transform" }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
        style={{
          width: 460,
          height: 460,
          background:
            "radial-gradient(circle, rgb(var(--glow) / 0.22) 0%, rgb(var(--glow) / 0.08) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
