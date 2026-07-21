import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "ink" | "flare";

const styles: Record<Variant, string> = {
  primary: "bg-[var(--brand)] text-white hover:bg-[var(--brand-deep)]",
  ink: "bg-[var(--ink)] text-white hover:bg-black",
  flare: "bg-[var(--flare)] text-white hover:brightness-110",
  secondary: "bg-white text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--paper-2)]",
  ghost: "bg-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]",
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
        "inline-flex cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
