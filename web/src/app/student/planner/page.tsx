"use client";

import { Check } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PLANNER_DAYS } from "@/lib/constants";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function PlannerPage() {
  const { planner, togglePlannerTask, currentStudent } = useApp();
  if (!currentStudent) return null;

  const done = planner.filter((t) => t.done).length;
  const pct = Math.round((done / planner.length) * 100);
  const days = [...PLANNER_DAYS];

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">برنامه‌ریزی هفته</div>
        <h1 className="display mt-2 text-4xl font-bold">برنامه هفتگی</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          نسخه دیجیتال برنامه قابل چاپ. وظایف را تیک بزن. پیشرفت را دنبال کن.
        </p>
      </div>

      <div className="surface p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">پیشرفت هفته</span>
          <span className="mono text-[var(--brand)]">{pct}%</span>
        </div>
        <ProgressBar value={pct} className="mt-3" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {days.map((day) => {
          const tasks = planner.filter((t) => t.day === day);
          if (!tasks.length) return null;
          return (
            <div key={day} className="surface p-5">
              <div className="flex items-baseline justify-between">
                <div className="display text-2xl font-bold">{day}</div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                  {tasks.filter((t) => t.done).length}/{tasks.length}
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <button
                      onClick={() => togglePlannerTask(task.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                        task.done
                          ? "border-[rgba(74,222,154,0.35)] bg-[rgba(74,222,154,0.08)]"
                          : "border-[var(--line)] bg-transparent hover:border-[var(--line-strong)] hover:bg-[rgba(148,210,216,0.06)]",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition",
                          task.done
                            ? "border-[var(--success)] bg-[var(--success)] text-[#03130b]"
                            : "border-[var(--line-strong)]",
                        )}
                      >
                        {task.done ? <Check size={11} strokeWidth={3.5} /> : ""}
                      </span>
                      <span
                        className={task.done ? "text-[var(--ink-faint)] line-through" : ""}
                      >
                        {task.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
