"use client";

import { useEffect, useMemo, useState } from "react";
import Logo from "@/components/exam/Logo";
import CurriculumTree from "@/components/exam/CurriculumTree";
import GradingPanel from "@/components/exam/GradingPanel";
import QuestionBankPanel from "@/components/exam/QuestionBankPanel";
import { ExamAssignModal } from "@/components/exam/ExamAssignModal";
import AdminStudentsPanel from "@/components/exam/AdminStudentsPanel";
import { getCurriculumSubjects } from "@/lib/exam/curriculum";
import type {
  BankQuestion,
  ExamAvailabilityStatus,
  ExamListItem,
  ExamSourceType,
  ExamType,
  GradeLevel,
  GradingStatus,
  RankingEntry,
  StudyTrack,
} from "@/lib/exam/types";
import {
  buildQuestionNumbers,
  formatDuration,
  formatGradeOutOf20,
  formatPersianDateTime,
  getAvailabilityLabel,
  getExamAvailability,
  getExamSourceLabel,
  getExamTypeLabel,
  getGradeTrackLabel,
  getGradingStatusLabel,
  isTestExam,
} from "@/lib/exam/types";

function defaultDateTimeLocal(offsetHours = 0) {
  const d = new Date();
  d.setHours(d.getHours() + offsetHours);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function availabilityBadgeClass(status: ExamAvailabilityStatus) {
  switch (status) {
    case "open":
      return "badge-open";
    case "scheduled":
      return "badge-scheduled";
    case "closed":
      return "badge-closed";
    default:
      return "badge-disabled";
  }
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "create" | "questionBank" | "rankings" | "grading" | "students">("list");
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportPdfError, setExportPdfError] = useState("");

  const [title, setTitle] = useState("");
  const [createSourceType, setCreateSourceType] = useState<ExamSourceType>("pdf");
  const [examType, setExamType] = useState<ExamType>("test");
  const [bankGrade, setBankGrade] = useState<GradeLevel>(12);
  const [bankTrack, setBankTrack] = useState<StudyTrack>("math");
  const [bankSubjectId, setBankSubjectId] = useState("");
  const [bankChapterId, setBankChapterId] = useState("");
  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [loadingBankQuestions, setLoadingBankQuestions] = useState(false);
  const [duration, setDuration] = useState(60);
  const [questionCount, setQuestionCount] = useState(20);
  const [optionCount, setOptionCount] = useState(4);
  const [questionsPdf, setQuestionsPdf] = useState<File | null>(null);
  const [answerSheetPdf, setAnswerSheetPdf] = useState<File | null>(null);
  const [answerKey, setAnswerKey] = useState<Record<string, number>>({});
  const [activeFrom, setActiveFrom] = useState(defaultDateTimeLocal(0));
  const [activeUntil, setActiveUntil] = useState(defaultDateTimeLocal(24 * 7));
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [creating, setCreating] = useState(false);
  const [assignExam, setAssignExam] = useState<{ id: number; title: string } | null>(null);

  const questionNumbers = useMemo(
    () => buildQuestionNumbers(questionCount),
    [questionCount]
  );

  const bankCurriculumSubjects = useMemo(
    () => getCurriculumSubjects(bankGrade, bankTrack),
    [bankGrade, bankTrack]
  );

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (createSourceType !== "bank") return;

    async function loadBankQuestions() {
      setLoadingBankQuestions(true);
      try {
        const params = new URLSearchParams({
          grade: String(bankGrade),
          track: bankTrack,
          question_type: examType,
        });
        if (bankSubjectId) params.set("subject_id", bankSubjectId);
        if (bankChapterId) params.set("chapter_id", bankChapterId);
        const res = await fetch(`/api/admin/question-bank?${params}`);
        if (res.ok) {
          const data = await res.json();
          setBankQuestions(data.questions);
        }
      } catch {
        // ignore
      } finally {
        setLoadingBankQuestions(false);
      }
    }

    loadBankQuestions();
  }, [createSourceType, bankGrade, bankTrack, bankSubjectId, bankChapterId, examType]);

  useEffect(() => {
    setBankSubjectId("");
    setBankChapterId("");
    setSelectedQuestionIds([]);
  }, [bankGrade, bankTrack, examType]);

  useEffect(() => {
    setSelectedQuestionIds((prev) =>
      prev.filter((id) => bankQuestions.some((q) => q.id === id))
    );
  }, [bankQuestions]);

  useEffect(() => {
    if (createSourceType !== "pdf") return;
    setAnswerKey((prev) => {
      const next: Record<string, number> = {};
      for (let i = 1; i <= questionCount; i++) {
        const key = String(i);
        next[key] = prev[key] ?? 0;
      }
      return next;
    });
  }, [questionCount, createSourceType]);

  async function checkAuth() {
    try {
      const res = await fetch("/api/admin/exams");
      if (res.ok) {
        const data = await res.json();
        setExams(data.exams);
        setAuthenticated(true);
      }
    } catch {
      // not authenticated
    }
    setChecking(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("رمز عبور اشتباه است");
      return;
    }
    setAuthenticated(true);
    loadExams();
  }

  async function loadExams() {
    const res = await fetch("/api/admin/exams");
    if (res.ok) {
      const data = await res.json();
      setExams(data.exams);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPassword("");
  }

  function setAnswerForQuestion(questionNumber: number, option: number) {
    setAnswerKey((prev) => ({ ...prev, [String(questionNumber)]: option }));
  }

  function resetCreateForm() {
    setTitle("");
    setCreateSourceType("pdf");
    setExamType("test");
    setBankGrade(12);
    setBankTrack("math");
    setBankSubjectId("");
    setBankChapterId("");
    setSelectedQuestionIds([]);
    setDuration(60);
    setQuestionCount(20);
    setOptionCount(4);
    setQuestionsPdf(null);
    setAnswerSheetPdf(null);
    setAnswerKey({});
    setActiveFrom(defaultDateTimeLocal(0));
    setActiveUntil(defaultDateTimeLocal(24 * 7));
  }

  function toggleBankQuestion(id: number) {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  }

  function moveSelectedQuestion(id: number, direction: -1 | 1) {
    setSelectedQuestionIds((prev) => {
      const index = prev.indexOf(id);
      if (index < 0) return prev;
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  async function handleCreateExam(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    if (createSourceType === "pdf") {
      if (!questionsPdf) {
        setCreateError("فایل PDF سوالات را انتخاب کنید");
        return;
      }
      if (!answerSheetPdf) {
        setCreateError("فایل PDF پاسخنامه را انتخاب کنید");
        return;
      }

      const missing = isTestExam(examType)
        ? questionNumbers.find((n) => !answerKey[String(n)])
        : undefined;
      if (missing) {
        setCreateError(`پاسخ سوال ${missing} را مشخص کنید`);
        return;
      }
    } else {
      if (selectedQuestionIds.length < 1) {
        setCreateError("حداقل یک سوال از بانک انتخاب کنید");
        return;
      }
    }

    setCreating(true);

    try {
      if (createSourceType === "bank") {
        const res = await fetch("/api/admin/exams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source_type: "bank",
            title,
            exam_type: examType,
            grade: bankGrade,
            track: bankTrack,
            duration_minutes: duration,
            active_from: activeFrom,
            active_until: activeUntil,
            question_ids: selectedQuestionIds,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setCreateError(data.error || "خطا در ایجاد آزمون");
          return;
        }
        setCreateSuccess(`آزمون ایجاد شد! کد آزمون: ${data.access_code}`);
        resetCreateForm();
        loadExams();
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("exam_type", examType);
      formData.append("duration_minutes", String(duration));
      formData.append("question_count", String(questionCount));
      formData.append("option_count", String(optionCount));
      formData.append("answer_key", isTestExam(examType) ? JSON.stringify(answerKey) : "{}");
      formData.append("questions_pdf", questionsPdf!);
      formData.append("answer_sheet_pdf", answerSheetPdf!);
      formData.append("active_from", activeFrom);
      formData.append("active_until", activeUntil);

      const res = await fetch("/api/admin/exams", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "خطا در ایجاد آزمون");
        return;
      }

      setCreateSuccess(`آزمون ایجاد شد! کد آزمون: ${data.access_code}`);
      resetCreateForm();
      loadExams();
    } catch {
      setCreateError("خطا در ارتباط با سرور");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(id: number, isActive: boolean) {
    await fetch("/api/admin/exams", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !isActive }),
    });
    loadExams();
  }

  async function handleDelete(id: number) {
    if (!confirm("آیا از حذف این آزمون مطمئن هستید؟")) return;
    await fetch(`/api/admin/exams?id=${id}`, { method: "DELETE" });
    loadExams();
  }

  async function loadRankings(examId: number) {
    setSelectedExamId(examId);
    setActiveTab("rankings");
    setExportPdfError("");
    const res = await fetch(`/api/admin/exams?rankings=${examId}`);
    if (res.ok) {
      const data = await res.json();
      setRankings(data.rankings);
    }
  }

  async function downloadScoresPdf() {
    if (!selectedExamId || rankings.length === 0) return;

    setExportingPdf(true);
    setExportPdfError("");

    try {
      const res = await fetch(`/api/admin/exams/export-pdf?examId=${selectedExamId}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setExportPdfError(data.error || "خطا در ساخت PDF");
        return;
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `scores-exam-${selectedExamId}.pdf`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportPdfError("خطا در دانلود PDF");
    } finally {
      setExportingPdf(false);
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">در حال بررسی...</div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="page-shell">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <Logo size="md" className="mb-4" />
            <h1 className="text-2xl font-bold text-slate-900">پنل مشاور</h1>
            <p className="text-slate-500 mt-1">Pepsino LAB</p>
          </div>
          <div className="card">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">رمز عبور</label>
                <input
                  type="password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {loginError}
                </div>
              )}
              <button type="submit" className="btn-primary w-full">
                ورود
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-slate-400 mt-4">
            <a href="/" className="hover:text-emerald-700">بازگشت به صفحه دانش‌آموز</a>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="bg-white/80 backdrop-blur border-b border-emerald-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">پنل مشاور</h1>
              <p className="text-sm text-slate-500">مدیریت آزمون‌های Pepsino LAB</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-sm">
            خروج
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["list", "create", "questionBank", "grading", "rankings", "students"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "bg-white text-slate-600 border border-emerald-100 hover:border-emerald-300"
              }`}
            >
              {tab === "list" && "لیست آزمون‌ها"}
              {tab === "create" && "ایجاد آزمون"}
              {tab === "questionBank" && "بانک سوال"}
              {tab === "grading" && "تصحیح تشریحی"}
              {tab === "rankings" && "رتبه‌بندی"}
              {tab === "students" && "دانش‌آموزان"}
            </button>
          ))}
        </div>


        {activeTab === "list" && (
          <div className="space-y-4">
            {exams.length === 0 ? (
              <div className="card text-center text-slate-500">
                هنوز آزمونی ایجاد نشده. از تب «ایجاد آزمون» شروع کنید.
              </div>
            ) : (
              exams.map((exam) => {
                const availability = getExamAvailability(exam);
                return (
                <div key={exam.id} className="card flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900">{exam.title}</h3>
                      <span className={availabilityBadgeClass(availability)}>
                        {getAvailabilityLabel(availability)}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                        {getExamTypeLabel(exam.exam_type)}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
                        {getExamSourceLabel(exam.source_type)}
                      </span>
                      {exam.grade && exam.track && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100">
                          {getGradeTrackLabel(exam.grade, exam.track)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {exam.question_count} سوال · {exam.option_count} گزینه ·{" "}
                      {formatDuration(exam.duration_minutes)} · {exam.attempt_count} شرکت‌کننده
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      بازه فعال: {formatPersianDateTime(exam.active_from)} تا{" "}
                      {formatPersianDateTime(exam.active_until)}
                    </p>
                    <p className="text-sm mt-1">
                      کد آزمون:{" "}
                      <span className="font-mono font-bold text-emerald-700 tracking-widest" dir="ltr">
                        {exam.access_code}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setAssignExam({ id: exam.id, title: exam.title })}
                      className="btn-secondary text-sm"
                    >
                      تخصیص دانش‌آموز
                    </button>
                    <button
                      onClick={() => loadRankings(exam.id)}
                      className="btn-secondary text-sm"
                    >
                      رتبه‌بندی
                    </button>
                    <button
                      onClick={() => handleToggleActive(exam.id, !!exam.is_active)}
                      className="btn-secondary text-sm"
                    >
                      {exam.is_active ? "غیرفعال" : "فعال"}
                    </button>
                    <button onClick={() => handleDelete(exam.id)} className="btn-danger text-sm">
                      حذف
                    </button>
                  </div>
                </div>
              )})
            )}
          </div>
        )}

        {activeTab === "questionBank" && <QuestionBankPanel />}

        {activeTab === "create" && (
          <div className="card max-w-3xl">
            <h2 className="font-bold text-lg mb-4">ایجاد آزمون جدید</h2>
            <form onSubmit={handleCreateExam} className="space-y-5">
              <div>
                <label className="label">روش ساخت آزمون</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["pdf", "bank"] as const).map((source) => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => setCreateSourceType(source)}
                      className={`p-4 rounded-2xl border-2 text-right transition-all ${
                        createSourceType === source
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-emerald-200"
                      }`}
                    >
                      <p className="font-bold text-slate-900">{getExamSourceLabel(source)}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {source === "pdf"
                          ? "آپلود فایل PDF سوالات و پاسخنامه"
                          : "انتخاب سوال از بانک سوال"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">نوع آزمون</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["test", "descriptive"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setExamType(type)}
                      className={`p-4 rounded-2xl border-2 text-right transition-all ${
                        examType === type
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-emerald-200"
                      }`}
                    >
                      <p className="font-bold text-slate-900">{getExamTypeLabel(type)}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {type === "test"
                          ? "پاسخ گزینه‌ای با تصحیح خودکار"
                          : "پاسخ تشریحی با ثبت متن دانش‌آموز"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">عنوان آزمون</label>
                  <input
                    type="text"
                    className="input-field"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: آزمون پپسینوژن - جلسه ۳"
                    required
                  />
                </div>

                <div>
                  <label className="label">مدت زمان (دقیقه)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min={1}
                    max={300}
                    required
                  />
                </div>

                {createSourceType === "pdf" && (
                  <>
                    <div>
                      <label className="label">تعداد سوال</label>
                      <input
                        type="number"
                        className="input-field"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                        min={1}
                        max={200}
                        required
                      />
                    </div>

                    <div>
                      <label className="label">تعداد گزینه هر سوال</label>
                      <select
                        className="input-field"
                        value={optionCount}
                        onChange={(e) => setOptionCount(Number(e.target.value))}
                        disabled={!isTestExam(examType)}
                      >
                        {[2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} گزینه
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {createSourceType === "bank" && (
                  <>
                    <div>
                      <label className="label">پایه</label>
                      <select
                        className="input-field"
                        value={bankGrade}
                        onChange={(e) => setBankGrade(Number(e.target.value) as GradeLevel)}
                      >
                        <option value={10}>دهم</option>
                        <option value={11}>یازدهم</option>
                        <option value={12}>دوازدهم</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">رشته</label>
                      <select
                        className="input-field"
                        value={bankTrack}
                        onChange={(e) => setBankTrack(e.target.value as StudyTrack)}
                      >
                        <option value="math">ریاضی</option>
                        <option value="experimental">تجربی</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="label">شروع دسترسی</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={activeFrom}
                    onChange={(e) => setActiveFrom(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="label">پایان دسترسی</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={activeUntil}
                    onChange={(e) => setActiveUntil(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>
              </div>

              {createSourceType === "pdf" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">فایل PDF سوالات</label>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="input-field"
                    onChange={(e) => setQuestionsPdf(e.target.files?.[0] ?? null)}
                    required
                  />
                </div>
                <div>
                  <label className="label">فایل PDF پاسخنامه</label>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="input-field"
                    onChange={(e) => setAnswerSheetPdf(e.target.files?.[0] ?? null)}
                    required
                  />
                </div>
              </div>
              )}

              {createSourceType === "bank" && (
                <div className="space-y-4">
                  <div className="card bg-slate-50/50">
                    <h3 className="font-bold text-sm mb-3">
                      دروس اختصاصی {getGradeTrackLabel(bankGrade, bankTrack)}
                    </h3>
                    <CurriculumTree
                      grade={bankGrade}
                      track={bankTrack}
                      selectedSubjectId={bankSubjectId}
                      selectedChapterId={bankChapterId}
                      onSelectChapter={(subjectId, chapterId) => {
                        setBankSubjectId(subjectId);
                        setBankChapterId(chapterId);
                      }}
                      compact
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="label">فیلتر درس</label>
                      <select
                        className="input-field"
                        value={bankSubjectId}
                        onChange={(e) => {
                          setBankSubjectId(e.target.value);
                          setBankChapterId("");
                        }}
                      >
                        <option value="">همه دروس</option>
                        {bankCurriculumSubjects.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">فیلتر فصل</label>
                      <select
                        className="input-field"
                        value={bankChapterId}
                        onChange={(e) => setBankChapterId(e.target.value)}
                        disabled={!bankSubjectId}
                      >
                        <option value="">همه فصل‌ها</option>
                        {bankCurriculumSubjects
                          .find((s) => s.id === bankSubjectId)
                          ?.chapters.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                  <label className="label">
                    انتخاب سوال از بانک ({selectedQuestionIds.length} سوال انتخاب‌شده)
                  </label>
                  {loadingBankQuestions ? (
                    <p className="text-sm text-slate-500 py-4">در حال بارگذاری سوالات...</p>
                  ) : bankQuestions.length === 0 ? (
                    <div className="bg-amber-50 text-amber-800 px-4 py-3 rounded-xl text-sm">
                      سوالی برای {getGradeTrackLabel(bankGrade, bankTrack)} و نوع {getExamTypeLabel(examType)} یافت نشد.
                      از تب «بانک سوال» سوال اضافه کنید.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                        {bankQuestions.map((q) => (
                          <label
                            key={q.id}
                            className="flex items-start gap-3 px-4 py-3 bg-white cursor-pointer hover:bg-emerald-50/50"
                          >
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={selectedQuestionIds.includes(q.id)}
                              onChange={() => toggleBankQuestion(q.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-800 line-clamp-2">{q.stem}</p>
                              <p className="text-xs text-slate-400 mt-1">
                                {q.subject_title}
                                {q.chapter_title ? ` · ${q.chapter_title}` : ""} · #{q.id}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>

                      {selectedQuestionIds.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">ترتیب سوالات در آزمون</p>
                          <div className="space-y-2">
                            {selectedQuestionIds.map((id, index) => {
                              const q = bankQuestions.find((item) => item.id === id);
                              if (!q) return null;
                              return (
                                <div
                                  key={id}
                                  className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50"
                                >
                                  <span className="text-sm font-bold text-emerald-700 w-8">{index + 1}</span>
                                  <p className="flex-1 text-sm text-slate-700 line-clamp-1">{q.stem}</p>
                                  <button
                                    type="button"
                                    onClick={() => moveSelectedQuestion(id, -1)}
                                    disabled={index === 0}
                                    className="btn-secondary text-xs px-2 py-1"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveSelectedQuestion(id, 1)}
                                    disabled={index === selectedQuestionIds.length - 1}
                                    className="btn-secondary text-xs px-2 py-1"
                                  >
                                    ↓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleBankQuestion(id)}
                                    className="btn-danger text-xs px-2 py-1"
                                  >
                                    حذف
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </div>
              )}

              {createSourceType === "pdf" && isTestExam(examType) && (
              <div>
                <label className="label">کلید تصحیح (گزینه صحیح هر سوال)</label>
                <p className="text-xs text-slate-400 mb-3">
                  برای هر سوال، گزینه صحیح را انتخاب کنید
                </p>
                <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {questionNumbers.map((num) => (
                    <div
                      key={num}
                      className="flex items-center justify-between gap-3 px-4 py-3 bg-white"
                    >
                      <span className="font-medium text-slate-700 min-w-16">سوال {num}</span>
                      <div className="flex gap-2 flex-wrap">
                        {Array.from({ length: optionCount }, (_, i) => i + 1).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAnswerForQuestion(num, opt)}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${
                              answerKey[String(num)] === opt
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-emerald-50"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {createError && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {createError}
                </div>
              )}

              {createSuccess && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {createSuccess}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? "در حال ایجاد..." : "ایجاد آزمون"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "grading" && <GradingPanel exams={exams} />}

        {activeTab === "students" && <AdminStudentsPanel />}

        {activeTab === "rankings" && (
          <div className="card">
            <h2 className="font-bold text-lg mb-4">رتبه‌بندی / شرکت‌کنندگان</h2>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {exams.length > 0 && (
                <select
                  className="input-field max-w-xs"
                  value={selectedExamId ?? ""}
                  onChange={(e) => loadRankings(Number(e.target.value))}
                >
                  <option value="" disabled>
                    انتخاب آزمون
                  </option>
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({getExamTypeLabel(e.exam_type)})
                    </option>
                  ))}
                </select>
              )}

              {selectedExamId && rankings.length > 0 && (
                <button
                  type="button"
                  onClick={downloadScoresPdf}
                  className="btn-secondary"
                  disabled={exportingPdf}
                >
                  {exportingPdf ? "در حال ساخت PDF..." : "دانلود PDF نمرات"}
                </button>
              )}
            </div>

            {exportPdfError && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                {exportPdfError}
              </div>
            )}

            {rankings.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                {selectedExamId ? "هنوز کسی در این آزمون شرکت نکرده" : "یک آزمون انتخاب کنید"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      {selectedExamId && isTestExam(exams.find((e) => e.id === selectedExamId)!.exam_type) && (
                        <th className="text-right py-3 px-2">رتبه</th>
                      )}
                      <th className="text-right py-3 px-2">نام</th>
                      <th className="text-right py-3 px-2">نام خانوادگی</th>
                      {selectedExamId && isTestExam(exams.find((e) => e.id === selectedExamId)!.exam_type) ? (
                        <>
                          <th className="text-right py-3 px-2">درصد</th>
                          <th className="text-right py-3 px-2">تعداد صحیح</th>
                        </>
                      ) : (
                        <>
                          <th className="text-right py-3 px-2">وضعیت</th>
                          <th className="text-right py-3 px-2">نمره</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((r) => {
                      const isTest = selectedExamId
                        ? isTestExam(exams.find((e) => e.id === selectedExamId)!.exam_type)
                        : true;
                      return (
                      <tr key={r.attempt_id ?? `${r.first_name}-${r.last_name}-${r.finished_at}`} className="border-b border-slate-100 hover:bg-slate-50">
                        {isTest && <td className="py-3 px-2 font-bold text-emerald-700">{r.rank}</td>}
                        <td className="py-3 px-2">{r.first_name}</td>
                        <td className="py-3 px-2">{r.last_name}</td>
                        {isTest ? (
                          <>
                            <td className="py-3 px-2 font-medium">{r.percentage}%</td>
                            <td className="py-3 px-2 text-slate-500">
                              {r.correct_count}/{r.total_questions}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className={`py-3 px-2 ${r.grading_status === "graded" ? "text-emerald-700" : "text-amber-700"}`}>
                              {getGradingStatusLabel(r.grading_status ?? "pending")}
                            </td>
                            <td className="py-3 px-2 font-medium">
                              {r.grading_status === "graded"
                                ? `${r.percentage}% (${formatGradeOutOf20(r.correct_count, r.total_questions)})`
                                : "—"}
                            </td>
                          </>
                        )}
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {assignExam && (
        <ExamAssignModal
          examId={assignExam.id}
          examTitle={assignExam.title}
          onClose={() => setAssignExam(null)}
          onSaved={() => setCreateSuccess("دانش‌آموزان با موفقیت تخصیص داده شدند")}
        />
      )}
    </main>
  );
}
