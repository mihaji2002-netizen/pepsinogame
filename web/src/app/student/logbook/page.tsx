"use client";

import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export default function LogbookPage() {
  const { logbook, updateLogbook, currentStudent } = useApp();
  if (!currentStudent) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="display text-4xl font-bold">دفترچه مأموریت</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          بازتاب روزانه برای {logbook.date}. برد، چالش و تمرکز فردا را ثبت کن.
        </p>
      </div>

      <div className="surface space-y-5 p-6">
        {[
          { key: "win" as const, label: "برد امروز", placeholder: "چه چیزی جلو برد؟" },
          {
            key: "challenge" as const,
            label: "چالش امروز",
            placeholder: "کجا اصطکاک بود؟",
          },
          {
            key: "tomorrowFocus" as const,
            label: "تمرکز فردا",
            placeholder: "یک نیت تیز برای فردا.",
          },
        ].map((field) => (
          <div key={field.key}>
            <label className="text-sm font-semibold">{field.label}</label>
            <textarea
              value={logbook[field.key]}
              onChange={(e) => updateLogbook({ [field.key]: e.target.value })}
              rows={3}
              placeholder={field.placeholder}
              className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none ring-[var(--brand)] focus:ring-2"
            />
          </div>
        ))}

        <div className="rounded-2xl bg-[var(--paper-deep)] p-4">
          <div className="text-sm font-semibold">یادداشت منتور</div>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">{logbook.mentorNotes}</p>
          <div className="mt-3 text-sm font-semibold">
            مهر منتور:{" "}
            <span className={logbook.stamped ? "text-[var(--success)]" : "text-[var(--ink-soft)]"}>
              {logbook.stamped ? "اعطا شد" : "هنوز نه"}
            </span>
          </div>
        </div>

        <Button
          onClick={() =>
            updateLogbook({
              win: logbook.win || "کار عمیق را بدون گوشی تمام کردم.",
              challenge: logbook.challenge || "هدف ۳ را دیر شروع کردم.",
              tomorrowFocus: logbook.tomorrowFocus || "اولین بلاک تمرکز را محافظت کنم.",
            })
          }
        >
          ذخیره بازتاب
        </Button>
      </div>
    </div>
  );
}
