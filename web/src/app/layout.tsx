import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { AppProvider } from "@/lib/store";
import { XpToast } from "@/components/ui/XpToast";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "PEPSINO LAB — سیستم‌عامل آموزشی گیمیفای‌شده",
  description:
    "برنامه‌ریزی، منتورینگ، گیمیفیکیشن، آنالیتیکس و انگیزه در یک تجربه یکپارچه آموزشی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} antialiased`}>
        <AppProvider>
          <div className="relative z-10 min-h-screen">{children}</div>
          <XpToast />
        </AppProvider>
      </body>
    </html>
  );
}
