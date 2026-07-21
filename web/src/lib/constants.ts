import type { Achievement, ExamRecord, LabTheme, MissionItem, PlannerTask, Student } from "./types";

export const BRAND = {
  name: "PEPSINO LAB",
  short: "PPL",
  tagline: "Gamified Education Operating System",
};

export const XP_PER_LEVEL = 1200;
export const LEVELS_PER_LAB = 4;
export const TOTAL_LEVELS = 16;
export const STAMPS_PER_LEVEL = 12;

export const LABS: LabTheme[] = [
  {
    id: "neuro",
    name: "Neuro",
    tagline: "Wire the foundations. Build focus under pressure.",
    color: "#2FD6C3",
    soft: "rgba(47, 214, 195, 0.14)",
    badge: "N",
  },
  {
    id: "research",
    name: "Research",
    tagline: "Ask sharper questions. Prove every claim.",
    color: "#F2B544",
    soft: "rgba(242, 181, 68, 0.14)",
    badge: "R",
  },
  {
    id: "catalyst",
    name: "Catalyst",
    tagline: "Accelerate output. Turn study into systems.",
    color: "#FF6B81",
    soft: "rgba(255, 107, 129, 0.14)",
    badge: "C",
  },
  {
    id: "pioneer",
    name: "Pioneer",
    tagline: "Lead the frontier. Own the season.",
    color: "#8AA5FF",
    soft: "rgba(138, 165, 255, 0.14)",
    badge: "P",
  },
];

export const DEFAULT_MISSIONS: MissionItem[] = [
  {
    key: "routine",
    title: "Routine",
    description: "Complete your daily study ritual and warm-up.",
    xpReward: 40,
    coinReward: 5,
    completed: false,
    approved: false,
  },
  {
    key: "target1",
    title: "Target 1",
    description: "Finish the first deep-work block with full focus.",
    xpReward: 60,
    coinReward: 8,
    completed: false,
    approved: false,
  },
  {
    key: "target2",
    title: "Target 2",
    description: "Solve practice problems without distraction.",
    xpReward: 60,
    coinReward: 8,
    completed: false,
    approved: false,
  },
  {
    key: "target3",
    title: "Target 3",
    description: "Review notes and close knowledge gaps.",
    xpReward: 50,
    coinReward: 6,
    completed: false,
    approved: false,
  },
  {
    key: "target4",
    title: "Target 4",
    description: "Complete timed drills for speed and accuracy.",
    xpReward: 70,
    coinReward: 10,
    completed: false,
    approved: false,
  },
  {
    key: "target5",
    title: "Target 5",
    description: "Teach one concept back in your own words.",
    xpReward: 55,
    coinReward: 7,
    completed: false,
    approved: false,
  },
  {
    key: "target6",
    title: "Target 6",
    description: "Lock tomorrow’s plan and submit reflection.",
    xpReward: 45,
    coinReward: 6,
    completed: false,
    approved: false,
  },
];

export const DEFAULT_PLANNER: PlannerTask[] = [
  { id: "p1", day: "Mon", title: "Math deep work · 90m", done: true },
  { id: "p2", day: "Mon", title: "Physics review · 45m", done: true },
  { id: "p3", day: "Tue", title: "Chemistry drills · 60m", done: false },
  { id: "p4", day: "Tue", title: "Mission logbook", done: false },
  { id: "p5", day: "Wed", title: "Mock exam block", done: false },
  { id: "p6", day: "Wed", title: "Mentor sync notes", done: false },
  { id: "p7", day: "Thu", title: "Weak-topic repair", done: false },
  { id: "p8", day: "Fri", title: "Weekly reflection", done: false },
  { id: "p9", day: "Sat", title: "Catch-up sprint", done: false },
  { id: "p10", day: "Sun", title: "Season planning", done: false },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "a1",
    title: "First Stamp",
    description: "Receive your first mentor stamp.",
    unlocked: false,
  },
  {
    id: "a2",
    title: "Perfect Week",
    description: "Complete every mission for 7 days.",
    unlocked: false,
  },
  {
    id: "a3",
    title: "1000 XP",
    description: "Cross the 1000 XP threshold.",
    unlocked: false,
  },
  {
    id: "a4",
    title: "Mission Master",
    description: "Clear an entire mission board.",
    unlocked: false,
  },
  {
    id: "a5",
    title: "Attendance Hero",
    description: "Stay present across six sessions.",
    unlocked: false,
  },
  {
    id: "a6",
    title: "Researcher",
    description: "Unlock the Research Lab.",
    unlocked: false,
  },
];

export const DEMO_STUDENTS: Student[] = [
  {
    id: "stu-1",
    studentId: "PPL-250001",
    name: "Ava Karimi",
    email: "ava@pepsinolab.dev",
    avatar: "AK",
    lab: "neuro",
    level: 1,
    xp: 180,
    coins: 42,
    stamps: 2,
    mentorId: "men-1",
    joinedAt: "2026-07-01",
    hasCompletedOnboarding: true,
  },
  {
    id: "stu-2",
    studentId: "PPL-250002",
    name: "Nima Rostami",
    email: "nima@pepsinolab.dev",
    avatar: "NR",
    lab: "neuro",
    level: 2,
    xp: 640,
    coins: 88,
    stamps: 5,
    mentorId: "men-1",
    joinedAt: "2026-07-01",
    hasCompletedOnboarding: true,
  },
  {
    id: "stu-3",
    studentId: "PPL-250003",
    name: "Sara Hosseini",
    email: "sara@pepsinolab.dev",
    avatar: "SH",
    lab: "research",
    level: 5,
    xp: 210,
    coins: 120,
    stamps: 3,
    mentorId: "men-1",
    joinedAt: "2026-06-15",
    hasCompletedOnboarding: true,
  },
];

export const DEMO_EXAMS: ExamRecord[] = [
  {
    id: "ex-1",
    subject: "Mathematics",
    date: "2026-07-10",
    score: 86,
    percentage: 86,
    rank: 3,
    comment: "Strong algebra. Tighten geometry proofs.",
  },
  {
    id: "ex-2",
    subject: "Physics",
    date: "2026-07-14",
    score: 78,
    percentage: 78,
    rank: 5,
    comment: "Good intuition. More timed drills needed.",
  },
];

export function labForLevel(level: number): LabTheme {
  const index = Math.min(Math.floor((level - 1) / LEVELS_PER_LAB), LABS.length - 1);
  return LABS[index];
}

export function xpProgress(xp: number) {
  return {
    current: xp % XP_PER_LEVEL,
    total: XP_PER_LEVEL,
    percent: Math.min(100, Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100)),
  };
}

export function nextStudentId(sequence: number, year = 25) {
  return `PPL-${year}${String(sequence).padStart(4, "0")}`;
}
