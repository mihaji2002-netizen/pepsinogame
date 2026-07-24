"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageLightbox from "@/components/exam/ImageLightbox";
import {
  buildQuestionNumbers,
  getExamTypeLabel,
  isDescriptiveAnswerAnswered,
  isTestExam,
  normalizeDescriptiveAnswer,
  type DescriptiveAnswer,
  type ExamQuestionItem,
  type ExamSourceType,
  type ExamType,
} from "@/lib/exam/types";

interface ExamData {
  id: number;
  title: string;
  exam_type: ExamType;
  source_type: ExamSourceType;
  duration_minutes: number;
  question_count: number;
  option_count: number;
  questions?: ExamQuestionItem[];
  questions_pdf_url: string | null;
}

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = Number(params.id);

  const [exam, setExam] = useState<ExamData | null>(null);
  const [answers, setAnswers] = useState<Record<string, number | DescriptiveAnswer>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  const questionNumbers = useMemo(
    () => (exam ? buildQuestionNumbers(exam.question_count) : []),
    [exam]
  );

  const submitExam = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/attempts/${attemptId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "خطا در ثبت آزمون");
        setSubmitting(false);
        return;
      }

      sessionStorage.removeItem(`exam_${attemptId}`);
      router.push(`/result/${attemptId}`);
    } catch {
      setError("خطا در ارتباط با سرور");
      setSubmitting(false);
    }
  }, [answers, attemptId, router, submitting]);

  useEffect(() => {
    async function loadExam() {
      try {
        const res = await fetch(`/api/attempts/${attemptId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "آزمون یافت نشد");
          setLoading(false);
          return;
        }

        if (data.attempt.finished_at) {
          router.push(`/result/${attemptId}`);
          return;
        }

        setExam(data.exam);
        setAnswers(data.attempt.answers || {});

        const stored = sessionStorage.getItem(`exam_${attemptId}`);
        let endTime: number;

        if (stored) {
          const { startedAt, durationMinutes } = JSON.parse(stored);
          endTime = startedAt + durationMinutes * 60 * 1000;
        } else {
          endTime = Date.now() + data.exam.duration_minutes * 60 * 1000;
          sessionStorage.setItem(
            `exam_${attemptId}`,
            JSON.stringify({
              startedAt: Date.now(),
              durationMinutes: data.exam.duration_minutes,
            })
          );
        }

        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        setLoading(false);
      } catch {
        setError("خطا در بارگذاری آزمون");
        setLoading(false);
      }
    }

    loadExam();
  }, [attemptId, router]);

  useEffect(() => {
    if (timeLeft <= 0 || loading || !exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, exam, submitExam]);

  useEffect(() => {
    if (!exam || loading) return;
    const interval = setInterval(() => {
      fetch(`/api/attempts/${attemptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [answers, attemptId, exam, loading]);

  function selectAnswer(questionNumber: number, option: number) {
    setAnswers((prev) => ({
      ...prev,
      [String(questionNumber)]: option,
    }));
  }

  function setTextAnswer(questionNumber: number, text: string) {
    setAnswers((prev) => {
      const current = normalizeDescriptiveAnswer(prev[String(questionNumber)]);
      return {
        ...prev,
        [String(questionNumber)]: { ...current, text },
      };
    });
  }

  async function uploadImage(questionNumber: number, file: File) {
    setUploadingImage(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("question_number", String(questionNumber));
      formData.append("image", file);

      const res = await fetch(`/api/attempts/${attemptId}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در آپلود تصویر");
        return;
      }
      setAnswers(data.answers);
    } catch {
      setError("خطا در آپلود تصویر");
    } finally {
      setUploadingImage(false);
    }
  }

  function isQuestionAnswered(num: number) {
    if (!exam) return false;
    const answer = answers[String(num)];
    if (isTestExam(exam.exam_type)) {
      return answer !== undefined && answer !== null;
    }
    return isDescriptiveAnswerAnswered(normalizeDescriptiveAnswer(answer));
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">در حال بارگذاری آزمون...</div>
      </main>
    );
  }

  if (error || !exam) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <p className="text-red-600 mb-4">{error || "آزمون یافت نشد"}</p>
          <a href="/" className="btn-primary inline-block">
            بازگشت
          </a>
        </div>
      </main>
    );
  }

  const answeredCount = questionNumbers.filter((num) => isQuestionAnswered(num)).length;
  const isLowTime = timeLeft < 300;
  const isTest = isTestExam(exam.exam_type);
  const isBankExam = exam.source_type === "bank";
  const currentQuestionData = exam.questions?.find((q) => q.position === currentQuestion);
  const currentOptions = currentQuestionData?.options ?? [];
  const optionNumbers = isBankExam && currentOptions.length > 0
    ? currentOptions.map((_, i) => i + 1)
    : Array.from({ length: exam.option_count }, (_, i) => i + 1);
  const currentDescriptiveAnswer = normalizeDescriptiveAnswer(answers[String(currentQuestion)]);
  const currentTextAnswer = currentDescriptiveAnswer.text;

  return (
    <main className="min-h-screen pb-6">
      <header className="bg-white/90 backdrop-blur border-b border-emerald-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-slate-800">{exam.title}</h1>
            <p className="text-sm text-slate-500">
              {getExamTypeLabel(exam.exam_type)} · {answeredCount} از {exam.question_count} سوال پاسخ داده شده
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowConfirm(true)} className="btn-primary text-sm">
              پایان آزمون
            </button>
            <div
              className={`text-xl font-mono font-bold px-4 py-2 rounded-xl ${
                isLowTime
                  ? "bg-red-100 text-red-700 timer-warning"
                  : "bg-emerald-50 text-emerald-700"
              }`}
              dir="ltr"
            >
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {isBankExam ? (
          <div className="card">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-sm font-medium text-slate-600">
              سوال {currentQuestion} از {exam.question_count}
            </div>
            <div className="p-5">
              <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                {currentQuestionData?.stem || "متن سوال در دسترس نیست"}
              </p>
            </div>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-sm font-medium text-slate-600">
              دفترچه سوالات
            </div>
            {exam.questions_pdf_url ? (
              <iframe
                src={exam.questions_pdf_url}
                className="w-full h-[55vh] min-h-[320px]"
                title="دفترچه سوالات"
              />
            ) : (
              <div className="p-8 text-center text-slate-500">فایل سوالات در دسترس نیست</div>
            )}
          </div>
        )}

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">پاسخ‌دهی</h2>
            <span className="text-sm text-slate-500">
              {isTest ? "روی شماره سوال بزنید و گزینه را انتخاب کنید" : "پاسخ متنی بنویسید یا عکس پاسخبرگ آپلود کنید"}
            </span>
          </div>

          <div className="flex gap-2 flex-wrap mb-5">
            {questionNumbers.map((num) => (
              <button
                key={num}
                onClick={() => setCurrentQuestion(num)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  currentQuestion === num
                    ? "bg-emerald-600 text-white"
                    : isQuestionAnswered(num)
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-5">
            {!isBankExam && (
              <p className="font-medium text-slate-700 mb-4">سوال {currentQuestion}</p>
            )}
            {isTest ? (
              <div className="flex gap-3 flex-wrap">
                {optionNumbers.map((opt) => {
                  const selected = answers[String(currentQuestion)] === opt;
                  const optionLabel = isBankExam && currentOptions[opt - 1]
                    ? currentOptions[opt - 1]
                    : `گزینه ${opt}`;
                  return (
                    <button
                      key={opt}
                      onClick={() => selectAnswer(currentQuestion, opt)}
                      className={`min-w-16 min-h-12 px-4 rounded-xl border-2 text-sm font-bold transition-all text-right ${
                        selected ? "option-selected" : "option-default bg-white"
                      }`}
                    >
                      {isBankExam ? (
                        <span className="flex items-center gap-2">
                          <span className="shrink-0">{opt}.</span>
                          <span className="font-normal">{optionLabel}</span>
                        </span>
                      ) : (
                        optionLabel
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  className="input-field min-h-32 resize-y"
                  value={currentTextAnswer}
                  onChange={(e) => setTextAnswer(currentQuestion, e.target.value)}
                  placeholder="پاسخ متنی خود را اینجا بنویسید..."
                />

                <div>
                  <label className="label">آپلود عکس پاسخ ({currentDescriptiveAnswer.images.length}/۳)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="input-field"
                    disabled={uploadingImage || currentDescriptiveAnswer.images.length >= 3}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(currentQuestion, file);
                      e.target.value = "";
                    }}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    می‌توانید عکس پاسخنامه نوشته‌شده را هم آپلود کنید
                  </p>
                </div>

                {currentDescriptiveAnswer.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {currentDescriptiveAnswer.images.map((img) => {
                      const imageSrc = `/api/attempts/${attemptId}/image?file=${encodeURIComponent(img)}`;
                      return (
                      <button
                        key={img}
                        type="button"
                        onClick={() =>
                          setPreviewImage({
                            src: imageSrc,
                            alt: `پاسخ سوال ${currentQuestion}`,
                          })
                        }
                        className="block w-full cursor-zoom-in"
                      >
                        <img
                          src={imageSrc}
                          alt={`پاسخ سوال ${currentQuestion}`}
                          className="w-full h-36 object-contain rounded-xl border border-slate-200 bg-white"
                        />
                      </button>
                    )})}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-5">
            <button
              onClick={() => setCurrentQuestion((q) => Math.max(1, q - 1))}
              disabled={currentQuestion === 1}
              className="btn-secondary"
            >
              سوال قبلی
            </button>
            <button
              onClick={() =>
                setCurrentQuestion((q) => Math.min(exam.question_count, q + 1))
              }
              disabled={currentQuestion === exam.question_count}
              className="btn-primary"
            >
              سوال بعدی
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">پایان آزمون</h3>
            <p className="text-slate-600 mb-4">
              {answeredCount < exam.question_count
                ? `شما به ${exam.question_count - answeredCount} سوال پاسخ نداده‌اید. آیا مطمئن هستید؟`
                : "آیا مطمئن هستید که می‌خواهید آزمون را تمام کنید؟"}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1">
                انصراف
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  submitExam();
                }}
                className="btn-primary flex-1"
                disabled={submitting}
              >
                {submitting ? "در حال ثبت..." : "تأیید"}
              </button>
            </div>
          </div>
        </div>
      )}

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
