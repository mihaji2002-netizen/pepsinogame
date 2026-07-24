import { DEMO_STUDENTS } from "@/lib/constants";
import type { MissionItem, SchoolGrade, Student, StudyField, XpEvent } from "@/lib/types";
import { getStudentExamResults } from "./exam-service";
import { getDb } from "./db";

export type PepsinoStudentRow = {
  id: string;
  student_code: string;
  name: string;
  email: string | null;
  gender: string | null;
  grade: number | null;
  study_field: string | null;
  level: number;
  xp: number;
  coins: number;
  stamps: number;
  lab: string | null;
  joined_at: string | null;
  missions_json: string;
  xp_history_json: string;
  updated_at: string;
};

export type SyncStudentPayload = {
  id: string;
  studentId: string;
  name: string;
  email: string;
  gender?: string;
  grade?: number;
  studyField?: string;
  level?: number;
  xp?: number;
  coins?: number;
  stamps?: number;
  lab?: string;
  joinedAt?: string;
  missions?: MissionItem[];
  xpHistory?: XpEvent[];
};

function mapRow(row: PepsinoStudentRow) {
  let missions: MissionItem[] = [];
  let xpHistory: XpEvent[] = [];
  try {
    missions = JSON.parse(row.missions_json || "[]");
  } catch {
    missions = [];
  }
  try {
    xpHistory = JSON.parse(row.xp_history_json || "[]");
  } catch {
    xpHistory = [];
  }

  return {
    id: row.id,
    studentId: row.student_code,
    name: row.name,
    email: row.email,
    gender: row.gender,
    grade: row.grade,
    studyField: row.study_field,
    level: row.level,
    xp: row.xp,
    coins: row.coins,
    stamps: row.stamps,
    lab: row.lab,
    joinedAt: row.joined_at,
    missions,
    xpHistory,
    updatedAt: row.updated_at,
  };
}

export function seedPepsinoStudents() {
  const db = getDb();
  const count = db.prepare(`SELECT COUNT(*) as c FROM pepsino_students`).get() as {
    c: number;
  };
  if (count.c > 0) return;

  for (const student of DEMO_STUDENTS) {
    upsertPepsinoStudent({
      id: student.id,
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      gender: student.gender,
      grade: student.grade,
      studyField: student.studyField,
      level: student.level,
      xp: student.xp,
      coins: student.coins,
      stamps: student.stamps,
      lab: student.lab,
      joinedAt: student.joinedAt,
    });
  }
}

export function upsertPepsinoStudent(student: SyncStudentPayload) {
  seedPepsinoStudents();
  const db = getDb();
  db.prepare(
    `INSERT INTO pepsino_students (
       id, student_code, name, email, gender, grade, study_field,
       level, xp, coins, stamps, lab, joined_at, missions_json, xp_history_json, updated_at
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
     ON CONFLICT(id) DO UPDATE SET
       student_code = excluded.student_code,
       name = excluded.name,
       email = excluded.email,
       gender = COALESCE(excluded.gender, pepsino_students.gender),
       grade = COALESCE(excluded.grade, pepsino_students.grade),
       study_field = COALESCE(excluded.study_field, pepsino_students.study_field),
       level = COALESCE(excluded.level, pepsino_students.level),
       xp = COALESCE(excluded.xp, pepsino_students.xp),
       coins = COALESCE(excluded.coins, pepsino_students.coins),
       stamps = COALESCE(excluded.stamps, pepsino_students.stamps),
       lab = COALESCE(excluded.lab, pepsino_students.lab),
       joined_at = COALESCE(excluded.joined_at, pepsino_students.joined_at),
       missions_json = CASE
         WHEN excluded.missions_json != '[]' THEN excluded.missions_json
         ELSE pepsino_students.missions_json
       END,
       xp_history_json = CASE
         WHEN excluded.xp_history_json != '[]' THEN excluded.xp_history_json
         ELSE pepsino_students.xp_history_json
       END,
       updated_at = datetime('now', 'localtime')`,
  ).run(
    student.id,
    student.studentId,
    student.name,
    student.email,
    student.gender ?? null,
    student.grade ?? null,
    student.studyField ?? null,
    student.level ?? 1,
    student.xp ?? 0,
    student.coins ?? 0,
    student.stamps ?? 0,
    student.lab ?? null,
    student.joinedAt ?? null,
    JSON.stringify(student.missions ?? []),
    JSON.stringify(student.xpHistory ?? []),
  );
}

export function syncPepsinoStudents(students: SyncStudentPayload[]) {
  seedPepsinoStudents();
  for (const student of students) {
    upsertPepsinoStudent(student);
  }
}

export function listPepsinoStudents(filters?: {
  grade?: SchoolGrade | "all";
  studyField?: StudyField | "all";
}) {
  seedPepsinoStudents();
  const db = getDb();
  const clauses: string[] = [];
  const params: Array<string | number> = [];

  if (filters?.grade && filters.grade !== "all") {
    clauses.push("grade = ?");
    params.push(filters.grade);
  }
  if (filters?.studyField && filters.studyField !== "all") {
    clauses.push("study_field = ?");
    params.push(filters.studyField);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db
    .prepare(
      `SELECT id, student_code, name, email, gender, grade, study_field,
              level, xp, coins, stamps, lab, joined_at, missions_json, xp_history_json, updated_at
       FROM pepsino_students
       ${where}
       ORDER BY grade ASC, study_field ASC, name ASC`,
    )
    .all(...params) as PepsinoStudentRow[];

  return rows.map(mapRow);
}

export function getPepsinoStudentById(id: string) {
  seedPepsinoStudents();
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id, student_code, name, email, gender, grade, study_field,
              level, xp, coins, stamps, lab, joined_at, missions_json, xp_history_json, updated_at
       FROM pepsino_students WHERE id = ?`,
    )
    .get(id) as PepsinoStudentRow | undefined;
  return row ? mapRow(row) : undefined;
}

export function adjustStudentRewards(
  studentId: string,
  xpDelta: number,
  coinsDelta: number,
  reason?: string,
) {
  const student = getPepsinoStudentById(studentId);
  if (!student) return null;

  const nextXp = Math.max(0, student.xp + xpDelta);
  const nextCoins = Math.max(0, student.coins + coinsDelta);
  const xpHistory = [...student.xpHistory];

  if (xpDelta !== 0) {
    xpHistory.unshift({
      id: `xp-${Date.now()}`,
      amount: xpDelta,
      reason: reason ?? (xpDelta > 0 ? "تغییر توسط ادمین" : "کسر توسط ادمین"),
      at: new Date().toISOString(),
    });
  }

  const db = getDb();
  db.prepare(
    `UPDATE pepsino_students
     SET xp = ?, coins = ?, xp_history_json = ?, updated_at = datetime('now', 'localtime')
     WHERE id = ?`,
  ).run(nextXp, nextCoins, JSON.stringify(xpHistory), studentId);

  return getPepsinoStudentById(studentId);
}

export function getPendingGradingForStudent(studentId: string) {
  const db = getDb();
  return db
    .prepare(
      `SELECT att.id as attempt_id, att.exam_id, e.title, att.finished_at, att.grading_status
       FROM attempts att
       JOIN exams e ON e.id = att.exam_id
       WHERE att.student_id = ?
         AND att.finished_at IS NOT NULL
         AND att.grading_status = 'pending'
       ORDER BY att.finished_at DESC`,
    )
    .all(studentId) as Array<{
    attempt_id: number;
    exam_id: number;
    title: string;
    finished_at: string;
    grading_status: string;
  }>;
}

export function getStudentAdminDetail(studentId: string) {
  const student = getPepsinoStudentById(studentId);
  if (!student) return null;

  const examResults = getStudentExamResults(studentId);
  const pendingGrading = getPendingGradingForStudent(studentId);
  const pendingMissions = student.missions.filter((m) => m.completed && !m.approved);

  return {
    student,
    examResults,
    pendingGrading,
    pendingMissions,
  };
}

export function splitStudentName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: "دانش‌آموز", last_name: "-" };
  if (parts.length === 1) return { first_name: parts[0], last_name: "-" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}
