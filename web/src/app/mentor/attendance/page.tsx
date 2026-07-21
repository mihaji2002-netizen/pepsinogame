"use client";

import { Button } from "@/components/ui/Button";
import type { AttendanceStatus } from "@/lib/types";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const statuses: AttendanceStatus[] = ["present", "late", "absent", "excused"];

const statusTone: Record<AttendanceStatus, string> = {
  present: "var(--success)",
  late: "var(--accent)",
  absent: "var(--danger)",
  excused: "var(--ink-soft)",
};

export default function AttendancePage() {
  const { attendance, setAttendance, students } = useApp();
  const student = students[0];

  const counts = statuses.reduce(
    (acc, status) => {
      acc[status] = attendance.filter((a) => a.status === status).length;
      return acc;
    },
    {} as Record<AttendanceStatus, number>,
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Six sessions</div>
        <h1 className="display mt-2 text-4xl font-bold">Attendance</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Six-session attendance for {student?.name ?? "selected student"}.
          Statistics generate automatically.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {statuses.map((status) => (
          <div key={status} className="surface p-5">
            <div
              className="mono text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: statusTone[status] }}
            >
              {status}
            </div>
            <div className="display mt-2 text-3xl font-bold">
              {counts[status]}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {attendance.map((record) => (
          <div
            key={record.session}
            className="surface flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="font-bold">Session {record.session}</div>
              <div className="mono mt-0.5 text-xs text-[var(--ink-faint)]">
                {record.date}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={record.status === status ? "primary" : "secondary"}
                  className={cn(
                    "capitalize",
                    record.status === status && "lab-glow",
                  )}
                  onClick={() => setAttendance(record.session, status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
