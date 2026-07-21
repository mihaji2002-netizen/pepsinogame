import { StudentShell } from "@/components/shells/StudentShell";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentShell>{children}</StudentShell>;
}
