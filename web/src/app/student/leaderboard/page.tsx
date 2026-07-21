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
        <h1 className="display text-4xl font-bold">Leaderboards</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Global XP ranking for the current season demo roster.
        </p>
      </div>

      <div className="surface overflow-hidden">
        <div className="grid grid-cols-[64px_1fr_100px_100px] gap-3 border-b border-[var(--line)] px-5 py-3 text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">
          <span>Rank</span>
          <span>Student</span>
          <span>Lab</span>
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
                {isYou ? " · You" : ""}
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
