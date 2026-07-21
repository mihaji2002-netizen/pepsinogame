"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { LABS } from "@/lib/constants";
import { useApp } from "@/lib/store";

const steps = ["welcome", "id", "lab", "mission", "start"] as const;

const stepMotion = {
  initial: { opacity: 0, y: 28, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

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
    <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="mesh-blob mesh-blob--a !top-10 !opacity-40" />
        <div className="mesh-blob mesh-blob--c !opacity-25" />
      </div>
      <AnimatePresence mode="wait">
        {key === "welcome" && (
          <motion.div key="welcome" {...stepMotion} className="text-center">
            <div className="display text-5xl md:text-6xl">به PEPSINO LAB خوش آمدی</div>
            <p className="mx-auto mt-4 max-w-md text-[var(--ink-soft)]">
              فصل از همین‌جا شروع می‌شود. اول هویت، بعد مأموریت.
            </p>
            <Magnetic className="mt-8">
              <Button variant="flare" onClick={() => setStep(1)}>
                نمایش کارت شناسایی
              </Button>
            </Magnetic>
          </motion.div>
        )}

        {key === "id" && (
          <motion.div key="id" {...stepMotion} className="space-y-6">
            <div>
              <div className="display text-4xl">کارت دیجیتال تو</div>
              <p className="mt-2 text-[var(--ink-soft)]">
                شناسه ثابت دانش‌آموز · هرگز لاب داخلش کد نمی‌شود · هرگز عوض نمی‌شود.
              </p>
            </div>
            <IdCard student={currentStudent} />
            <Button variant="flare" onClick={() => setStep(2)}>
              ادامه
            </Button>
          </motion.div>
        )}

        {key === "lab" && (
          <motion.div key="lab" {...stepMotion} className="surface p-8">
            <motion.div
              className="h-36"
              style={{ background: `linear-gradient(145deg, ${lab.color}, #0b1c22)` }}
              initial={{ scaleX: 0.2, opacity: 0.4 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="display mt-6 text-4xl">لاب {lab.name}</div>
            <p className="mt-3 text-[var(--ink-soft)]">{lab.tagline}</p>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">
              از سطح ۱ شروع می‌کنی. با XP و مهر منتور از ریسرچ، کاتالیست و پایونیر عبور کن.
            </p>
            <Button variant="flare" className="mt-6" onClick={() => setStep(3)}>
              آشنایی با بورد مأموریت
            </Button>
          </motion.div>
        )}

        {key === "mission" && (
          <motion.div key="mission" {...stepMotion} className="surface p-8">
            <div className="display text-4xl">اولین مأموریت</div>
            <p className="mt-3 text-[var(--ink-soft)]">
              روتین و سپس هدف‌های ۱ تا ۶ را کامل کن. هر عمل XP می‌دهد. منتور کیفیت را تأیید می‌کند.
            </p>
            <motion.div
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-6 border-r-4 border-[var(--flare)] bg-[var(--paper-2)] p-4"
            >
              <div className="text-sm text-[var(--ink-soft)]">امروز</div>
              <div className="display mt-2 text-2xl">روتین</div>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                مراسم مطالعه روزانه و گرم‌کردن را کامل کن. +۴۰ XP
              </p>
            </motion.div>
            <Button variant="flare" className="mt-6" onClick={() => setStep(4)}>
              آماده‌ام
            </Button>
          </motion.div>
        )}

        {key === "start" && (
          <motion.div key="start" {...stepMotion} className="text-center">
            <div className="display text-5xl">ورود به داشبورد</div>
            <p className="mx-auto mt-4 max-w-md text-[var(--ink-soft)]">
              مأموریت. پیشرفت. XP. سطح. سکه. اول اقدام.
            </p>
            <Magnetic className="mt-8">
              <Button
                variant="flare"
                onClick={() => {
                  completeOnboarding();
                  router.push("/student/dashboard");
                }}
              >
                شروع
              </Button>
            </Magnetic>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
