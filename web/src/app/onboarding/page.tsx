"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/button";
import { LABS } from "@/lib/constants";
import { useApp } from "@/lib/store";

const steps = ["welcome", "id", "lab", "mission", "start"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { hydrated, currentStudent, completeOnboarding, user } = useApp();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== "student" || !currentStudent) {
      router.replace("/register");
      return;
    }
    if (currentStudent.hasCompletedOnboarding) {
      router.replace("/student/dashboard");
    }
  }, [hydrated, user, currentStudent, router]);

  if (!currentStudent) {
    return (
      <div className="grid min-h-screen place-items-center text-[var(--ink-soft)]">
        در حال آماده‌سازی لاب…
      </div>
    );
  }

  const lab = LABS.find((l) => l.id === currentStudent.lab) ?? LABS[0];
  const key = steps[step];

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-12">
      <AnimatePresence mode="wait">
        {key === "welcome" && (
          <motion.div
            key="welcome"
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            className="text-center"
          >
            <div className="display text-5xl font-bold md:text-6xl">
              به PEPSINO LAB خوش آمدی
            </div>
            <p className="mx-auto mt-4 max-w-md text-[var(--ink-soft)]">
              فصل از همین‌جا شروع می‌شود. اول هویت، بعد مأموریت.
            </p>
            <Button className="mt-8" onClick={() => setStep(1)}>
              نمایش کارت شناسایی
            </Button>
          </motion.div>
        )}

        {key === "id" && (
          <motion.div
            key="id"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            <div>
              <div className="display text-4xl font-bold">کارت دیجیتال تو</div>
              <p className="mt-2 text-[var(--ink-soft)]">
                شناسه ثابت دانش‌آموز · هرگز لاب داخلش کد نمی‌شود · هرگز عوض نمی‌شود.
              </p>
            </div>
            <IdCard student={currentStudent} />
            <Button onClick={() => setStep(2)}>ادامه</Button>
          </motion.div>
        )}

        {key === "lab" && (
          <motion.div
            key="lab"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="surface p-8"
          >
            <div
              className="h-36 rounded-[24px]"
              style={{ background: `linear-gradient(145deg, ${lab.color}, #102027)` }}
            />
            <div className="display mt-6 text-4xl font-bold">لاب {lab.name}</div>
            <p className="mt-3 text-[var(--ink-soft)]">{lab.tagline}</p>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">
              از سطح ۱ شروع می‌کنی. با XP و مهر منتور از ریسرچ، کاتالیست و پایونیر عبور کن.
            </p>
            <Button className="mt-6" onClick={() => setStep(3)}>
              آشنایی با بورد مأموریت
            </Button>
          </motion.div>
        )}

        {key === "mission" && (
          <motion.div
            key="mission"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="surface p-8"
          >
            <div className="display text-4xl font-bold">اولین مأموریت</div>
            <p className="mt-3 text-[var(--ink-soft)]">
              روتین و سپس هدف‌های ۱ تا ۶ را کامل کن. هر عمل XP می‌دهد. منتور کیفیت را تأیید می‌کند.
            </p>
            <div className="mt-6 rounded-2xl bg-[var(--paper-deep)] p-4">
              <div className="text-sm text-[var(--ink-soft)]">امروز</div>
              <div className="display mt-2 text-2xl font-bold">روتین</div>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                مراسم مطالعه روزانه و گرم‌کردن را کامل کن. +۴۰ XP
              </p>
            </div>
            <Button className="mt-6" onClick={() => setStep(4)}>
              آماده‌ام
            </Button>
          </motion.div>
        )}

        {key === "start" && (
          <motion.div
            key="start"
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="display text-5xl font-bold">ورود به داشبورد</div>
            <p className="mx-auto mt-4 max-w-md text-[var(--ink-soft)]">
              مأموریت. پیشرفت. XP. سطح. سکه. اول اقدام.
            </p>
            <Button
              className="mt-8"
              onClick={() => {
                completeOnboarding();
                router.push("/student/dashboard");
              }}
            >
              شروع
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
