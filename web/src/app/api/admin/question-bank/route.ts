import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/exam/auth";
import { validateCurriculumSelection } from "@/lib/exam/curriculum";
import {
  createBankQuestion,
  deleteBankQuestion,
  getBankQuestionById,
  listBankQuestions,
  updateBankQuestion,
} from "@/lib/exam/question-bank-service";
import type { ExamType, GradeLevel, StudyTrack } from "@/lib/exam/types";

function parseGrade(value: unknown): GradeLevel | null {
  const grade = Number(value);
  if (grade === 10 || grade === 11 || grade === 12) return grade;
  return null;
}

function parseTrack(value: unknown): StudyTrack | null {
  if (value === "math" || value === "experimental") return value;
  return null;
}

function parseQuestionType(value: unknown): ExamType | null {
  if (value === "test" || value === "descriptive") return value;
  return null;
}

function parseSubjectId(value: unknown): string | null {
  const id = String(value ?? "").trim();
  return id || null;
}

function parseChapterId(value: unknown): string | null {
  const id = String(value ?? "").trim();
  return id || null;
}

function normalizeOptions(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null;
  const options = raw.map((item) => String(item).trim()).filter(Boolean);
  return options.length > 0 ? options : null;
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const grade = parseGrade(request.nextUrl.searchParams.get("grade"));
  const track = parseTrack(request.nextUrl.searchParams.get("track"));
  const questionType = parseQuestionType(request.nextUrl.searchParams.get("question_type"));
  const subjectId = parseSubjectId(request.nextUrl.searchParams.get("subject_id"));
  const chapterId = parseChapterId(request.nextUrl.searchParams.get("chapter_id"));

  const questions = listBankQuestions({
    grade: grade ?? undefined,
    track: track ?? undefined,
    question_type: questionType ?? undefined,
    subject_id: subjectId ?? undefined,
    chapter_id: chapterId ?? undefined,
  });

  return NextResponse.json({ questions });
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const grade = parseGrade(body.grade);
    const track = parseTrack(body.track);
    const subjectId = parseSubjectId(body.subject_id);
    const chapterId = parseChapterId(body.chapter_id);
    const questionType = parseQuestionType(body.question_type);
    const stem = String(body.stem ?? "").trim();
    const options = normalizeOptions(body.options);
    const correctOption = body.correct_option == null ? null : Number(body.correct_option);

    if (!grade || !track || !questionType) {
      return NextResponse.json({ error: "پایه، رشته یا نوع سوال نامعتبر است" }, { status: 400 });
    }
    if (!subjectId || !chapterId) {
      return NextResponse.json({ error: "درس و فصل الزامی است" }, { status: 400 });
    }
    if (!validateCurriculumSelection(grade, track, subjectId, chapterId)) {
      return NextResponse.json({ error: "درس یا فصل با پایه و رشته همخوانی ندارد" }, { status: 400 });
    }
    if (!stem) {
      return NextResponse.json({ error: "متن سوال الزامی است" }, { status: 400 });
    }

    if (questionType === "test") {
      if (!options || options.length < 2 || options.length > 6) {
        return NextResponse.json({ error: "سوالات تستی باید ۲ تا ۶ گزینه داشته باشند" }, { status: 400 });
      }
      if (!Number.isInteger(correctOption) || correctOption! < 1 || correctOption! > options.length) {
        return NextResponse.json({ error: "پاسخ صحیح باید بین ۱ تا تعداد گزینه‌ها باشد" }, { status: 400 });
      }
    } else if (options && options.length > 0) {
      return NextResponse.json({ error: "سوالات تشریحی نباید گزینه داشته باشند" }, { status: 400 });
    }

    const id = createBankQuestion({
      grade,
      track,
      subject_id: subjectId,
      chapter_id: chapterId,
      question_type: questionType,
      stem,
      options: questionType === "test" ? options : null,
      correct_option: questionType === "test" ? correctOption : null,
    });

    return NextResponse.json({ id, question: getBankQuestionById(id) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در ثبت سوال";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const id = Number(body.id);
    const grade = parseGrade(body.grade);
    const track = parseTrack(body.track);
    const subjectId = parseSubjectId(body.subject_id);
    const chapterId = parseChapterId(body.chapter_id);
    const questionType = parseQuestionType(body.question_type);
    const stem = String(body.stem ?? "").trim();
    const options = normalizeOptions(body.options);
    const correctOption = body.correct_option == null ? null : Number(body.correct_option);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "شناسه سوال نامعتبر است" }, { status: 400 });
    }
    if (!grade || !track || !questionType || !stem || !subjectId || !chapterId) {
      return NextResponse.json({ error: "اطلاعات سوال ناقص است" }, { status: 400 });
    }
    if (!validateCurriculumSelection(grade, track, subjectId, chapterId)) {
      return NextResponse.json({ error: "درس یا فصل با پایه و رشته همخوانی ندارد" }, { status: 400 });
    }

    if (questionType === "test") {
      if (!options || options.length < 2 || options.length > 6) {
        return NextResponse.json({ error: "سوالات تستی باید ۲ تا ۶ گزینه داشته باشند" }, { status: 400 });
      }
      if (!Number.isInteger(correctOption) || correctOption! < 1 || correctOption! > options.length) {
        return NextResponse.json({ error: "پاسخ صحیح نامعتبر است" }, { status: 400 });
      }
    }

    updateBankQuestion(id, {
      grade,
      track,
      subject_id: subjectId,
      chapter_id: chapterId,
      question_type: questionType,
      stem,
      options: questionType === "test" ? options : null,
      correct_option: questionType === "test" ? correctOption : null,
    });

    return NextResponse.json({ success: true, question: getBankQuestionById(id) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در ویرایش سوال";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "شناسه سوال نامعتبر است" }, { status: 400 });
  }

  try {
    deleteBankQuestion(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در حذف سوال";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
