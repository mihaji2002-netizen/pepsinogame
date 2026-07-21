"use client";

import { motion } from "framer-motion";
import { Check, Coins, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useApp } from "@/lib/store";

export default function MissionsPage() {
  const { missions, completeMission, currentStudent } = useApp();
  if (!currentStudent) return null;

  const completed = missions.filter((m) => m.completed).length;
  const pct = Math.round((completed / missions.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Daily loop</div>
          <h1 className="display mt-2 text-4xl font-bold">Mission Board</h1>
          <p className="mt-2 max-w-xl text-[var(--ink-soft)]">
            Routine + six targets. Complete to earn XP and coins. Mentors
            approve quality.
          </p>
        </div>
        <div className="chip">
          {completed}/{missions.length} cleared today
        </div>
      </div>

      <div className="surface p-5">
        <div className="mb-2 flex justify-between text-xs text-[var(--ink-soft)]">
          <span className="font-semibold">Board completion</span>
          <span className="mono">{pct}%</span>
        </div>
        <ProgressBar value={pct} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {missions.map((mission, index) => {
          const locked =
            index > 0 && !missions[index - 1]?.completed && !mission.completed;
          return (
            <motion.div
              key={mission.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`surface p-5 transition ${
                mission.completed
                  ? "border-[rgba(74,222,154,0.35)]"
                  : locked
                    ? "opacity-55"
                    : "hover:border-[var(--line-strong)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
                    {mission.key === "routine" ? "Daily ritual" : "Target"}
                  </div>
                  <div className="display mt-1.5 text-2xl font-bold">
                    {mission.title}
                  </div>
                </div>
                {mission.completed ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(74,222,154,0.4)] bg-[rgba(74,222,154,0.12)] px-3 py-1 text-xs font-bold text-[var(--success)]">
                    <Check size={13} /> Done
                  </span>
                ) : locked ? (
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)]">
                    <Lock size={14} className="text-[var(--ink-faint)]" />
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                {mission.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="mono flex items-center gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1 text-[var(--brand)]">
                    <Zap size={12} /> +{mission.xpReward}
                  </span>
                  <span className="flex items-center gap-1 text-[var(--accent)]">
                    <Coins size={12} /> +{mission.coinReward}
                  </span>
                </span>
                <span
                  className={`mono text-[10px] uppercase tracking-wider ${
                    mission.approved
                      ? "text-[var(--success)]"
                      : "text-[var(--ink-faint)]"
                  }`}
                >
                  {mission.approved ? "Mentor approved" : "Pending approval"}
                </span>
              </div>
              <Button
                className="mt-4 w-full"
                variant={mission.completed ? "secondary" : "primary"}
                disabled={mission.completed || locked}
                onClick={() => completeMission(mission.key)}
              >
                {mission.completed
                  ? "Completed"
                  : locked
                    ? "Locked"
                    : "Mark complete"}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
