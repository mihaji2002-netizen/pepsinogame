import localFont from "next/font/local";
import { Vazirmatn } from "next/font/google";

export const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vazir",
  display: "swap",
});

export const estedad = localFont({
  src: [
    {
      path: "../../public/fonts/estedad/Estedad-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/estedad/Estedad-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-estedad",
  display: "swap",
});
