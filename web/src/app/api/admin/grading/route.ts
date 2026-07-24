import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/exam/auth";
import {
  getAttemptById,
  getDescriptiveSubmissions,
  getExamById,
  gradeDescriptiveAttempt,
} from "@/lib/exam/exam-service";

export async function GET(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const examId = request.nextUrl.searchParams.get("examId");
  const attemptId = request.nextUrl.searchParams.get("attemptId");

  if (attemptId) {
    const attempt = getAttemptById(Number(attemptId));
    if (!attempt || !attempt.finished_at) {
      return NextResponse.json({ error: "پاسخبرگ یافت نشد" }, { status: 404 });
    }
    const exam = getExamById(attempt.exam_id);
    if (!exam || exam.exam_type !== "descriptive") {
      return NextResponse.json({ error: "این آزمون تشریحی نیست" }, { status: 400 });
    }

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        first_name: attempt.first_name,
        last_name: attempt.last_name,
        answers: attempt.answers,
        question_scores: attempt.question_scores,
        grading_status: attempt.grading_status,
        percentage: attempt.percentage,
        correct_count: attempt.correct_count,
        total_questions: attempt.total_questions,
        finished_at: attempt.finished_at,
        graded_at: attempt.graded_at,
      },
      exam: {
        id: exam.id,
        title: exam.title,
        source_type: exam.source_type,
        question_count: exam.question_count,
        questions: exam.source_type === "bank" ? exam.questions : undefined,
        questions_pdf_url: exam.questions_pdf
          ? `/api/exams/${exam.id}/pdf?type=questions`
          : null,
        answer_sheet_pdf_url: exam.answer_sheet_pdf
          ? `/api/exams/${exam.id}/pdf?type=answer-sheet`
          : null,
      },
    });
  }

  if (!examId) {
    return NextResponse.json({ error: "شناسه آزمون الزامی است" }, { status: 400 });
  }

  const exam = getExamById(Number(examId));
  if (!exam || exam.exam_type !== "descriptive") {
    return NextResponse.json({ error: "آزمون تشریحی یافت نشد" }, { status: 404 });
  }

  const submissions = getDescriptiveSubmissions(Number(examId));
  return NextResponse.json({ exam, submissions });
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { attempt_id, question_scores } = body;

    if (!attempt_id || !question_scores) {
      return NextResponse.json({ error: "اطلاعات تصحیح ناقص است" }, { status: 400 });
    }

    gradeDescriptiveAttempt(Number(attempt_id), question_scores);
    const attempt = getAttemptById(Number(attempt_id));

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt!.id,
        percentage: attempt!.percentage,
        correct_count: attempt!.correct_count,
        total_questions: attempt!.total_questions,
        grading_status: attempt!.grading_status,
        rank: attempt!.rank,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در ثبت نمره";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
