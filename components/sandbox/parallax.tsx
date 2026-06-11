"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  offset?: readonly [number, number];
}

export function ParallaxLayer({
  children,
  speed = 0.35,
  className = "",
  offset = [-120, 120],
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], offset.map((v) => v * speed));

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

interface ParallaxSceneProps {
  children: ReactNode;
  className?: string;
  height?: string;
}

export function ParallaxScene({
  children,
  className = "",
  height = "min-h-[520px]",
}: ParallaxSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} className={`relative overflow-hidden ${height} ${className}`}>
      {children}
      <ScrollProgressBar progress={scrollYProgress} />
    </div>
  );
}

function ScrollProgressBar({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  if (reduce) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--glass-border)]">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-[var(--brand-blue)] via-[var(--brand-green)] to-[var(--brand-orange)]"
        style={{ scaleX, transformOrigin: "0% 50%" }}
      />
    </div>
  );
}

export function FloatingOrb({
  color,
  size = 280,
  speed = 0.2,
  className = "",
}: {
  color: string;
  size?: number;
  speed?: number;
  className?: string;
}) {
  return (
    <ParallaxLayer speed={speed} className={`pointer-events-none absolute ${className}`}>
      <div
        className="rounded-full blur-3xl opacity-40"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </ParallaxLayer>
  );
}
