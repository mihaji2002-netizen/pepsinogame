"use client";

import { useEffect, useMemo, useState } from "react";
import ImageLightbox from "@/components/exam/ImageLightbox";
import type { DescriptiveAnswer, ExamListItem, ExamQuestionItem, ExamSourceType } from "@/lib/exam/types";
import {
  buildQuestionNumbers,
  formatDescriptiveQuestionMaxScore,
  formatGradeOutOf20,
  getDescriptiveQuestionMaxScore,
  getGradingStatusLabel,
  normalizeDescriptiveAnswer,
} from "@/lib/exam/types";

interface Submission {
  id: number;
  first_name: string;
  last_name: string;
  percentage: number;
  correct_count: number;
  total_questions: number;
  grading_status: "pending" | "graded" | "auto";
  finished_at: string;
}

interface GradingDetail {
  attempt: {
    id: number;
    first_name: string;
    last_name: string;
    answers: Record<string, unknown>;
    question_scores: Record<string, number>;
    grading_status: string;
    percentage: number;
    correct_count: number;
    total_questions: number;
  };
  exam: {
    title: string;
    question_count: number;
    source_type?: ExamSourceType;
    questions?: ExamQuestionItem[];
    questions_pdf_url: string | null;
    answer_sheet_pdf_url: string | null;
  };
}

export default function GradingPanel({ exams }: { exams: ExamListItem[] }) {
  const descriptiveExams = exams.filter((e) => e.exam_type === "descriptive");
  const [selectedExamId, setSelectedExamId] = useState<number | "">("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);
  const [detail, setDetail] = useState<GradingDetail | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  const questionNumbers = useMemo(
    () => (detail ? buildQuestionNumbers(detail.exam.question_count) : []),
    [detail]
  );

  const questionMaxScore = useMemo(
    () => (detail ? getDescriptiveQuestionMaxScore(detail.exam.question_count) : 0),
    [detail]
  );

  const questionMaxScoreLabel = useMemo(
    () => (detail ? formatDescriptiveQuestionMaxScore(detail.exam.question_count) : "0"),
    [detail]
  );

  useEffect(() => {
    if (descriptiveExams.length > 0 && !selectedExamId) {
      setSelectedExamId(descriptiveExams[0].id);
    }
  }, [descriptiveExams, selectedExamId]);

  useEffect(() => {
    if (selectedExamId) {
      loadSubmissions(Number(selectedExamId));
    }
  }, [selectedExamId]);

  async function loadSubmissions(examId: number) {
    setLoading(true);
    setError("");
    setSelectedAttemptId(null);
    setDetail(null);
    try {
      const res = await fetch(`/api/admin/grading?examId=${examId}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در بارگذاری");
        return;
      }
      setSubmissions(data.submissions);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  async function loadAttempt(attemptId: number) {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/grading?attemptId=${attemptId}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در بارگذاری پاسخبرگ");
        return;
      }
      setSelectedAttemptId(attemptId);
      setDetail(data);
      const initialScores: Record<string, number> = {};
      for (let i = 1; i <= data.exam.question_count; i++) {
        const key = String(i);
        initialScores[key] = data.attempt.question_scores[key] ?? 0;
      }
      setScores(initialScores);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  async function saveGrade() {
    if (!selectedAttemptId) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/grading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attempt_id: selectedAttemptId,
          question_scores: scores,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ثبت نمره");
        return;
      }
      setSuccess(`نمره ثبت شد — ${data.attempt.percentage}%`);
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              attempt: {
                ...prev.attempt,
                grading_status: data.attempt.grading_status,
                percentage: data.attempt.percentage,
                correct_count: data.attempt.correct_count,
                total_questions: data.attempt.total_questions,
                graded_at: new Date().toISOString(),
              },
            }
          : prev
      );
      if (selectedExamId) loadSubmissions(Number(selectedExamId));
      loadAttempt(selectedAttemptId);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  }

  if (descriptiveExams.length === 0) {
    return (
      <div className="card text-center text-slate-500">
        هنوز آزمون تشریحی ایجاد نشده است.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="font-bold text-lg mb-4">تصحیح پاسخبرگ تشریحی</h2>
        <select
          className="input-field max-w-md"
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(Number(e.target.value))}
        >
          {descriptiveExams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-1">
          <h3 className="font-bold mb-3">پاسخبرگ‌های ارسالی</h3>
          {loading && !detail ? (
            <p className="text-slate-500 text-sm">در حال بارگذاری...</p>
          ) : submissions.length === 0 ? (
            <p className="text-slate-500 text-sm">هنوز پاسخبرگی ثبت نشده</p>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {submissions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadAttempt(s.id)}
                  className={`w-full text-right p-3 rounded-xl border transition-colors ${
                    selectedAttemptId === s.id
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-slate-200 hover:border-emerald-200"
                  }`}
                >
                  <p className="font-medium">{s.first_name} {s.last_name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {getGradingStatusLabel(s.grading_status)}
                    {s.grading_status === "graded" &&
                      ` · ${formatGradeOutOf20(s.correct_count, s.total_questions)}`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card lg:col-span-2">
          {!detail ? (
            <p className="text-slate-500 text-center py-16">
              یک پاسخبرگ را از لیست انتخاب کنید
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-bold text-lg">
                    {detail.attempt.first_name} {detail.attempt.last_name}
                  </h3>
                  <p className="text-sm text-slate-500">{detail.exam.title}</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    مجموع نمره آزمون از ۲۰ — هر سوال حداکثر {questionMaxScoreLabel} نمره
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    detail.attempt.grading_status === "graded"
                      ? "badge-open"
                      : "badge-scheduled"
                  }`}
                >
                  {getGradingStatusLabel(detail.attempt.grading_status as "pending" | "graded")}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {detail.exam.questions_pdf_url && (
                  <a
                    href={detail.exam.questions_pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary text-sm"
                  >
                    دفترچه سوالات
                  </a>
                )}
                {detail.exam.answer_sheet_pdf_url && (
                  <a
                    href={detail.exam.answer_sheet_pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary text-sm"
                  >
                    پاسخنامه مرجع
                  </a>
                )}
              </div>

              <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                {questionNumbers.map((num) => {
                  const answer = normalizeDescriptiveAnswer(detail.attempt.answers[String(num)]);
                  const questionData = detail.exam.questions?.find((q) => q.position === num);
                  return (
                    <div key={num} className="border border-emerald-100 rounded-2xl p-4 bg-emerald-50/30">
                      <p className="font-bold mb-2">سوال {num}</p>
                      {questionData?.stem && (
                        <p className="text-sm text-slate-700 whitespace-pre-wrap mb-3 bg-white rounded-xl p-3 border border-slate-100">
                          {questionData.stem}
                        </p>
                      )}

                      {answer.text.trim() && (
                        <div className="mb-3">
                          <p className="text-xs text-slate-500 mb-1">پاسخ متنی:</p>
                          <p className="text-sm whitespace-pre-wrap bg-white rounded-xl p-3 border border-slate-100">
                            {answer.text}
                          </p>
                        </div>
                      )}

                      {answer.images.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-slate-500 mb-2">تصاویر آپلود شده:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {answer.images.map((img) => {
                              const imageSrc = `/api/attempts/${detail.attempt.id}/image?file=${encodeURIComponent(img)}`;
                              return (
                              <button
                                key={img}
                                type="button"
                                onClick={() =>
                                  setPreviewImage({
                                    src: imageSrc,
                                    alt: `پاسخ سوال ${num}`,
                                  })
                                }
                                className="block w-full rounded-xl overflow-hidden border border-slate-200 bg-white cursor-zoom-in"
                              >
                                <img
                                  src={imageSrc}
                                  alt={`پاسخ سوال ${num}`}
                                  className="w-full h-48 object-contain bg-slate-50"
                                />
                              </button>
                            )})}
                          </div>
                        </div>
                      )}

                      {!answer.text.trim() && answer.images.length === 0 && (
                        <p className="text-sm text-slate-400 mb-3">پاسخی ثبت نشده</p>
                      )}

                      <div>
                        <label className="label">نمره (۰ تا {questionMaxScoreLabel})</label>
                        <input
                          type="number"
                          min={0}
                          max={questionMaxScore}
                          step={questionMaxScore >= 1 ? 0.25 : 0.1}
                          className="input-field max-w-[120px]"
                          value={scores[String(num)] ?? 0}
                          onChange={(e) =>
                            setScores((prev) => ({
                              ...prev,
                              [String(num)]: Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
              )}
              {success && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>
              )}

              <button onClick={saveGrade} className="btn-primary" disabled={saving}>
                {saving ? "در حال ثبت..." : "ثبت نمره و اتمام تصحیح"}
              </button>
            </div>
          )}
        </div>
      </div>

      {previewImage && (
        <ImageLightbox
          src={previewImage.src}
          alt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}
