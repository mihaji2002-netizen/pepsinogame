import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/exam/auth";
import {
  assignExamToStudents,
  getExamAssignmentStudentIds,
} from "@/lib/exam/exam-service";
import { listPepsinoStudents } from "@/lib/exam/pepsino-students";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const examId = Number(request.nextUrl.searchParams.get("exam_id"));
  if (!examId || Number.isNaN(examId)) {
    return NextResponse.json({ error: "شناسه آزمون نامعتبر است" }, { status: 400 });
  }

  return NextResponse.json({
    assigned_student_ids: getExamAssignmentStudentIds(examId),
    students: listPepsinoStudents(),
  });
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const examId = Number(body.exam_id);
    const studentIds = Array.isArray(body.student_ids) ? body.student_ids : [];

    if (!examId || Number.isNaN(examId)) {
      return NextResponse.json({ error: "شناسه آزمون نامعتبر است" }, { status: 400 });
    }
    if (studentIds.length === 0) {
      return NextResponse.json({ error: "حداقل یک دانش‌آموز انتخاب کنید" }, { status: 400 });
    }

    assignExamToStudents(examId, studentIds.map(String));
    return NextResponse.json({
      success: true,
      assigned_student_ids: getExamAssignmentStudentIds(examId),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در تخصیص آزمون";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
