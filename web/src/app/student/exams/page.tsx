"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";
import { formatDate } from "@/lib/utils";

type AssignedExam = {
  exam_id: number;
  title: string;
  exam_type: "test" | "descriptive";
  duration_minutes: number;
  question_count: number;
  assignment_status: "assigned" | "started" | "completed";
  attempt_id: number | null;
  percentage: number | null;
  rank: number | null;
  finished_at: string | null;
  grading_status: string | null;
  availability_error: string | null;
};

export default function StudentExamsPage() {
  const router = useRouter();
  const { currentStudent } = useApp();
  const [exams, setExams] = useState<AssignedExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadExams = useCallback(async () => {
    if (!currentStudent) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${currentStudent.id}/exams`);
      const data = await res.json();
      if (res.ok) setExams(data.exams ?? []);
    } finally {
      setLoading(false);
    }
  }, [currentStudent]);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  if (!currentStudent) return null;

  async function startExam(examId: number) {
    setStartingId(examId);
    setError("");
    try {
      const res = await fetch("/api/exams/start-assigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: currentStudent!.id,
          exam_id: examId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در شروع آزمون");
        return;
      }

      sessionStorage.setItem(
        `exam_${data.attempt_id}`,
        JSON.stringify({
          startedAt: Date.now(),
          durationMinutes: data.exam.duration_minutes,
        }),
      );

      router.push(`/exam/${data.attempt_id}`);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setStartingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Exam</div>
        <h1 className="display mt-2 text-4xl">آزمون‌های من</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          آزمون‌هایی که منتور برای شما فعال کرده — شرکت کنید و نتیجه در پروفایل ثبت
          می‌شود.
        </p>
      </div>

      {error && (
        <div className="surface border border-[rgba(255,100,100,0.35)] p-4 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="surface p-8 text-center text-[var(--ink-soft)]">
          در حال بارگذاری آزمون‌ها…
        </div>
      ) : exams.length === 0 ? (
        <div className="surface p-8 text-center text-[var(--ink-soft)]">
          هنوز آزمونی به شما اختصاص داده نشده است.
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => {
            const isDone = exam.assignment_status === "completed";
            const isPendingGrade =
              exam.exam_type === "descriptive" &&
              exam.finished_at &&
              exam.grading_status === "pending";
            const canStart = !isDone && !isPendingGrade && !exam.availability_error;

            return (
              <div key={exam.exam_id} className="surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="display text-2xl font-bold">{exam.title}</div>
                    <p className="mt-2 text-sm text-[var(--ink-soft)]">
                      {exam.question_count} سوال · {exam.duration_minutes} دقیقه ·{" "}
                      {exam.exam_type === "test" ? "تستی" : "تشریحی"}
                    </p>
                    {exam.availability_error && (
                      <p className="mt-2 text-sm text-[var(--accent)]">
                        {exam.availability_error}
                      </p>
                    )}
                    {isDone && exam.percentage != null && (
                      <p className="mt-3 text-sm">
                        نتیجه:{" "}
                        <span className="font-bold text-[var(--brand)]">
                          {Math.round(exam.percentage)}%
                        </span>
                        {exam.rank ? ` · رتبه ${exam.rank}` : ""}
                        {exam.finished_at
                          ? ` · ${formatDate(exam.finished_at.slice(0, 10))}`
                          : ""}
                      </p>
                    )}
                    {isPendingGrade && (
                      <p className="mt-3 text-sm text-[var(--accent)]">
                        در انتظار نمره‌دهی منتور
                      </p>
                    )}
                  </div>
                  <div>
                    {isDone && exam.attempt_id ? (
                      <Link href={`/result/${exam.attempt_id}`}>
                        <Button variant="secondary">
                          <CheckCircle2 size={16} />
                          مشاهده نتیجه
                        </Button>
                      </Link>
                    ) : isPendingGrade && exam.attempt_id ? (
                      <Button variant="secondary" disabled>
                        <Clock size={16} />
                        در انتظار نمره
                      </Button>
                    ) : (
                      <Button
                        disabled={!canStart || startingId === exam.exam_id}
                        onClick={() => startExam(exam.exam_id)}
                      >
                        <PlayCircle size={16} />
                        {startingId === exam.exam_id
                          ? "در حال شروع…"
                          : exam.assignment_status === "started"
                            ? "ادامه آزمون"
                            : "شروع آزمون"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/student/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand)]"
      >
        <ArrowRight size={14} className="rtl:rotate-180" />
        بازگشت به داشبورد
      </Link>
    </div>
  );
}
