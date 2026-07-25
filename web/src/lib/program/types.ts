export type PlannerBackgroundId =
  | "neuro-lab"
  | "neuron-watermark"
  | "clean-white"
  | "subject-gradient";

export type LabId = "neuro" | "research" | "catalyst" | "pioneer";

export interface SubjectPalette {
  primary: string;
  dark: string;
  light: string;
  accent: string;
  muted: string;
  header: string;
  border: string;
}

export interface SubjectTheme {
  name: string;
  hexColor: string;
  palette: SubjectPalette;
}

export interface RoutineItem {
  id: string;
  label: string;
}

export interface MissionItem {
  id: string;
  label: string;
}

export interface PlannerGridRow {
  id: string;
  dayLabel: string;
  dayIcon: string;
  routine: string;
  target6: string;
  target5: string;
  target4: string;
  target3: string;
  target2: string;
  target1: string;
}

export interface WeeklyReportFields {
  studyHours: string;
  testPercentage: string;
  strengths: string;
  weaknesses: string;
  nextWeekMission: string;
}

export interface SubjectOfWeekFields {
  level: string;
  xp: string;
  streak: string;
}

export interface WeeklyProgram {
  id: string;
  name: string;
  backgroundId: PlannerBackgroundId;
  subjectTheme: SubjectTheme;
  subjectName: string;
  subjectId: string;
  lab: LabId;
  level: string;
  xp: string;
  rank: string;
  nextLevelXp: string;
  routines: RoutineItem[];
  missions: MissionItem[];
  gridRows: PlannerGridRow[];
  weeklyReport: WeeklyReportFields;
  weeklyNotes: string;
  weeklyReflection: string;
  subjectOfWeek: SubjectOfWeekFields;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectThemePreset {
  name: string;
  hexColor: string;
}
