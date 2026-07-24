export type UserRole = "student" | "mentor" | "admin";

export type LabId = "neuro" | "research" | "catalyst" | "pioneer";

export type AttendanceStatus = "present" | "late" | "absent" | "excused";

export type MissionKey =
  | "routine"
  | "target1"
  | "target2"
  | "target3"
  | "target4"
  | "target5"
  | "target6";

export interface LabTheme {
  id: LabId;
  name: string;
  nameEn: string;
  focus: string;
  tagline: string;
  color: string;
  soft: string;
  badge: string;
  image: string;
  imageAlt: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  avatar: string;
  lab: LabId;
  level: number;
  xp: number;
  coins: number;
  stamps: number;
  mentorId: string;
  joinedAt: string;
  hasCompletedOnboarding: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface MissionItem {
  key: MissionKey;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  approved: boolean;
}

export interface LogbookEntry {
  date: string;
  win: string;
  challenge: string;
  tomorrowFocus: string;
  mentorNotes: string;
  stamped: boolean;
}

export interface PlannerTask {
  id: string;
  day: string;
  title: string;
  done: boolean;
}

export interface XpEvent {
  id: string;
  amount: number;
  reason: string;
  at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface AttendanceRecord {
  session: number;
  status: AttendanceStatus;
  date: string;
}

export interface ExamRecord {
  id: string;
  subject: string;
  date: string;
  score: number;
  percentage: number;
  rank: number;
  comment: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  at: string;
}

export interface AppUser {
  role: UserRole;
  studentId?: string;
  mentorId?: string;
}
