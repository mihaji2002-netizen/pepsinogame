import "@/styles/exam-globals.css";

export function ExamSystemShell({ children }: { children: React.ReactNode }) {
  return <div className="exam-system relative z-20">{children}</div>;
}
