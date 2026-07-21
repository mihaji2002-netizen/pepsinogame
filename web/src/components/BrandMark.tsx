import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  compact = false,
  invert = false,
}: {
  className?: string;
  compact?: boolean;
  invert?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative grid h-12 w-12 place-items-center rounded-[18px] text-lg font-bold",
          invert
            ? "bg-[var(--signal)] text-[var(--void)] shadow-[0_0_30px_rgba(47,245,194,0.35)]"
            : "bg-[var(--void)] text-[var(--signal)] shadow-[0_14px_40px_rgba(6,20,22,0.28)]",
        )}
        style={{ fontFamily: "var(--font-display)" }}
      >
        P
        <span className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-[var(--signal-hot)]" />
      </div>
      {!compact && (
        <div>
          <div
            className={cn(
              "text-xl font-bold leading-none tracking-tight",
              invert ? "text-white" : "text-[var(--ink)]",
            )}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {BRAND.name}
          </div>
          <div
            className={cn(
              "mt-1 text-[11px] font-medium",
              invert ? "text-white/60" : "text-[var(--ink-soft)]",
            )}
          >
            سیستم‌عامل آموزشی
          </div>
        </div>
      )}
    </div>
  );
}
