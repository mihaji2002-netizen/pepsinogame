import type { Achievement, ExamRecord, LabTheme, MissionItem, PlannerTask, Student } from "./types";

export const BRAND = {
  name: "PEPSINO LAB",
  short: "PPL",
  tagline: "سیستم‌عامل آموزشی گیمیفای‌شده",
};

export const XP_PER_LEVEL = 1200;
export const LEVELS_PER_LAB = 4;
export const TOTAL_LEVELS = 16;
export const STAMPS_PER_LEVEL = 12;

export const LABS: LabTheme[] = [
  {
    id: "neuro",
    name: "نورو",
    tagline: "پایه‌ها را بساز. تمرکز را زیر فشار قوی کن.",
    color: "#0F8A8A",
    soft: "rgba(15, 138, 138, 0.12)",
    badge: "N",
  },
  {
    id: "research",
    name: "ریسرچ",
    tagline: "سؤال‌های تیزتر بپرس. هر ادعا را ثابت کن.",
    color: "#C27803",
    soft: "rgba(194, 120, 3, 0.12)",
    badge: "R",
  },
  {
    id: "catalyst",
    name: "کاتالیست",
    tagline: "خروجی را شتاب بده. مطالعه را به سیستم تبدیل کن.",
    color: "#D1495B",
    soft: "rgba(209, 73, 91, 0.12)",
    badge: "C",
  },
  {
    id: "pioneer",
    name: "پایونیر",
    tagline: "مرز را رهبری کن. فصل را مال خودت کن.",
    color: "#2A9D6E",
    soft: "rgba(42, 157, 110, 0.12)",
    badge: "P",
  },
];

export const DEFAULT_MISSIONS: MissionItem[] = [
  {
    key: "routine",
    title: "روتین",
    description: "مراسم مطالعه روزانه و گرم‌کردن را کامل کن.",
    xpReward: 40,
    coinReward: 5,
    completed: false,
    approved: false,
  },
  {
    key: "target1",
    title: "هدف ۱",
    description: "اولین بلاک تمرکز عمیق را با تمرکز کامل تمام کن.",
    xpReward: 60,
    coinReward: 8,
    completed: false,
    approved: false,
  },
  {
    key: "target2",
    title: "هدف ۲",
    description: "تمرین‌ها را بدون حواس‌پرتی حل کن.",
    xpReward: 60,
    coinReward: 8,
    completed: false,
    approved: false,
  },
  {
    key: "target3",
    title: "هدف ۳",
    description: "جزوه‌ها را مرور کن و شکاف‌های دانش را ببند.",
    xpReward: 50,
    coinReward: 6,
    completed: false,
    approved: false,
  },
  {
    key: "target4",
    title: "هدف ۴",
    description: "تمرین‌های زمان‌دار برای سرعت و دقت را انجام بده.",
    xpReward: 70,
    coinReward: 10,
    completed: false,
    approved: false,
  },
  {
    key: "target5",
    title: "هدف ۵",
    description: "یک مفهوم را با زبان خودت دوباره توضیح بده.",
    xpReward: 55,
    coinReward: 7,
    completed: false,
    approved: false,
  },
  {
    key: "target6",
    title: "هدف ۶",
    description: "برنامه فردا را قفل کن و بازتاب را ثبت کن.",
    xpReward: 45,
    coinReward: 6,
    completed: false,
    approved: false,
  },
];

export const DEFAULT_PLANNER: PlannerTask[] = [
  { id: "p1", day: "دوشنبه", title: "کار عمیق ریاضی · ۹۰ دقیقه", done: true },
  { id: "p2", day: "دوشنبه", title: "مرور فیزیک · ۴۵ دقیقه", done: true },
  { id: "p3", day: "سه‌شنبه", title: "تمرین شیمی · ۶۰ دقیقه", done: false },
  { id: "p4", day: "سه‌شنبه", title: "دفتر مأموریت", done: false },
  { id: "p5", day: "چهارشنبه", title: "بلاک آزمون آزمایشی", done: false },
  { id: "p6", day: "چهارشنبه", title: "یادداشت هماهنگی با منتور", done: false },
  { id: "p7", day: "پنج‌شنبه", title: "رفع نقطه ضعف", done: false },
  { id: "p8", day: "جمعه", title: "بازتاب هفتگی", done: false },
  { id: "p9", day: "شنبه", title: "اسپرینت جبرانی", done: false },
  { id: "p10", day: "یکشنبه", title: "برنامه‌ریزی فصل", done: false },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "a1",
    title: "اولین مهر",
    description: "اولین مهر منتور را دریافت کن.",
    unlocked: false,
  },
  {
    id: "a2",
    title: "هفته کامل",
    description: "۷ روز همه مأموریت‌ها را کامل کن.",
    unlocked: false,
  },
  {
    id: "a3",
    title: "۱۰۰۰ XP",
    description: "از آستانه ۱۰۰۰ XP عبور کن.",
    unlocked: false,
  },
  {
    id: "a4",
    title: "استاد مأموریت",
    description: "کل بورد مأموریت را پاک‌سازی کن.",
    unlocked: false,
  },
  {
    id: "a5",
    title: "قهرمان حضور",
    description: "در شش جلسه حضور داشته باش.",
    unlocked: false,
  },
  {
    id: "a6",
    title: "پژوهشگر",
    description: "لاب ریسرچ را باز کن.",
    unlocked: false,
  },
];

export const DEMO_STUDENTS: Student[] = [
  {
    id: "stu-1",
    studentId: "PPL-250001",
    name: "آوا کریمی",
    email: "ava@pepsinolab.dev",
    avatar: "آک",
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
    name: "نیما رستمی",
    email: "nima@pepsinolab.dev",
    avatar: "نر",
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
    name: "سارا حسینی",
    email: "sara@pepsinolab.dev",
    avatar: "سح",
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
    subject: "ریاضی",
    date: "2026-07-10",
    score: 86,
    percentage: 86,
    rank: 3,
    comment: "جبر قوی است. اثبات‌های هندسه را محکم‌تر کن.",
  },
  {
    id: "ex-2",
    subject: "فیزیک",
    date: "2026-07-14",
    score: 78,
    percentage: 78,
    rank: 5,
    comment: "شهود خوب است. تمرین زمان‌دار بیشتری لازم است.",
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
