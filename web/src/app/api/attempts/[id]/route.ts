import { NextRequest, NextResponse } from "next/server";
import {
  finishAttempt,
  getAttemptById,
  getExamById,
  updateAttemptAnswers,
} from "@/lib/exam/exam-service";
import { calculateScore, DESCRIPTIVE_MAX_GRADE, isTestExam } from "@/lib/exam/types";

function examPayload(exam: NonNullable<ReturnType<typeof getExamById>>, includeKey = false) {
  return {
    id: exam.id,
    title: exam.title,
    exam_type: exam.exam_type,
    source_type: exam.source_type,
    duration_minutes: exam.duration_minutes,
    question_count: exam.question_count,
    option_count: exam.option_count,
    questions: exam.source_type === "bank" ? exam.questions : undefined,
    questions_pdf_url: exam.questions_pdf
      ? `/api/exams/${exam.id}/pdf?type=questions`
      : null,
    answer_sheet_pdf_url: exam.answer_sheet_pdf
      ? `/api/exams/${exam.id}/pdf?type=answer-sheet`
      : null,
    answer_key: includeKey && isTestExam(exam.exam_type) ? exam.answer_key : undefined,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const attempt = getAttemptById(Number(id));

  if (!attempt) {
    return NextResponse.json({ error: "تلاش یافت نشد" }, { status: 404 });
  }

  const exam = getExamById(attempt.exam_id);
  if (!exam) {
    return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({
    attempt: {
      id: attempt.id,
      first_name: attempt.first_name,
      last_name: attempt.last_name,
      answers: attempt.answers,
      correct_count: attempt.correct_count,
      total_questions: attempt.total_questions,
      percentage: attempt.percentage,
      rank: attempt.rank,
      grading_status: attempt.grading_status,
      question_scores: attempt.question_scores,
      graded_at: attempt.graded_at,
      started_at: attempt.started_at,
      finished_at: attempt.finished_at,
    },
    exam: examPayload(exam, !!attempt.finished_at),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const attempt = getAttemptById(Number(id));

  if (!attempt || attempt.finished_at) {
    return NextResponse.json({ error: "تلاش یافت نشد یا قبلاً پایان یافته" }, { status: 404 });
  }

  const { answers } = await request.json();
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "پاسخ‌ها نامعتبر است" }, { status: 400 });
  }

  updateAttemptAnswers(Number(id), answers);
  return NextResponse.json({ success: true });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const attempt = getAttemptById(Number(id));

  if (!attempt || attempt.finished_at) {
    return NextResponse.json({ error: "تلاش یافت نشد یا قبلاً پایان یافته" }, { status: 404 });
  }

  const exam = getExamById(attempt.exam_id);
  if (!exam) {
    return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
  }

  const body = await request.json();
  const answers = body.answers || attempt.answers;

  updateAttemptAnswers(Number(id), answers);

  if (isTestExam(exam.exam_type)) {
    const score = calculateScore(
      answers as Record<string, number>,
      exam.answer_key
    );
    finishAttempt(Number(id), {
      correct_count: score.correctCount,
      total_questions: score.totalQuestions,
      percentage: score.percentage,
      grading_status: "auto",
    });
  } else {
    finishAttempt(Number(id), {
      correct_count: 0,
      total_questions: DESCRIPTIVE_MAX_GRADE,
      percentage: 0,
      grading_status: "pending",
    });
  }

  const finishedAttempt = getAttemptById(Number(id));

  return NextResponse.json({
    attempt: {
      id: finishedAttempt!.id,
      first_name: finishedAttempt!.first_name,
      last_name: finishedAttempt!.last_name,
      correct_count: finishedAttempt!.correct_count,
      total_questions: finishedAttempt!.total_questions,
      percentage: finishedAttempt!.percentage,
      rank: finishedAttempt!.rank,
      grading_status: finishedAttempt!.grading_status,
      graded_at: finishedAttempt!.graded_at,
      finished_at: finishedAttempt!.finished_at,
      answers,
    },
    exam: examPayload(exam, true),
  });
}
