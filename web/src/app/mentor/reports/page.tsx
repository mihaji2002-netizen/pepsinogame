"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LabArt } from "@/components/LabArt";
import { BRAND, LABS, xpProgress } from "@/lib/constants";
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
    (missions.filter((m) => m.completed).length /
      Math.max(missions.length, 1)) *
    100;

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">هفتگی · ماهانه · فصل</div>
          <h1 className="display mt-2 text-4xl">گزارش‌ها</h1>
          <p className="mt-2 text-[var(--ink-soft)]">
            خلاصه‌های قابل چاپ و PDF با ظاهر ممتاز.
          </p>
        </div>
        <Button onClick={() => window.print()}>
          <Printer size={16} />
          خروجی PDF / چاپ
        </Button>
      </div>

      <article className="print-sheet sheet overflow-hidden">
        <div
          className="relative overflow-hidden px-8 py-10 text-white"
          style={{
            background: `radial-gradient(500px 260px at 85% -30%, ${lab.color}55, transparent 70%), linear-gradient(140deg, #12121c, #05050a 75%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <LabArt lab={lab} size="sm" showBadge />
            <div>
              <div className="display text-base font-bold leading-none">
                {BRAND.nameEn}
              </div>
              <div className="mono mt-1 text-[10px] text-white/50">
                {BRAND.tagline}
              </div>
            </div>
          </div>
          <div className="display mt-8 text-4xl font-bold">خلاصه فصل</div>
          <p className="mt-2 max-w-xl text-white/65">
            نمای خودکار برای {student.name} ·{" "}
            <span className="mono">{student.studentId}</span>
          </p>
        </div>

        <div className="grid gap-8 p-8 md:grid-cols-2">
          <section>
            <h2 className="display text-2xl">شاخص‌های اصلی</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["آزمایشگاه", lab.name],
                ["سطح", String(student.level)],
                ["پیشرفت امتیاز", `${progress.current}/${progress.total}`],
                ["سکه", String(student.coins)],
                ["مهرهای منتور", String(student.stamps)],
                ["حضور", `${present}/۶ جلسه`],
                ["تکمیل ماموریت", `${Math.round(missionRate)}٪`],
                ["میانگین آزمون", `${avgExam.toFixed(1)}٪`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-[rgba(18,35,42,0.12)] pb-2"
                >
                  <dt className="text-[#52676d]">{label}</dt>
                  <dd className="font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="display text-2xl">روایت رشد</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#52676d]">
              <p>
                <strong className="text-[#12232a]">نقاط قوت:</strong>{" "}
                ریتم مداوم ماموریت و بهبود روند آزمون در دروس اصلی.
              </p>
              <p>
                <strong className="text-[#12232a]">نقاط ضعف:</strong>{" "}
                گاهی شروع دیر هدف‌ها؛ اولین بلوک کار عمیق را محافظت کن.
              </p>
              <p>
                <strong className="text-[#12232a]">یادداشت منتور:</strong> عادت‌های
                نورو را محکم نگه دار. کیفیت مهر بر سرعت. برای باز شدن آزمایشگاه
                پژوهش آماده شو.
              </p>
            </div>
          </section>
        </div>

        <div className="mono border-t border-[rgba(18,35,42,0.12)] px-8 py-5 text-[10px] text-[#7d9096]">
          {BRAND.nameEn} · هفتگی / ماهانه / فصل · گزارش چاپی ممتاز
        </div>
      </article>
    </div>
  );
}
