"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const { registerStudent } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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
        <h1 className="display mt-10 text-5xl font-bold leading-[1.05] tracking-tight">
          جای خود را در{" "}
          <span className="text-[var(--brand)]">آزمایشگاه نورو</span> رزرو کنید
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-[var(--ink-soft)]">
          ثبت‌نام شناسه دائمی دانش‌آموزی، کارت شناسایی دیجیتال و تخصیص
          خودکار سطح ۱ را ایجاد می‌کند.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-[var(--ink-soft)]">
          {[
            "شناسه دائمی — PPL-26XXXX، هرگز تغییر نمی‌کند",
            "کارت شناسایی دیجیتال، آماده دانلود",
            "سطح ۱ · آزمایشگاه نورو · اولین ماموریت در انتظار",
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
          registerStudent(name.trim(), email.trim());
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
        <Button type="submit" className="w-full py-3">
          ساخت حساب و نمایش کارت شناسایی
        </Button>
        <p className="text-sm text-[var(--ink-soft)]">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className="font-semibold text-[var(--brand)]">
            ورود
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
