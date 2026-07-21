"use client";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/BrandMark";
import { LABS, xpProgress } from "@/lib/constants";
import { useApp } from "@/lib/store";

export default function ReportsPage() {
  const { students, attendance, exams, currentStudent, missions } = useApp();
  const student = students[0] ?? currentStudent;
  if (!student) return null;

  const lab = LABS.find((l) => l.id === student.lab) ?? LABS[0];
  const progress = xpProgress(student.xp);
  const present = attendance.filter(
    (a) => a.status === "present" || a.status === "late",
  ).length;
  const avgExam =
    exams.reduce((sum, e) => sum + e.percentage, 0) / Math.max(exams.length, 1);
  const missionRate =
    (missions.filter((m) => m.completed).length / Math.max(missions.length, 1)) * 100;

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl font-bold">گزارش‌ها</h1>
          <p className="mt-2 text-[var(--ink-soft)]">
            خلاصه هفتگی، ماهانه و فصلی — قابل چاپ و آماده PDF.
          </p>
        </div>
        <Button onClick={() => window.print()}>خروجی PDF / چاپ</Button>
      </div>

      <article className="print-sheet surface overflow-hidden">
        <div
          className="px-8 py-10 text-white"
          style={{
            background: `linear-gradient(135deg, ${lab.color}, #102027 70%)`,
          }}
        >
          <BrandMark className="[&_*]:text-white" />
          <div className="display mt-8 text-4xl font-bold">خلاصه فصل</div>
          <p className="mt-2 max-w-xl text-white/75">
            نمای خودکار برای {student.name} · {student.studentId}
          </p>
        </div>

        <div className="grid gap-6 p-8 md:grid-cols-2">
          <section>
            <h2 className="display text-2xl font-bold">شاخص‌های اصلی</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["لاب", lab.name],
                ["سطح", String(student.level)],
                ["پیشرفت XP", `${progress.current}/${progress.total}`],
                ["سکه", String(student.coins)],
                ["مهر منتور", String(student.stamps)],
                ["حضور", `${present}/6 جلسه`],
                ["تکمیل مأموریت", `${Math.round(missionRate)}٪`],
                ["میانگین آزمون", `${avgExam.toFixed(1)}٪`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-[var(--line)] pb-2"
                >
                  <dt className="text-[var(--ink-soft)]">{label}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="display text-2xl font-bold">روایت رشد</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--ink-soft)]">
              <p>
                <strong className="text-[var(--ink)]">نقاط قوت:</strong> ریتم مأموریت پایدار و روند
                رو به بهبود آزمون در دروس اصلی.
              </p>
              <p>
                <strong className="text-[var(--ink)]">نقاط ضعف:</strong> گاهی شروع دیرهنگام بلاک‌های
                هدف؛ اولین پنجره کار عمیق را محافظت کن.
              </p>
              <p>
                <strong className="text-[var(--ink)]">یادداشت منتور:</strong> عادت‌های نورو را محکم
                نگه دار. کیفیت مهر مهم‌تر از سرعت است. برای باز شدن لاب ریسرچ آماده شو.
              </p>
            </div>
          </section>
        </div>

        <div className="border-t border-[var(--line)] px-8 py-6 text-xs text-[var(--ink-soft)]">
          PEPSINO LAB · هفتگی / ماهانه / فصلی · گزارش چاپی پریمیوم
        </div>
      </article>
    </div>
  );
}
