"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const { registerStudent } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="hero-dawn opacity-70" aria-hidden />
      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:px-8">
        <div>
          <BrandMark />
          <h1 className="display mt-8 text-5xl font-bold tracking-tight">
            جایت را در لاب بگیر
          </h1>
          <p className="mt-3 max-w-md text-[var(--ink-soft)]">
            ثبت‌نام، شناسه ثابت دانش‌آموز، کارت دیجیتال و سطح ۱ را خودکار می‌سازد.
          </p>
        </div>

        <form
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
          <Button type="submit" variant="flare" className="w-full">
            ساخت حساب و نمایش کارت
          </Button>
          <p className="text-sm text-[var(--ink-soft)]">
            قبلاً ثبت‌نام کردی؟{" "}
            <Link href="/login" className="font-semibold text-[var(--brand-deep)]">
              ورود
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
