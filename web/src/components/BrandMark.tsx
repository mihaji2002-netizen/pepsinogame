"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  compact = false,
  light = false,
}: {
  className?: string;
  compact?: boolean;
  light?: boolean;
}) {
  return (
    <motion.div
      className={cn("flex items-center gap-3", className)}
      whileHover={{ scale: 1.03 }}
      transition={springSoft}
    >
      <motion.div
        className={cn(
          "grid h-11 w-11 place-items-center text-lg font-bold",
          light ? "bg-white text-[var(--ink)]" : "bg-[var(--ink)] text-[var(--mint)]",
        )}
        style={{ fontFamily: "var(--font-display)" }}
        whileHover={{ rotate: -8 }}
        transition={springSoft}
      >
        P
      </motion.div>
      {!compact && (
        <div
          className={cn(
            "display text-xl leading-none tracking-tight",
            light ? "text-white" : "text-[var(--ink)]",
          )}
        >
          {BRAND.name}
        </div>
      )}
    </motion.div>
  );
}
