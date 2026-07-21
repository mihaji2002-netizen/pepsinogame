import type { LabId, MissionKey } from "./types";

export type DayId = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";

export const SHEET_DAYS: {
  id: DayId;
  fa: string;
  en: string;
  letter: string;
}[] = [
  { id: "sat", fa: "شنبه", en: "SAT", letter: "ش" },
  { id: "sun", fa: "یکشنبه", en: "SUN", letter: "ی" },
  { id: "mon", fa: "دوشنبه", en: "MON", letter: "د" },
  { id: "tue", fa: "سه‌شنبه", en: "TUE", letter: "س" },
  { id: "wed", fa: "چهارشنبه", en: "WED", letter: "چ" },
  { id: "thu", fa: "پنج‌شنبه", en: "THU", letter: "پ" },
  { id: "fri", fa: "جمعه", en: "FRI", letter: "ج" },
];

export const TARGET_COLS: { key: MissionKey | "extra"; label: string; labelEn: string }[] = [
  { key: "target1", label: "هدف ۱", labelEn: "TARGET 1" },
  { key: "target2", label: "هدف ۲", labelEn: "TARGET 2" },
  { key: "target3", label: "هدف ۳", labelEn: "TARGET 3" },
  { key: "target4", label: "هدف ۴", labelEn: "TARGET 4" },
  { key: "target5", label: "هدف ۵", labelEn: "TARGET 5" },
  { key: "target6", label: "هدف ۶", labelEn: "TARGET 6" },
  { key: "extra", label: "ویژه", labelEn: "SPECIAL" },
];

/** Pastel cell washes like Pioneer reference */
export const PIONEER_PASTELS = [
  "#fde2e4",
  "#fff1b6",
  "#d8f3dc",
  "#caf0f8",
  "#e2e0ff",
  "#ffe5d9",
  "#f1c0e8",
];

export interface LabSheetProfile {
  motif: "neural" | "research" | "catalyst" | "pioneer";
  dayStages: { id: DayId; stage: string; hint?: string }[];
  footer: { label: string; href: string }[];
  boardPastels: boolean;
  rankLabel: (level: number) => string;
}

export const LAB_SHEETS: Record<LabId, LabSheetProfile> = {
  neuro: {
    motif: "neural",
    dayStages: [
      { id: "sat", stage: "WAKE" },
      { id: "sun", stage: "FOCUS" },
      { id: "mon", stage: "ENCODE" },
      { id: "tue", stage: "TRAIN" },
      { id: "wed", stage: "RECALL" },
      { id: "thu", stage: "STRESS" },
      { id: "fri", stage: "RESET" },
    ],
    footer: [
      { label: "FOCUS", href: "/student/missions" },
      { label: "LEARN", href: "/student/logbook" },
      { label: "ADAPT", href: "/student/planner" },
      { label: "EVOLVE", href: "/student/profile" },
    ],
    boardPastels: false,
    rankLabel: (level) => `R${level}`,
  },
  research: {
    motif: "research",
    dayStages: [
      { id: "sat", stage: "OBSERVE" },
      { id: "sun", stage: "HYPOTHESIS" },
      { id: "mon", stage: "TEST" },
      { id: "tue", stage: "ANALYZE" },
      { id: "wed", stage: "ITERATE" },
      { id: "thu", stage: "PEER" },
      { id: "fri", stage: "PUBLISH" },
    ],
    footer: [
      { label: "ANALYZE", href: "/student/missions" },
      { label: "INVESTIGATE", href: "/student/logbook" },
      { label: "DISCOVER", href: "/student/planner" },
      { label: "DECODE", href: "/student/profile" },
    ],
    boardPastels: false,
    rankLabel: (level) => `L${level}`,
  },
  catalyst: {
    motif: "catalyst",
    dayStages: [
      { id: "sat", stage: "SPARK" },
      { id: "sun", stage: "MIX" },
      { id: "mon", stage: "REACT" },
      { id: "tue", stage: "ACCEL" },
      { id: "wed", stage: "OUTPUT" },
      { id: "thu", stage: "REFINE" },
      { id: "fri", stage: "SCALE" },
    ],
    footer: [
      { label: "IGNITE", href: "/student/missions" },
      { label: "BUILD", href: "/student/logbook" },
      { label: "SHIP", href: "/student/planner" },
      { label: "SCALE", href: "/student/profile" },
    ],
    boardPastels: true,
    rankLabel: (level) => `C${level}`,
  },
  pioneer: {
    motif: "pioneer",
    dayStages: [
      { id: "sat", stage: "THE GATE" },
      { id: "sun", stage: "EXPLORE" },
      { id: "mon", stage: "DISCOVER" },
      { id: "tue", stage: "ADVENTURE", hint: "start" },
      { id: "wed", stage: "CHALLENGE" },
      { id: "thu", stage: "DISCIPLINE" },
      { id: "fri", stage: "LEGACY" },
    ],
    footer: [
      { label: "FOCUS", href: "/student/missions" },
      { label: "PLAN", href: "/student/planner" },
      { label: "EXECUTE", href: "/student/missions" },
      { label: "GROW", href: "/student/profile" },
    ],
    boardPastels: true,
    rankLabel: () => "Four",
  },
};

/** Sample filled board content (Persian) — Pioneer-style planner cells */
export const SAMPLE_BOARD: Record<DayId, string[]> = {
  sat: [
    "مرور شیمی فصل ۱",
    "تمرین ریاضی پایه",
    "واژگان زبان",
    "جمع‌بندی فیزیک",
    "نقشه ذهنی زیست",
    "مرور کوتاه شب",
    "آماده‌سازی کیف",
  ],
  sun: [
    "تست جامع زیست",
    "حل مسئله جبر",
    "شنیدن زبان",
    "آزمایش مجازی",
    "خلاصه‌نویسی",
    "مرور اشتباهات",
    "هدف‌گذاری فردا",
  ],
  mon: [
    "بلاک تمرکز ۹۰د",
    "تمرین زمان‌دار",
    "مرور جزوه",
    "کوییز کوتاه",
    "توضیح به خود",
    "لیست شکاف‌ها",
    "چک روتین",
  ],
  tue: [
    "شروع ماجراجویی",
    "پروژه هفتگی",
    "هم‌خوانی با همکار",
    "نشست مشاوره",
    "تمرین سخت",
    "ثبت لاگ‌بوک",
    "پاداش کوچک",
  ],
  wed: [
    "چالش سرعت",
    "آزمون آزمایشی",
    "رفع ضعف",
    "مرور فلش‌کارت",
    "تمرکز بدون موبایل",
    "گزارش شب",
    "بازیابی انرژی",
  ],
  thu: [
    "انضباط عمیق",
    "تکرار هدف ۱",
    "تکرار هدف ۲",
    "کار با منتور",
    "مرور هفته",
    "برنامه جمعه",
    "تشکر از خود",
  ],
  fri: [
    "میراث هفته",
    "جمع‌بندی نهایی",
    "تست جمعه",
    "بازتاب کتبی",
    "آرشیو یادداشت",
    "پاک‌سازی بورد",
    "جشن کوچک",
  ],
};

export const WEEKLY_MISSION_SAMPLES = [
  "مرور شیمی فصل ۱ را تمام کن",
  "یک تست جامع زیست بده",
  "۹۰ دقیقه تمرکز عمیق",
  "نشست مشاوره را برگزار کن",
  "چالش سرعت را رد کن",
  "بازتاب هفتگی بنویس",
  "بورد را تا جمعه پاک کن",
];
