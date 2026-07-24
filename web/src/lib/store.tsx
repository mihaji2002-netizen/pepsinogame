"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_MISSIONS,
  DEFAULT_PLANNER,
  DEMO_EXAMS,
  DEMO_STUDENTS,
  LABS,
  STAMPS_PER_LEVEL,
  XP_PER_LEVEL,
  labForLevel,
  nextStudentId,
} from "./constants";
import { syncStudentLab, normalizeStudent } from "./id-card";
import type { AvatarKey, Gender } from "./types";
import type {
  Achievement,
  Announcement,
  AppUser,
  AttendanceRecord,
  ExamRecord,
  LogbookEntry,
  MissionItem,
  MissionKey,
  PlannerTask,
  Student,
  XpEvent,
} from "./types";
import { fa } from "./fa";
import { todayKey } from "./utils";

interface AppState {
  hydrated: boolean;
  user: AppUser | null;
  students: Student[];
  missions: MissionItem[];
  planner: PlannerTask[];
  logbook: LogbookEntry;
  xpHistory: XpEvent[];
  achievements: Achievement[];
  attendance: AttendanceRecord[];
  exams: ExamRecord[];
  announcements: Announcement[];
  xpToast: number | null;
  loginAsStudent: (email?: string) => void;
  loginAsMentor: () => void;
  registerStudent: (name: string, email: string, gender: Gender) => Student;
  logout: () => void;
  completeOnboarding: () => void;
  completeMission: (key: MissionKey) => void;
  approveMission: (studentId: string, key: MissionKey) => void;
  awardStamp: (studentId: string) => void;
  togglePlannerTask: (id: string) => void;
  updateLogbook: (patch: Partial<LogbookEntry>) => void;
  setAttendance: (session: number, status: AttendanceRecord["status"]) => void;
  addExam: (exam: Omit<ExamRecord, "id">) => void;
  adjustXp: (studentId: string, amount: number, reason: string) => void;
  adjustCoins: (studentId: string, amount: number) => void;
  setAvatarKey: (avatarKey: AvatarKey) => void;
  clearXpToast: () => void;
  currentStudent: Student | null;
}

interface PersistedState {
  user: AppUser | null;
  students: Student[];
  missions: MissionItem[];
  planner: PlannerTask[];
  logbook: LogbookEntry;
  xpHistory: XpEvent[];
  achievements: Achievement[];
  attendance: AttendanceRecord[];
  exams: ExamRecord[];
}

const STORAGE_KEY = "pepsino-lab-mvp-v1";

const defaultLogbook: LogbookEntry = {
  date: todayKey(),
  win: "",
  challenge: "",
  tomorrowFocus: "",
  mentorNotes: "بلوک‌های تمرکز را محکم نگه دار. داری عادت‌های نورو می‌سازی.",
  stamped: false,
};

const defaultAttendance: AttendanceRecord[] = [
  { session: 1, status: "present", date: "2026-07-01" },
  { session: 2, status: "present", date: "2026-07-03" },
  { session: 3, status: "late", date: "2026-07-05" },
  { session: 4, status: "present", date: "2026-07-08" },
  { session: 5, status: "excused", date: "2026-07-10" },
  { session: 6, status: "absent", date: "2026-07-12" },
];

const defaultAnnouncements: Announcement[] = [
  {
    id: "an-1",
    title: "نبض فصل",
    body: "فشرده نورو این هفته شروع می‌شود. هدف ۱ را قبل از جمعه تمام کن.",
    at: "2026-07-18",
  },
  {
    id: "an-2",
    title: "ساعات حضور منتور",
    body: "بررسی ماموریت‌ها و اعطای مهر هر شب ساعت ۱۹:۰۰.",
    at: "2026-07-19",
  },
];

const defaultXpHistory: XpEvent[] = [
  {
    id: "xp-1",
    amount: 40,
    reason: "روتین تکمیل شد",
    at: "2026-07-18T10:00:00Z",
  },
  {
    id: "xp-2",
    amount: 60,
    reason: "هدف ۱ تکمیل شد",
    at: "2026-07-18T12:00:00Z",
  },
];

const defaultPersisted: PersistedState = {
  user: null,
  students: DEMO_STUDENTS,
  missions: DEFAULT_MISSIONS,
  planner: DEFAULT_PLANNER,
  logbook: defaultLogbook,
  xpHistory: defaultXpHistory,
  achievements: DEFAULT_ACHIEVEMENTS,
  attendance: defaultAttendance,
  exams: DEMO_EXAMS,
};

const AppContext = createContext<AppState | null>(null);

function applyLevelRules(student: Student): Student {
  let { xp, level, stamps } = student;
  let lab = student.lab;

  while (xp >= XP_PER_LEVEL && stamps >= STAMPS_PER_LEVEL && level < 16) {
    xp -= XP_PER_LEVEL;
    stamps -= STAMPS_PER_LEVEL;
    level += 1;
    lab = labForLevel(level).id;
  }

  return { ...student, xp, level, stamps, lab };
}

function readPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPersisted;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      user: parsed.user ?? null,
      students: (parsed.students ?? DEMO_STUDENTS).map((s) =>
        normalizeStudent(s as Student & { avatar?: string }),
      ),
      missions: parsed.missions ?? DEFAULT_MISSIONS,
      planner: parsed.planner ?? DEFAULT_PLANNER,
      logbook: parsed.logbook ?? defaultLogbook,
      xpHistory: parsed.xpHistory ?? defaultXpHistory,
      achievements: parsed.achievements ?? DEFAULT_ACHIEVEMENTS,
      attendance: parsed.attendance ?? defaultAttendance,
      exams: parsed.exams ?? DEMO_EXAMS,
    };
  } catch {
    return defaultPersisted;
  }
}

let memoryState: PersistedState = defaultPersisted;
let memoryReady = false;
const listeners = new Set<() => void>();

function ensureClientState() {
  if (!memoryReady && typeof window !== "undefined") {
    memoryState = readPersisted();
    memoryReady = true;
  }
  return memoryState;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return ensureClientState();
}

function getServerSnapshot() {
  return defaultPersisted;
}

function commit(next: PersistedState) {
  memoryState = next;
  memoryReady = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota / private mode failures
  }
  listeners.forEach((listener) => listener());
}

function patchState(updater: (prev: PersistedState) => PersistedState) {
  commit(updater(ensureClientState()));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [xpToast, setXpToast] = useState<number | null>(null);
  const [announcements] = useState(defaultAnnouncements);

  const {
    user,
    students,
    missions,
    planner,
    logbook,
    xpHistory,
    achievements,
    attendance,
    exams,
  } = persisted;

  const currentStudent = useMemo(() => {
    if (!user?.studentId) return null;
    return students.find((s) => s.id === user.studentId) ?? null;
  }, [user, students]);

  const updateStudent = useCallback(
    (studentId: string, updater: (s: Student) => Student) => {
      patchState((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.id === studentId ? applyLevelRules(updater(s)) : s,
        ),
      }));
    },
    [],
  );

  const grantXp = useCallback(
    (studentId: string, amount: number, reason: string) => {
      patchState((prev) => {
        const studentsNext = prev.students.map((s) =>
          s.id === studentId ? applyLevelRules({ ...s, xp: s.xp + amount }) : s,
        );
        const student = prev.students.find((s) => s.id === studentId);
        const nextXp = (student?.xp ?? 0) + amount;
        return {
          ...prev,
          students: studentsNext,
          xpHistory: [
            {
              id: `xp-${Date.now()}`,
              amount,
              reason,
              at: new Date().toISOString(),
            },
            ...prev.xpHistory,
          ],
          achievements: prev.achievements.map((a) =>
            a.id === "a3" && nextXp >= 1000 ? { ...a, unlocked: true } : a,
          ),
        };
      });
      setXpToast(amount);
    },
    [],
  );

  const value: AppState = {
    hydrated,
    user,
    students,
    missions,
    planner,
    logbook,
    xpHistory,
    achievements,
    attendance,
    exams,
    announcements,
    xpToast,
    currentStudent,
    loginAsStudent: (email) => {
      const found =
        students.find((s) => s.email === email) ??
        students[0] ??
        DEMO_STUDENTS[0];
      patchState((prev) => ({
        ...prev,
        user: { role: "student", studentId: found.id },
      }));
    },
    loginAsMentor: () =>
      patchState((prev) => ({
        ...prev,
        user: { role: "mentor", mentorId: "men-1" },
      })),
    registerStudent: (name, email, gender) => {
      const sequence = students.length + 1;
      const student: Student = syncStudentLab({
        id: `stu-${Date.now()}`,
        studentId: nextStudentId(sequence),
        name,
        email,
        gender,
        avatarKey: 1,
        lab: "neuro",
        level: 1,
        xp: 0,
        coins: 20,
        stamps: 0,
        mentorId: "men-1",
        joinedAt: todayKey(),
        hasCompletedOnboarding: false,
      });
      patchState((prev) => ({
        ...prev,
        students: [...prev.students, student],
        user: { role: "student", studentId: student.id },
        missions: DEFAULT_MISSIONS.map((m) => ({
          ...m,
          completed: false,
          approved: false,
        })),
      }));
      return student;
    },
    logout: () => patchState((prev) => ({ ...prev, user: null })),
    completeOnboarding: () => {
      if (!currentStudent) return;
      updateStudent(currentStudent.id, (s) => ({
        ...s,
        hasCompletedOnboarding: true,
      }));
    },
    completeMission: (key) => {
      if (!currentStudent) return;
      const mission = missions.find((m) => m.key === key);
      if (!mission || mission.completed) return;

      const willCompleteAll = missions.every((m) =>
        m.key === key ? true : m.completed,
      );

      patchState((prev) => ({
        ...prev,
        missions: prev.missions.map((m) =>
          m.key === key ? { ...m, completed: true } : m,
        ),
        students: prev.students.map((s) =>
          s.id === currentStudent.id
            ? applyLevelRules({ ...s, coins: s.coins + mission.coinReward })
            : s,
        ),
        achievements: willCompleteAll
          ? prev.achievements.map((a) =>
              a.id === "a4" ? { ...a, unlocked: true } : a,
            )
          : prev.achievements,
      }));
      grantXp(currentStudent.id, mission.xpReward, fa.xp.missionDone(mission.title));
    },
    approveMission: (_studentId, key) => {
      patchState((prev) => ({
        ...prev,
        missions: prev.missions.map((m) =>
          m.key === key ? { ...m, approved: true } : m,
        ),
      }));
    },
    awardStamp: (studentId) => {
      patchState((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.id === studentId
            ? applyLevelRules({ ...s, stamps: s.stamps + 1 })
            : s,
        ),
        logbook: { ...prev.logbook, stamped: true },
        achievements: prev.achievements.map((a) =>
          a.id === "a1" ? { ...a, unlocked: true } : a,
        ),
      }));
      grantXp(studentId, 25, fa.xp.awarded);
    },
    togglePlannerTask: (id) => {
      patchState((prev) => ({
        ...prev,
        planner: prev.planner.map((t) =>
          t.id === id ? { ...t, done: !t.done } : t,
        ),
      }));
    },
    updateLogbook: (patch) => {
      patchState((prev) => ({
        ...prev,
        logbook: { ...prev.logbook, ...patch },
      }));
    },
    setAttendance: (session, status) => {
      patchState((prev) => ({
        ...prev,
        attendance: prev.attendance.map((a) =>
          a.session === session ? { ...a, status } : a,
        ),
      }));
    },
    addExam: (exam) => {
      patchState((prev) => ({
        ...prev,
        exams: [{ ...exam, id: `ex-${Date.now()}` }, ...prev.exams],
      }));
    },
    adjustXp: (studentId, amount, reason) => grantXp(studentId, amount, reason),
    adjustCoins: (studentId, amount) => {
      updateStudent(studentId, (s) => ({
        ...s,
        coins: Math.max(0, s.coins + amount),
      }));
    },
    setAvatarKey: (avatarKey) => {
      if (!currentStudent) return;
      updateStudent(currentStudent.id, (s) => ({ ...s, avatarKey }));
    },
    clearXpToast: () => setXpToast(null),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useLabTheme(labId?: string) {
  return LABS.find((l) => l.id === labId) ?? LABS[0];
}
