"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/Button";
import { BRAND, LABS } from "@/lib/constants";
import { fa } from "@/lib/fa";
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
        {fa.loading.onboarding}
      </div>
    );
  }

  const lab = LABS.find((l) => l.id === currentStudent.lab) ?? LABS[0];
  const key = steps[step];

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-12">
      {/* Step indicator */}
      <div className="mb-10 flex justify-center gap-2">
        {steps.map((s, i) => (
          <div
            key={s}
            className="h-1 w-10 rounded-full transition-all duration-500"
            style={{
              background:
                i <= step ? "var(--brand)" : "rgba(var(--brand-rgb),0.15)",
              boxShadow: i <= step ? "0 0 10px rgba(var(--brand-rgb),0.5)" : "none",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {key === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
              className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-[rgba(var(--brand-rgb),0.4)] bg-[rgba(var(--brand-rgb),0.12)] text-[var(--brand)]"
            >
              <PartyPopper size={36} />
            </motion.div>
            <h1 className="display mt-8 text-5xl font-bold md:text-6xl">
              به <span className="shimmer-text">{BRAND.nameEn}</span> خوش آمدید
            </h1>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-[var(--ink-soft)]">
              فصل شما از همین الان شروع می‌شود، {currentStudent.name.split(" ")[0]}.
              اول هویت. بعد ماموریت.
            </p>
            <Button className="mt-10 px-7 py-3" onClick={() => setStep(1)}>
              نمایش کارت شناسایی
            </Button>
          </motion.div>
        )}

        {key === "id" && (
          <motion.div
            key="id"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="eyebrow">گام ۰۲ · هویت</div>
              <h1 className="display mt-3 text-4xl">
                شناسنامه دیجیتال شما
              </h1>
              <p className="mt-3 text-[var(--ink-soft)]">
                شناسه دائمی دانش‌آموزی · آزمایشگاه را کدگذاری نمی‌کند · هرگز تغییر نمی‌کند.
              </p>
            </div>
            <IdCard student={currentStudent} />
            <div className="text-center">
              <Button className="px-7 py-3" onClick={() => setStep(2)}>
                ادامه
              </Button>
            </div>
          </motion.div>
        )}

        {key === "lab" && (
          <motion.div
            key="lab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="surface overflow-hidden p-8"
          >
            <div
              className="relative h-40 overflow-hidden rounded-[18px] border"
              style={{
                borderColor: `${lab.color}44`,
                background: `linear-gradient(150deg, ${lab.color}30, #0c0c14 70%)`,
              }}
            >
              <div
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-2xl"
                style={{ background: lab.color }}
              />
              <div
                className="absolute bottom-4 left-5 grid h-14 w-14 place-items-center rounded-2xl border text-2xl font-bold"
                style={{
                  color: lab.color,
                  borderColor: `${lab.color}55`,
                  background: "rgba(5,9,12,0.5)",
                }}
              >
                {lab.badge}
              </div>
            </div>
            <div className="eyebrow mt-6">گام ۰۳ · آزمایشگاه شما</div>
            <h1 className="display mt-2 text-4xl">آزمایشگاه {lab.name}</h1>
            <p className="mt-3 text-[var(--ink-soft)]">{lab.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
              از سطح ۱ شروع می‌کنید. با امتیاز و مهرهای منتور از پژوهش،
              کاتالیز و پیشگام عبور کنید.
            </p>
            <Button className="mt-8" onClick={() => setStep(3)}>
              آشنایی با تخته ماموریت
            </Button>
          </motion.div>
        )}

        {key === "mission" && (
          <motion.div
            key="mission"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="surface p-8"
          >
            <div className="eyebrow">گام ۰۴ · چرخه</div>
            <h1 className="display mt-2 text-4xl">اولین ماموریت</h1>
            <p className="mt-3 leading-relaxed text-[var(--ink-soft)]">
              روتین را کامل کنید، سپس اهداف ۱ تا ۶. هر اقدام امتیاز می‌دهد.
              منتورها کیفیت را تأیید و مهر اعطا می‌کنند.
            </p>
            <div className="surface-flat mt-7 p-5">
              <div className="mono text-[10px] text-[var(--ink-faint)]">
                امروز
              </div>
              <div className="display mt-2 text-2xl font-bold">روتین</div>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                آیین روزانه مطالعه و گرم‌کردن را کامل کن.
              </p>
              <div className="mono mt-3 text-sm font-bold text-[var(--brand)]">
                +۴۰ امتیاز · +۵ سکه
              </div>
            </div>
            <Button className="mt-8" onClick={() => setStep(4)}>
              آماده‌ام
            </Button>
          </motion.div>
        )}

        {key === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h1 className="display text-5xl">ورود به داشبورد</h1>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-[var(--ink-soft)]">
              ماموریت. پیشرفت. امتیاز. سطح. سکه. اول اقدام.
            </p>
            <Button
              className="mt-10 px-9 py-3.5 text-base"
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
