"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-[var(--brand)] text-[var(--brand-ink)] shadow-[0_12px_40px_rgba(var(--brand-rgb),0.35)] hover:shadow-[0_16px_48px_rgba(var(--brand-rgb),0.45)]",
  secondary:
    "bg-[rgba(var(--brand-rgb),0.08)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--line-strong)] hover:bg-[rgba(var(--brand-rgb),0.14)] backdrop-blur-sm",
  ghost:
    "bg-transparent text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[rgba(var(--brand-rgb),0.08)]",
  danger: "bg-[var(--danger)] text-[#2a0b12]",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: Omit<HTMLMotionProps<"button">, "ref"> & { variant?: Variant }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={springSnappy}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-5 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
