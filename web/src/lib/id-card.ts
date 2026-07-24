import { labForLevel, LEVELS_PER_LAB, LABS } from "./constants";
import type { LabTheme, Student } from "./types";

export function studentLab(student: Pick<Student, "level" | "lab">): LabTheme {
  return labForLevel(student.level);
}

export function labTierLevel(level: number) {
  return ((level - 1) % LEVELS_PER_LAB) + 1;
}

export function globalLabIndex(level: number) {
  return Math.min(Math.floor((level - 1) / LEVELS_PER_LAB), LABS.length - 1);
}

export function cardStatus(student: Pick<Student, "hasCompletedOnboarding">) {
  return student.hasCompletedOnboarding ? "ACTIVE" : "ACTIVATING";
}

export function cardStatusFa(student: Pick<Student, "hasCompletedOnboarding">) {
  return student.hasCompletedOnboarding ? "فعال" : "در حال فعال‌سازی";
}

export function syncStudentLab<T extends Pick<Student, "level" | "lab">>(student: T): T {
  return { ...student, lab: labForLevel(student.level).id };
}
