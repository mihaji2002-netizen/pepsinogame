import { NextResponse } from "next/server";
import { getAssignedExamsForStudent } from "@/lib/exam/exam-service";
import { getAvailabilityMessage } from "@/lib/exam/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const exams = getAssignedExamsForStudent(id).map((exam) => ({
    ...exam,
    availability_error: getAvailabilityMessage({
      is_active: exam.is_active,
      active_from: exam.active_from,
      active_until: exam.active_until,
    }),
  }));

  return NextResponse.json({ exams });
}
