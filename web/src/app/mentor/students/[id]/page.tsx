"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LABS, xpProgress } from "@/lib/constants";
import { useApp } from "@/lib/store";
import { formatDate } from "@/lib/utils";

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
        <p>Student not found.</p>
        <Link href="/mentor/dashboard" className="mt-4 inline-block text-[var(--brand-deep)]">
          Back to roster
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
        className="no-print inline-flex items-center gap-2 text-sm text-[var(--ink-soft)]"
      >
        <ArrowLeft size={16} />
        Back to command center
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl font-bold">{student.name}</h1>
          <p className="mt-2 text-[var(--ink-soft)]">
            Full timeline, charts, growth, attendance, exams, coins, XP, reports, and notes.
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button onClick={() => awardStamp(student.id)}>Award stamp</Button>
          <Button variant="secondary" onClick={() => adjustXp(student.id, 100, "Mentor adjustment")}>
            +100 XP
          </Button>
          <Button variant="secondary" onClick={() => adjustCoins(student.id, 15)}>
            +15 Coins
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <IdCard student={student} />
        <div className="surface p-6">
          <h2 className="display text-2xl font-bold">Growth Snapshot</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Lab", lab.name],
              ["Level", String(student.level)],
              ["Stamps", String(student.stamps)],
              ["Attendance", `${presentCount}/6`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[var(--paper-deep)] p-3">
                <div className="text-xs text-[var(--ink-soft)]">{label}</div>
                <div className="mt-1 text-lg font-semibold">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span>XP progress</span>
              <span>
                {progress.current}/{progress.total}
              </span>
            </div>
            <ProgressBar value={progress.percent} color={lab.color} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface p-6">
          <h2 className="display text-2xl font-bold">XP Timeline</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {xpHistory.map((event) => (
              <li key={event.id} className="flex justify-between gap-4 border-b border-[var(--line)] pb-3 last:border-none">
                <div>
                  <div className="font-medium">{event.reason}</div>
                  <div className="text-[var(--ink-soft)]">{formatDate(event.at)}</div>
                </div>
                <div className="font-semibold text-[var(--brand-deep)]">+{event.amount}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-6">
          <h2 className="display text-2xl font-bold">Exams</h2>
          <ul className="mt-4 space-y-3">
            {exams.map((exam) => (
              <li key={exam.id} className="rounded-2xl bg-[var(--paper-deep)] p-4">
                <div className="flex justify-between font-semibold">
                  <span>{exam.subject}</span>
                  <span>{exam.percentage}%</span>
                </div>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">{exam.comment}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-6">
          <h2 className="display text-2xl font-bold">Attendance</h2>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {attendance.map((a) => (
              <div key={a.session} className="rounded-xl bg-[var(--paper-deep)] p-3 text-center text-xs">
                <div className="font-semibold">S{a.session}</div>
                <div className="mt-1 capitalize">{a.status}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-6">
          <h2 className="display text-2xl font-bold">Missions & Notes</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {missions.map((m) => (
              <li key={m.key} className="flex justify-between">
                <span>{m.title}</span>
                <span className="text-[var(--ink-soft)]">
                  {m.completed ? (m.approved ? "Approved" : "Pending") : "Open"}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-2xl bg-[var(--paper-deep)] p-4 text-sm">
            <div className="font-semibold">Mentor Notes</div>
            <p className="mt-2 text-[var(--ink-soft)]">{logbook.mentorNotes}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
