import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import { AppProvider } from "@/lib/store";
import { XpToast } from "@/components/ui/XpToast";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "PEPSINO LAB — Gamified Education OS",
  description:
    "Planning, mentoring, gamification, analytics, and motivation in one unified educational ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${syne.variable} antialiased`}>
        <AppProvider>
          <div className="relative z-10 min-h-screen">{children}</div>
          <XpToast />
        </AppProvider>
      </body>
    </html>
  );
}
