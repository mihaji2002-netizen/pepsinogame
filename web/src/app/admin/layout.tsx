import { ExamSystemShell } from "@/components/exam/ExamSystemShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExamSystemShell>{children}</ExamSystemShell>;
}
