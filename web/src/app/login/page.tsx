"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { KineticText } from "@/components/ui/kinetic-text";
import { Magnetic } from "@/components/ui/magnetic";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsStudent, loginAsMentor } = useApp();
  const [email, setEmail] = useState("ava@pepsinolab.dev");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="mesh">
        <div className="mesh-blob mesh-blob--a" />
        <div className="mesh-blob mesh-blob--b" />
        <div className="mesh-blob mesh-blob--c" />
        <div className="mesh-slash opacity-80" aria-hidden />
      </div>
      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <BrandMark />
          <div className="mt-8">
            <KineticText text="ورود به لاب" className="display text-5xl md:text-6xl" as="h1" />
          </div>
          <p className="mt-4 max-w-md text-[var(--ink-soft)]">
            احراز هویت نسخه MVP — ایمیل دانش‌آموز را وارد کن یا وارد کنسول منتور شو.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="surface p-6 md:p-8"
        >
          <label className="block text-sm font-medium">ایمیل</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field mt-2"
            placeholder="you@school.edu"
            dir="ltr"
          />
          <div className="mt-5 flex flex-col gap-3">
            <Magnetic strength={16}>
              <Button
                variant="flare"
                className="w-full"
                onClick={() => {
                  loginAsStudent(email);
                  router.push("/student/dashboard");
                }}
              >
                ادامه به‌عنوان دانش‌آموز
              </Button>
            </Magnetic>
            <Magnetic strength={12}>
              <Button
                variant="ink"
                className="w-full"
                onClick={() => {
                  loginAsMentor();
                  router.push("/mentor/dashboard");
                }}
              >
                ادامه به‌عنوان منتور
              </Button>
            </Magnetic>
          </div>
          <p className="mt-6 text-sm text-[var(--ink-soft)]">
            حساب نداری؟{" "}
            <Link href="/register" className="font-semibold text-[var(--brand-deep)]">
              ساخت حساب دانش‌آموز
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
