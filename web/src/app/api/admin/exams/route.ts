import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/exam/auth";
import { saveExamPdf } from "@/lib/exam/file-storage";
import {
  createExam,
  deleteExam,
  getAllExams,
  getExamRankings,
  toggleExamActive,
} from "@/lib/exam/exam-service";
import { buildExamSnapshotsFromBank, getBankQuestionsByIds } from "@/lib/exam/question-bank-service";
import {
  generateAccessCode,
  parseAnswerKeyInput,
  parseDateTimeLocal,
  type ExamType,
  type GradeLevel,
  type StudyTrack,
} from "@/lib/exam/types";

async function createPdfExam(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const examType = String(formData.get("exam_type") ?? "test") as ExamType;
  const durationMinutes = Number(formData.get("duration_minutes"));
  const questionCount = Number(formData.get("question_count"));
  const optionCount = Number(formData.get("option_count") ?? 4);
  const answerKeyRaw = String(formData.get("answer_key") ?? "");
  const activeFromRaw = String(formData.get("active_from") ?? "").trim();
  const activeUntilRaw = String(formData.get("active_until") ?? "").trim();
  const questionsPdf = formData.get("questions_pdf");
  const answerSheetPdf = formData.get("answer_sheet_pdf");

  if (!title) throw new Error("عنوان آزمون الزامی است");
  if (examType !== "test" && examType !== "descriptive") throw new Error("نوع آزمون نامعتبر است");
  if (!durationMinutes || durationMinutes < 1) throw new Error("مدت زمان آزمون نامعتبر است");
  if (!questionCount || questionCount < 1 || questionCount > 200) {
    throw new Error("تعداد سوال باید بین ۱ تا ۲۰۰ باشد");
  }
  if (examType === "test" && (!optionCount || optionCount < 2 || optionCount > 6)) {
    throw new Error("تعداد گزینه‌ها باید بین ۲ تا ۶ باشد");
  }
  if (!(questionsPdf instanceof File) || questionsPdf.size === 0) {
    throw new Error("فایل PDF سوالات الزامی است");
  }
  if (!(answerSheetPdf instanceof File) || answerSheetPdf.size === 0) {
    throw new Error("فایل PDF پاسخنامه الزامی است");
  }
  if (!activeFromRaw || !activeUntilRaw) throw new Error("بازه فعال‌سازی آزمون الزامی است");

  const activeFrom = parseDateTimeLocal(activeFromRaw);
  const activeUntil = parseDateTimeLocal(activeUntilRaw);
  if (new Date(activeFrom.replace(" ", "T")) >= new Date(activeUntil.replace(" ", "T"))) {
    throw new Error("زمان پایان باید بعد از زمان شروع باشد");
  }

  const answerKey =
    examType === "test" ? parseAnswerKeyInput(answerKeyRaw, questionCount, optionCount) : {};
  const accessCode = generateAccessCode();

  const id = createExam({
    title,
    exam_type: examType,
    source_type: "pdf",
    duration_minutes: durationMinutes,
    question_count: questionCount,
    option_count: examType === "test" ? optionCount : 0,
    answer_key_json: JSON.stringify(answerKey),
    access_code: accessCode,
    questions_pdf: "questions.pdf",
    answer_sheet_pdf: "answer-sheet.pdf",
    active_from: activeFrom,
    active_until: activeUntil,
  });

  try {
    await saveExamPdf(id, "questions", questionsPdf);
    await saveExamPdf(id, "answer-sheet", answerSheetPdf);
  } catch (error) {
    deleteExam(id);
    throw error;
  }

  return { id, access_code: accessCode };
}

async function createBankExam(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim();
  const examType = String(body.exam_type ?? "test") as ExamType;
  const grade = Number(body.grade) as GradeLevel;
  const track = String(body.track ?? "") as StudyTrack;
  const durationMinutes = Number(body.duration_minutes);
  const activeFromRaw = String(body.active_from ?? "").trim();
  const activeUntilRaw = String(body.active_until ?? "").trim();
  const questionIds = Array.isArray(body.question_ids)
    ? body.question_ids.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
    : [];

  if (!title) throw new Error("عنوان آزمون الزامی است");
  if (examType !== "test" && examType !== "descriptive") throw new Error("نوع آزمون نامعتبر است");
  if (![10, 11, 12].includes(grade)) throw new Error("پایه تحصیلی نامعتبر است");
  if (track !== "math" && track !== "experimental") throw new Error("رشته تحصیلی نامعتبر است");
  if (!durationMinutes || durationMinutes < 1) throw new Error("مدت زمان آزمون نامعتبر است");
  if (questionIds.length < 1 || questionIds.length > 200) {
    throw new Error("حداقل یک سوال از بانک انتخاب کنید");
  }
  if (!activeFromRaw || !activeUntilRaw) throw new Error("بازه فعال‌سازی آزمون الزامی است");

  const activeFrom = parseDateTimeLocal(activeFromRaw);
  const activeUntil = parseDateTimeLocal(activeUntilRaw);
  if (new Date(activeFrom.replace(" ", "T")) >= new Date(activeUntil.replace(" ", "T"))) {
    throw new Error("زمان پایان باید بعد از زمان شروع باشد");
  }

  const bankQuestions = getBankQuestionsByIds(questionIds);
  for (const question of bankQuestions) {
    if (question.grade !== grade || question.track !== track || question.question_type !== examType) {
      throw new Error(`سوال ${question.id} با پایه، رشته یا نوع آزمون انتخاب‌شده همخوانی ندارد`);
    }
  }

  const { questions, answerKey, optionCount } = buildExamSnapshotsFromBank(questionIds);
  const accessCode = generateAccessCode();

  const id = createExam({
    title,
    exam_type: examType,
    source_type: "bank",
    grade,
    track,
    duration_minutes: durationMinutes,
    question_count: questions.length,
    option_count: examType === "test" ? optionCount : 0,
    questions_json: JSON.stringify(questions),
    answer_key_json: JSON.stringify(answerKey),
    access_code: accessCode,
    questions_pdf: null,
    answer_sheet_pdf: null,
    active_from: activeFrom,
    active_until: activeUntil,
  });

  return { id, access_code: accessCode };
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const examId = request.nextUrl.searchParams.get("rankings");
  if (examId) {
    const rankings = getExamRankings(Number(examId));
    return NextResponse.json({ rankings });
  }

  const exams = getAllExams();
  return NextResponse.json({ exams });
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      if (body.source_type === "bank") {
        const result = await createBankExam(body);
        return NextResponse.json(result);
      }
      return NextResponse.json({ error: "درخواست نامعتبر است" }, { status: 400 });
    }

    const formData = await request.formData();
    const sourceType = String(formData.get("source_type") ?? "pdf");
    if (sourceType === "bank") {
      const questionIdsRaw = String(formData.get("question_ids") ?? "[]");
      const body = {
        source_type: "bank",
        title: formData.get("title"),
        exam_type: formData.get("exam_type"),
        grade: formData.get("grade"),
        track: formData.get("track"),
        duration_minutes: formData.get("duration_minutes"),
        active_from: formData.get("active_from"),
        active_until: formData.get("active_until"),
        question_ids: JSON.parse(questionIdsRaw),
      };
      const result = await createBankExam(body);
      return NextResponse.json(result);
    }

    const result = await createPdfExam(formData);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در ایجاد آزمون";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { id, is_active } = body;
  if (!id) return NextResponse.json({ error: "شناسه آزمون الزامی است" }, { status: 400 });

  toggleExamActive(Number(id), !!is_active);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "شناسه آزمون الزامی است" }, { status: 400 });

  deleteExam(Number(id));
  return NextResponse.json({ success: true });
}
