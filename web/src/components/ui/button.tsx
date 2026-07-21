"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "ink" | "flare";

const styles: Record<Variant, string> = {
  primary: "bg-[var(--brand)] text-white hover:bg-[var(--brand-deep)]",
  ink: "bg-[var(--ink)] text-white hover:bg-[#061016]",
  flare: "bg-[var(--flare)] text-white hover:brightness-110",
  secondary: "bg-white text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--paper-2)]",
  ghost: "bg-transparent text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-black/5",
  danger: "bg-[var(--danger)] text-white hover:brightness-95",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <motion.div
      className="inline-flex"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={springSnappy}
    >
      <button
        className={cn(
          "inline-flex w-full cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
          styles[variant],
          className,
        )}
        {...props}
      />
    </motion.div>
  );
}
