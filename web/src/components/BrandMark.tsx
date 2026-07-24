import { FlaskConical } from "lucide-react";
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
      <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-[rgba(var(--brand-rgb),0.45)] bg-gradient-to-b from-[rgba(var(--brand-rgb),0.22)] to-[rgba(var(--brand-rgb),0.06)] text-[var(--brand)] shadow-[0_8px_28px_rgba(var(--brand-rgb),0.28)]">
        <FlaskConical size={18} strokeWidth={2.2} />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(232,197,71,0.8)]" />
      </div>
      {!compact && (
        <div>
          <div className="display text-base font-bold leading-none">
            {BRAND.name}
          </div>
          <div className="mono mt-1 text-[10px] text-[var(--ink-soft)]">
            {BRAND.motto}
          </div>
        </div>
      )}
    </div>
  );
}
