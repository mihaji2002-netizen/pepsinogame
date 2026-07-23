import type { Metadata } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";
import { AppProvider } from "@/lib/store";
import { MotionProvider } from "@/components/MotionProvider";
import { AmbientBackground } from "@/components/effects/AmbientBackground";
import { XpToast } from "@/components/ui/XpToast";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["500", "600", "700", "800"],
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
});

export const metadata: Metadata = {
  title: "پپسینو لب — سیستم‌عامل آموزشی گیمیفای‌شده",
  description:
    "محیط علمی برای فعال‌سازی پتانسیل پنهان — برنامه‌ریزی، منتورینگ و گیمیفیکیشن در یک اکوسیستم.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${syne.variable} ${jbMono.variable} antialiased`}>
        <AmbientBackground />
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
