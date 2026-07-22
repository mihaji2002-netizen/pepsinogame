import type { AttendanceStatus } from "./types";

export const fa = {
  brand: {
    tagline: "سیستم‌عامل آموزشی گیمیفای‌شده",
    educationOs: "سیستم‌عامل آموزش",
  },
  attendance: {
    present: "حاضر",
    late: "تأخیر",
    absent: "غایب",
    excused: "موجه",
  } satisfies Record<AttendanceStatus, string>,
  loading: {
    app: "در حال بارگذاری پپسینو لب…",
    mentor: "در حال بارگذاری کنسول منتور…",
    onboarding: "در حال آماده‌سازی آزمایشگاه…",
  },
  xp: {
    awarded: "مهر منتور اعطا شد",
    missionDone: (title: string) => `${title} تکمیل شد`,
    mentorBoost: "تقویت XP توسط منتور",
    mentorAdjust: "تنظیم XP توسط منتور",
  },
} as const;

export function attendanceLabel(status: AttendanceStatus) {
  return fa.attendance[status];
}
