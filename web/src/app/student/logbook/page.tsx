"use client";

import { Stamp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

export default function LogbookPage() {
  const { logbook, updateLogbook, currentStudent } = useApp();
  if (!currentStudent) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="eyebrow">بازتاب روزانه</div>
        <h1 className="display mt-2 text-4xl">Logbook</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          بازتاب برای <span className="mono text-[var(--brand)]">{logbook.date}</span>.
          برد، چالش و تمرکز فردا را ثبت کن.
        </p>
      </div>

      <div className="surface space-y-6 p-6 md:p-8">
        {[
          {
            key: "win" as const,
            label: "برد امروز",
            placeholder: "چه چیزی پیشرفت را جلو انداخت؟",
          },
          {
            key: "challenge" as const,
            label: "چالش امروز",
            placeholder: "کجا اصطکاک پیش آمد؟",
          },
          {
            key: "tomorrowFocus" as const,
            label: "تمرکز فردا",
            placeholder: "یک نیت شفاف برای فردا.",
          },
        ].map((field) => (
          <div key={field.key}>
            <label className="text-sm font-bold">{field.label}</label>
            <textarea
              value={logbook[field.key]}
              onChange={(e) => updateLogbook({ [field.key]: e.target.value })}
              rows={3}
              placeholder={field.placeholder}
              className="field mt-2 resize-none"
            />
          </div>
        ))}

        <div className="surface-flat p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">یادداشت منتور</div>
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                logbook.stamped
                  ? "border-[rgba(242,181,68,0.5)] bg-[rgba(242,181,68,0.12)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--ink-faint)]"
              }`}
            >
              <Stamp size={13} />
              {logbook.stamped ? "Stamp اعطا شد" : "هنوز Stamp نیست"}
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
            {logbook.mentorNotes}
          </p>
        </div>

        <Button
          onClick={() =>
            updateLogbook({
              win: logbook.win || "کار عمیق را بدون موبایل تمام کردم.",
              challenge: logbook.challenge || "شروع Target 3 دیر بود.",
              tomorrowFocus:
                logbook.tomorrowFocus || "اولین بلوک تمرکز را محافظت کن.",
            })
          }
        >
          ذخیره بازتاب
        </Button>
      </div>
    </div>
  );
}
