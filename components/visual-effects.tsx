"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function CursorSpotlight() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        node.style.setProperty("--spot-x", `${targetX}px`);
        node.style.setProperty("--spot-y", `${targetY}px`);
        frame = 0;
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-screen"
      style={{
        background:
          "radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 30%), rgba(96,165,255,0.14), transparent 60%)",
      }}
    />
  );
}

export function AnimatedNumber({
  value,
  duration = 1.8,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  const numericMatch = value.match(/-?\d+(\.\d+)?/);
  const numeric = numericMatch ? parseFloat(numericMatch[0]) : null;
  const prefix = numericMatch ? value.slice(0, numericMatch.index) : "";
  const suffix = numericMatch
    ? value.slice((numericMatch.index ?? 0) + numericMatch[0].length)
    : "";

  useEffect(() => {
    if (reduce || numeric === null || !inView || !ref.current) return;
    const node = ref.current;
    const decimals = numericMatch?.[1] ? numericMatch[1].length - 1 : 0;
    const controls = animate(0, numeric, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [duration, inView, numeric, numericMatch, prefix, reduce, suffix]);

  if (numeric === null || reduce) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((event.clientX - cx) * strength);
    y.set((event.clientY - cy) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}

export function AccentGlowCard({
  accent,
  children,
  className,
}: {
  accent: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setCoords({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={handleMove}
      onPointerLeave={() => setCoords(null)}
      style={
        coords
          ? ({
              "--glow-x": `${coords.x}px`,
              "--glow-y": `${coords.y}px`,
              "--glow-color": accent,
            } as React.CSSProperties)
          : ({ "--glow-color": accent } as React.CSSProperties)
      }
    >
      {children}
    </div>
  );
}

