import { MentorShell } from "@/components/shells/MentorShell";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MentorShell>{children}</MentorShell>;
}
