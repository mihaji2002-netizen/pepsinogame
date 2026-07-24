import { getChapterLabel, getSubjectLabel, validateCurriculumSelection } from "./curriculum";
import { getDb } from "./db";
import type { BankQuestion, ExamQuestionItem, ExamType, GradeLevel, StudyTrack } from "./types";

type BankQuestionRow = {
  id: number;
  grade: GradeLevel;
  track: StudyTrack;
  subject_id: string | null;
  chapter_id: string | null;
  question_type: ExamType;
  stem: string;
  options_json: string | null;
  correct_option: number | null;
  created_at: string;
};

function mapBankQuestion(row: BankQuestionRow): BankQuestion {
  const subjectId = row.subject_id ?? "";
  const chapterId = row.chapter_id ?? "";
  return {
    id: row.id,
    grade: row.grade,
    track: row.track,
    subject_id: subjectId,
    chapter_id: chapterId,
    subject_title: subjectId ? getSubjectLabel(row.grade, row.track, subjectId) : "",
    chapter_title:
      subjectId && chapterId
        ? getChapterLabel(row.grade, row.track, subjectId, chapterId)
        : "",
    question_type: row.question_type,
    stem: row.stem,
    options: row.options_json ? (JSON.parse(row.options_json) as string[]) : null,
    correct_option: row.correct_option,
    created_at: row.created_at,
  };
}

const bankSelect = `
  SELECT id, grade, track, subject_id, chapter_id, question_type, stem, options_json, correct_option, created_at
  FROM question_bank
`;

export function listBankQuestions(filters?: {
  grade?: GradeLevel;
  track?: StudyTrack;
  question_type?: ExamType;
  subject_id?: string;
  chapter_id?: string;
}): BankQuestion[] {
  const db = getDb();
  const clauses: string[] = [];
  const params: Array<number | string> = [];

  if (filters?.grade) {
    clauses.push("grade = ?");
    params.push(filters.grade);
  }
  if (filters?.track) {
    clauses.push("track = ?");
    params.push(filters.track);
  }
  if (filters?.question_type) {
    clauses.push("question_type = ?");
    params.push(filters.question_type);
  }
  if (filters?.subject_id) {
    clauses.push("subject_id = ?");
    params.push(filters.subject_id);
  }
  if (filters?.chapter_id) {
    clauses.push("chapter_id = ?");
    params.push(filters.chapter_id);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db
    .prepare(`${bankSelect} ${where} ORDER BY created_at DESC, id DESC`)
    .all(...params) as BankQuestionRow[];

  return rows.map(mapBankQuestion);
}

export function getBankQuestionById(id: number): BankQuestion | null {
  const db = getDb();
  const row = db.prepare(`${bankSelect} WHERE id = ?`).get(id) as BankQuestionRow | undefined;
  return row ? mapBankQuestion(row) : null;
}

export function getBankQuestionsByIds(ids: number[]): BankQuestion[] {
  if (ids.length === 0) return [];
  const db = getDb();
  const placeholders = ids.map(() => "?").join(", ");
  const rows = db
    .prepare(`${bankSelect} WHERE id IN (${placeholders})`)
    .all(...ids) as BankQuestionRow[];

  const byId = new Map(rows.map((row) => [row.id, mapBankQuestion(row)]));
  return ids.map((id) => byId.get(id)).filter((q): q is BankQuestion => !!q);
}

export function createBankQuestion(data: {
  grade: GradeLevel;
  track: StudyTrack;
  subject_id: string;
  chapter_id: string;
  question_type: ExamType;
  stem: string;
  options: string[] | null;
  correct_option: number | null;
}): number {
  if (!validateCurriculumSelection(data.grade, data.track, data.subject_id, data.chapter_id)) {
    throw new Error("درس یا فصل انتخاب‌شده نامعتبر است");
  }

  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO question_bank (grade, track, subject_id, chapter_id, question_type, stem, options_json, correct_option)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      data.grade,
      data.track,
      data.subject_id,
      data.chapter_id,
      data.question_type,
      data.stem.trim(),
      data.options ? JSON.stringify(data.options) : null,
      data.correct_option
    );
  return Number(result.lastInsertRowid);
}

export function updateBankQuestion(
  id: number,
  data: {
    grade: GradeLevel;
    track: StudyTrack;
    subject_id: string;
    chapter_id: string;
    question_type: ExamType;
    stem: string;
    options: string[] | null;
    correct_option: number | null;
  }
) {
  if (!validateCurriculumSelection(data.grade, data.track, data.subject_id, data.chapter_id)) {
    throw new Error("درس یا فصل انتخاب‌شده نامعتبر است");
  }

  const db = getDb();
  const result = db
    .prepare(
      `UPDATE question_bank
       SET grade = ?, track = ?, subject_id = ?, chapter_id = ?, question_type = ?, stem = ?, options_json = ?, correct_option = ?
       WHERE id = ?`
    )
    .run(
      data.grade,
      data.track,
      data.subject_id,
      data.chapter_id,
      data.question_type,
      data.stem.trim(),
      data.options ? JSON.stringify(data.options) : null,
      data.correct_option,
      id
    );
  if (result.changes === 0) {
    throw new Error("سوال یافت نشد");
  }
}

export function deleteBankQuestion(id: number) {
  const db = getDb();
  const result = db.prepare(`DELETE FROM question_bank WHERE id = ?`).run(id);
  if (result.changes === 0) {
    throw new Error("سوال یافت نشد");
  }
}

export function buildExamSnapshotsFromBank(questionIds: number[]): {
  questions: ExamQuestionItem[];
  answerKey: Record<string, number>;
  optionCount: number;
} {
  const bankQuestions = getBankQuestionsByIds(questionIds);
  if (bankQuestions.length !== questionIds.length) {
    throw new Error("برخی سوالات انتخاب‌شده یافت نشدند");
  }

  const questions: ExamQuestionItem[] = [];
  const answerKey: Record<string, number> = {};
  let optionCount = 0;

  bankQuestions.forEach((question, index) => {
    const position = index + 1;
    const options = question.options?.map((opt) => opt.trim()).filter(Boolean) ?? null;

    questions.push({
      position,
      bank_question_id: question.id,
      stem: question.stem,
      options,
    });

    if (question.question_type === "test") {
      if (!options || options.length < 2) {
        throw new Error(`سوال ${question.id} گزینه کافی ندارد`);
      }
      if (!question.correct_option || question.correct_option < 1 || question.correct_option > options.length) {
        throw new Error(`پاسخ صحیح سوال ${question.id} نامعتبر است`);
      }
      answerKey[String(position)] = question.correct_option;
      optionCount = Math.max(optionCount, options.length);
    }
  });

  return { questions, answerKey, optionCount };
}
