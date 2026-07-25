import { generateSubjectPalette } from "./color-palette";
import type { LabId, PlannerBackgroundId, SubjectThemePreset, WeeklyProgram } from "./types";

export const SUBJECT_COLOR_PRESETS: SubjectThemePreset[] = [
  { name: "زیست", hexColor: "#9B7BB8" },
  { name: "شیمی", hexColor: "#E8913A" },
  { name: "فیزیک", hexColor: "#4A90D9" },
  { name: "ریاضی", hexColor: "#2E8B57" },
  { name: "ادبیات", hexColor: "#C45C6E" },
  { name: "زبان", hexColor: "#5B8DEF" },
  { name: "عربی", hexColor: "#6B8E23" },
];

export const PLANNER_BACKGROUNDS: Array<{
  id: PlannerBackgroundId;
  label: string;
  description: string;
}> = [
  { id: "neuro-lab", label: "NEURO LAB", description: "قالب سبز علمی (پیش‌فرض)" },
  { id: "neuron-watermark", label: "نورون", description: "واترمارک سلول عصبی" },
  { id: "clean-white", label: "سفید تمیز", description: "مینیمال برای چاپ" },
  { id: "subject-gradient", label: "گرادیان درس", description: "بر اساس رنگ درس" },
];

export const LAB_OPTIONS: Array<{ id: LabId; label: string }> = [
  { id: "neuro", label: "NEURO" },
  { id: "research", label: "RESEARCH" },
  { id: "catalyst", label: "CATALYST" },
  { id: "pioneer", label: "PIONEER" },
];

const DEFAULT_HEX = "#9B7BB8";

function row(
  id: string,
  dayLabel: string,
  dayIcon: string,
): WeeklyProgram["gridRows"][number] {
  return {
    id,
    dayLabel,
    dayIcon,
    routine: "",
    target6: "",
    target5: "",
    target4: "",
    target3: "",
    target2: "",
    target1: "",
  };
}

export function createEmptyProgram(name = "برنامه هفتگی جدید"): WeeklyProgram {
  const now = new Date().toISOString();
  const palette = generateSubjectPalette(DEFAULT_HEX);

  return {
    id: `prog-${Date.now()}`,
    name,
    backgroundId: "neuro-lab",
    subjectTheme: {
      name: "زیست",
      hexColor: DEFAULT_HEX,
      palette,
    },
    subjectName: "",
    subjectId: "",
    lab: "neuro",
    level: "",
    xp: "",
    rank: "",
    nextLevelXp: "",
    routines: [
      { id: "r1", label: "خواب مناسب" },
      { id: "r2", label: "گزارش شبانه" },
      { id: "r3", label: "ورزش" },
      { id: "r4", label: "مرور حافظه" },
      { id: "r5", label: "آب کافی" },
      { id: "r6", label: "بدون تعویق" },
    ],
    missions: Array.from({ length: 7 }, (_, i) => ({
      id: `m${i + 1}`,
      label: "",
    })),
    gridRows: [
      row("d1", "دوشنبه", "☀️"),
      row("d2", "سه‌شنبه", "⛅"),
      row("d3", "چهارشنبه", "🌤️"),
      row("d4", "پنجشنبه", "🌙"),
      row("d5", "جمعه", "☀️"),
      row("d6", "شنبه", "⛅"),
      row("d7", "یکشنبه", "🌙"),
    ],
    weeklyReport: {
      studyHours: "",
      testPercentage: "",
      strengths: "",
      weaknesses: "",
      nextWeekMission: "",
    },
    weeklyNotes: "",
    weeklyReflection: "",
    subjectOfWeek: {
      level: "",
      xp: "",
      streak: "",
    },
    createdAt: now,
    updatedAt: now,
  };
}
