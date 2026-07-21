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
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "h-2 overflow-hidden rounded-full border border-[var(--line)] bg-[rgba(5,9,12,0.6)]",
        className,
      )}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${clamped}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow: `0 0 12px ${color}66`,
        }}
      />
    </div>
  );
}
