"use client";

import { LABS } from "@/lib/constants";
import { useApp } from "@/lib/store";

export default function LeaderboardPage() {
  const { students, currentStudent } = useApp();
  if (!currentStudent) return null;

  const ranked = [...students].sort(
    (a, b) => b.level * 10000 + b.xp - (a.level * 10000 + a.xp),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-4xl font-bold">رتبه‌بندی</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          رتبه‌بندی سراسری XP برای فهرست نمایشی فصل جاری.
        </p>
      </div>

      <div className="surface overflow-hidden">
        <div className="grid grid-cols-[64px_1fr_100px_100px] gap-3 border-b border-[var(--line)] px-5 py-3 text-xs text-[var(--ink-soft)]">
          <span>رتبه</span>
          <span>دانش‌آموز</span>
          <span>لاب</span>
          <span>XP</span>
        </div>
        {ranked.map((student, index) => {
          const lab = LABS.find((l) => l.id === student.lab)?.name ?? student.lab;
          const isYou = student.id === currentStudent.id;
          return (
            <div
              key={student.id}
              className={`grid grid-cols-[64px_1fr_100px_100px] gap-3 px-5 py-4 text-sm ${
                isYou ? "bg-[var(--brand)]/10" : ""
              }`}
            >
              <span className="font-semibold">#{index + 1}</span>
              <span className="font-semibold">
                {student.name}
                {isYou ? " · تو" : ""}
              </span>
              <span>{lab}</span>
              <span>{student.xp + (student.level - 1) * 1200}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
