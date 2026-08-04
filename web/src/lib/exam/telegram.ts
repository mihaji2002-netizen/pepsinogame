import type { Attempt, Exam } from "./types";
import { formatGradeOutOf20, isTestExam } from "./types";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();
const CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim();

export function isTelegramConfigured(): boolean {
  return Boolean(BOT_TOKEN && CHAT_ID);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!isTelegramConfigured()) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("[telegram] send failed:", error);
    return false;
  }
}

function studentName(first: string, last: string): string {
  return `${first} ${last}`.trim();
}

export async function notifyAttemptFinished(attempt: Attempt, exam: Exam): Promise<void> {
  if (!isTelegramConfigured() || !attempt.finished_at) return;

  const name = escapeHtml(studentName(attempt.first_name, attempt.last_name));
  const title = escapeHtml(exam.title);

  if (isTestExam(exam.exam_type)) {
    const rank = attempt.rank != null ? `\n🏆 <b>رتبه:</b> ${attempt.rank}` : "";
    await sendTelegramMessage(
      `📋 <b>نتیجه آزمون تستی</b>\n\n` +
        `🎓 <b>دانش‌آموز:</b> ${name}\n` +
        `📚 <b>آزمون:</b> ${title}\n` +
        `✅ <b>صحیح:</b> ${attempt.correct_count} از ${attempt.total_questions}\n` +
        `📊 <b>درصد:</b> ${attempt.percentage.toFixed(1)}%` +
        rank,
    );
    return;
  }

  await sendTelegramMessage(
    `📝 <b>پاسخبرگ تشریحی ثبت شد</b>\n\n` +
      `🎓 <b>دانش‌آموز:</b> ${name}\n` +
      `📚 <b>آزمون:</b> ${title}\n` +
      `⏳ <b>وضعیت:</b> در انتظار تصحیح`,
  );
}

export async function notifyAttemptGraded(attempt: Attempt, exam: Exam): Promise<void> {
  if (
    !isTelegramConfigured() ||
    !attempt.finished_at ||
    attempt.grading_status !== "graded" ||
    isTestExam(exam.exam_type)
  ) {
    return;
  }

  const name = escapeHtml(studentName(attempt.first_name, attempt.last_name));
  const title = escapeHtml(exam.title);
  const grade = formatGradeOutOf20(attempt.correct_count, attempt.total_questions);
  const rank = attempt.rank != null ? `\n🏆 <b>رتبه:</b> ${attempt.rank}` : "";

  await sendTelegramMessage(
    `✅ <b>تصحیح تشریحی انجام شد</b>\n\n` +
      `🎓 <b>دانش‌آموز:</b> ${name}\n` +
      `📚 <b>آزمون:</b> ${title}\n` +
      `📊 <b>نمره:</b> ${grade}` +
      rank,
  );
}
