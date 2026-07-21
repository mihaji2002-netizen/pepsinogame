import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  compact = false,
  light = false,
}: {
  className?: string;
  compact?: boolean;
  light?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "grid h-10 w-10 place-items-center text-lg font-bold",
          light ? "bg-white text-[var(--ink)]" : "bg-[var(--ink)] text-[var(--mint)]",
        )}
        style={{ fontFamily: "var(--font-display)" }}
      >
        P
      </div>
      {!compact && (
        <div
          className={cn(
            "text-xl font-bold leading-none tracking-tight",
            light ? "text-white" : "text-[var(--ink)]",
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {BRAND.name}
        </div>
      )}
    </div>
  );
}
