import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-[var(--brand)] text-[var(--brand-ink)] hover:bg-[var(--brand-deep)] shadow-[0_10px_34px_rgba(80,200,120,0.3)]",
  secondary:
    "bg-[rgba(80,200,120,0.08)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--line-strong)] hover:bg-[rgba(80,200,120,0.14)]",
  ghost:
    "bg-transparent text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[rgba(80,200,120,0.08)]",
  danger: "bg-[var(--danger)] text-[#2a0b12] hover:opacity-90",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
