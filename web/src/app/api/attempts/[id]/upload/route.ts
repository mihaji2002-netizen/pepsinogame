import { NextRequest, NextResponse } from "next/server";
import { saveAttemptImage } from "@/lib/exam/file-storage";
import { getAttemptById, getExamById, updateAttemptAnswers } from "@/lib/exam/exam-service";
import { normalizeDescriptiveAnswer } from "@/lib/exam/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attemptId = Number(id);
    const attempt = getAttemptById(attemptId);

    if (!attempt || attempt.finished_at) {
      return NextResponse.json({ error: "آزمون فعال یافت نشد" }, { status: 404 });
    }

    const exam = getExamById(attempt.exam_id);
    if (!exam || exam.exam_type !== "descriptive") {
      return NextResponse.json({ error: "آپلود تصویر فقط برای آزمون تشریحی مجاز است" }, { status: 400 });
    }

    const formData = await request.formData();
    const questionNumber = Number(formData.get("question_number"));
    const file = formData.get("image");

    if (!questionNumber || questionNumber < 1 || questionNumber > exam.question_count) {
      return NextResponse.json({ error: "شماره سوال نامعتبر است" }, { status: 400 });
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "فایل تصویر الزامی است" }, { status: 400 });
    }

    const key = String(questionNumber);
    const current = normalizeDescriptiveAnswer(attempt.answers[key]);
    if (current.images.length >= 3) {
      return NextResponse.json({ error: "حداکثر ۳ تصویر برای هر سوال مجاز است" }, { status: 400 });
    }

    const filename = await saveAttemptImage(attemptId, questionNumber, file);
    const updatedAnswer = {
      text: current.text,
      images: [...current.images, filename],
    };

    const answers = {
      ...attempt.answers,
      [key]: updatedAnswer,
    };

    updateAttemptAnswers(attemptId, answers);

    return NextResponse.json({
      filename,
      image_url: `/api/attempts/${attemptId}/image?file=${encodeURIComponent(filename)}`,
      answers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در آپلود تصویر";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
