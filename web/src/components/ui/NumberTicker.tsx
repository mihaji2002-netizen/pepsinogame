"use client";

import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Animated counter in the style of 21st.dev / Magic UI number tickers. */
export function NumberTicker({
  value,
  className,
  delay = 0,
}: {
  value: number;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 40, stiffness: 140 });
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => motionValue.set(value), delay);
    return () => clearTimeout(t);
  }, [inView, value, delay, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = new Intl.NumberFormat("fa-IR").format(
          Math.round(latest),
        );
      }
    });
  }, [spring]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      0
    </span>
  );
}
