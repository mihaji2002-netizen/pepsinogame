import type { Metadata } from "next";
import { Changa, IBM_Plex_Sans_Arabic } from "next/font/google";
import { AppProvider } from "@/lib/store";
import { XpToast } from "@/components/ui/XpToast";
import "./globals.css";

const changa = Changa({
  subsets: ["arabic", "latin"],
  variable: "--font-changa",
  weight: ["500", "600", "700", "800"],
});

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-plex",
  weight: ["300", "400", "500", "600", "700"],
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
      <body className={`${changa.variable} ${plex.variable} antialiased`}>
        <AppProvider>
          <div className="relative z-10 min-h-screen">{children}</div>
          <XpToast />
        </AppProvider>
      </body>
    </html>
  );
}
