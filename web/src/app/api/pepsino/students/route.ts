import { NextRequest, NextResponse } from "next/server";
import { listPepsinoStudents, syncPepsinoStudents } from "@/lib/exam/pepsino-students";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const students = listPepsinoStudents();
  return NextResponse.json({ students });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const students = Array.isArray(body.students) ? body.students : [];
    syncPepsinoStudents(
      students.map((s: { id: string; studentId: string; name: string; email: string }) => ({
        id: s.id,
        studentId: s.studentId,
        name: s.name,
        email: s.email,
      })),
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطا در همگام‌سازی دانش‌آموزان" }, { status: 500 });
  }
}
