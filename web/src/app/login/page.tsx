"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsStudent, loginAsMentor } = useApp();
  const [email, setEmail] = useState("ava@pepsinolab.dev");

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:px-8">
      <div>
        <BrandMark />
        <h1 className="display mt-8 text-5xl font-bold tracking-tight">ورود به لاب</h1>
        <p className="mt-3 max-w-md text-[var(--ink-soft)]">
          احراز هویت نسخه MVP — ایمیل دانش‌آموز را وارد کن یا وارد کنسول منتور شو.
          گوگل و پیامک بعداً اضافه می‌شود.
        </p>
      </div>

      <div className="surface p-6 md:p-8">
        <label className="block text-sm font-medium">ایمیل</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none ring-[var(--brand)] focus:ring-2"
          placeholder="you@school.edu"
          dir="ltr"
        />
        <div className="mt-5 flex flex-col gap-3">
          <Button
            onClick={() => {
              loginAsStudent(email);
              router.push("/student/dashboard");
            }}
          >
            ادامه به‌عنوان دانش‌آموز
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              loginAsMentor();
              router.push("/mentor/dashboard");
            }}
          >
            ادامه به‌عنوان منتور
          </Button>
        </div>
        <p className="mt-6 text-sm text-[var(--ink-soft)]">
          حساب نداری؟{" "}
          <Link href="/register" className="font-semibold text-[var(--brand-deep)]">
            ساخت حساب دانش‌آموز
          </Link>
        </p>
      </div>
    </div>
  );
}
