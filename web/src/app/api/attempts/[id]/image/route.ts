import { NextRequest, NextResponse } from "next/server";
import { getAttemptImagePath, getImageContentType } from "@/lib/exam/file-storage";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const file = request.nextUrl.searchParams.get("file");
  if (!file) {
    return NextResponse.json({ error: "فایل مشخص نشده" }, { status: 400 });
  }

  const filepath = getAttemptImagePath(Number(id), file);
  if (!filepath) {
    return NextResponse.json({ error: "تصویر یافت نشد" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filepath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": getImageContentType(file),
      "Cache-Control": "private, max-age=3600",
    },
  });
}
