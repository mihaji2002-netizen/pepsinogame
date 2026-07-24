import { ExamSystemShell } from "@/components/exam/ExamSystemShell";

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExamSystemShell>{children}</ExamSystemShell>;
}
