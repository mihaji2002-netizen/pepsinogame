"use client";

import { LABS, xpProgress } from "@/lib/constants";
import { useApp } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";

const statusTone: Record<string, string> = {
  present: "text-[var(--success)]",
  late: "text-[var(--accent)]",
  absent: "text-[var(--danger)]",
  excused: "text-[var(--ink-soft)]",
};

export default function ProfilePage() {
  const {
    currentStudent,
    xpHistory,
    exams,
    attendance,
    achievements,
    missions,
  } = useApp();
  if (!currentStudent) return null;

  const lab = LABS.find((l) => l.id === currentStudent.lab) ?? LABS[0];
  const progress = xpProgress(currentStudent.xp);

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Everything in one place</div>
        <h1 className="display mt-2 text-4xl font-bold">Student Profile</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Personal information, history, achievements, and mentor notes.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="surface h-fit p-6">
          <div className="flex items-center gap-4">
            <div
              className="grid h-16 w-16 place-items-center rounded-2xl border text-xl font-bold"
              style={{
                color: lab.color,
                borderColor: `${lab.color}55`,
                background: `${lab.color}16`,
              }}
            >
              {currentStudent.avatar}
            </div>
            <div>
              <div className="display text-3xl font-bold">
                {currentStudent.name}
              </div>
              <div className="mono text-sm tracking-[0.14em] text-[var(--ink-soft)]">
                {currentStudent.studentId}
              </div>
            </div>
          </div>
          <dl className="mt-7 space-y-3.5 text-sm">
            {[
              ["Email", currentStudent.email],
              ["Lab", lab.name],
              ["Level", String(currentStudent.level)],
              ["Coins", String(currentStudent.coins)],
              ["Stamps", String(currentStudent.stamps)],
              ["Joined", formatDate(currentStudent.joinedAt)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between border-b border-[var(--line)] pb-3 last:border-none"
              >
                <dt className="text-[var(--ink-soft)]">{label}</dt>
                <dd className="font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold">XP to next level</span>
              <span className="mono text-xs text-[var(--ink-soft)]">
                {progress.current}/{progress.total}
              </span>
            </div>
            <ProgressBar value={progress.percent} color={lab.color} />
          </div>
        </section>

        <section className="space-y-6">
          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">XP History</h2>
            <ul className="mt-4 divide-y divide-[var(--line)] text-sm">
              {xpHistory.map((e) => (
                <li key={e.id} className="flex justify-between gap-4 py-2.5">
                  <span>{e.reason}</span>
                  <span className="mono shrink-0 font-bold text-[var(--brand)]">
                    +{e.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">Exam History</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {exams.map((exam) => (
                <li key={exam.id} className="surface-flat p-4">
                  <div className="flex justify-between font-bold">
                    <span>{exam.subject}</span>
                    <span className="mono text-[var(--brand)]">
                      {exam.percentage}%
                    </span>
                  </div>
                  <div className="mono mt-1.5 text-xs text-[var(--ink-faint)]">
                    Rank #{exam.rank} · {formatDate(exam.date)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">Attendance</h2>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {attendance.map((a) => (
                <div key={a.session} className="surface-flat p-3 text-center">
                  <div className="mono text-xs font-bold">S{a.session}</div>
                  <div
                    className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${statusTone[a.status]}`}
                  >
                    {a.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">Mission History</h2>
            <ul className="mt-4 divide-y divide-[var(--line)] text-sm">
              {missions.map((m) => (
                <li key={m.key} className="flex justify-between py-2.5">
                  <span>{m.title}</span>
                  <span
                    className={`mono text-[10px] font-bold uppercase tracking-wider ${
                      m.completed
                        ? "text-[var(--success)]"
                        : "text-[var(--ink-faint)]"
                    }`}
                  >
                    {m.completed ? "Completed" : "Open"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">Badges</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {achievements
                .filter((a) => a.unlocked)
                .map((a) => (
                  <span
                    key={a.id}
                    className="rounded-full border border-[rgba(47,214,195,0.4)] bg-[rgba(47,214,195,0.1)] px-3.5 py-1.5 text-sm font-bold text-[var(--brand)]"
                  >
                    {a.title}
                  </span>
                ))}
              {!achievements.some((a) => a.unlocked) && (
                <span className="text-sm text-[var(--ink-soft)]">
                  No badges unlocked yet.
                </span>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
