import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "exams.db");

let db: Database.Database | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDb(): Database.Database {
  if (!db) {
    ensureDataDir();
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema(db);
  }
  return db;
}

function columnExists(database: Database.Database, table: string, column: string): boolean {
  const columns = database.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  return columns.some((c) => c.name === column);
}

function migrateSchema(database: Database.Database) {
  if (!columnExists(database, "exams", "question_count")) {
    database.exec(`ALTER TABLE exams ADD COLUMN question_count INTEGER NOT NULL DEFAULT 0`);
    database.exec(
      `UPDATE exams SET question_count = COALESCE(json_array_length(questions_json), 0) WHERE question_count = 0`
    );
  }
  if (!columnExists(database, "exams", "option_count")) {
    database.exec(`ALTER TABLE exams ADD COLUMN option_count INTEGER NOT NULL DEFAULT 4`);
  }
  if (!columnExists(database, "exams", "questions_pdf")) {
    database.exec(`ALTER TABLE exams ADD COLUMN questions_pdf TEXT`);
  }
  if (!columnExists(database, "exams", "answer_sheet_pdf")) {
    database.exec(`ALTER TABLE exams ADD COLUMN answer_sheet_pdf TEXT`);
  }
  if (!columnExists(database, "exams", "active_from")) {
    database.exec(`ALTER TABLE exams ADD COLUMN active_from TEXT`);
  }
  if (!columnExists(database, "exams", "active_until")) {
    database.exec(`ALTER TABLE exams ADD COLUMN active_until TEXT`);
  }
  if (!columnExists(database, "exams", "exam_type")) {
    database.exec(`ALTER TABLE exams ADD COLUMN exam_type TEXT NOT NULL DEFAULT 'test'`);
  }
  if (!columnExists(database, "attempts", "grading_status")) {
    database.exec(`ALTER TABLE attempts ADD COLUMN grading_status TEXT NOT NULL DEFAULT 'auto'`);
  }
  if (!columnExists(database, "attempts", "question_scores_json")) {
    database.exec(`ALTER TABLE attempts ADD COLUMN question_scores_json TEXT NOT NULL DEFAULT '{}'`);
  }
  if (!columnExists(database, "attempts", "graded_at")) {
    database.exec(`ALTER TABLE attempts ADD COLUMN graded_at TEXT`);
  }

  database.exec(`
    UPDATE attempts
    SET grading_status = 'pending'
    WHERE finished_at IS NOT NULL
      AND grading_status = 'auto'
      AND graded_at IS NULL
      AND exam_id IN (SELECT id FROM exams WHERE exam_type = 'descriptive')
  `);

  if (!columnExists(database, "exams", "source_type")) {
    database.exec(`ALTER TABLE exams ADD COLUMN source_type TEXT NOT NULL DEFAULT 'pdf'`);
  }
  if (!columnExists(database, "exams", "grade")) {
    database.exec(`ALTER TABLE exams ADD COLUMN grade INTEGER`);
  }
  if (!columnExists(database, "exams", "track")) {
    database.exec(`ALTER TABLE exams ADD COLUMN track TEXT`);
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS question_bank (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grade INTEGER NOT NULL CHECK (grade IN (10, 11, 12)),
      track TEXT NOT NULL CHECK (track IN ('math', 'experimental')),
      question_type TEXT NOT NULL CHECK (question_type IN ('test', 'descriptive')),
      stem TEXT NOT NULL,
      options_json TEXT,
      correct_option INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_question_bank_filter
      ON question_bank(grade, track, question_type);
  `);

  if (!columnExists(database, "question_bank", "subject_id")) {
    database.exec(`ALTER TABLE question_bank ADD COLUMN subject_id TEXT`);
  }
  if (!columnExists(database, "question_bank", "chapter_id")) {
    database.exec(`ALTER TABLE question_bank ADD COLUMN chapter_id TEXT`);
  }

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_question_bank_curriculum
      ON question_bank(grade, track, subject_id, chapter_id);
  `);

  if (!columnExists(database, "attempts", "student_id")) {
    database.exec(`ALTER TABLE attempts ADD COLUMN student_id TEXT`);
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS pepsino_students (
      id TEXT PRIMARY KEY,
      student_code TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS exam_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      student_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'assigned',
      assigned_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
      UNIQUE(exam_id, student_id)
    );

    CREATE INDEX IF NOT EXISTS idx_exam_assignments_student
      ON exam_assignments(student_id);

    CREATE TABLE IF NOT EXISTS student_exam_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      exam_id INTEGER NOT NULL,
      attempt_id INTEGER NOT NULL UNIQUE,
      subject TEXT NOT NULL,
      percentage REAL NOT NULL,
      score REAL NOT NULL,
      rank INTEGER,
      finished_at TEXT NOT NULL,
      comment TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_student_exam_results_student
      ON student_exam_results(student_id);
  `);
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      questions_json TEXT NOT NULL DEFAULT '[]',
      answer_key_json TEXT NOT NULL,
      access_code TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      answers_json TEXT NOT NULL DEFAULT '{}',
      correct_count INTEGER NOT NULL DEFAULT 0,
      total_questions INTEGER NOT NULL DEFAULT 0,
      percentage REAL NOT NULL DEFAULT 0,
      started_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      finished_at TEXT,
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_attempts_exam ON attempts(exam_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_percentage ON attempts(exam_id, percentage DESC);
  `);

  migrateSchema(database);
}
