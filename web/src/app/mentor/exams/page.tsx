"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ClipboardCheck, ExternalLink, Plus } from "lucide-react";
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
        <div className="eyebrow">Exam System</div>
        <h1 className="display mt-2 text-4xl">آزمون‌ها</h1>
        <p className="mt-2 max-w-xl text-[var(--ink-soft)]">
          برگزاری آزمون آنلاین، بانک سوال، نمره‌دهی و ثبت نتایج در پروفایل دانش‌آموز.
        </p>
      </div>

      <section className="surface overflow-hidden p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--brand)]">
              <ClipboardCheck size={20} />
              <h2 className="display text-2xl">برگزاری آزمون آنلاین</h2>
            </div>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--ink-soft)]">
              ساخت آزمون تستی یا دفترچه‌ای، آپلود PDF، بانک سوال، کد دسترسی برای
              دانش‌آموزان، نمره‌دهی و خروجی PDF کارنامه.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
              <li>
                · ورود دانش‌آموز:{" "}
                <span className="mono text-[var(--brand)]">/exam/join</span>
              </li>
              <li>
                · پنل برگزاری: <span className="mono text-[var(--brand)]">/admin</span>
              </li>
            </ul>
          </div>
          <Link href="/admin">
            <Button className="px-6 py-3">
              باز کردن پنل برگزاری
              <ExternalLink size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="display text-2xl">ثبت نتیجه در پرونده</h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
              نتایج خلاصه برای نمایش در پروفایل و گزارش منتور.
            </p>
          </div>
          <Link
            href="/mentor/dashboard"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)]"
          >
            <ArrowLeft size={14} className="rtl:rotate-180" />
            بازگشت
          </Link>
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
              comment:
                comment || "تلاش خوبی بود. موضوعات ضعیف را بیشتر تمرین کن.",
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
            ثبت نتیجه
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
      </section>
    </div>
  );
}
