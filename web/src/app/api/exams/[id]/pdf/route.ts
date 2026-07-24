import { NextRequest, NextResponse } from "next/server";
import { getExamPdfPath } from "@/lib/exam/file-storage";
import { getExamById } from "@/lib/exam/exam-service";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const examId = Number(id);
  const type = request.nextUrl.searchParams.get("type");

  if (type !== "questions" && type !== "answer-sheet") {
    return NextResponse.json({ error: "نوع فایل نامعتبر است" }, { status: 400 });
  }

  const exam = getExamById(examId);
  if (!exam) {
    return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
  }

  const filepath = getExamPdfPath(examId, type);
  if (!filepath) {
    return NextResponse.json({ error: "فایل PDF یافت نشد" }, { status: 404 });
  }

  const file = fs.readFileSync(filepath);
  const filename = type === "questions" ? "questions.pdf" : "answer-sheet.pdf";

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
