import type { Metadata } from "next";
import { El_Messiri, Readex_Pro } from "next/font/google";
import { AppProvider } from "@/lib/store";
import { XpToast } from "@/components/ui/XpToast";
import "./globals.css";

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  variable: "--font-el-messiri",
  weight: ["500", "600", "700"],
});

const readex = Readex_Pro({
  subsets: ["arabic", "latin"],
  variable: "--font-readex",
  weight: ["300", "400", "500", "600", "700"],
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
      <body className={`${elMessiri.variable} ${readex.variable} antialiased`}>
        <AppProvider>
          <div className="relative z-10 min-h-screen">{children}</div>
          <XpToast />
        </AppProvider>
      </body>
    </html>
  );
}
