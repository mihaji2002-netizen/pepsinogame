import { deleteAttemptFiles, deleteExamFiles } from "./file-storage";
import { getDb } from "./db";
import type { Attempt, Exam, ExamListItem, ExamQuestionItem, ExamSourceType, GradingStatus, GradeLevel, RankingEntry, StudyTrack } from "./types";
import {
  calculateDescriptiveGrade,
  normalizeParticipantName,
  parseExamQuestions,
  validateQuestionScores,
} from "./types";

type ExamRow = {
  id: number;
  title: string;
  exam_type: "test" | "descriptive";
  source_type: ExamSourceType;
  grade: GradeLevel | null;
  track: StudyTrack | null;
  duration_minutes: number;
  question_count: number;
  option_count: number;
  questions_json: string;
  questions_pdf: string | null;
  answer_sheet_pdf: string | null;
  answer_key_json: string;
  access_code: string;
  is_active: number;
  active_from: string | null;
  active_until: string | null;
  created_at: string;
};

function mapExamRow(row: ExamRow): Exam {
  return {
    id: row.id,
    title: row.title,
    exam_type: row.exam_type,
    source_type: row.source_type ?? "pdf",
    grade: row.grade,
    track: row.track,
    duration_minutes: row.duration_minutes,
    question_count: row.question_count,
    option_count: row.option_count,
    questions: parseExamQuestions(row.questions_json),
    questions_pdf: row.questions_pdf,
    answer_sheet_pdf: row.answer_sheet_pdf,
    answer_key: JSON.parse(row.answer_key_json),
    access_code: row.access_code,
    is_active: row.is_active,
    active_from: row.active_from,
    active_until: row.active_until,
    created_at: row.created_at,
  };
}

const examSelect = `
  SELECT id, title, exam_type, source_type, grade, track, duration_minutes, question_count, option_count,
         questions_json, questions_pdf, answer_sheet_pdf, answer_key_json, access_code,
         is_active, active_from, active_until, created_at
  FROM exams
`;

export function getActiveExams(): ExamListItem[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT e.id, e.title, e.exam_type, e.source_type, e.grade, e.track, e.duration_minutes, e.question_count, e.option_count,
              e.access_code, e.is_active, e.active_from, e.active_until, e.created_at,
              (SELECT COUNT(*) FROM attempts a WHERE a.exam_id = e.id AND a.finished_at IS NOT NULL) as attempt_count
       FROM exams e
       WHERE e.is_active = 1
       ORDER BY e.created_at DESC`
    )
    .all() as ExamListItem[];
}

export function getAllExams(): ExamListItem[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT e.id, e.title, e.exam_type, e.source_type, e.grade, e.track, e.duration_minutes, e.question_count, e.option_count,
              e.access_code, e.is_active, e.active_from, e.active_until, e.created_at,
              (SELECT COUNT(*) FROM attempts a WHERE a.exam_id = e.id AND a.finished_at IS NOT NULL) as attempt_count
       FROM exams e
       ORDER BY e.created_at DESC`
    )
    .all() as ExamListItem[];
}

export function getExamById(id: number): Exam | null {
  const db = getDb();
  const row = db.prepare(`${examSelect} WHERE id = ?`).get(id) as ExamRow | undefined;
  return row ? mapExamRow(row) : null;
}

export function getExamByAccessCode(accessCode: string): Exam | null {
  const db = getDb();
  const row = db
    .prepare(`${examSelect} WHERE access_code = ? AND is_active = 1`)
    .get(accessCode.toUpperCase()) as ExamRow | undefined;
  return row ? mapExamRow(row) : null;
}

export function createExam(data: {
  title: string;
  exam_type: "test" | "descriptive";
  source_type?: ExamSourceType;
  grade?: GradeLevel | null;
  track?: StudyTrack | null;
  duration_minutes: number;
  question_count: number;
  option_count: number;
  answer_key_json: string;
  questions_json?: string;
  access_code: string;
  questions_pdf: string | null;
  answer_sheet_pdf: string | null;
  active_from: string | null;
  active_until: string | null;
}): number {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO exams (
        title, exam_type, source_type, grade, track, duration_minutes, questions_json, answer_key_json, access_code,
        question_count, option_count, questions_pdf, answer_sheet_pdf,
        active_from, active_until
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      data.title,
      data.exam_type,
      data.source_type ?? "pdf",
      data.grade ?? null,
      data.track ?? null,
      data.duration_minutes,
      data.questions_json ?? "[]",
      data.answer_key_json,
      data.access_code,
      data.question_count,
      data.option_count,
      data.questions_pdf,
      data.answer_sheet_pdf,
      data.active_from,
      data.active_until
    );
  return Number(result.lastInsertRowid);
}

export function toggleExamActive(id: number, isActive: boolean) {
  const db = getDb();
  db.prepare(`UPDATE exams SET is_active = ? WHERE id = ?`).run(isActive ? 1 : 0, id);
}

export function deleteExam(id: number) {
  const db = getDb();
  const attempts = db
    .prepare(`SELECT id FROM attempts WHERE exam_id = ?`)
    .all(id) as { id: number }[];
  for (const attempt of attempts) {
    deleteAttemptFiles(attempt.id);
  }
  db.prepare(`DELETE FROM attempts WHERE exam_id = ?`).run(id);
  db.prepare(`DELETE FROM exams WHERE id = ?`).run(id);
  deleteExamFiles(id);
}

export function createAttempt(data: {
  exam_id: number;
  first_name: string;
  last_name: string;
}): number {
  const db = getDb();
  const firstName = normalizeParticipantName(data.first_name);
  const lastName = normalizeParticipantName(data.last_name);
  const result = db
    .prepare(`INSERT INTO attempts (exam_id, first_name, last_name) VALUES (?, ?, ?)`)
    .run(data.exam_id, firstName, lastName);
  return Number(result.lastInsertRowid);
}

type AttemptRow = {
  id: number;
  exam_id: number;
  first_name: string;
  last_name: string;
  answers_json: string;
  correct_count: number;
  total_questions: number;
  percentage: number;
  grading_status: GradingStatus;
  question_scores_json: string;
  graded_at: string | null;
  started_at: string;
  finished_at: string | null;
};

function mapAttemptRow(row: AttemptRow): Attempt {
  const rank = row.finished_at ? getRankForAttempt(row.exam_id, row.id) : null;
  return {
    id: row.id,
    exam_id: row.exam_id,
    first_name: row.first_name,
    last_name: row.last_name,
    answers: JSON.parse(row.answers_json),
    correct_count: row.correct_count,
    total_questions: row.total_questions,
    percentage: row.percentage,
    grading_status: row.grading_status,
    question_scores: JSON.parse(row.question_scores_json || "{}"),
    graded_at: row.graded_at,
    started_at: row.started_at,
    finished_at: row.finished_at,
    rank,
  };
}

export function getAttemptById(id: number): Attempt | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id, exam_id, first_name, last_name, answers_json, correct_count, total_questions,
              percentage, grading_status, question_scores_json, graded_at, started_at, finished_at
       FROM attempts WHERE id = ?`
    )
    .get(id) as AttemptRow | undefined;

  return row ? mapAttemptRow(row) : null;
}

export function updateAttemptAnswers(id: number, answers: Record<string, unknown>) {
  const db = getDb();
  db.prepare(`UPDATE attempts SET answers_json = ? WHERE id = ? AND finished_at IS NULL`).run(
    JSON.stringify(answers),
    id
  );
}

export function finishAttempt(
  id: number,
  data: {
    correct_count: number;
    total_questions: number;
    percentage: number;
    grading_status?: GradingStatus;
  }
) {
  const db = getDb();
  db.prepare(
    `UPDATE attempts
     SET correct_count = ?, total_questions = ?, percentage = ?,
         grading_status = COALESCE(?, grading_status),
         finished_at = datetime('now', 'localtime')
     WHERE id = ? AND finished_at IS NULL`
  ).run(
    data.correct_count,
    data.total_questions,
    data.percentage,
    data.grading_status ?? null,
    id
  );
}

export function gradeDescriptiveAttempt(
  attemptId: number,
  questionScores: Record<string, number>
) {
  const attempt = getAttemptById(attemptId);
  if (!attempt || !attempt.finished_at) {
    throw new Error("پاسخبرگ یافت نشد");
  }

  const exam = getExamById(attempt.exam_id);
  if (!exam || exam.exam_type !== "descriptive") {
    throw new Error("این آزمون تشریحی نیست");
  }

  const scores = validateQuestionScores(questionScores, exam.question_count);
  const grade = calculateDescriptiveGrade(scores, exam.question_count);

  const db = getDb();
  const result = db.prepare(
    `UPDATE attempts
     SET question_scores_json = ?, correct_count = ?, total_questions = ?,
         percentage = ?, grading_status = 'graded',
         graded_at = datetime('now', 'localtime')
     WHERE id = ?`
  ).run(
    JSON.stringify(scores),
    grade.totalScore,
    grade.maxScore,
    grade.percentage,
    attemptId
  );

  if (result.changes === 0) {
    throw new Error("ثبت نمره انجام نشد");
  }
}

export function getDescriptiveSubmissions(examId: number) {
  const db = getDb();
  return db
    .prepare(
      `SELECT id, first_name, last_name, percentage, correct_count, total_questions,
              grading_status, finished_at
       FROM attempts
       WHERE exam_id = ? AND finished_at IS NOT NULL
       ORDER BY finished_at DESC`
    )
    .all(examId) as Array<{
    id: number;
    first_name: string;
    last_name: string;
    percentage: number;
    correct_count: number;
    total_questions: number;
    grading_status: GradingStatus;
    finished_at: string;
  }>;
}

function getRankForAttempt(examId: number, attemptId: number): number | null {
  const exam = getExamById(examId);
  if (!exam) return null;

  const db = getDb();

  if (exam.exam_type === "descriptive") {
    const rows = db
      .prepare(
        `SELECT id FROM attempts
         WHERE exam_id = ? AND finished_at IS NOT NULL AND grading_status = 'graded'
         ORDER BY percentage DESC, correct_count DESC, graded_at ASC`
      )
      .all(examId) as { id: number }[];
    const index = rows.findIndex((r) => r.id === attemptId);
    return index >= 0 ? index + 1 : null;
  }

  const rows = db
    .prepare(
      `SELECT id FROM attempts
       WHERE exam_id = ? AND finished_at IS NOT NULL
       ORDER BY percentage DESC, correct_count DESC, finished_at ASC`
    )
    .all(examId) as { id: number }[];

  const index = rows.findIndex((r) => r.id === attemptId);
  return index >= 0 ? index + 1 : rows.length + 1;
}

export function getExamRankings(examId: number): RankingEntry[] {
  const exam = getExamById(examId);
  const db = getDb();

  if (exam?.exam_type === "descriptive") {
    const rows = db
      .prepare(
        `SELECT id, first_name, last_name, percentage, correct_count, total_questions,
                grading_status, finished_at
         FROM attempts
         WHERE exam_id = ? AND finished_at IS NOT NULL
         ORDER BY
           CASE WHEN grading_status = 'graded' THEN 0 ELSE 1 END,
           percentage DESC,
           finished_at ASC`
      )
      .all(examId) as Array<Omit<RankingEntry, "rank"> & { id: number; grading_status: GradingStatus }>;

    let gradedRank = 0;
    return rows.map((row) => {
      if (row.grading_status === "graded") {
        gradedRank += 1;
        return {
          rank: gradedRank,
          attempt_id: row.id,
          first_name: row.first_name,
          last_name: row.last_name,
          percentage: row.percentage,
          correct_count: row.correct_count,
          total_questions: row.total_questions,
          finished_at: row.finished_at,
          grading_status: row.grading_status,
        };
      }
      return {
        rank: 0,
        attempt_id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        percentage: row.percentage,
        correct_count: row.correct_count,
        total_questions: row.total_questions,
        finished_at: row.finished_at,
        grading_status: row.grading_status,
      };
    });
  }

  const rows = db
    .prepare(
      `SELECT first_name, last_name, percentage, correct_count, total_questions, finished_at
       FROM attempts
       WHERE exam_id = ? AND finished_at IS NOT NULL
       ORDER BY percentage DESC, correct_count DESC, finished_at ASC`
    )
    .all(examId) as Omit<RankingEntry, "rank">[];

  return rows.map((row, index) => ({
    rank: index + 1,
    ...row,
  }));
}

function findAttemptByName(examId: number, firstName: string, lastName: string) {
  const db = getDb();
  const first = normalizeParticipantName(firstName);
  const last = normalizeParticipantName(lastName);

  const names = db
    .prepare(`SELECT id, first_name, last_name, finished_at FROM attempts WHERE exam_id = ?`)
    .all(examId) as {
    id: number;
    first_name: string;
    last_name: string;
    finished_at: string | null;
  }[];

  return names.filter(
    (a) =>
      normalizeParticipantName(a.first_name) === first &&
      normalizeParticipantName(a.last_name) === last
  );
}

export function hasActiveAttempt(examId: number, firstName: string, lastName: string): number | null {
  const matches = findAttemptByName(examId, firstName, lastName);
  const active = matches.find((a) => !a.finished_at);
  return active?.id ?? null;
}

export function hasFinishedAttempt(examId: number, firstName: string, lastName: string): boolean {
  const matches = findAttemptByName(examId, firstName, lastName);
  return matches.some((a) => !!a.finished_at);
}
