import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "استودیو برنامه‌ساز | PEPSINO LAB",
  description: "ساخت برنامه هفتگی NEURO LAB",
};

export default function ProgramStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
