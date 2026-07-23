"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Coins, Stamp, Zap } from "lucide-react";
import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LABS, xpProgress } from "@/lib/constants";
import { useApp } from "@/lib/store";
import { attendanceLabel, fa } from "@/lib/fa";
import { formatDate } from "@/lib/utils";

const statusTone: Record<string, string> = {
  present: "text-[var(--success)]",
  late: "text-[var(--accent)]",
  absent: "text-[var(--danger)]",
  excused: "text-[var(--ink-soft)]",
};

export default function MentorStudentDetailPage() {
  const params = useParams<{ id: string }>();
  const {
    students,
    attendance,
    exams,
    xpHistory,
    missions,
    awardStamp,
    adjustXp,
    adjustCoins,
    logbook,
  } = useApp();

  const student = students.find((s) => s.id === params.id);
  if (!student) {
    return (
      <div className="surface p-8">
        <p>دانش‌آموز یافت نشد.</p>
        <Link
          href="/mentor/dashboard"
          className="mt-4 inline-block font-bold text-[var(--brand)]"
        >
          بازگشت به فهرست
        </Link>
      </div>
    );
  }

  const lab = LABS.find((l) => l.id === student.lab) ?? LABS[0];
  const progress = xpProgress(student.xp);
  const presentCount = attendance.filter((a) => a.status === "present").length;

  return (
    <div className="space-y-6">
      <Link
        href="/mentor/dashboard"
        className="no-print inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
      >
        <ArrowLeft size={16} className="rtl:rotate-180" />
        بازگشت به مرکز فرماندهی
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">جزئیات دانش‌آموز</div>
          <h1 className="display mt-2 text-4xl">{student.name}</h1>
          <p className="mono mt-2 text-sm text-[var(--ink-soft)]">
            {student.studentId} ·{" "}
            <span style={{ color: lab.color }}>آزمایشگاه {lab.name}</span>
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button onClick={() => awardStamp(student.id)}>
            <Stamp size={15} />
            اعطای مهر
          </Button>
          <Button
            variant="secondary"
            onClick={() => adjustXp(student.id, 100, fa.xp.mentorAdjust)}
          >
            <Zap size={15} />
            +۱۰۰ امتیاز
          </Button>
          <Button variant="secondary" onClick={() => adjustCoins(student.id, 15)}>
            <Coins size={15} />
            +۱۵ سکه
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <IdCard student={student} />
        <div className="surface p-6">
          <h2 className="display text-2xl">نمای کلی رشد</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["آزمایشگاه", lab.name],
              ["سطح", String(student.level)],
              ["مهر", String(student.stamps)],
              ["حضور", `${presentCount}/6`],
            ].map(([label, value]) => (
              <div key={label} className="surface-flat p-3.5">
                <div className="mono text-[10px] text-[var(--ink-faint)]">
                  {label}
                </div>
                <div className="display mt-1.5 text-lg font-bold">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold">پیشرفت امتیاز</span>
              <span className="mono text-xs text-[var(--ink-soft)]">
                {progress.current}/{progress.total}
              </span>
            </div>
            <ProgressBar value={progress.percent} color={lab.color} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface p-6">
          <h2 className="display text-2xl">خط زمانی امتیاز</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {xpHistory.map((event) => (
              <li
                key={event.id}
                className="flex justify-between gap-4 border-b border-[var(--line)] pb-3 last:border-none"
              >
                <div>
                  <div className="font-semibold">{event.reason}</div>
                  <div className="mono text-xs text-[var(--ink-faint)]">
                    {formatDate(event.at)}
                  </div>
                </div>
                <div className="mono font-bold text-[var(--brand)]">
                  +{event.amount}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-6">
          <h2 className="display text-2xl">آزمون‌ها</h2>
          <ul className="mt-4 space-y-3">
            {exams.map((exam) => (
              <li key={exam.id} className="surface-flat p-4">
                <div className="flex justify-between font-bold">
                  <span>{exam.subject}</span>
                  <span className="mono text-[var(--brand)]">
                    {exam.percentage}%
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {exam.comment}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-6">
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
        </section>

        <section className="surface p-6">
          <h2 className="display text-2xl">ماموریت‌ها و یادداشت‌ها</h2>
          <ul className="mt-4 divide-y divide-[var(--line)] text-sm">
            {missions.map((m) => (
              <li key={m.key} className="flex justify-between py-2.5">
                <span>{m.title}</span>
                <span
                  className={`mono text-[10px] font-bold ${
                    m.completed
                      ? m.approved
                        ? "text-[var(--success)]"
                        : "text-[var(--accent)]"
                      : "text-[var(--ink-faint)]"
                  }`}
                >
                  {m.completed ? (m.approved ? "تأییدشده" : "در انتظار") : "باز"}
                </span>
              </li>
            ))}
          </ul>
          <div className="surface-flat mt-5 p-4 text-sm">
            <div className="font-bold">یادداشت منتور</div>
            <p className="mt-2 leading-relaxed text-[var(--ink-soft)]">
              {logbook.mentorNotes}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
