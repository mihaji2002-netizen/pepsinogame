import { NextResponse } from "next/server";
import { getStudentExamResults } from "@/lib/exam/exam-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const results = getStudentExamResults(id).map((row) => ({
    id: `ser-${row.id}`,
    subject: row.subject,
    date: row.finished_at.slice(0, 10),
    score: row.score,
    percentage: row.percentage,
    rank: row.rank ?? 0,
    comment: row.comment || "نتیجه آزمون آنلاین",
    examId: row.exam_id,
    attemptId: row.attempt_id,
  }));

  return NextResponse.json({ results });
}
