"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Card with a mouse-following radial glow, in the style of 21st.dev /
 * Aceternity spotlight cards. Falls back to a static card without JS hover.
 */
export function SpotlightCard({
  children,
  className,
  color = "rgba(180, 75, 255, 0.14)",
  style,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      }}
      className={cn("group relative overflow-hidden", className)}
      style={style}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${color}, transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
