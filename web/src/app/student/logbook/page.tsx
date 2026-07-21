"use client";

import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

export default function LogbookPage() {
  const { logbook, updateLogbook, currentStudent } = useApp();
  if (!currentStudent) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="display text-4xl font-bold">Mission Logbook</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Daily reflection for {logbook.date}. Capture the win, the challenge, and tomorrow’s focus.
        </p>
      </div>

      <div className="surface space-y-5 p-6">
        {[
          { key: "win" as const, label: "Today’s Win", placeholder: "What moved the needle?" },
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
          <div className="text-sm font-semibold">Mentor Notes</div>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">{logbook.mentorNotes}</p>
          <div className="mt-3 text-sm font-semibold">
            Mentor Stamp:{" "}
            <span className={logbook.stamped ? "text-[var(--success)]" : "text-[var(--ink-soft)]"}>
              {logbook.stamped ? "Awarded" : "Not yet"}
            </span>
          </div>
        </div>

        <Button
          onClick={() =>
            updateLogbook({
              win: logbook.win || "Completed deep work without phone.",
              challenge: logbook.challenge || "Started Target 3 too late.",
              tomorrowFocus: logbook.tomorrowFocus || "Protect the first focus block.",
            })
          }
        >
          Save reflection
        </Button>
      </div>
    </div>
  );
}
