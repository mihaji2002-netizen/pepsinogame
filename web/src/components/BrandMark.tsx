import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-[rgba(47,214,195,0.4)] bg-gradient-to-b from-[rgba(47,214,195,0.2)] to-[rgba(47,214,195,0.05)] text-[var(--brand)] shadow-[0_8px_28px_rgba(47,214,195,0.25)]">
        <span className="display text-lg font-bold tracking-tight">P</span>
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(242,181,68,0.8)]" />
      </div>
      {!compact && (
        <div>
          <div className="display text-base font-bold leading-none tracking-tight">
            {BRAND.name}
          </div>
          <div className="mono mt-1 text-[10px] uppercase tracking-[0.24em] text-[var(--ink-soft)]">
            Education OS
          </div>
        </div>
      )}
    </div>
  );
}
