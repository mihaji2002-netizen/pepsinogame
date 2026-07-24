"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { LabTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

const sizes = {
  xs: 40,
  sm: 56,
  md: 80,
  lg: 112,
  xl: 160,
  hero: 220,
} as const;

type LabArtProps = {
  lab: Pick<LabTheme, "image" | "imageAlt" | "name" | "color" | "badge">;
  size?: keyof typeof sizes;
  className?: string;
  framed?: boolean;
  animate?: boolean;
  showBadge?: boolean;
};

export function LabArt({
  lab,
  size = "md",
  className,
  framed = true,
  animate = false,
  showBadge = false,
}: LabArtProps) {
  const px = sizes[size];

  const inner = (
    <>
      <div
        aria-hidden
        className="absolute inset-[12%] rounded-2xl blur-2xl opacity-35"
        style={{ background: lab.color }}
      />
      <Image
        src={lab.image}
        alt={lab.imageAlt}
        width={px}
        height={px}
        className={cn(
          "relative h-full w-full object-contain",
          framed && "rounded-2xl",
        )}
        style={{
          filter: `drop-shadow(0 0 14px ${lab.color}66)`,
        }}
        priority={size === "hero" || size === "xl"}
      />
      {showBadge && (
        <span
          className="absolute -bottom-1 -left-1 grid h-7 w-7 place-items-center rounded-lg border text-xs font-bold"
          style={{
            color: lab.color,
            borderColor: `${lab.color}66`,
            background: "rgba(5,5,10,0.85)",
          }}
        >
          {lab.badge}
        </span>
      )}
    </>
  );

  if (animate) {
    return (
      <motion.div
        className={cn("relative shrink-0", className)}
        style={{ width: px, height: px }}
        whileHover={{ scale: 1.04, rotate: -1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        animate={{ y: [0, -6, 0] }}
      >
        {inner}
      </motion.div>
    );
  }

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: px, height: px }}
    >
      {inner}
    </div>
  );
}