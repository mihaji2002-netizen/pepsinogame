import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  color = "var(--brand)",
  className,
}: {
  value: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={cn("h-2.5 overflow-hidden rounded-full bg-black/8", className)}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  );
}
