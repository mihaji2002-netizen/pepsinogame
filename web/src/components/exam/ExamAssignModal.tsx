"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type PepsinoStudent = {
  id: string;
  student_code: string;
  name: string;
  email: string | null;
};

export function ExamAssignModal({
  examId,
  examTitle,
  onClose,
  onSaved,
}: {
  examId: number;
  examTitle: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [students, setStudents] = useState<PepsinoStudent[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/exams/assign?exam_id=${examId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "خطا در بارگذاری");
          return;
        }
        setStudents(data.students ?? []);
        setSelected(new Set(data.assigned_student_ids ?? []));
      } catch {
        setError("خطا در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [examId]);

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/exams/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_id: examId,
          student_ids: Array.from(selected),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ذخیره");
        return;
      }
      onSaved();
      onClose();
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card max-h-[85vh] w-full max-w-lg overflow-hidden">
        <div className="flex items-start justify-between gap-3 border-b border-emerald-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">تخصیص دانش‌آموز</h3>
            <p className="mt-1 text-sm text-slate-500">{examTitle}</p>
          </div>
          <button type="button" onClick={onClose} className="btn-secondary !p-2">
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-center text-slate-500">در حال بارگذاری…</p>
        ) : (
          <div className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto">
            {students.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                دانش‌آموزی ثبت نشده. ابتدا از پنل PEPSINO LAB ثبت‌نام کنید.
              </p>
            ) : (
              students.map((student) => (
                <label
                  key={student.id}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-emerald-100 px-4 py-3 hover:bg-emerald-50/60"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(student.id)}
                    onChange={() => toggle(student.id)}
                    className="h-4 w-4 accent-emerald-600"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900">{student.name}</div>
                    <div className="font-mono text-xs text-slate-500" dir="ltr">
                      {student.student_code}
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex justify-end gap-2 border-t border-emerald-100 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="btn-primary"
          >
            {saving ? "در حال ذخیره…" : "ذخیره تخصیص"}
          </button>
        </div>
      </div>
    </div>
  );
}
