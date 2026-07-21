"use client";

import { motion } from "framer-motion";
import { letter, staggerFast } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function KineticText({
  text,
  className,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "span";
}) {
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={cn("inline-block", className)}
      variants={staggerFast}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letter}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </MotionTag>
  );
}
