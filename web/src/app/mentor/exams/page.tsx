"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
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
        <div className="eyebrow">ارزیابی</div>
        <h1 className="display mt-2 text-4xl">سیستم آزمون</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          ایجاد آزمون با موضوع، نمره، درصد، رتبه و توضیحات منتور.
        </p>
      </div>

      <form
        className="surface grid gap-5 p-6 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          addExam({
            subject,
            date: new Date().toISOString().slice(0, 10),
            score,
            percentage: score,
            rank: Math.max(1, Math.round((100 - score) / 8) + 1),
            comment: comment || "تلاش خوبی بود. موضوعات ضعیف را بیشتر تمرین کن.",
          });
          setComment("");
        }}
      >
        <div>
          <label className="text-sm font-bold">موضوع</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="field mt-2"
          />
        </div>
        <div>
          <label className="text-sm font-bold">نمره / درصد</label>
          <input
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="field mt-2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-bold">توضیح منتور</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="field mt-2 resize-none"
            placeholder="نقاط قوت، ضعف، تمرکز بعدی…"
          />
        </div>
        <Button type="submit" className="md:col-span-2 md:w-fit">
          <Plus size={16} />
          ثبت آزمون
        </Button>
      </form>

      <div className="space-y-3">
        {exams.map((exam) => (
          <div key={exam.id} className="surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="display text-2xl">{exam.subject}</div>
                <div className="mono mt-1 text-xs text-[var(--ink-faint)]">
                  {formatDate(exam.date)} · رتبه #{exam.rank}
                </div>
              </div>
              <div className="text-right">
                <div className="display text-3xl font-bold text-[var(--brand)]">
                  {exam.percentage}%
                </div>
                <div className="mono text-xs text-[var(--ink-faint)]">
                  نمره {exam.score}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
              {exam.comment}
            </p>
            <ProgressBar value={exam.percentage} className="mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
