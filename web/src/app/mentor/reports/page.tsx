"use client";

import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/BrandMark";
import { LABS, xpProgress } from "@/lib/constants";
import { useApp } from "@/lib/store";

export default function ReportsPage() {
  const { students, attendance, exams, currentStudent, missions } = useApp();
  const student = students[0] ?? currentStudent;
  if (!student) return null;

  const lab = LABS.find((l) => l.id === student.lab) ?? LABS[0];
  const progress = xpProgress(student.xp);
  const present = attendance.filter((a) => a.status === "present" || a.status === "late").length;
  const avgExam =
    exams.reduce((sum, e) => sum + e.percentage, 0) / Math.max(exams.length, 1);
  const missionRate =
    (missions.filter((m) => m.completed).length / Math.max(missions.length, 1)) * 100;

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl font-bold">Reports</h1>
          <p className="mt-2 text-[var(--ink-soft)]">
            Weekly, monthly, and season summaries — printable and PDF-ready.
          </p>
        </div>
        <Button onClick={() => window.print()}>Export PDF / Print</Button>
      </div>

      <article className="print-sheet surface overflow-hidden">
        <div
          className="px-8 py-10 text-white"
          style={{
            background: `linear-gradient(135deg, ${lab.color}, #102027 70%)`,
          }}
        >
          <BrandMark className="[&_*]:text-white" />
          <div className="display mt-8 text-4xl font-bold">Season Summary</div>
          <p className="mt-2 max-w-xl text-white/75">
            Automatically generated snapshot for {student.name} · {student.studentId}
          </p>
        </div>

        <div className="grid gap-6 p-8 md:grid-cols-2">
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
                <div key={label} className="flex justify-between border-b border-[var(--line)] pb-2">
                  <dt className="text-[var(--ink-soft)]">{label}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="display text-2xl font-bold">Growth Narrative</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--ink-soft)]">
              <p>
                <strong className="text-[var(--ink)]">Strengths:</strong> Consistent mission
                cadence and improving exam trajectory in core subjects.
              </p>
              <p>
                <strong className="text-[var(--ink)]">Weaknesses:</strong> Occasional late starts
                on Target blocks; protect the first deep-work window.
              </p>
              <p>
                <strong className="text-[var(--ink)]">Mentor Notes:</strong> Keep the Neuro habits
                tight. Stamp quality over speed. Prepare for Research Lab unlock.
              </p>
            </div>
          </section>
        </div>

        <div className="border-t border-[var(--line)] px-8 py-6 text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)]">
          PEPSINO LAB · Weekly / Monthly / Season · Premium printable report
        </div>
      </article>
    </div>
  );
}
