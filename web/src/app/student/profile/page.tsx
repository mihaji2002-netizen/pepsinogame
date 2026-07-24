"use client";

import { xpProgress } from "@/lib/constants";
import { useApp } from "@/lib/store";
import { attendanceLabel } from "@/lib/fa";
import { formatDate } from "@/lib/utils";
import { AvatarPicker } from "@/components/AvatarPicker";
import { LabArt } from "@/components/LabArt";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { studentLab } from "@/lib/id-card";

const statusTone: Record<string, string> = {
  present: "text-[var(--success)]",
  late: "text-[var(--accent)]",
  absent: "text-[var(--danger)]",
  excused: "text-[var(--ink-soft)]",
};

export default function ProfilePage() {
  const { currentStudent, xpHistory, exams, attendance, achievements, missions, setAvatarKey } =
    useApp();
  if (!currentStudent) return null;

  const lab = studentLab(currentStudent);
  const progress = xpProgress(currentStudent.xp);

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">همه‌چیز در یک جا</div>
        <h1 className="display mt-2 text-4xl">پروفایل دانش‌آموز</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          اطلاعات شخصی، تاریخچه، دستاوردها و یادداشت‌های منتور.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="surface h-fit p-6">
          <div className="flex items-center gap-4">
            <LabArt lab={lab} size="lg" showBadge />
            <div>
              <div className="display text-3xl font-bold">
                {currentStudent.name}
              </div>
              <div className="mono text-sm text-[var(--ink-soft)]">
                {currentStudent.studentId}
              </div>
            </div>
          </div>
          <dl className="mt-7 space-y-3.5 text-sm">
            {[
              ["ایمیل", currentStudent.email],
              ["آزمایشگاه", lab.name],
              ["سطح", String(currentStudent.level)],
              ["سکه", String(currentStudent.coins)],
              ["مهر", String(currentStudent.stamps)],
              ["عضویت", formatDate(currentStudent.joinedAt)],
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
              <span className="font-semibold">امتیاز تا سطح بعد</span>
              <span className="mono text-xs text-[var(--ink-soft)]">
                {progress.current}/{progress.total}
              </span>
            </div>
            <ProgressBar value={progress.percent} color={lab.color} />
          </div>
          <div className="mt-8">
            <h2 className="display text-xl">آواتار کارت شناسایی</h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
              {currentStudent.gender === "female" ? "دختر" : "پسر"} — با لول‌آپ، نسخهٔ
              آزمایشگاهی همین استایل روی کارت می‌آید.
            </p>
            <AvatarPicker
              className="mt-4"
              gender={currentStudent.gender}
              labId={lab.id}
              value={currentStudent.avatarKey}
              onChange={setAvatarKey}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="surface p-6">
            <h2 className="display text-2xl">تاریخچه امتیاز</h2>
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
            <h2 className="display text-2xl">تاریخچه آزمون</h2>
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
                    رتبه #{exam.rank} · {formatDate(exam.date)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface p-6">
            <h2 className="display text-2xl">حضور و غیاب</h2>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {attendance.map((a) => (
                <div key={a.session} className="surface-flat p-3 text-center">
                  <div className="mono text-xs font-bold">S{a.session}</div>
                  <div
                    className={`mt-1 text-[10px] font-bold ${statusTone[a.status]}`}
                  >
                    {attendanceLabel(a.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface p-6">
            <h2 className="display text-2xl">تاریخچه ماموریت</h2>
            <ul className="mt-4 divide-y divide-[var(--line)] text-sm">
              {missions.map((m) => (
                <li key={m.key} className="flex justify-between py-2.5">
                  <span>{m.title}</span>
                  <span
                    className={`mono text-[10px] font-bold ${
                      m.completed
                        ? "text-[var(--success)]"
                        : "text-[var(--ink-faint)]"
                    }`}
                  >
                    {m.completed ? "تکمیل‌شده" : "باز"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface p-6">
            <h2 className="display text-2xl">نشان‌ها</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {achievements
                .filter((a) => a.unlocked)
                .map((a) => (
                  <span
                    key={a.id}
                    className="rounded-full border border-[rgba(var(--brand-rgb),0.4)] bg-[rgba(var(--brand-rgb),0.1)] px-3.5 py-1.5 text-sm font-bold text-[var(--brand)]"
                  >
                    {a.title}
                  </span>
                ))}
              {!achievements.some((a) => a.unlocked) && (
                <span className="text-sm text-[var(--ink-soft)]">
                  هنوز نشانی باز نشده است.
                </span>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
