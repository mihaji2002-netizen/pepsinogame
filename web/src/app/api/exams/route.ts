import { NextResponse } from "next/server";
import { getActiveExams } from "@/lib/exam/exam-service";

export async function GET() {
  const exams = getActiveExams();
  return NextResponse.json({
    exams: exams.map((e) => ({
      id: e.id,
      title: e.title,
      duration_minutes: e.duration_minutes,
      question_count: e.question_count,
    })),
  });
}
