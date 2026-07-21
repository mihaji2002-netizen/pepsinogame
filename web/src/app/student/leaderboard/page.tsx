"use client";

import { Trophy } from "lucide-react";
import { LABS } from "@/lib/constants";
import { useApp } from "@/lib/store";

const medal = ["text-[var(--accent)]", "text-[#c8d4d8]", "text-[#cd9468]"];

export default function LeaderboardPage() {
  const { students, currentStudent } = useApp();
  if (!currentStudent) return null;

  const ranked = [...students].sort(
    (a, b) => b.level * 10000 + b.xp - (a.level * 10000 + a.xp),
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Season standings</div>
        <h1 className="display mt-2 text-4xl font-bold">Leaderboards</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Global XP ranking for the current season demo roster.
        </p>
      </div>

      <div className="surface overflow-hidden">
        <div className="mono grid grid-cols-[64px_1fr_110px_90px] gap-3 border-b border-[var(--line)] px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
          <span>Rank</span>
          <span>Student</span>
          <span>Lab</span>
          <span className="text-right">XP</span>
        </div>
        {ranked.map((student, index) => {
          const lab = LABS.find((l) => l.id === student.lab) ?? LABS[0];
          const isYou = student.id === currentStudent.id;
          return (
            <div
              key={student.id}
              className={`grid grid-cols-[64px_1fr_110px_90px] items-center gap-3 border-b border-[var(--line)] px-5 py-4 text-sm last:border-none ${
                isYou ? "bg-[rgba(47,214,195,0.08)]" : ""
              }`}
            >
              <span className="flex items-center gap-1.5 font-bold">
                {index < 3 ? (
                  <Trophy size={14} className={medal[index]} />
                ) : null}
                #{index + 1}
              </span>
              <span>
                <span className="font-bold">{student.name}</span>
                {isYou && (
                  <span className="ml-2 rounded-full border border-[rgba(47,214,195,0.4)] bg-[rgba(47,214,195,0.12)] px-2 py-0.5 text-[10px] font-bold text-[var(--brand)]">
                    YOU
                  </span>
                )}
                <div className="mono text-[10px] tracking-wider text-[var(--ink-faint)]">
                  {student.studentId}
                </div>
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: lab.color }}
              >
                {lab.name} · L{student.level}
              </span>
              <span className="mono text-right font-bold text-[var(--brand)]">
                {student.xp + (student.level - 1) * 1200}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
