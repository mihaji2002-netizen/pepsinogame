export type ExamType = "test" | "descriptive";
export type GradingStatus = "auto" | "pending" | "graded";
export type ExamSourceType = "pdf" | "bank";
export type GradeLevel = 10 | 11 | 12;
export type StudyTrack = "math" | "experimental";

export interface DescriptiveAnswer {
  text: string;
  images: string[];
}

export type AnswerValue = number | string | DescriptiveAnswer;

export interface ExamQuestionItem {
  position: number;
  bank_question_id: number | null;
  stem: string;
  options: string[] | null;
}

export interface BankQuestion {
  id: number;
  grade: GradeLevel;
  track: StudyTrack;
  subject_id: string;
  chapter_id: string;
  subject_title: string;
  chapter_title: string;
  question_type: ExamType;
  stem: string;
  options: string[] | null;
  correct_option: number | null;
  created_at: string;
}

export interface Exam {
  id: number;
  title: string;
  exam_type: ExamType;
  source_type: ExamSourceType;
  grade: GradeLevel | null;
  track: StudyTrack | null;
  duration_minutes: number;
  question_count: number;
  option_count: number;
  questions: ExamQuestionItem[];
  questions_pdf: string | null;
  answer_sheet_pdf: string | null;
  answer_key: Record<string, number>;
  access_code: string;
  is_active: number;
  active_from: string | null;
  active_until: string | null;
  created_at: string;
}

export type ExamAnswers = Record<string, AnswerValue>;

export interface Attempt {
  id: number;
  exam_id: number;
  first_name: string;
  last_name: string;
  answers: ExamAnswers;
  correct_count: number;
  total_questions: number;
  percentage: number;
  rank: number | null;
  grading_status: GradingStatus;
  question_scores: Record<string, number>;
  graded_at: string | null;
  started_at: string;
  finished_at: string | null;
}

export interface ExamListItem {
  id: number;
  title: string;
  exam_type: ExamType;
  source_type: ExamSourceType;
  grade: GradeLevel | null;
  track: StudyTrack | null;
  duration_minutes: number;
  question_count: number;
  option_count: number;
  access_code: string;
  is_active: number;
  active_from: string | null;
  active_until: string | null;
  created_at: string;
  attempt_count: number;
}

export type ExamAvailabilityStatus = "disabled" | "scheduled" | "open" | "closed";

export interface RankingEntry {
  rank: number;
  first_name: string;
  last_name: string;
  percentage: number;
  correct_count: number;
  total_questions: number;
  finished_at: string;
  grading_status?: GradingStatus;
  attempt_id?: number;
}

export function validateManualAnswerKey(
  answerKey: Record<string, number>,
  questionCount: number,
  optionCount: number
): Record<string, number> {
  const normalized: Record<string, number> = {};

  for (let i = 1; i <= questionCount; i++) {
    const key = String(i);
    if (answerKey[key] === undefined) {
      throw new Error(`پاسخ سوال ${i} وارد نشده است`);
    }
    const answer = Number(answerKey[key]);
    if (!Number.isInteger(answer) || answer < 1 || answer > optionCount) {
      throw new Error(`پاسخ سوال ${i} باید بین ۱ تا ${optionCount} باشد`);
    }
    normalized[key] = answer;
  }

  return normalized;
}

export function parseAnswerKeyInput(raw: string, questionCount: number, optionCount: number) {
  let parsed: Record<string, number>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("فرمت کلید تصحیح نامعتبر است");
  }
  return validateManualAnswerKey(parsed, questionCount, optionCount);
}

export function calculateScore(
  answers: Record<string, number>,
  answerKey: Record<string, number>
): { correctCount: number; totalQuestions: number; percentage: number } {
  const keys = Object.keys(answerKey);
  const totalQuestions = keys.length;
  let correctCount = 0;

  for (const key of keys) {
    if (answers[key] === answerKey[key]) {
      correctCount++;
    }
  }

  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  return { correctCount, totalQuestions, percentage };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} دقیقه`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} ساعت و ${m} دقیقه` : `${h} ساعت`;
}

export function generateAccessCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function buildQuestionNumbers(count: number): number[] {
  return Array.from({ length: count }, (_, i) => i + 1);
}

export function isTestExam(examType: ExamType): boolean {
  return examType === "test";
}

export function getExamTypeLabel(examType: ExamType): string {
  return examType === "test" ? "تستی" : "تشریحی";
}

export function getGradeLabel(grade: GradeLevel): string {
  if (grade === 10) return "دهم";
  if (grade === 11) return "یازدهم";
  return "دوازدهم";
}

export function getTrackLabel(track: StudyTrack): string {
  return track === "math" ? "ریاضی" : "تجربی";
}

export function getGradeTrackLabel(grade: GradeLevel, track: StudyTrack): string {
  return `${getGradeLabel(grade)} ${getTrackLabel(track)}`;
}

export function getExamSourceLabel(sourceType: ExamSourceType): string {
  return sourceType === "bank" ? "بانک سوال" : "PDF";
}

export function parseExamQuestions(raw: string | null | undefined): ExamQuestionItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ExamQuestionItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item, index) => ({
      position: Number(item.position ?? index + 1),
      bank_question_id: item.bank_question_id ?? null,
      stem: String(item.stem ?? ""),
      options: Array.isArray(item.options) ? item.options.map(String) : null,
    }));
  } catch {
    return [];
  }
}

export function isBankExam(sourceType: ExamSourceType): boolean {
  return sourceType === "bank";
}

export function normalizeDescriptiveAnswer(value: unknown): DescriptiveAnswer {
  if (typeof value === "string") {
    return { text: value, images: [] };
  }
  if (value && typeof value === "object") {
    const obj = value as Partial<DescriptiveAnswer>;
    return {
      text: String(obj.text ?? ""),
      images: Array.isArray(obj.images) ? obj.images.map(String) : [],
    };
  }
  return { text: "", images: [] };
}

export function isDescriptiveAnswerAnswered(answer: DescriptiveAnswer): boolean {
  return answer.text.trim().length > 0 || answer.images.length > 0;
}

export const DESCRIPTIVE_MAX_GRADE = 20;

export function getDescriptiveQuestionMaxScore(questionCount: number): number {
  if (questionCount <= 0) return 0;
  return DESCRIPTIVE_MAX_GRADE / questionCount;
}

export function formatDescriptiveQuestionMaxScore(questionCount: number): string {
  const max = getDescriptiveQuestionMaxScore(questionCount);
  if (!Number.isFinite(max) || max <= 0) return "0";
  if (Number.isInteger(max)) return String(max);
  return max.toFixed(2).replace(/\.?0+$/, "");
}

export function calculateDescriptiveGrade(
  questionScores: Record<string, number>,
  questionCount: number
): { totalScore: number; maxScore: number; percentage: number } {
  const maxScore = DESCRIPTIVE_MAX_GRADE;
  const questionMaxScore = getDescriptiveQuestionMaxScore(questionCount);
  let totalScore = 0;
  for (let i = 1; i <= questionCount; i++) {
    const score = Number(questionScores[String(i)] ?? 0);
    totalScore += Math.max(0, Math.min(questionMaxScore, score));
  }
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  return { totalScore, maxScore, percentage };
}

export function validateQuestionScores(
  scores: Record<string, number>,
  questionCount: number
): Record<string, number> {
  const questionMaxScore = getDescriptiveQuestionMaxScore(questionCount);
  const maxLabel = formatDescriptiveQuestionMaxScore(questionCount);
  const normalized: Record<string, number> = {};
  for (let i = 1; i <= questionCount; i++) {
    const key = String(i);
    const score = Number(scores[key] ?? 0);
    if (!Number.isFinite(score) || score < 0 || score > questionMaxScore) {
      throw new Error(`نمره سوال ${i} باید بین ۰ تا ${maxLabel} باشد`);
    }
    normalized[key] = score;
  }
  return normalized;
}

export function getGradeOutOf20(totalScore: number, maxScore: number): number {
  if (maxScore <= 0) return 0;
  const grade = (totalScore / maxScore) * DESCRIPTIVE_MAX_GRADE;
  return Math.round(grade * 10) / 10;
}

export function formatGradeOutOf20(totalScore: number, maxScore: number): string {
  const grade = getGradeOutOf20(totalScore, maxScore);
  const display = Number.isInteger(grade) ? String(grade) : grade.toFixed(1);
  return `${display}/${DESCRIPTIVE_MAX_GRADE}`;
}

export function getGradingStatusLabel(status: GradingStatus): string {
  switch (status) {
    case "graded":
      return "تصحیح شده";
    case "pending":
      return "در انتظار تصحیح";
    default:
      return "خودکار";
  }
}

export function normalizeParticipantName(name: string): string {
  return name.trim().replace(/\s+/g, " ").normalize("NFKC");
}

export function parseDateTimeLocal(value: string): string {
  if (!value?.trim()) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("تاریخ و ساعت نامعتبر است");
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

export function toDateTimeLocalValue(value: string | null): string {
  if (!value) return "";
  return value.replace(" ", "T").slice(0, 16);
}

export function formatPersianDateTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getExamAvailability(
  exam: {
    is_active: number;
    active_from: string | null;
    active_until: string | null;
  },
  now = new Date()
): ExamAvailabilityStatus {
  if (!exam.is_active) return "disabled";
  const from = exam.active_from ? new Date(exam.active_from.replace(" ", "T")) : null;
  const until = exam.active_until ? new Date(exam.active_until.replace(" ", "T")) : null;
  if (from && now < from) return "scheduled";
  if (until && now > until) return "closed";
  return "open";
}

export function getAvailabilityLabel(status: ExamAvailabilityStatus): string {
  switch (status) {
    case "open":
      return "در دسترس";
    case "scheduled":
      return "هنوز شروع نشده";
    case "closed":
      return "پایان یافته";
    default:
      return "غیرفعال";
  }
}

export function getAvailabilityMessage(
  exam: {
    is_active: number;
    active_from: string | null;
    active_until: string | null;
  },
  now = new Date()
): string | null {
  const status = getExamAvailability(exam, now);
  if (status === "open") return null;
  if (status === "disabled") return "این آزمون غیرفعال است";
  if (status === "scheduled") {
    return `آزمون از ${formatPersianDateTime(exam.active_from)} شروع می‌شود`;
  }
  return `مهلت شرکت در آزمون در ${formatPersianDateTime(exam.active_until)} پایان یافته است`;
}
