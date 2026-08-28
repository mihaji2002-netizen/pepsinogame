/** وقتی true باشد، فقط سامانه آزمون برای دانش‌آموزان در دسترس است. */
export function isExamOnlyMode(): boolean {
  return process.env.EXAM_ONLY_MODE === "true";
}

export const EXAM_STUDENT_ENTRY = "/exam/join";
