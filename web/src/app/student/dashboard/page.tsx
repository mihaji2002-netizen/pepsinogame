"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Flame, Star, Zap } from "lucide-react";
import { IdCard } from "@/components/IdCard";
import { Button } from "@/components/ui/Button";
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
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface overflow-hidden p-6 md:p-8"
        style={{ boxShadow: `0 24px 60px ${lab.soft}` }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
              {lab.name} Lab · Level {currentStudent.level}
            </div>
            <h1 className="display mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              Today’s Mission
            </h1>
            <p className="mt-2 max-w-xl text-[var(--ink-soft)]">
              {nextMission.completed
                ? "Board cleared. Reflect in the logbook and prepare tomorrow."
                : nextMission.description}
            </p>
          </div>
          <Link href="/student/missions">
            <Button>
              Open Mission Board
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Current Mission",
              value: nextMission.title,
              icon: Flame,
              tone: lab.color,
            },
            {
              label: "XP",
              value: `${currentStudent.xp}`,
              icon: Zap,
              tone: "var(--brand)",
            },
            {
              label: "Level",
              value: `${currentStudent.level}`,
              icon: Star,
              tone: "var(--accent)",
            },
            {
              label: "Coins",
              value: `${currentStudent.coins}`,
              icon: Coins,
              tone: "var(--success)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white/70 p-4"
              style={{ border: `1px solid ${stat.tone}22` }}
            >
              <div className="flex items-center justify-between text-sm text-[var(--ink-soft)]">
                {stat.label}
                <stat.icon size={16} style={{ color: stat.tone }} />
              </div>
              <div className="display mt-2 text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>Level progress</span>
            <span className="text-[var(--ink-soft)]">
              {progress.current} / {progress.total} XP
            </span>
          </div>
          <ProgressBar value={progress.percent} color={lab.color} />
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="display text-2xl font-bold">Weekly Planner</h2>
              <span className="text-sm text-[var(--ink-soft)]">{plannerPct}% done</span>
            </div>
            <ProgressBar value={plannerPct} className="mt-4" />
            <ul className="mt-5 space-y-2">
              {planner.slice(0, 5).map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between rounded-xl bg-[var(--paper-deep)] px-3 py-2 text-sm"
                >
                  <span>
                    <span className="mr-2 font-semibold text-[var(--ink-soft)]">
                      {task.day}
                    </span>
                    {task.title}
                  </span>
                  <span className={task.done ? "text-[var(--success)]" : "text-[var(--ink-soft)]"}>
                    {task.done ? "Done" : "Open"}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/student/planner" className="mt-4 inline-block text-sm font-semibold text-[var(--brand-deep)]">
              Open full planner
            </Link>
          </div>

          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">Recent Activity</h2>
            <ul className="mt-4 space-y-3">
              {xpHistory.slice(0, 5).map((event) => (
                <li key={event.id} className="flex items-center justify-between text-sm">
                  <span>{event.reason}</span>
                  <span className="font-semibold text-[var(--brand-deep)]">
                    +{event.amount} XP
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <IdCard student={currentStudent} />
          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">Achievements</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-2xl p-3 text-sm ${
                    a.unlocked
                      ? "bg-[var(--brand)]/10 text-[var(--ink)]"
                      : "bg-[var(--paper-deep)] text-[var(--ink-soft)]"
                  }`}
                >
                  <div className="font-semibold">{a.title}</div>
                  <div className="mt-1 text-xs opacity-80">{a.description}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="surface p-6">
            <h2 className="display text-2xl font-bold">Announcements</h2>
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
