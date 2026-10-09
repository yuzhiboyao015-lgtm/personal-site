"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * 点阵涟漪：指针划过去，附近的点被"推开"。
 * 纯 DOM + motion，不碰 canvas，用来对比"轻量交互"能做到什么程度。
 */

const CELL = 30;
const RIPPLE = 96;

/** 指针离点阵的"热区"档位，用来显示那句小提示 */
type Hotspot = 0 | 1 | 2;

export function DotGrid() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hotspot, setHotspot] = useState<Hotspot | null>(null);
  const [pulse, setPulse] = useState(0);

  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);
  const mx = useSpring(rawX, { stiffness: 120, damping: 20 });
  const my = useSpring(rawY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cols = Math.max(1, Math.ceil(size.w / CELL));
  const rows = Math.max(1, Math.ceil(size.h / CELL));
  const total = cols * rows;
  // 点太多就别硬撑，手机上容易卡
  const tooMany = total > 900;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rawX.set(e.clientX - r.left);
    rawY.set(e.clientY - r.top);
  };

  const onLeave = () => {
    rawX.set(-9999);
    rawY.set(-9999);
    setHotspot(null);
  };

  return (
    <div className="relative">
      <div
        ref={boxRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative h-[320px] w-full touch-none overflow-hidden rounded-2xl border border-[var(--line)] bg-[rgb(var(--glow)/0.03)] sm:h-[380px]"
      >
        {!tooMany && size.w > 0 && (
          <div className="absolute inset-0">
            {Array.from({ length: total }, (_, i) => {
              const x = (i % cols) * CELL + CELL / 2;
              const y = Math.floor(i / cols) * CELL + CELL / 2;
              return (
                <Dot
                  key={i}
                  x={x}
                  y={y}
                  mx={mx}
                  my={my}
                  onHot={(h) => {
                    setHotspot(h);
                    setPulse(h);
                  }}
                />
              );
            })}
          </div>
        )}

        {size.w > 0 && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
            style={{
              x: mx,
              y: my,
              background:
                "radial-gradient(circle, rgb(var(--glow) / 0.30), transparent 70%)",
            }}
          />
        )}

        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.7rem] tracking-widest text-[var(--fg-dim)]">
          {tooMany ? "屏幕太密了，换个宽点的地方再看" : "把指针放上去划一划"}
        </div>
      </div>

      <AnimatePresence>
        {hotspot !== null && (
          <motion.p
            key={`${hotspot}-${pulse}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 text-center text-xs tracking-widest text-[var(--fg-dim)]"
          >
            {hotspot === 0 ? "太远了，靠近一点" : hotspot === 1 ? "有点意思" : "正中靶心"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Dot({
  x,
  y,
  mx,
  my,
  onHot,
}: {
  x: number;
  y: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  onHot: (h: Hotspot) => void;
}) {
  const scale = useTransform([mx, my], (values) => {
    const [cx, cy] = values as [number, number];
    if (cx < -100) return 1;
    const d = Math.hypot(cx - x, cy - y);
    return 1 + Math.max(0, 1 - d / RIPPLE) * 2.2;
  });

  const opacity = useTransform([mx, my], (values) => {
    const [cx, cy] = values as [number, number];
    if (cx < -100) return 0.22;
    const d = Math.hypot(cx - x, cy - y);
    return 0.22 + Math.max(0, 1 - d / RIPPLE) * 0.7;
  });

  useMotionValueEvent(scale, "change", (v) => {
    if (v > 2.4) onHot(2);
    else if (v > 1.7) onHot(1);
    else if (v > 1.2) onHot(0);
  });

  return (
    <motion.span
      aria-hidden
      className="absolute h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
      style={{ left: x - 3, top: y - 3, scale, opacity }}
    />
  );
}
