"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function PlannerPage() {
  const { planner, togglePlannerTask, currentStudent } = useApp();
  if (!currentStudent) return null;

  const done = planner.filter((t) => t.done).length;
  const pct = Math.round((done / planner.length) * 100);
  const days = ["دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه", "یکشنبه"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-4xl font-bold">برنامه‌ریز هفتگی</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          نسخه دیجیتال برنامه‌ریز چاپی. تسک‌ها را تیک بزن. درصد تکمیل را ببین.
        </p>
      </div>

      <div className="surface p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">تکمیل هفته</span>
          <span>{pct}٪</span>
        </div>
        <ProgressBar value={pct} className="mt-3" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {days.map((day) => {
          const tasks = planner.filter((t) => t.day === day);
          if (!tasks.length) return null;
          return (
            <div key={day} className="surface p-5">
              <div className="display text-2xl font-bold">{day}</div>
              <ul className="mt-4 space-y-2">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <button
                      onClick={() => togglePlannerTask(task.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-right text-sm transition",
                        task.done
                          ? "bg-[var(--success)]/10 text-[var(--ink)]"
                          : "bg-[var(--paper-deep)] hover:bg-white",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-5 w-5 place-items-center rounded-full border text-[10px]",
                          task.done
                            ? "border-[var(--success)] bg-[var(--success)] text-white"
                            : "border-[var(--line)]",
                        )}
                      >
                        {task.done ? "✓" : ""}
                      </span>
                      {task.title}
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
