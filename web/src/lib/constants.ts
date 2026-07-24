import type { Achievement, ExamRecord, LabId, LabTheme, MissionItem, PlannerTask, Student, AvatarKey, Gender } from "./types";

export const BRAND = {
  name: "پپسینو لب",
  nameEn: "PEPSINO LAB",
  short: "PPL",
  tagline: "فعال شو تا رشد کنی",
  motto: "GET ACTIVE TO GROW",
};

export const BRAND_SLOGANS = [
  "بدون نام واقعی — فقط شناسه موضوعی",
  "هر روز یک ماموریت است، هر ماموریت تو را قوی‌تر می‌کند",
  "با دیگران رقابت نمی‌کنیم، با دیروز خودمان رقابت می‌کنیم",
  "پتانسیلت را فعال کن، آنزیم شو",
] as const;

export const XP_PER_LEVEL = 1200;
export const LEVELS_PER_LAB = 4;
export const TOTAL_LEVELS = 16;
export const STAMPS_PER_LEVEL = 12;

export const PLANNER_DAYS = ["دو", "سه", "چه", "پن", "جم", "شن", "یک"] as const;

export const LABS: LabTheme[] = [
  {
    id: "neuro",
    name: "نورو",
    nameEn: "NEURO LAB",
    focus: "ذهن · حافظه · نظم",
    tagline: "پایه‌های ذهنی را بساز. تمرکز را تحت فشار تقویت کن.",
    color: "#00FF9D",
    soft: "rgba(0, 255, 157, 0.14)",
    badge: "N",
    image: "/labs/neuro.svg",
    imageAlt: "آیکون آزمایشگاه نورو — مغز و شبکه عصبی",
  },
  {
    id: "research",
    name: "پژوهش",
    nameEn: "RESEARCH LAB",
    focus: "استراتژی · تحلیل · دقت",
    tagline: "سؤال‌های تیز بپرس. هر ادعا را با شواهد ثابت کن.",
    color: "#3B9EFF",
    soft: "rgba(59, 158, 255, 0.14)",
    badge: "R",
    image: "/labs/research.svg",
    imageAlt: "آیکون آزمایشگاه پژوهش — میکروسکوپ",
  },
  {
    id: "catalyst",
    name: "کاتالیز",
    nameEn: "CATALYST LAB",
    focus: "تحول · رشد · بازیابی",
    tagline: "خروجی را شتاب بده. مطالعه را به سیستم تبدیل کن.",
    color: "#FFB020",
    soft: "rgba(255, 176, 32, 0.14)",
    badge: "C",
    image: "/labs/catalyst.svg",
    imageAlt: "آیکون آزمایشگاه کاتالیز — فلاسک شیمی",
  },
  {
    id: "pioneer",
    name: "پیشگام",
    nameEn: "PIONEER LAB",
    focus: "رهبری · چشم‌انداز · دستاورد",
    tagline: "در خط مقدم بایست. فصل را مال خودت کن.",
    color: "#B44BFF",
    soft: "rgba(180, 75, 255, 0.14)",
    badge: "P",
    image: "/labs/pioneer.svg",
    imageAlt: "آیکون آزمایشگاه پیشگام — راکت",
  },
];

export const DEFAULT_MISSIONS: MissionItem[] = [
  {
    key: "routine",
    title: "روتین",
    description: "آیین روزانه مطالعه و گرم‌کردن را کامل کن.",
    xpReward: 40,
    coinReward: 5,
    completed: false,
    approved: false,
  },
  {
    key: "target1",
    title: "هدف ۱",
    description: "اولین بلوک کار عمیق را با تمرکز کامل تمام کن.",
    xpReward: 60,
    coinReward: 8,
    completed: false,
    approved: false,
  },
  {
    key: "target2",
    title: "هدف ۲",
    description: "مسائل تمرینی را بدون حواس‌پرتی حل کن.",
    xpReward: 60,
    coinReward: 8,
    completed: false,
    approved: false,
  },
  {
    key: "target3",
    title: "هدف ۳",
    description: "یادداشت‌ها را مرور کن و شکاف‌های دانشی را ببند.",
    xpReward: 50,
    coinReward: 6,
    completed: false,
    approved: false,
  },
  {
    key: "target4",
    title: "هدف ۴",
    description: "تمرین‌های زمان‌دار برای سرعت و دقت انجام بده.",
    xpReward: 70,
    coinReward: 10,
    completed: false,
    approved: false,
  },
  {
    key: "target5",
    title: "هدف ۵",
    description: "یک مفهوم را با کلمات خودت توضیح بده.",
    xpReward: 55,
    coinReward: 7,
    completed: false,
    approved: false,
  },
  {
    key: "target6",
    title: "هدف ۶",
    description: "برنامه فردا را قفل کن و بازتاب امروز را ثبت کن.",
    xpReward: 45,
    coinReward: 6,
    completed: false,
    approved: false,
  },
];

export const DEFAULT_PLANNER: PlannerTask[] = [
  { id: "p1", day: "دو", title: "ریاضی · کار عمیق ۹۰ دقیقه", done: true },
  { id: "p2", day: "دو", title: "فیزیک · مرور ۴۵ دقیقه", done: true },
  { id: "p3", day: "سه", title: "شیمی · تمرین ۶۰ دقیقه", done: false },
  { id: "p4", day: "سه", title: "دفترچه ماموریت", done: false },
  { id: "p5", day: "چه", title: "آزمون آزمایشی", done: false },
  { id: "p6", day: "چه", title: "یادداشت جلسه منتور", done: false },
  { id: "p7", day: "پن", title: "ترمیم موضوعات ضعیف", done: false },
  { id: "p8", day: "جم", title: "بازتاب هفتگی", done: false },
  { id: "p9", day: "شن", title: "اسپرینت جبران", done: false },
  { id: "p10", day: "یک", title: "برنامه‌ریزی فصل", done: false },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "a1",
    title: "استاد تمرکز",
    description: "۷ روز پیاپی ماموریت روتین را کامل کن.",
    unlocked: false,
  },
  {
    id: "a2",
    title: "استاد پیوستگی",
    description: "۳۰ روز پیاپی بدون غیبت در ماموریت‌ها.",
    unlocked: false,
  },
  {
    id: "a3",
    title: "جایزه کاتالیز",
    description: "آزمایشگاه کاتالیز را باز کن.",
    unlocked: false,
  },
  {
    id: "a4",
    title: "مدال پیشگام",
    description: "به سطح ۱۳ و آزمایشگاه پیشگام برس.",
    unlocked: false,
  },
  {
    id: "a5",
    title: "مهر ۷ روزه",
    description: "۷ روز پیاپی مهر منتور دریافت کن.",
    unlocked: false,
  },
  {
    id: "a6",
    title: "مهر ۳۰ روزه",
    description: "۳۰ روز پیاپی مهر منتور دریافت کن.",
    unlocked: false,
  },
];

export const DEMO_STUDENTS: Student[] = [
  {
    id: "stu-1",
    studentId: "N-021",
    name: "آوا کریمی",
    email: "ava@pepsinolab.dev",
    gender: "female",
    avatarKey: 1,
    lab: "neuro",
    level: 3,
    xp: 1250,
    coins: 42,
    stamps: 5,
    mentorId: "men-1",
    joinedAt: "2026-07-01",
    hasCompletedOnboarding: true,
  },
  {
    id: "stu-2",
    studentId: "N-022",
    name: "نیما رستمی",
    email: "nima@pepsinolab.dev",
    gender: "male",
    avatarKey: 2,
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
    studentId: "R-003",
    name: "سارا حسینی",
    email: "sara@pepsinolab.dev",
    gender: "female",
    avatarKey: 2,
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
    comment: "شهود خوبی داری. تمرین‌های زمان‌دار بیشتر لازم است.",
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

export function nextStudentId(sequence: number, labId: LabId = "neuro") {
  const badge = LABS.find((l) => l.id === labId)?.badge ?? "N";
  return `${badge}-${String(sequence).padStart(3, "0")}`;
}
