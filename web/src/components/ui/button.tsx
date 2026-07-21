import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-[var(--brand)] text-white hover:bg-[var(--brand-deep)] hover:-translate-y-0.5 shadow-[0_12px_30px_rgba(15,138,138,0.28)]",
  secondary:
    "bg-white/80 text-[var(--ink)] border border-[var(--line)] hover:bg-white hover:-translate-y-0.5",
  ghost: "bg-transparent text-[var(--ink-soft)] hover:bg-white/60",
  danger: "bg-[var(--danger)] text-white hover:brightness-95",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
