"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CurriculumTree from "@/components/exam/CurriculumTree";
import { getCurriculumSubjects } from "@/lib/exam/curriculum";
import type { BankQuestion, ExamType, GradeLevel, StudyTrack } from "@/lib/exam/types";
import { getExamTypeLabel, getGradeTrackLabel } from "@/lib/exam/types";

const GRADES: GradeLevel[] = [10, 11, 12];
const TRACKS: StudyTrack[] = ["math", "experimental"];

const emptyForm = {
  grade: 12 as GradeLevel,
  track: "math" as StudyTrack,
  subject_id: "",
  chapter_id: "",
  question_type: "test" as ExamType,
  stem: "",
  options: ["", "", "", ""],
  correct_option: 1,
};

export default function QuestionBankPanel() {
  const [filterGrade, setFilterGrade] = useState<GradeLevel>(12);
  const [filterTrack, setFilterTrack] = useState<StudyTrack>("math");
  const [filterSubjectId, setFilterSubjectId] = useState("");
  const [filterChapterId, setFilterChapterId] = useState("");
  const [filterType, setFilterType] = useState<ExamType | "">("");
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filterSubjects = useMemo(
    () => getCurriculumSubjects(filterGrade, filterTrack),
    [filterGrade, filterTrack]
  );

  const formSubjects = useMemo(
    () => getCurriculumSubjects(form.grade, form.track),
    [form.grade, form.track]
  );

  const formChapters = useMemo(() => {
    const subject = formSubjects.find((s) => s.id === form.subject_id);
    return subject?.chapters ?? [];
  }, [formSubjects, form.subject_id]);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        grade: String(filterGrade),
        track: filterTrack,
      });
      if (filterType) params.set("question_type", filterType);
      if (filterSubjectId) params.set("subject_id", filterSubjectId);
      if (filterChapterId) params.set("chapter_id", filterChapterId);

      const res = await fetch(`/api/admin/question-bank?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در بارگذاری");
        return;
      }
      setQuestions(data.questions);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }, [filterGrade, filterTrack, filterType, filterSubjectId, filterChapterId]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    setFilterSubjectId("");
    setFilterChapterId("");
  }, [filterGrade, filterTrack]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function startCreate(subjectId?: string, chapterId?: string) {
    setForm({
      ...emptyForm,
      grade: filterGrade,
      track: filterTrack,
      subject_id: subjectId ?? filterSubjectId,
      chapter_id: chapterId ?? filterChapterId,
      question_type: filterType || "test",
    });
    setEditingId(null);
    setShowForm(true);
    setSuccess("");
    setError("");
  }

  function startEdit(question: BankQuestion) {
    setForm({
      grade: question.grade,
      track: question.track,
      subject_id: question.subject_id,
      chapter_id: question.chapter_id,
      question_type: question.question_type,
      stem: question.stem,
      options: question.options ?? ["", "", "", ""],
      correct_option: question.correct_option ?? 1,
    });
    setEditingId(question.id);
    setShowForm(true);
    setSuccess("");
    setError("");
  }

  function setOption(index: number, value: string) {
    setForm((prev) => {
      const options = [...prev.options];
      options[index] = value;
      return { ...prev, options };
    });
  }

  function addOption() {
    if (form.options.length >= 6) return;
    setForm((prev) => ({ ...prev, options: [...prev.options, ""] }));
  }

  function removeOption(index: number) {
    if (form.options.length <= 2) return;
    setForm((prev) => {
      const options = prev.options.filter((_, i) => i !== index);
      let correct = prev.correct_option;
      if (correct > options.length) correct = options.length;
      return { ...prev, options, correct_option: correct };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      grade: form.grade,
      track: form.track,
      subject_id: form.subject_id,
      chapter_id: form.chapter_id,
      question_type: form.question_type,
      stem: form.stem,
      options: form.question_type === "test" ? form.options.map((o) => o.trim()).filter(Boolean) : [],
      correct_option: form.question_type === "test" ? form.correct_option : null,
    };

    try {
      const res = await fetch("/api/admin/question-bank", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ذخیره سوال");
        return;
      }
      setSuccess(editingId ? "سوال ویرایش شد" : "سوال اضافه شد");
      resetForm();
      loadQuestions();
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("آیا از حذف این سوال مطمئن هستید؟")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/question-bank?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در حذف");
        return;
      }
      loadQuestions();
    } catch {
      setError("خطا در ارتباط با سرور");
    }
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div>
            <h2 className="font-bold text-lg">بانک سوال</h2>
            <p className="text-sm text-slate-500 mt-1">
              فقط دروس اختصاصی (ریاضی، فیزیک، شیمی، زیست، هندسه، حسابان و...)
            </p>
          </div>
          <button type="button" onClick={() => startCreate()} className="btn-primary text-sm">
            افزودن سوال
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <select
            className="input-field"
            value={filterGrade}
            onChange={(e) => setFilterGrade(Number(e.target.value) as GradeLevel)}
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>
                پایه {g === 10 ? "دهم" : g === 11 ? "یازدهم" : "دوازدهم"}
              </option>
            ))}
          </select>
          <select
            className="input-field"
            value={filterTrack}
            onChange={(e) => setFilterTrack(e.target.value as StudyTrack)}
          >
            {TRACKS.map((t) => (
              <option key={t} value={t}>
                {t === "math" ? "ریاضی" : "تجربی"}
              </option>
            ))}
          </select>
          <select
            className="input-field"
            value={filterSubjectId}
            onChange={(e) => {
              setFilterSubjectId(e.target.value);
              setFilterChapterId("");
            }}
          >
            <option value="">همه دروس</option>
            {filterSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <select
            className="input-field"
            value={filterChapterId}
            onChange={(e) => setFilterChapterId(e.target.value)}
            disabled={!filterSubjectId}
          >
            <option value="">همه فصل‌ها</option>
            {filterSubjects
              .find((s) => s.id === filterSubjectId)
              ?.chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
          </select>
        </div>

        <select
          className="input-field max-w-xs"
          value={filterType}
          onChange={(e) => setFilterType((e.target.value as ExamType) || "")}
        >
          <option value="">همه انواع سوال</option>
          <option value="test">تستی</option>
          <option value="descriptive">تشریحی</option>
        </select>
      </div>

      <div className="card">
        <h3 className="font-bold mb-3">دروس اختصاصی {getGradeTrackLabel(filterGrade, filterTrack)}</h3>
        <CurriculumTree
          grade={filterGrade}
          track={filterTrack}
          selectedSubjectId={filterSubjectId}
          selectedChapterId={filterChapterId}
          onSelectChapter={(subjectId, chapterId) => {
            setFilterSubjectId(subjectId);
            setFilterChapterId(chapterId);
          }}
        />
      </div>

      {showForm && (
        <div className="card max-w-3xl">
          <h3 className="font-bold mb-4">{editingId ? "ویرایش سوال" : "سوال جدید"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">پایه</label>
                <select
                  className="input-field"
                  value={form.grade}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      grade: Number(e.target.value) as GradeLevel,
                      subject_id: "",
                      chapter_id: "",
                    }))
                  }
                  required
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g === 10 ? "دهم" : g === 11 ? "یازدهم" : "دوازدهم"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">رشته</label>
                <select
                  className="input-field"
                  value={form.track}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      track: e.target.value as StudyTrack,
                      subject_id: "",
                      chapter_id: "",
                    }))
                  }
                  required
                >
                  <option value="math">ریاضی</option>
                  <option value="experimental">تجربی</option>
                </select>
              </div>
              <div>
                <label className="label">درس</label>
                <select
                  className="input-field"
                  value={form.subject_id}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, subject_id: e.target.value, chapter_id: "" }))
                  }
                  required
                >
                  <option value="">انتخاب درس</option>
                  {formSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">فصل</label>
                <select
                  className="input-field"
                  value={form.chapter_id}
                  onChange={(e) => setForm((p) => ({ ...p, chapter_id: e.target.value }))}
                  required
                  disabled={!form.subject_id}
                >
                  <option value="">انتخاب فصل</option>
                  {formChapters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">نوع سوال</label>
                <select
                  className="input-field"
                  value={form.question_type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, question_type: e.target.value as ExamType }))
                  }
                  required
                >
                  <option value="test">تستی</option>
                  <option value="descriptive">تشریحی</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">متن سوال</label>
              <textarea
                className="input-field min-h-28 resize-y"
                value={form.stem}
                onChange={(e) => setForm((p) => ({ ...p, stem: e.target.value }))}
                placeholder="متن سوال را بنویسید..."
                required
              />
            </div>

            {form.question_type === "test" && (
              <div>
                <label className="label">گزینه‌ها</label>
                <div className="space-y-2">
                  {form.options.map((opt, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="text-sm font-medium text-slate-500 w-8">{index + 1}</span>
                      <input
                        type="text"
                        className="input-field flex-1"
                        value={opt}
                        onChange={(e) => setOption(index, e.target.value)}
                        placeholder={`گزینه ${index + 1}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="btn-danger text-xs px-2 py-1"
                        disabled={form.options.length <= 2}
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
                {form.options.length < 6 && (
                  <button type="button" onClick={addOption} className="btn-secondary text-sm mt-2">
                    افزودن گزینه
                  </button>
                )}

                <div className="mt-4">
                  <label className="label">پاسخ صحیح</label>
                  <div className="flex gap-2 flex-wrap">
                    {form.options.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, correct_option: index + 1 }))}
                        className={`w-10 h-10 rounded-lg text-sm font-bold ${
                          form.correct_option === index + 1
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            <div className="flex gap-2">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "ثبت سوال"}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
          {success}
        </div>
      )}

      {!showForm && error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      <div className="card">
        {loading ? (
          <p className="text-slate-500 text-center py-8">در حال بارگذاری...</p>
        ) : questions.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            سوالی یافت نشد. روی یک فصل کلیک کنید یا سوال جدید اضافه کنید.
          </p>
        ) : (
          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q.id}
                className="border border-slate-200 rounded-xl p-4 bg-white hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {getGradeTrackLabel(q.grade, q.track)}
                      </span>
                      {q.subject_title && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {q.subject_title}
                        </span>
                      )}
                      {q.chapter_title && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                          {q.chapter_title}
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {getExamTypeLabel(q.question_type)}
                      </span>
                      <span className="text-xs text-slate-400">#{q.id}</span>
                    </div>
                    <p className="text-slate-800 whitespace-pre-wrap">{q.stem}</p>
                    {q.options && q.options.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        {q.options.map((opt, i) => (
                          <li key={i} className={q.correct_option === i + 1 ? "text-emerald-700 font-medium" : ""}>
                            {i + 1}. {opt}
                            {q.correct_option === i + 1 && " ✓"}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(q)} className="btn-secondary text-xs">
                      ویرایش
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="btn-danger text-xs">
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
