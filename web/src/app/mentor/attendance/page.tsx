"use client";

import { Button } from "@/components/ui/Button";
import type { AttendanceStatus } from "@/lib/types";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const statuses: AttendanceStatus[] = ["present", "late", "absent", "excused"];
const labels: Record<AttendanceStatus, string> = {
  present: "حاضر",
  late: "تأخیر",
  absent: "غایب",
  excused: "موجه",
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
        <h1 className="display text-4xl font-bold">حضور و غیاب</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          حضور شش‌جلسه‌ای برای {student?.name ?? "دانش‌آموز انتخاب‌شده"}. آمار خودکار ساخته می‌شود.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {statuses.map((status) => (
          <div key={status} className="surface p-5">
            <div className="text-sm text-[var(--ink-soft)]">{labels[status]}</div>
            <div className="display mt-2 text-3xl font-bold">{counts[status]}</div>
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
              <div className="font-semibold">جلسه {record.session}</div>
              <div className="text-sm text-[var(--ink-soft)]">{record.date}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={record.status === status ? "primary" : "secondary"}
                  className={cn(record.status === status && "lab-glow")}
                  onClick={() => setAttendance(record.session, status)}
                >
                  {labels[status]}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
