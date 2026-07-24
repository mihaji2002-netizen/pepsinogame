import type { GradeLevel, StudyTrack } from "./types";

export interface CurriculumChapter {
  id: string;
  title: string;
}

export interface CurriculumSubject {
  id: string;
  title: string;
  chapters: CurriculumChapter[];
}

type CurriculumKey = `${GradeLevel}-${StudyTrack}`;

function ch(id: string, title: string): CurriculumChapter {
  return { id, title };
}

function subject(id: string, title: string, chapters: CurriculumChapter[]): CurriculumSubject {
  return { id, title, chapters };
}

const RIAZI_1_CHAPTERS = [
  ch("f1", "فصل ۱: مجموعه، الگو و دنباله"),
  ch("f2", "فصل ۲: مثلثات"),
  ch("f3", "فصل ۳: توان‌های گویا و عبارت‌های جبری"),
  ch("f4", "فصل ۴: معادله‌ها و نامعادله‌ها"),
  ch("f5", "فصل ۵: تابع"),
  ch("f6", "فصل ۶: شمارش (بدون شمردن)"),
  ch("f7", "فصل ۷: آمار و احتمال"),
];

const SHIMI_1_CHAPTERS = [
  ch("f1", "فصل ۱: کیهان، زادگاه عناصر"),
  ch("f2", "فصل ۲: ردپای گازها در زندگی"),
  ch("f3", "فصل ۳: آب، آهنگ زندگی"),
];

const SHIMI_2_CHAPTERS = [
  ch("f1", "فصل ۱: قدرت هیدروژن (pH)"),
  ch("f2", "فصل ۲: رفتار گازها"),
  ch("f3", "فصل ۳: سیر تحول در برابر تغییر"),
];

const SHIMI_3_CHAPTERS = [
  ch("f1", "فصل ۱: مولکول‌های اطلاعاتی در سلول"),
  ch("f2", "فصل ۲: خواص فیزیکی مواد"),
  ch("f3", "فصل ۳: ساختار لوئیس و رسانایی"),
];

const FIZIK_2_CHAPTERS = [
  ch("f1", "فصل ۱: الکتریسیته ساکن"),
  ch("f2", "فصل ۲: الکتریسیته جاری و مغناطیس"),
  ch("f3", "فصل ۳: القای الکترومغناطیسی"),
];

const FIZIK_3_CHAPTERS = [
  ch("f1", "فصل ۱: آشنایی با فیزیک اتمی و هسته‌ای"),
  ch("f2", "فصل ۲: آشنایی با فیزیک نسبیت"),
  ch("f3", "فصل ۳: آشنایی با فیزیک کوانتومی"),
];

const GRADE_10_MATH: CurriculumSubject[] = [
  subject("riazi-1", "ریاضی ۱", RIAZI_1_CHAPTERS),
  subject("fizik-1-riazi", "فیزیک ۱ (ریاضی)", [
    ch("f1", "فصل ۱: فیزیک و اندازه‌گیری"),
    ch("f2", "فصل ۲: ویژگی‌های فیزیکی مواد"),
    ch("f3", "فصل ۳: کار، انرژی و توان"),
    ch("f4", "فصل ۴: دما و گرما"),
    ch("f5", "فصل ۵: ترمودینامیک"),
  ]),
  subject("shimi-1", "شیمی ۱", SHIMI_1_CHAPTERS),
  subject("hendese-1", "هندسه ۱", [
    ch("f1", "فصل ۱: ترسیم‌های هندسی و استدلال"),
    ch("f2", "فصل ۲: قضیه تالس، تشابه و کاربردهای آن"),
    ch("f3", "فصل ۳: چندضلعی‌ها"),
    ch("f4", "فصل ۴: تجسم فضایی"),
  ]),
];

const GRADE_10_EXPERIMENTAL: CurriculumSubject[] = [
  subject("riazi-1", "ریاضی ۱", RIAZI_1_CHAPTERS),
  subject("fizik-1-tajrobi", "فیزیک ۱ (تجربی)", [
    ch("f1", "فصل ۱: فیزیک و اندازه‌گیری"),
    ch("f2", "فصل ۲: ویژگی‌های فیزیکی مواد"),
    ch("f3", "فصل ۳: کار، انرژی و توان"),
    ch("f4", "فصل ۴: دما و گرما"),
  ]),
  subject("shimi-1", "شیمی ۱", SHIMI_1_CHAPTERS),
  subject("zist-1", "زیست‌شناسی ۱", [
    ch("f1", "فصل ۱: دنیای زنده"),
    ch("f2", "فصل ۲: گوارش و جذب مواد"),
    ch("f3", "فصل ۳: تبادلات گازی"),
    ch("f4", "فصل ۴: گردش مواد در بدن"),
    ch("f5", "فصل ۵: تنظیم اسمزی و دفع مواد زاید"),
    ch("f6", "فصل ۶: از یاخته تا گیاه"),
    ch("f7", "فصل ۷: جذب و انتقال مواد در گیاهان"),
  ]),
];

const GRADE_11_MATH: CurriculumSubject[] = [
  subject("hesaban-1", "حسابان ۱", [
    ch("f1", "فصل ۱: جبر و معادله"),
    ch("f2", "فصل ۲: تابع"),
    ch("f3", "فصل ۳: توابع نمایی و لگاریتمی"),
    ch("f4", "فصل ۴: مثلثات"),
    ch("f5", "فصل ۵: حد و پیوستگی"),
  ]),
  subject("hendese-2", "هندسه ۲", [
    ch("f1", "فصل ۱: مثلثات"),
    ch("f2", "فصل ۲: تبدیل‌های هندسی"),
    ch("f3", "فصل ۳: روابط طولی در مثلث"),
  ]),
  subject("fizik-2", "فیزیک ۲", FIZIK_2_CHAPTERS),
  subject("shimi-2", "شیمی ۲", SHIMI_2_CHAPTERS),
  subject("amar", "آمار و احتمال", [
    ch("f1", "فصل ۱: آشنایی با علم آمار"),
    ch("f2", "فصل ۲: احتمال"),
    ch("f3", "فصل ۳: آمار توصیفی"),
    ch("f4", "فصل ۴: آمار استنباطی"),
  ]),
];

const GRADE_11_EXPERIMENTAL: CurriculumSubject[] = [
  subject("zist-2", "زیست‌شناسی ۲", [
    ch("f1", "فصل ۱: تنظیم عصبی"),
    ch("f2", "فصل ۲: حواس"),
    ch("f3", "فصل ۳: دستگاه حرکتی"),
    ch("f4", "فصل ۴: تنظیم شیمیایی"),
    ch("f5", "فصل ۵: ایمنی"),
    ch("f6", "فصل ۶: تقسیم یاخته"),
    ch("f7", "فصل ۷: تولید مثل"),
    ch("f8", "فصل ۸: تولید مثل نهاندانگان"),
    ch("f9", "فصل ۹: پاسخ گیاهان به محرک‌ها"),
  ]),
  subject("fizik-2", "فیزیک ۲", FIZIK_2_CHAPTERS),
  subject("shimi-2", "شیمی ۲", SHIMI_2_CHAPTERS),
  subject("riazi-2-tajrobi", "ریاضی ۲ (تجربی)", [
    ch("f1", "فصل ۱: هندسه تحلیلی و جبر"),
    ch("f2", "فصل ۲: هندسه"),
    ch("f3", "فصل ۳: تابع"),
    ch("f4", "فصل ۴: مثلثات"),
    ch("f5", "فصل ۵: توابع نمایی و لگاریتمی"),
    ch("f6", "فصل ۶: حد و پیوستگی"),
    ch("f7", "فصل ۷: آمار و احتمال"),
  ]),
  subject("zamin", "زمین‌شناسی", [
    ch("f1", "فصل ۱: آفرینش کیهان و تکوین زمین"),
    ch("f2", "فصل ۲: منابع معدنی و ذخایر انرژی"),
    ch("f3", "فصل ۳: پویایی زمین"),
  ]),
  subject("ensan-mohit", "انسان و محیط زیست", [
    ch("f1", "فصل ۱: منابع تجدیدپذیر"),
    ch("f2", "فصل ۲: منابع غیرتجدیدپذیر"),
    ch("f3", "فصل ۳: تنوع زیستی"),
    ch("f4", "فصل ۴: آلودگی محیط زیست"),
  ]),
];

const GRADE_12_MATH: CurriculumSubject[] = [
  subject("hesaban-2", "حسابان ۲", [
    ch("f1", "فصل ۱: تابع"),
    ch("f2", "فصل ۲: مثلثات"),
    ch("f3", "فصل ۳: حدهای نامتناهی و حد در بی‌نهایت"),
    ch("f4", "فصل ۴: مشتق"),
    ch("f5", "فصل ۵: کاربردهای مشتق"),
  ]),
  subject("hendese-3", "هندسه ۳", [
    ch("f1", "فصل ۱: ماتریس و تبدیلات"),
    ch("f2", "فصل ۲: مقاطع مخروطی"),
  ]),
  subject("fizik-3", "فیزیک ۳", FIZIK_3_CHAPTERS),
  subject("shimi-3", "شیمی ۳", SHIMI_3_CHAPTERS),
  subject("gosaste", "ریاضیات گسسته", [
    ch("f1", "فصل ۱: آشنایی با نظریه اعداد"),
    ch("f2", "فصل ۲: گراف و مدل‌سازی"),
    ch("f3", "فصل ۳: ترکیبیات"),
  ]),
];

const GRADE_12_EXPERIMENTAL: CurriculumSubject[] = [
  subject("zist-3", "زیست‌شناسی ۳", [
    ch("f1", "فصل ۱: مولکول‌های اطلاعاتی"),
    ch("f2", "فصل ۲: جریان اطلاعات در یاخته"),
    ch("f3", "فصل ۳: انتقال اطلاعات در نسل‌ها"),
    ch("f4", "فصل ۴: تغییر در اطلاعات وراثتی"),
    ch("f5", "فصل ۵: از ماده به انرژی"),
    ch("f6", "فصل ۶: از انرژی به ماده"),
    ch("f7", "فصل ۷: فناوری‌های زیستی"),
    ch("f8", "فصل ۸: رفتارهای جانوران"),
  ]),
  subject("fizik-3", "فیزیک ۳", FIZIK_3_CHAPTERS),
  subject("shimi-3", "شیمی ۳", SHIMI_3_CHAPTERS),
  subject("riazi-3-tajrobi", "ریاضی ۳ (تجربی)", [
    ch("f1", "فصل ۱: تابع"),
    ch("f2", "فصل ۲: مثلثات"),
    ch("f3", "فصل ۳: حد و پیوستگی"),
    ch("f4", "فصل ۴: مشتق"),
    ch("f5", "فصل ۵: آمار و احتمال"),
  ]),
];

const CURRICULUM: Record<CurriculumKey, CurriculumSubject[]> = {
  "10-math": GRADE_10_MATH,
  "10-experimental": GRADE_10_EXPERIMENTAL,
  "11-math": GRADE_11_MATH,
  "11-experimental": GRADE_11_EXPERIMENTAL,
  "12-math": GRADE_12_MATH,
  "12-experimental": GRADE_12_EXPERIMENTAL,
};

export function getCurriculumKey(grade: GradeLevel, track: StudyTrack): CurriculumKey {
  return `${grade}-${track}`;
}

export function getCurriculumSubjects(grade: GradeLevel, track: StudyTrack): CurriculumSubject[] {
  return CURRICULUM[getCurriculumKey(grade, track)] ?? [];
}

export function getCurriculumSubject(
  grade: GradeLevel,
  track: StudyTrack,
  subjectId: string
): CurriculumSubject | null {
  return getCurriculumSubjects(grade, track).find((s) => s.id === subjectId) ?? null;
}

export function getCurriculumChapter(
  grade: GradeLevel,
  track: StudyTrack,
  subjectId: string,
  chapterId: string
): CurriculumChapter | null {
  const subjectItem = getCurriculumSubject(grade, track, subjectId);
  return subjectItem?.chapters.find((c) => c.id === chapterId) ?? null;
}

export function getSubjectLabel(
  grade: GradeLevel,
  track: StudyTrack,
  subjectId: string
): string {
  return getCurriculumSubject(grade, track, subjectId)?.title ?? subjectId;
}

export function getChapterLabel(
  grade: GradeLevel,
  track: StudyTrack,
  subjectId: string,
  chapterId: string
): string {
  return getCurriculumChapter(grade, track, subjectId, chapterId)?.title ?? chapterId;
}

export function validateCurriculumSelection(
  grade: GradeLevel,
  track: StudyTrack,
  subjectId: string,
  chapterId: string
): boolean {
  return !!getCurriculumChapter(grade, track, subjectId, chapterId);
}
