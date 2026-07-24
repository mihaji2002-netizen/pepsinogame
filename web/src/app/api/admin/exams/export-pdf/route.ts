import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/exam/auth";
import { getExamById, getExamRankings } from "@/lib/exam/exam-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const examId = Number(request.nextUrl.searchParams.get("examId"));
  if (!examId || Number.isNaN(examId)) {
    return NextResponse.json({ error: "شناسه آزمون نامعتبر است" }, { status: 400 });
  }

  const exam = getExamById(examId);
  if (!exam) {
    return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
  }

  const rankings = getExamRankings(examId);
  if (rankings.length === 0) {
    return NextResponse.json({ error: "نمره‌ای برای خروجی وجود ندارد" }, { status: 400 });
  }

  try {
    const { generateScoresPdf, buildScoresPdfFilename, buildScoresPdfFilenameUtf8 } = await import(
      "@/lib/exam/scores-pdf"
    );
    const pdfBuffer = await generateScoresPdf(exam, rankings);
    const asciiFilename = buildScoresPdfFilename(exam.title, examId);
    const utf8Filename = encodeURIComponent(buildScoresPdfFilenameUtf8(exam.title, examId));

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${utf8Filename}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("export-pdf failed:", error);
    const message = error instanceof Error ? error.message : "خطا در ساخت PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
