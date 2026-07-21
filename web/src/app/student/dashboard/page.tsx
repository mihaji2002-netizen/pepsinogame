"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Coins, Flame, Star, Zap } from "lucide-react";
import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LABS, xpProgress } from "@/lib/constants";
import { useApp } from "@/lib/store";

export default function StudentDashboardPage() {
  const {
    currentStudent,
    missions,
    planner,
    achievements,
    announcements,
    xpHistory,
  } = useApp();

  if (!currentStudent) return null;

  const lab = LABS.find((l) => l.id === currentStudent.lab) ?? LABS[0];
  const progress = xpProgress(currentStudent.xp);
  const nextMission = missions.find((m) => !m.completed) ?? missions[0];
  const plannerDone = planner.filter((t) => t.done).length;
  const plannerPct = Math.round((plannerDone / planner.length) * 100);

  return (
    <div className="space-y-6">
      <motion.section
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden p-6 text-white md:p-8"
        style={{
          background: `linear-gradient(145deg, ${lab.color} 0%, #134e4a 55%, #14212b 100%)`,
        }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs text-white/60">
              لاب {lab.name} · سطح {currentStudent.level}
            </div>
            <h1 className="display mt-2 text-4xl md:text-5xl">مأموریت امروز</h1>
            <p className="mt-2 max-w-xl text-white/70">
              {nextMission.completed
                ? "بورد پاک شد. در دفترچه بازتاب بنویس و فردا را آماده کن."
                : nextMission.description}
            </p>
          </div>
          <Link href="/student/missions">
            <Button variant="flare">
              باز کردن بورد مأموریت
              <ArrowLeft size={16} />
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-px bg-white/15 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "مأموریت فعلی", value: nextMission.title, icon: Flame },
            { label: "XP", value: `${currentStudent.xp}`, icon: Zap },
            { label: "سطح", value: `${currentStudent.level}`, icon: Star },
            { label: "سکه", value: `${currentStudent.coins}`, icon: Coins },
          ].map((stat) => (
            <div key={stat.label} className="bg-black/20 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm text-white/55">
                {stat.label}
                <stat.icon size={16} className="text-[var(--mint)]" />
              </div>
              <div className="display mt-2 text-3xl">
                {stat.label === "XP" || stat.label === "سکه" || stat.label === "سطح" ? (
                  <NumberTicker value={Number(stat.value)} />
                ) : (
                  stat.value
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm text-white/70">
            <span>پیشرفت سطح</span>
            <span>
              {progress.current} / {progress.total} XP
            </span>
          </div>
          <ProgressBar value={progress.percent} color="var(--mint)" />
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="display text-3xl">برنامه‌ریز هفتگی</h2>
              <span className="text-sm text-[var(--ink-soft)]">{plannerPct}٪ انجام‌شده</span>
            </div>
            <ProgressBar value={plannerPct} className="mt-4" color="var(--brand)" />
            <ul className="mt-5 space-y-2">
              {planner.slice(0, 5).map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between bg-[var(--paper-2)] px-3 py-2 text-sm"
                >
                  <span>
                    <span className="ml-2 font-semibold text-[var(--ink-soft)]">{task.day}</span>
                    {task.title}
                  </span>
                  <span className={task.done ? "text-[var(--success)]" : "text-[var(--ink-soft)]"}>
                    {task.done ? "انجام" : "باز"}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/student/planner"
              className="mt-4 inline-block text-sm font-semibold text-[var(--brand-deep)]"
            >
              باز کردن برنامه‌ریز کامل
            </Link>
          </div>

          <div className="surface p-6">
            <h2 className="display text-3xl">فعالیت‌های اخیر</h2>
            <ul className="mt-4 space-y-3">
              {xpHistory.slice(0, 5).map((event) => (
                <li key={event.id} className="flex items-center justify-between text-sm">
                  <span>{event.reason}</span>
                  <span className="font-semibold text-[var(--brand-deep)]">+{event.amount} XP</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <IdCard student={currentStudent} />
          <div className="surface p-6">
            <h2 className="display text-3xl">دستاوردها</h2>
            <div className="mt-4 grid grid-cols-2 gap-px bg-[var(--line)]">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`p-3 text-sm ${
                    a.unlocked
                      ? "bg-[var(--ink)] text-[var(--mint)]"
                      : "bg-white text-[var(--ink-soft)]"
                  }`}
                >
                  <div className="font-semibold">{a.title}</div>
                  <div className="mt-1 text-xs opacity-80">{a.description}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="surface p-6">
            <h2 className="display text-3xl">اعلان‌ها</h2>
            <ul className="mt-4 space-y-4">
              {announcements.map((a) => (
                <li key={a.id}>
                  <div className="font-semibold">{a.title}</div>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">{a.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
