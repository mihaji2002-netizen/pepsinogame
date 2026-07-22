import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Infinite horizontal marquee strip (21st.dev / Magic UI style). */
export function Marquee({
  children,
  className,
  duration = 30,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <div
      className={cn(
        "marquee-mask relative flex w-full overflow-hidden",
        className,
      )}
    >
      <div
        className="marquee-track flex w-max items-center gap-4 pr-4"
        style={{ animationDuration: `${duration}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
