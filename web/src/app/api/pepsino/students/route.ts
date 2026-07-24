import { NextRequest, NextResponse } from "next/server";
import { listPepsinoStudents, syncPepsinoStudents } from "@/lib/exam/pepsino-students";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const grade = request.nextUrl.searchParams.get("grade");
  const studyField = request.nextUrl.searchParams.get("studyField");

  const students = listPepsinoStudents({
    grade: grade === "10" || grade === "11" || grade === "12" ? Number(grade) as 10 | 11 | 12 : "all",
    studyField:
      studyField === "math" || studyField === "experimental" || studyField === "humanities"
        ? studyField
        : "all",
  });

  return NextResponse.json({ students });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const students = Array.isArray(body.students) ? body.students : [];
    syncPepsinoStudents(
      students.map(
        (s: {
          id: string;
          studentId: string;
          name: string;
          email: string;
          gender?: string;
          grade?: number;
          studyField?: string;
          level?: number;
          xp?: number;
          coins?: number;
          stamps?: number;
          lab?: string;
          joinedAt?: string;
          missions?: unknown[];
          xpHistory?: unknown[];
        }) => ({
          id: s.id,
          studentId: s.studentId,
          name: s.name,
          email: s.email,
          gender: s.gender,
          grade: s.grade,
          studyField: s.studyField,
          level: s.level,
          xp: s.xp,
          coins: s.coins,
          stamps: s.stamps,
          lab: s.lab,
          joinedAt: s.joinedAt,
          missions: s.missions,
          xpHistory: s.xpHistory,
        }),
      ),
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطا در همگام‌سازی دانش‌آموزان" }, { status: 500 });
  }
}
