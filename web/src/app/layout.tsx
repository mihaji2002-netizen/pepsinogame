import type { Metadata } from "next";
import { JetBrains_Mono, Vazirmatn } from "next/font/google";
import { AppProvider } from "@/lib/store";
import { MotionProvider } from "@/components/MotionProvider";
import { XpToast } from "@/components/ui/XpToast";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
});

export const metadata: Metadata = {
  title: "پپسینو لب — سیستم‌عامل آموزشی گیمیفای‌شده",
  description:
    "برنامه‌ریزی، منتورینگ، گیمیفیکیشن، تحلیل و انگیزه در یک اکوسیستم آموزشی یکپارچه.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} ${jbMono.variable} antialiased`}>
        <AppProvider>
          <MotionProvider>
            <div className="relative z-10 min-h-screen">{children}</div>
            <XpToast />
          </MotionProvider>
        </AppProvider>
      </body>
    </html>
  );
}
