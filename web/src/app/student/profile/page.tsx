"use client";

import { LABS, xpProgress } from "@/lib/constants";
import { useApp } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";

const attendanceLabel: Record<string, string> = {
  present: "حاضر",
  late: "تأخیر",
  absent: "غایب",
  excused: "موجه",
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
        <h1 className="display text-4xl font-bold">پروفایل دانش‌آموز</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          اطلاعات شخصی، تاریخچه، دستاوردها و یادداشت منتور در یک جا.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="surface p-6">
          <div className="flex items-center gap-4">
            <div
              className="grid h-16 w-16 place-items-center rounded-2xl text-xl font-bold text-white"
              style={{ background: lab.color }}
            >
              {currentStudent.avatar}
            </div>
            <div>
              <div className="display text-3xl font-bold">{currentStudent.name}</div>
              <div className="font-mono text-sm tracking-wider text-[var(--ink-soft)]" dir="ltr">
                {currentStudent.studentId}
              </div>
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            {[
              ["ایمیل", currentStudent.email],
              ["لاب", lab.name],
              ["سطح", String(currentStudent.level)],
              ["سکه", String(currentStudent.coins)],
              ["مهرها", String(currentStudent.stamps)],
              ["عضویت", formatDate(currentStudent.joinedAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-[var(--ink-soft)]">{label}</dt>
                <dd className={label === "ایمیل" ? "" : undefined} dir={label === "ایمیل" ? "ltr" : undefined}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span>XP تا سطح بعد</span>
              <span>
                {progress.current}/{progress.total}
              </span>
            </div>
            <ProgressBar value={progress.percent} color={lab.color} />
          </div>
        </section>

        <section className="space-y-6">
          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">تاریخچه XP</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {xpHistory.map((e) => (
                <li key={e.id} className="flex justify-between gap-4">
                  <span>{e.reason}</span>
                  <span className="shrink-0 font-semibold">+{e.amount}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">تاریخچه آزمون</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {exams.map((exam) => (
                <li key={exam.id} className="rounded-xl bg-[var(--paper-deep)] p-3">
                  <div className="flex justify-between font-semibold">
                    <span>{exam.subject}</span>
                    <span>{exam.percentage}٪</span>
                  </div>
                  <div className="mt-1 text-[var(--ink-soft)]">
                    رتبه #{exam.rank} · {formatDate(exam.date)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">حضور و غیاب</h2>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {attendance.map((a) => (
                <div
                  key={a.session}
                  className="rounded-xl bg-[var(--paper-deep)] p-3 text-center text-xs"
                >
                  <div className="font-semibold">جلسه {a.session}</div>
                  <div className="mt-1 text-[var(--ink-soft)]">
                    {attendanceLabel[a.status] ?? a.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">تاریخچه مأموریت</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {missions.map((m) => (
                <li key={m.key} className="flex justify-between">
                  <span>{m.title}</span>
                  <span className="text-[var(--ink-soft)]">
                    {m.completed ? "انجام‌شده" : "باز"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">نشان‌ها</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {achievements
                .filter((a) => a.unlocked)
                .map((a) => (
                  <span
                    key={a.id}
                    className="rounded-full bg-[var(--brand)]/12 px-3 py-1 text-sm font-semibold"
                  >
                    {a.title}
                  </span>
                ))}
              {!achievements.some((a) => a.unlocked) && (
                <span className="text-sm text-[var(--ink-soft)]">هنوز نشانی باز نشده.</span>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
