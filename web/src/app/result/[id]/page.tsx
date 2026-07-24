"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ImageLightbox from "@/components/exam/ImageLightbox";
import {
  buildQuestionNumbers,
  getExamTypeLabel,
  formatGradeOutOf20,
  getGradingStatusLabel,
  isTestExam,
  normalizeDescriptiveAnswer,
  type ExamType,
  type GradingStatus,
} from "@/lib/exam/types";

interface ResultData {
  attempt: {
    first_name: string;
    last_name: string;
    correct_count: number;
    total_questions: number;
    percentage: number;
    rank: number | null;
    answers: Record<string, unknown>;
    grading_status: GradingStatus;
    graded_at: string | null;
    attempt_id?: number;
  };
  exam: {
    title: string;
    exam_type: ExamType;
    question_count: number;
    option_count: number;
    answer_sheet_pdf_url: string;
    answer_key?: Record<string, number>;
  };
}

export default function ResultPage() {
  const params = useParams();
  const attemptId = Number(params.id);
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  const questionNumbers = useMemo(
    () => (data ? buildQuestionNumbers(data.exam.question_count) : []),
    [data]
  );

  useEffect(() => {
    async function loadResult() {
      try {
        const res = await fetch(`/api/attempts/${attemptId}`);
        const result = await res.json();

        if (!res.ok || !result.attempt.finished_at) {
          setError(result.error || "نتیجه یافت نشد");
          setLoading(false);
          return;
        }

        setData({
          attempt: result.attempt,
          exam: result.exam,
        });
        setLoading(false);
      } catch {
        setError("خطا در بارگذاری نتیجه");
        setLoading(false);
      }
    }

    loadResult();
  }, [attemptId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">در حال بارگذاری نتیجه...</div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/" className="btn-primary inline-block">
            بازگشت
          </a>
        </div>
      </main>
    );
  }

  const { attempt, exam } = data;
  const isTest = isTestExam(exam.exam_type);
  const percentageColor =
    attempt.percentage >= 70
      ? "text-green-600"
      : attempt.percentage >= 50
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <main className="min-h-screen p-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="card text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">{isTest ? "🎉" : "✅"}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{exam.title}</h1>
            <p className="text-slate-500 mt-1">
              {attempt.first_name} {attempt.last_name}
            </p>
            <p className="text-sm text-emerald-700 mt-2 font-medium">
              {getExamTypeLabel(exam.exam_type)}
            </p>
          </div>

          {isTest ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500 mb-1">درصد</p>
                  <p className={`text-3xl font-bold ${percentageColor}`}>{attempt.percentage}%</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500 mb-1">رتبه</p>
                  <p className="text-3xl font-bold text-emerald-700">{attempt.rank}</p>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                <p className="text-slate-600">
                  <span className="font-bold text-emerald-700">{attempt.correct_count}</span> پاسخ صحیح از{" "}
                  <span className="font-bold">{attempt.total_questions}</span> سوال
                </p>
              </div>
            </>
          ) : (
            <div className="bg-amber-50 rounded-xl p-5 mb-6 border border-amber-100">
              {attempt.grading_status === "graded" ? (
                <>
                  <p className="font-bold text-emerald-800 mb-2">نمره شما ثبت شد</p>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-slate-500">درصد</p>
                      <p className="text-2xl font-bold text-emerald-700">{attempt.percentage}%</p>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-slate-500">نمره از ۲۰</p>
                      <p className="text-2xl font-bold text-emerald-700">
                        {formatGradeOutOf20(attempt.correct_count, attempt.total_questions)}
                      </p>
                    </div>
                  </div>
                  {attempt.rank && (
                    <p className="text-sm text-emerald-700 mt-3">رتبه: {attempt.rank}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="font-bold text-amber-800 mb-1">پاسخ‌های شما ثبت شد</p>
                  <p className="text-sm text-amber-700">
                    {getGradingStatusLabel(attempt.grading_status)} — نمره پس از تصحیح مشاور اعلام می‌شود.
                  </p>
                </>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setShowReview(!showReview);
                setShowAnswerSheet(false);
              }}
              className="btn-secondary w-full"
            >
              {showReview
                ? isTest
                  ? "بستن کارنامه"
                  : "بستن پاسخ‌ها"
                : isTest
                  ? "مشاهده کارنامه"
                  : "مشاهده پاسخ‌های من"}
            </button>
            <button
              onClick={() => {
                setShowAnswerSheet(!showAnswerSheet);
                setShowReview(false);
              }}
              className="btn-secondary w-full"
            >
              {showAnswerSheet ? "بستن پاسخنامه PDF" : "مشاهده پاسخنامه PDF"}
            </button>
            <a href="/" className="btn-primary w-full text-center">
              خروج
            </a>
          </div>
        </div>

        {showReview && (
          <div className="card mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
            <h2 className="font-bold text-lg sticky top-0 bg-white pb-2">
              {isTest ? "کارنامه" : "پاسخ‌های شما"}
            </h2>
            {questionNumbers.map((num) => {
              if (isTest) {
                const rawAnswer = attempt.answers[String(num)];
                const correctAnswer = exam.answer_key?.[String(num)];
                const isCorrect = rawAnswer === correctAnswer;
                return (
                  <div
                    key={num}
                    className={`p-4 rounded-xl border ${
                      isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
                  >
                    <p className="font-medium mb-1">سوال {num}</p>
                    <div className="text-sm space-y-1">
                      <p>
                        پاسخ شما:{" "}
                        <span className={isCorrect ? "text-green-700" : "text-red-700"}>
                          {rawAnswer ? `گزینه ${rawAnswer}` : "بدون پاسخ"}
                        </span>
                      </p>
                      {!isCorrect && correctAnswer && (
                        <p className="text-green-700">پاسخ صحیح: گزینه {correctAnswer}</p>
                      )}
                    </div>
                  </div>
                );
              }

              const userAnswer = normalizeDescriptiveAnswer(attempt.answers[String(num)]);

              return (
                <div key={num} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
                  <p className="font-medium mb-2">سوال {num}</p>
                  {userAnswer.text.trim() && (
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed mb-3">
                      {userAnswer.text}
                    </p>
                  )}
                  {userAnswer.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {userAnswer.images.map((img) => {
                        const imageSrc = `/api/attempts/${attemptId}/image?file=${encodeURIComponent(img)}`;
                        return (
                        <button
                          key={img}
                          type="button"
                          onClick={() =>
                            setPreviewImage({
                              src: imageSrc,
                              alt: `پاسخ ${num}`,
                            })
                          }
                          className="block w-full cursor-zoom-in"
                        >
                          <img
                            src={imageSrc}
                            alt={`پاسخ ${num}`}
                            className="w-full h-32 object-contain rounded-lg border bg-white"
                          />
                        </button>
                      )})}
                    </div>
                  )}
                  {!userAnswer.text.trim() && userAnswer.images.length === 0 && (
                    <p className="text-sm text-slate-400">پاسخی ثبت نشده</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {showAnswerSheet && (
          <div className="card mt-4 p-0 overflow-hidden">
            <iframe
              src={exam.answer_sheet_pdf_url}
              className="w-full h-[70vh] min-h-[400px]"
              title="پاسخنامه PDF"
            />
          </div>
        )}
      </div>

      {previewImage && (
        <ImageLightbox
          src={previewImage.src}
          alt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </main>
  );
}
