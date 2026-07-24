"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { GENDER_OPTIONS } from "@/lib/avatars";
import type { Gender } from "@/lib/types";
import { useApp } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const { registerStudent } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender>("female");

  return (
    <motion.div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-5 py-10 md:grid-cols-2 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Link href="/">
          <BrandMark />
        </Link>
        <h1 className="display mt-10 text-5xl">
          جای خود را در{" "}
          <span className="text-[var(--brand)]">آزمایشگاه نورو</span> رزرو کنید
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-[var(--ink-soft)]">
          ثبت‌نام شناسه دائمی موضوعی، انتخاب آواتار و کارت شناسایی دیجیتال سطح ۱.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-[var(--ink-soft)]">
          {[
            "شناسه دائمی — هرگز تغییر نمی‌کند",
            "آواتار مخصوص دختر یا پسر — قابل تغییر بعداً",
            "سطح ۱ · نورو لب · اولین ماموریت در انتظار",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <Sparkles size={14} className="shrink-0 text-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="surface space-y-5 p-6 md:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !email.trim()) return;
          registerStudent(name.trim(), email.trim(), gender);
          router.push("/onboarding");
        }}
      >
        <div>
          <label className="text-sm font-semibold">نام کامل</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field mt-2"
            placeholder="آوا کریمی"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">ایمیل</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field mt-2"
            placeholder="ava@school.edu"
          />
        </div>
        <motion.div>
          <label className="text-sm font-semibold">جنسیت (برای آواتار کارت)</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setGender(opt.id)}
                className={
                  gender === opt.id
                    ? "rounded-xl border border-[var(--brand)] bg-[rgba(var(--brand-rgb),0.12)] py-3 font-bold text-[var(--brand)]"
                    : "rounded-xl border border-[var(--line)] py-3 font-semibold text-[var(--ink-soft)] hover:border-[var(--line-strong)]"
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
        <Button type="submit" className="w-full py-3">
          ساخت حساب و انتخاب آواتار
        </Button>
        <p className="text-sm text-[var(--ink-soft)]">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className="font-semibold text-[var(--brand)]">
            ورود
          </Link>
        </p>
      </motion.form>
    </motion.div>
  );
}
