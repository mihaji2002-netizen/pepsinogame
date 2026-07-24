"use client";

import { useCallback, useEffect, useState } from "react";
import {
  schoolGradeLabel,
  SCHOOL_GRADE_OPTIONS,
  studyFieldLabel,
  STUDY_FIELD_OPTIONS,
} from "@/lib/constants";
import type { MissionItem, SchoolGrade, StudyField } from "@/lib/types";
import { formatPersianDateTime } from "@/lib/exam/types";

type StudentSummary = {
  id: string;
  studentId: string;
  name: string;
  email: string | null;
  gender: string | null;
  grade: number | null;
  studyField: string | null;
  level: number;
  xp: number;
  coins: number;
  stamps: number;
  lab: string | null;
};

type StudentDetail = {
  student: StudentSummary & {
    joinedAt: string | null;
    missions: MissionItem[];
    xpHistory: Array<{ id: string; amount: number; reason: string; at: string }>;
  };
  examResults: Array<{
    subject: string;
    percentage: number;
    rank: number | null;
    finished_at: string;
    comment: string;
  }>;
  pendingGrading: Array<{
    attempt_id: number;
    exam_id: number;
    title: string;
    finished_at: string;
  }>;
  pendingMissions: MissionItem[];
};

export default function AdminStudentsPanel() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [gradeFilter, setGradeFilter] = useState<SchoolGrade | "all">("all");
  const [fieldFilter, setFieldFilter] = useState<StudyField | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [error, setError] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (gradeFilter !== "all") params.set("grade", String(gradeFilter));
      if (fieldFilter !== "all") params.set("studyField", fieldFilter);
      const res = await fetch(`/api/admin/students?${params}`);
      const data = await res.json();
      if (res.ok) setStudents(data.students ?? []);
    } finally {
      setLoading(false);
    }
  }, [gradeFilter, fieldFilter]);

  const loadDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/students/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در بارگذاری");
        return;
      }
      setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  async function adjustRewards(xpDelta: number, coinsDelta: number, reason: string) {
    if (!selectedId) return;
    setAdjusting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/students/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp_delta: xpDelta, coins_delta: coinsDelta, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در اعمال تغییر");
        return;
      }
      await loadStudents();
      await loadDetail(selectedId);
    } finally {
      setAdjusting(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <div className="card">
        <h2 className="font-bold text-lg mb-4">دانش‌آموزان</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            className="input-field max-w-[140px]"
            value={gradeFilter}
            onChange={(e) =>
              setGradeFilter(
                e.target.value === "all" ? "all" : (Number(e.target.value) as SchoolGrade),
              )
            }
          >
            <option value="all">همه پایه‌ها</option>
            {SCHOOL_GRADE_OPTIONS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
          <select
            className="input-field max-w-[140px]"
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value as StudyField | "all")}
          >
            <option value="all">همه رشته‌ها</option>
            {STUDY_FIELD_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-slate-500 text-center py-8">در حال بارگذاری...</p>
        ) : students.length === 0 ? (
          <p className="text-slate-500 text-center py-8">دانش‌آموزی یافت نشد</p>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
            {students.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => setSelectedId(student.id)}
                className={`w-full text-right px-4 py-3 transition-colors hover:bg-emerald-50 ${
                  selectedId === student.id ? "bg-emerald-50 border-r-4 border-emerald-600" : ""
                }`}
              >
                <div className="font-bold text-slate-900">{student.name}</div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
                  <span>{student.studentId}</span>
                  {student.grade && (
                    <span>
                      {schoolGradeLabel(student.grade as SchoolGrade)} ·{" "}
                      {studyFieldLabel(student.studyField as StudyField)}
                    </span>
                  )}
                  <span>Level {student.level}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card min-h-[420px]">
        {!selectedId ? (
          <p className="text-slate-500 text-center py-16">
            برای مشاهده جزئیات، روی نام دانش‌آموز کلیک کنید
          </p>
        ) : detailLoading ? (
          <p className="text-slate-500 text-center py-16">در حال بارگذاری جزئیات...</p>
        ) : detail ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{detail.student.name}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {detail.student.studentId} · {detail.student.email}
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  پایه{" "}
                  {detail.student.grade
                    ? schoolGradeLabel(detail.student.grade as SchoolGrade)
                    : "—"}{" "}
                  · رشته{" "}
                  {detail.student.studyField
                    ? studyFieldLabel(detail.student.studyField as StudyField)
                    : "—"}{" "}
                  · Lab {detail.student.lab ?? "—"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={adjusting}
                  onClick={() => adjustRewards(50, 0, "افزایش XP توسط ادمین")}
                  className="btn-secondary text-xs"
                >
                  +۵۰ XP
                </button>
                <button
                  type="button"
                  disabled={adjusting}
                  onClick={() => adjustRewards(-50, 0, "کسر XP توسط ادمین")}
                  className="btn-danger text-xs"
                >
                  −۵۰ XP
                </button>
                <button
                  type="button"
                  disabled={adjusting}
                  onClick={() => adjustRewards(0, 10, "افزایش Coin توسط ادمین")}
                  className="btn-secondary text-xs"
                >
                  +۱۰ Coin
                </button>
                <button
                  type="button"
                  disabled={adjusting}
                  onClick={() => adjustRewards(0, -10, "کسر Coin توسط ادمین")}
                  className="btn-danger text-xs"
                >
                  −۱۰ Coin
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ["Level", detail.student.level],
                ["XP", detail.student.xp],
                ["Coin", detail.student.coins],
                ["Stamp", detail.student.stamps],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 px-4 py-3">
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="text-xl font-bold mt-1">{value}</div>
                </div>
              ))}
            </div>

            {(detail.pendingMissions.length > 0 || detail.pendingGrading.length > 0) && (
              <section>
                <h3 className="font-bold text-amber-700 mb-3">نیاز به تأیید / اقدام</h3>
                <ul className="space-y-2 text-sm">
                  {detail.pendingMissions.map((m) => (
                    <li key={m.key} className="rounded-xl bg-amber-50 px-4 py-3">
                      Mission «{m.title}» تکمیل شده — در انتظار تأیید منتور
                    </li>
                  ))}
                  {detail.pendingGrading.map((g) => (
                    <li key={g.attempt_id} className="rounded-xl bg-amber-50 px-4 py-3">
                      تصحیح آزمون «{g.title}» — ارسال شده در{" "}
                      {formatPersianDateTime(g.finished_at)}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h3 className="font-bold mb-3">نتایج آزمون‌ها</h3>
              {detail.examResults.length === 0 ? (
                <p className="text-sm text-slate-500">هنوز نتیجه آزمونی ثبت نشده</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {detail.examResults.map((exam) => (
                    <li
                      key={`${exam.subject}-${exam.finished_at}`}
                      className="flex justify-between rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <span className="font-medium">{exam.subject}</span>
                      <span>
                        {Math.round(exam.percentage)}%
                        {exam.rank ? ` · رتبه ${exam.rank}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="font-bold mb-3">فعالیت XP</h3>
              <ul className="space-y-2 text-sm max-h-48 overflow-y-auto">
                {detail.student.xpHistory.length === 0 ? (
                  <li className="text-slate-500">فعالیتی ثبت نشده</li>
                ) : (
                  detail.student.xpHistory.map((event) => (
                    <li
                      key={event.id}
                      className="flex justify-between border-b border-slate-100 pb-2"
                    >
                      <span>{event.reason}</span>
                      <span className={event.amount >= 0 ? "text-emerald-700" : "text-red-600"}>
                        {event.amount >= 0 ? "+" : ""}
                        {event.amount}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section>
              <h3 className="font-bold mb-3">وضعیت Missionها</h3>
              <ul className="grid gap-2 sm:grid-cols-2 text-sm">
                {detail.student.missions.map((m) => (
                  <li key={m.key} className="rounded-xl bg-slate-50 px-3 py-2 flex justify-between">
                    <span>{m.title}</span>
                    <span
                      className={
                        m.completed
                          ? m.approved
                            ? "text-emerald-700"
                            : "text-amber-700"
                          : "text-slate-400"
                      }
                    >
                      {m.completed ? (m.approved ? "تأیید" : "انتظار") : "باز"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
