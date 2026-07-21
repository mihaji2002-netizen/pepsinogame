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

export default function RegisterPage() {
  const router = useRouter();
  const { registerStudent } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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
            <KineticText
              text="جایت را در لاب بگیر"
              className="display text-4xl md:text-6xl"
              as="h1"
            />
          </div>
          <p className="mt-4 max-w-md text-[var(--ink-soft)]">
            ثبت‌نام، شناسه ثابت دانش‌آموز، کارت دیجیتال و سطح ۱ را خودکار می‌سازد.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="surface space-y-4 p-6 md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !email.trim()) return;
            registerStudent(name.trim(), email.trim());
            router.push("/onboarding");
          }}
        >
          <div>
            <label className="block text-sm font-medium">نام کامل</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field mt-2"
              placeholder="آوا کریمی"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ایمیل</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field mt-2"
              placeholder="ava@school.edu"
              dir="ltr"
            />
          </div>
          <Magnetic strength={16} className="block w-full">
            <Button type="submit" variant="flare" className="w-full">
              ساخت حساب و نمایش کارت
            </Button>
          </Magnetic>
          <p className="text-sm text-[var(--ink-soft)]">
            قبلاً ثبت‌نام کردی؟{" "}
            <Link href="/login" className="font-semibold text-[var(--brand-deep)]">
              ورود
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
