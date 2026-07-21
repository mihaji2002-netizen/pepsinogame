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
      <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-[var(--brand-deep)] text-white shadow-[0_10px_30px_rgba(11,95,99,0.35)]">
        <span className="display text-lg font-bold tracking-tight">P</span>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[var(--accent)]" />
      </div>
      {!compact && (
        <div>
          <div className="display text-lg font-bold leading-none tracking-tight">
            {BRAND.name}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)]">
            Education OS
          </div>
        </div>
      )}
    </div>
  );
}
