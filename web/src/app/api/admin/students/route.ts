import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/exam/auth";
import { listPepsinoStudents } from "@/lib/exam/pepsino-students";
import type { SchoolGrade, StudyField } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const grade = request.nextUrl.searchParams.get("grade");
  const studyField = request.nextUrl.searchParams.get("studyField");

  const students = listPepsinoStudents({
    grade:
      grade === "10" || grade === "11" || grade === "12"
        ? (Number(grade) as SchoolGrade)
        : "all",
    studyField:
      studyField === "math" || studyField === "experimental" || studyField === "humanities"
        ? (studyField as StudyField)
        : "all",
  });

  return NextResponse.json({ students });
}
