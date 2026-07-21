"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function ExamsPage() {
  const { exams, addExam } = useApp();
  const [subject, setSubject] = useState("ریاضی");
  const [score, setScore] = useState(85);
  const [comment, setComment] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-4xl font-bold">سیستم آزمون</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          ساخت آزمون با درس، نمره، درصد، رتبه و نظر منتور.
        </p>
      </div>

      <form
        className="surface grid gap-4 p-6 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          addExam({
            subject,
            date: new Date().toISOString().slice(0, 10),
            score,
            percentage: score,
            rank: Math.max(1, Math.round((100 - score) / 8) + 1),
            comment: comment || "تلاش خوب. روی نقاط ضعف بیشتر تمرین کن.",
          });
          setComment("");
        }}
      >
        <div>
          <label className="text-sm font-medium">درس</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none ring-[var(--brand)] focus:ring-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">نمره / درصد</label>
          <input
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none ring-[var(--brand)] focus:ring-2"
            dir="ltr"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">نظر منتور</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none ring-[var(--brand)] focus:ring-2"
            placeholder="نقاط قوت، ضعف، تمرکز بعدی…"
          />
        </div>
        <Button type="submit" className="md:col-span-2 md:w-fit">
          ثبت آزمون
        </Button>
      </form>

      <div className="space-y-3">
        {exams.map((exam) => (
          <div key={exam.id} className="surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="display text-2xl font-bold">{exam.subject}</div>
                <div className="mt-1 text-sm text-[var(--ink-soft)]">
                  {formatDate(exam.date)} · رتبه #{exam.rank}
                </div>
              </div>
              <div className="text-left">
                <div className="display text-3xl font-bold">{exam.percentage}٪</div>
                <div className="text-sm text-[var(--ink-soft)]">نمره {exam.score}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">{exam.comment}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/8">
              <div
                className="h-full rounded-full bg-[var(--brand)]"
                style={{ width: `${exam.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
