"use client";

import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees applied at the corners. Default 8. */
  intensity?: number;
  /** Render as <button>. Provide onClick if needed. */
  as?: "div" | "button";
  type?: "button" | "submit";
  onClick?: () => void;
  style?: CSSProperties;
}

/**
 * Wraps children in an element that tilts in 3D following the mouse,
 * and projects a soft specular highlight under the cursor.
 *
 * Why: replaces the static glass-panel hover with a dynamic, tactile
 * response — feels like physical glass catching ambient light.
 */
export function Tilt3D({
  children,
  className = "",
  intensity = 8,
  as = "div",
  type = "button",
  onClick,
  style,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement | HTMLButtonElement | null>(null);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * intensity * 2;
    const rx = -(py - 0.5) * intensity * 2;
    el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const cls = `tilt-3d ${className}`;

  if (as === "button") {
    return (
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        type={type}
        onClick={onClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cls}
        style={style}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cls}
      style={style}
    >
      {children}
    </div>
  );
}
