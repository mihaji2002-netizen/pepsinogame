import { NextRequest, NextResponse } from "next/server";
import { startAssignedExam } from "@/lib/exam/exam-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const studentId = String(body.student_id || "").trim();
    const examId = Number(body.exam_id);

    if (!studentId) {
      return NextResponse.json({ error: "شناسه دانش‌آموز الزامی است" }, { status: 400 });
    }
    if (!examId || Number.isNaN(examId)) {
      return NextResponse.json({ error: "شناسه آزمون نامعتبر است" }, { status: 400 });
    }

    const { attemptId, exam } = startAssignedExam(studentId, examId);

    return NextResponse.json({
      attempt_id: attemptId,
      exam: {
        id: exam.id,
        title: exam.title,
        exam_type: exam.exam_type,
        duration_minutes: exam.duration_minutes,
        question_count: exam.question_count,
        option_count: exam.option_count,
        questions_pdf_url: exam.questions_pdf
          ? `/api/exams/${exam.id}/pdf?type=questions`
          : null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در شروع آزمون";
    const status = message.includes("قبلاً") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
