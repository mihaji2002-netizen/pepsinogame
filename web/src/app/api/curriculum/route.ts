import { NextRequest, NextResponse } from "next/server";
import { getCurriculumSubjects } from "@/lib/exam/curriculum";
import type { GradeLevel, StudyTrack } from "@/lib/exam/types";

function parseGrade(value: string | null): GradeLevel | null {
  const grade = Number(value);
  if (grade === 10 || grade === 11 || grade === 12) return grade;
  return null;
}

function parseTrack(value: string | null): StudyTrack | null {
  if (value === "math" || value === "experimental") return value;
  return null;
}

export async function GET(request: NextRequest) {
  const grade = parseGrade(request.nextUrl.searchParams.get("grade"));
  const track = parseTrack(request.nextUrl.searchParams.get("track"));

  if (!grade || !track) {
    return NextResponse.json({ error: "پایه و رشته الزامی است" }, { status: 400 });
  }

  const subjects = getCurriculumSubjects(grade, track);
  return NextResponse.json({ grade, track, subjects });
}
