"use client";

import { motion } from "framer-motion";
import { PepsinoLogo } from "@/components/PepsinoLogo";
import { BRAND } from "@/lib/constants";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  compact = false,
  light = false,
  size = 44,
}: {
  className?: string;
  compact?: boolean;
  light?: boolean;
  size?: number;
}) {
  return (
    <motion.div
      className={cn("flex items-center gap-3", className)}
      whileHover={{ scale: 1.02 }}
      transition={springSoft}
    >
      <PepsinoLogo size={size} />
      {!compact && (
        <div className="leading-tight">
          <div
            className={cn(
              "text-lg font-extrabold tracking-tight",
              light ? "text-white" : "text-[var(--ink)]",
            )}
            style={{ fontFamily: "var(--font-body)" }}
          >
            pepsiño
          </div>
          <div
            className="text-[10px] font-extrabold tracking-[0.28em]"
            style={{ color: "var(--brand)" }}
          >
            LAB
          </div>
          <div
            className={cn(
              "mt-0.5 text-[8px] font-bold tracking-[0.16em]",
              light ? "text-white/70" : "text-[var(--ink-soft)]",
            )}
          >
            {BRAND.tagline}
          </div>
        </div>
      )}
    </motion.div>
  );
}
