"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Flame, Megaphone, Star, Zap } from "lucide-react";
import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LABS, xpProgress } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";
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
    <motion.div
      className="space-y-6"
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      animate="show"
    >
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden rounded-[22px] border p-6 md:p-8"
        style={{
          borderColor: `${lab.color}33`,
          background: `radial-gradient(640px 300px at 8% -20%, ${lab.color}22, transparent 65%), linear-gradient(180deg, #0b141a, #070f14)`,
        }}
      >
        <div
          className="absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-20 blur-3xl"
          style={{ background: lab.color }}
        />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div
              className="mono text-[10px] font-bold"
              style={{ color: lab.color }}
            >
              آزمایشگاه {lab.name} · سطح {currentStudent.level}
            </div>
            <h1 className="display mt-3 text-4xl md:text-5xl">
              ماموریت امروز
            </h1>
            <p className="mt-3 max-w-xl leading-relaxed text-[var(--ink-soft)]">
              {nextMission.completed
                ? "تخته پاک شد. در دفترچه بازتاب بنویس و فردا را آماده کن."
                : nextMission.description}
            </p>
          </div>
          <Link href="/student/missions">
            <Button className="px-6 py-3">
              باز کردن تخته ماموریت
              <ArrowRight size={16} className="rtl:rotate-180" />
            </Button>
          </Link>
        </div>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "ماموریت جاری",
              value: nextMission.title,
              icon: Flame,
              tone: lab.color,
            },
            {
              label: "امتیاز",
              value: `${currentStudent.xp}`,
              icon: Zap,
              tone: "var(--brand)",
            },
            {
              label: "سطح",
              value: `${currentStudent.level}`,
              icon: Star,
              tone: "var(--accent)",
            },
            {
              label: "سکه",
              value: `${currentStudent.coins}`,
              icon: Coins,
              tone: "var(--success)",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="surface-flat p-4"
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[10px] text-[var(--ink-faint)]">
                  {stat.label}
                </span>
                <stat.icon size={15} style={{ color: stat.tone }} />
              </div>
              <div className="display mt-2 truncate text-2xl font-bold md:text-3xl">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative mt-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">پیشرفت سطح</span>
            <span className="mono text-xs text-[var(--ink-soft)]">
              {progress.current} / {progress.total} امتیاز
            </span>
          </div>
          <ProgressBar value={progress.percent} color={lab.color} />
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="display text-2xl">برنامه هفتگی</h2>
              <span className="chip">{plannerPct}٪ انجام‌شده</span>
            </div>
            <ProgressBar value={plannerPct} className="mt-4" />
            <ul className="mt-5 space-y-2">
              {planner.slice(0, 5).map((task) => (
                <li
                  key={task.id}
                  className="surface-flat flex items-center justify-between px-3.5 py-2.5 text-sm"
                >
                  <span className="flex items-center gap-3">
                    <span className="mono w-8 text-[10px] font-bold text-[var(--ink-faint)]">
                      {task.day}
                    </span>
                    <span className={task.done ? "text-[var(--ink-faint)] line-through" : ""}>
                      {task.title}
                    </span>
                  </span>
                  <span
                    className={
                      task.done
                        ? "mono text-xs font-bold text-[var(--success)]"
                        : "mono text-xs text-[var(--ink-faint)]"
                    }
                  >
                    {task.done ? "انجام شد" : "باز"}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/student/planner"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand)]"
            >
              برنامه کامل
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          </div>

          <div className="surface p-6">
            <h2 className="display text-2xl">فعالیت اخیر</h2>
            <ul className="mt-4 divide-y divide-[var(--line)]">
              {xpHistory.slice(0, 5).map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between py-2.5 text-sm"
                >
                  <span className="flex items-center gap-2.5">
                    <Zap size={13} className="text-[var(--brand)]" />
                    {event.reason}
                  </span>
                  <span className="mono font-bold text-[var(--brand)]">
                    +{event.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <IdCard student={currentStudent} />

          <div className="surface p-6">
            <h2 className="display text-2xl">دستاوردها</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-2xl border p-3.5 text-sm transition ${
                    a.unlocked
                      ? "border-[rgba(80,200,120,0.4)] bg-[rgba(80,200,120,0.08)]"
                      : "border-[var(--line)] bg-transparent opacity-50"
                  }`}
                >
                  <div className="font-bold">{a.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-[var(--ink-soft)]">
                    {a.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface p-6">
            <h2 className="display flex items-center gap-2 text-2xl">
              <Megaphone size={20} className="text-[var(--accent)]" />
              اعلان‌ها
            </h2>
            <ul className="mt-4 space-y-4">
              {announcements.map((a) => (
                <li key={a.id} className="surface-flat p-4">
                  <div className="font-bold">{a.title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {a.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
