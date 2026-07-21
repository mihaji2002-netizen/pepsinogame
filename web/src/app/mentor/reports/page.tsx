"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LABS, xpProgress } from "@/lib/constants";
import { useApp } from "@/lib/store";

export default function ReportsPage() {
  const { students, attendance, exams, currentStudent, missions } = useApp();
  const student = students[0] ?? currentStudent;
  if (!student) return null;

  const lab = LABS.find((l) => l.id === student.lab) ?? LABS[0];
  const progress = xpProgress(student.xp);
  const present = attendance.filter(
    (a) => a.status === "present" || a.status === "late",
  ).length;
  const avgExam =
    exams.reduce((sum, e) => sum + e.percentage, 0) / Math.max(exams.length, 1);
  const missionRate =
    (missions.filter((m) => m.completed).length /
      Math.max(missions.length, 1)) *
    100;

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Weekly · Monthly · Season</div>
          <h1 className="display mt-2 text-4xl font-bold">Reports</h1>
          <p className="mt-2 text-[var(--ink-soft)]">
            Printable and PDF-ready summaries with a premium finish.
          </p>
        </div>
        <Button onClick={() => window.print()}>
          <Printer size={16} />
          Export PDF / Print
        </Button>
      </div>

      <article className="print-sheet sheet overflow-hidden">
        <div
          className="relative overflow-hidden px-8 py-10 text-white"
          style={{
            background: `radial-gradient(500px 260px at 85% -30%, ${lab.color}55, transparent 70%), linear-gradient(140deg, #0b141a, #05090c 75%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-xl border text-base font-bold"
              style={{
                color: lab.color,
                borderColor: `${lab.color}66`,
                background: `${lab.color}1c`,
              }}
            >
              P
            </div>
            <div>
              <div className="display text-base font-bold leading-none">
                PEPSINO LAB
              </div>
              <div className="mono mt-1 text-[10px] uppercase tracking-[0.24em] text-white/50">
                Education OS
              </div>
            </div>
          </div>
          <div className="display mt-8 text-4xl font-bold">Season Summary</div>
          <p className="mt-2 max-w-xl text-white/65">
            Automatically generated snapshot for {student.name} ·{" "}
            <span className="mono">{student.studentId}</span>
          </p>
        </div>

        <div className="grid gap-8 p-8 md:grid-cols-2">
          <section>
            <h2 className="display text-2xl font-bold">Core Metrics</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Lab", lab.name],
                ["Level", String(student.level)],
                ["XP Progress", `${progress.current}/${progress.total}`],
                ["Coins", String(student.coins)],
                ["Mentor Stamps", String(student.stamps)],
                ["Attendance", `${present}/6 sessions`],
                ["Mission Completion", `${Math.round(missionRate)}%`],
                ["Exam Average", `${avgExam.toFixed(1)}%`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-[rgba(18,35,42,0.12)] pb-2"
                >
                  <dt className="text-[#52676d]">{label}</dt>
                  <dd className="font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="display text-2xl font-bold">Growth Narrative</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#52676d]">
              <p>
                <strong className="text-[#12232a]">Strengths:</strong>{" "}
                Consistent mission cadence and improving exam trajectory in
                core subjects.
              </p>
              <p>
                <strong className="text-[#12232a]">Weaknesses:</strong>{" "}
                Occasional late starts on Target blocks; protect the first
                deep-work window.
              </p>
              <p>
                <strong className="text-[#12232a]">Mentor Notes:</strong> Keep
                the Neuro habits tight. Stamp quality over speed. Prepare for
                Research Lab unlock.
              </p>
            </div>
          </section>
        </div>

        <div className="mono border-t border-[rgba(18,35,42,0.12)] px-8 py-5 text-[10px] uppercase tracking-[0.22em] text-[#7d9096]">
          PEPSINO LAB · Weekly / Monthly / Season · Premium printable report
        </div>
      </article>
    </div>
  );
}
