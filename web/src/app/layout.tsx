import type { Metadata } from "next";
import { Marhey, Rubik } from "next/font/google";
import { AppProvider } from "@/lib/store";
import { XpToast } from "@/components/ui/XpToast";
import "./globals.css";

const marhey = Marhey({
  subsets: ["arabic", "latin"],
  variable: "--font-marhey",
  weight: ["400", "500", "600", "700"],
});

const rubik = Rubik({
  subsets: ["arabic", "latin"],
  variable: "--font-rubik",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PEPSINO LAB",
  description: "سیستم‌عامل آموزشی گیمیفای‌شده برای فصل‌های واقعی یادگیری",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${marhey.variable} ${rubik.variable} antialiased`}>
        <AppProvider>
          <div className="relative z-10 min-h-screen">{children}</div>
          <XpToast />
        </AppProvider>
      </body>
    </html>
  );
}
