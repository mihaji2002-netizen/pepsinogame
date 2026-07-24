"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsStudent, loginAsMentor } = useApp();
  const [email, setEmail] = useState("ava@pepsinolab.dev");

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-5 py-10 md:grid-cols-2 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Link href="/">
          <BrandMark />
        </Link>
        <div className="chip mt-10">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] shadow-[0_0_8px_var(--brand)]" />
          فصل ۲۶ در جریان است
        </div>
        <h1 className="display mt-5 text-5xl">
          ورود به <span className="text-[var(--brand)]">Lab</span>
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-[var(--ink-soft)]">
          احراز هویت نمایشی — ایمیل دانش‌آموز را انتخاب کنید یا وارد کنسول
          منتور شوید. ورود با گوگل و پیامک بعداً اضافه می‌شود.
        </p>
        <div className="mt-8 flex items-center gap-3 text-sm text-[var(--ink-faint)]">
          <ShieldCheck size={16} className="text-[var(--brand)]" />
          Subject ID شما هرگز تغییر نمی‌کند. Labها تغییر می‌کنند.
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="surface p-6 md:p-8"
      >
        <label className="text-sm font-semibold">ایمیل</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field mt-2"
          placeholder="you@school.edu"
        />
        <div className="mt-6 flex flex-col gap-3">
          <Button
            className="py-3"
            onClick={() => {
              loginAsStudent(email);
              router.push("/student/dashboard");
            }}
          >
            ادامه به‌عنوان دانش‌آموز
            <ArrowRight size={16} className="rtl:rotate-180" />
          </Button>
          <Button
            variant="secondary"
            className="py-3"
            onClick={() => {
              loginAsMentor();
              router.push("/mentor/dashboard");
            }}
          >
            ادامه به‌عنوان منتور
          </Button>
        </div>
        <p className="mt-8 text-sm text-[var(--ink-soft)]">
          تازه‌واردید؟{" "}
          <Link href="/register" className="font-semibold text-[var(--brand)]">
            ساخت حساب دانش‌آموزی
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
