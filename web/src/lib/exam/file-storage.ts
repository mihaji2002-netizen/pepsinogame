import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export function getExamUploadDir(examId: number): string {
  return path.join(UPLOADS_DIR, String(examId));
}

export function getAttemptUploadDir(attemptId: number): string {
  return path.join(UPLOADS_DIR, "attempts", String(attemptId));
}

export function ensureExamUploadDir(examId: number): string {
  const dir = getExamUploadDir(examId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function ensureAttemptUploadDir(attemptId: number): string {
  const dir = getAttemptUploadDir(attemptId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export async function saveExamPdf(
  examId: number,
  type: "questions" | "answer-sheet",
  file: File
): Promise<string> {
  if (file.type !== "application/pdf") {
    throw new Error("فقط فایل PDF مجاز است");
  }

  const dir = ensureExamUploadDir(examId);
  const filename = type === "questions" ? "questions.pdf" : "answer-sheet.pdf";
  const filepath = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);
  return filename;
}

export async function saveAttemptImage(
  attemptId: number,
  questionNumber: number,
  file: File
): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("فقط فایل تصویر (JPG, PNG, WEBP) مجاز است");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("حجم تصویر نباید بیشتر از ۸ مگابایت باشد");
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
  const filename = `q${questionNumber}_${Date.now()}.${ext}`;
  const dir = ensureAttemptUploadDir(attemptId);
  const filepath = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);
  return filename;
}

export function getExamPdfPath(
  examId: number,
  type: "questions" | "answer-sheet"
): string | null {
  const filename = type === "questions" ? "questions.pdf" : "answer-sheet.pdf";
  const filepath = path.join(getExamUploadDir(examId), filename);
  return fs.existsSync(filepath) ? filepath : null;
}

export function getAttemptImagePath(attemptId: number, filename: string): string | null {
  const safeName = path.basename(filename);
  const filepath = path.join(getAttemptUploadDir(attemptId), safeName);
  return fs.existsSync(filepath) ? filepath : null;
}

export function deleteExamFiles(examId: number) {
  const dir = getExamUploadDir(examId);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export function deleteAttemptFiles(attemptId: number) {
  const dir = getAttemptUploadDir(attemptId);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export function getImageContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}
