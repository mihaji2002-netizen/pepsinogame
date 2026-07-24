import { ExamSystemShell } from "@/components/exam/ExamSystemShell";

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExamSystemShell>{children}</ExamSystemShell>;
}
