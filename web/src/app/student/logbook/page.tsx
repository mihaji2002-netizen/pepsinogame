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
        <div className="eyebrow">Daily reflection</div>
        <h1 className="display mt-2 text-4xl font-bold">Mission Logbook</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Reflection for <span className="mono text-[var(--brand)]">{logbook.date}</span>.
          Capture the win, the challenge, and tomorrow&apos;s focus.
        </p>
      </div>

      <div className="surface space-y-6 p-6 md:p-8">
        {[
          {
            key: "win" as const,
            label: "Today’s Win",
            placeholder: "What moved the needle?",
          },
          {
            key: "challenge" as const,
            label: "Today’s Challenge",
            placeholder: "Where did friction appear?",
          },
          {
            key: "tomorrowFocus" as const,
            label: "Tomorrow Focus",
            placeholder: "One sharp intention for tomorrow.",
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
            <div className="text-sm font-bold">Mentor Notes</div>
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                logbook.stamped
                  ? "border-[rgba(242,181,68,0.5)] bg-[rgba(242,181,68,0.12)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--ink-faint)]"
              }`}
            >
              <Stamp size={13} />
              {logbook.stamped ? "Stamp awarded" : "No stamp yet"}
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
            {logbook.mentorNotes}
          </p>
        </div>

        <Button
          onClick={() =>
            updateLogbook({
              win: logbook.win || "Completed deep work without phone.",
              challenge: logbook.challenge || "Started Target 3 too late.",
              tomorrowFocus:
                logbook.tomorrowFocus || "Protect the first focus block.",
            })
          }
        >
          Save reflection
        </Button>
      </div>
    </div>
  );
}
