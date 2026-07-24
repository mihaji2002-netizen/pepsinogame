import { DEMO_STUDENTS } from "@/lib/constants";
import type { Student } from "@/lib/types";
import { getDb } from "./db";

export function seedPepsinoStudents() {
  const db = getDb();
  const count = db.prepare(`SELECT COUNT(*) as c FROM pepsino_students`).get() as {
    c: number;
  };
  if (count.c > 0) return;

  const insert = db.prepare(
    `INSERT INTO pepsino_students (id, student_code, name, email) VALUES (?, ?, ?, ?)`,
  );
  for (const student of DEMO_STUDENTS) {
    insert.run(student.id, student.studentId, student.name, student.email);
  }
}

export function upsertPepsinoStudent(student: Pick<Student, "id" | "studentId" | "name" | "email">) {
  seedPepsinoStudents();
  const db = getDb();
  db.prepare(
    `INSERT INTO pepsino_students (id, student_code, name, email, updated_at)
     VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
     ON CONFLICT(id) DO UPDATE SET
       student_code = excluded.student_code,
       name = excluded.name,
       email = excluded.email,
       updated_at = datetime('now', 'localtime')`,
  ).run(student.id, student.studentId, student.name, student.email);
}

export function syncPepsinoStudents(students: Pick<Student, "id" | "studentId" | "name" | "email">[]) {
  seedPepsinoStudents();
  for (const student of students) {
    upsertPepsinoStudent(student);
  }
}

export function listPepsinoStudents() {
  seedPepsinoStudents();
  const db = getDb();
  return db
    .prepare(
      `SELECT id, student_code, name, email FROM pepsino_students ORDER BY name ASC`,
    )
    .all() as Array<{
    id: string;
    student_code: string;
    name: string;
    email: string | null;
  }>;
}

export function getPepsinoStudentById(id: string) {
  seedPepsinoStudents();
  const db = getDb();
  return db
    .prepare(`SELECT id, student_code, name, email FROM pepsino_students WHERE id = ?`)
    .get(id) as
    | { id: string; student_code: string; name: string; email: string | null }
    | undefined;
}

export function splitStudentName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: "دانش‌آموز", last_name: "-" };
  if (parts.length === 1) return { first_name: parts[0], last_name: "-" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}
