import { NextRequest, NextResponse } from "next/server";
import {
  createAttempt,
  getExamByAccessCode,
  hasActiveAttempt,
  hasFinishedAttempt,
} from "@/lib/exam/exam-service";
import { getAvailabilityMessage } from "@/lib/exam/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_code, first_name, last_name } = body;

    if (!access_code?.trim()) {
      return NextResponse.json({ error: "کد آزمون الزامی است" }, { status: 400 });
    }
    if (!first_name?.trim() || !last_name?.trim()) {
      return NextResponse.json({ error: "نام و نام خانوادگی الزامی است" }, { status: 400 });
    }

    const exam = getExamByAccessCode(access_code.trim());
    if (!exam) {
      return NextResponse.json({ error: "کد آزمون نامعتبر است" }, { status: 404 });
    }

    const availabilityMessage = getAvailabilityMessage(exam);
    if (availabilityMessage) {
      return NextResponse.json({ error: availabilityMessage }, { status: 403 });
    }

    if (hasFinishedAttempt(exam.id, first_name, last_name)) {
      return NextResponse.json(
        { error: "این نام و نام خانوادگی قبلاً در این آزمون شرکت کرده است" },
        { status: 409 }
      );
    }

    const existingAttemptId = hasActiveAttempt(exam.id, first_name, last_name);
    if (existingAttemptId) {
      return NextResponse.json({
        attempt_id: existingAttemptId,
        exam: {
          id: exam.id,
          title: exam.title,
          exam_type: exam.exam_type,
          duration_minutes: exam.duration_minutes,
          question_count: exam.question_count,
          option_count: exam.option_count,
          questions_pdf_url: `/api/exams/${exam.id}/pdf?type=questions`,
        },
      });
    }

    const attemptId = createAttempt({
      exam_id: exam.id,
      first_name,
      last_name,
    });

    return NextResponse.json({
      attempt_id: attemptId,
      exam: {
        id: exam.id,
        title: exam.title,
        duration_minutes: exam.duration_minutes,
        question_count: exam.question_count,
        option_count: exam.option_count,
        questions_pdf_url: `/api/exams/${exam.id}/pdf?type=questions`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در شروع آزمون";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
