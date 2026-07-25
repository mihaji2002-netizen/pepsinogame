import { getDb } from "@/lib/exam/db";
import { generateSubjectPalette, normalizeHex } from "./color-palette";
import type { SubjectPalette, WeeklyProgram } from "./types";

export function saveSubjectTheme(name: string, hexColor: string): SubjectPalette {
  const palette = generateSubjectPalette(hexColor);
  const db = getDb();
  db.prepare(
    `INSERT INTO subject_themes (name, hex_color, palette_json, updated_at)
     VALUES (?, ?, ?, datetime('now', 'localtime'))
     ON CONFLICT(name) DO UPDATE SET
       hex_color = excluded.hex_color,
       palette_json = excluded.palette_json,
       updated_at = datetime('now', 'localtime')`,
  ).run(name, normalizeHex(hexColor), JSON.stringify(palette));
  return palette;
}

export function getSubjectTheme(name: string): { hexColor: string; palette: SubjectPalette } | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT hex_color, palette_json FROM subject_themes WHERE name = ?`)
    .get(name) as { hex_color: string; palette_json: string } | undefined;
  if (!row) return null;
  try {
    return { hexColor: row.hex_color, palette: JSON.parse(row.palette_json) };
  } catch {
    return null;
  }
}

export function listWeeklyPrograms() {
  const db = getDb();
  return db
    .prepare(
      `SELECT id, name, subject_name, created_at, updated_at
       FROM weekly_programs
       ORDER BY updated_at DESC`,
    )
    .all() as Array<{
    id: string;
    name: string;
    subject_name: string | null;
    created_at: string;
    updated_at: string;
  }>;
}

export function getWeeklyProgram(id: string): WeeklyProgram | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT program_json FROM weekly_programs WHERE id = ?`)
    .get(id) as { program_json: string } | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.program_json) as WeeklyProgram;
  } catch {
    return null;
  }
}

export function upsertWeeklyProgram(program: WeeklyProgram) {
  saveSubjectTheme(program.subjectTheme.name, program.subjectTheme.hexColor);
  const db = getDb();
  const now = new Date().toISOString();
  const payload = { ...program, updatedAt: now };
  db.prepare(
    `INSERT INTO weekly_programs (id, name, program_json, subject_name, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       program_json = excluded.program_json,
       subject_name = excluded.subject_name,
       updated_at = excluded.updated_at`,
  ).run(
    program.id,
    program.name,
    JSON.stringify(payload),
    program.subjectTheme.name,
    program.createdAt,
    now,
  );
  return payload;
}

export function deleteWeeklyProgram(id: string) {
  const db = getDb();
  db.prepare(`DELETE FROM weekly_programs WHERE id = ?`).run(id);
}
