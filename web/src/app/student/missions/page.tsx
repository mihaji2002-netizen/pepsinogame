"use client";

import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export default function MissionsPage() {
  const { missions, completeMission, currentStudent } = useApp();
  if (!currentStudent) return null;

  const completed = missions.filter((m) => m.completed).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-4xl font-bold">بورد مأموریت</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          روتین + شش هدف. با تکمیل، XP و سکه می‌گیری. منتور کیفیت را تأیید می‌کند.
        </p>
        <div className="mt-4 text-sm font-semibold">
          {completed}/{missions.length} امروز پاک شد
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {missions.map((mission, index) => {
          const locked =
            index > 0 && !missions[index - 1]?.completed && !mission.completed;
          return (
            <motion.div
              key={mission.key}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="surface p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-[var(--ink-soft)]">
                    {mission.key === "routine" ? "روزانه" : "هدف"}
                  </div>
                  <div className="display mt-1 text-2xl font-bold">{mission.title}</div>
                </div>
                {mission.completed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success)]/15 px-3 py-1 text-xs font-semibold text-[var(--success)]">
                    <Check size={14} /> انجام
                  </span>
                ) : locked ? (
                  <Lock size={18} className="text-[var(--ink-soft)]" />
                ) : null}
              </div>
              <p className="mt-3 text-sm text-[var(--ink-soft)]">{mission.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span>
                  +{mission.xpReward} XP · +{mission.coinReward} سکه
                </span>
                <span className="text-[var(--ink-soft)]">
                  {mission.approved ? "تأیید منتور" : "در انتظار تأیید"}
                </span>
              </div>
              <Button
                className="mt-4 w-full"
                disabled={mission.completed || locked}
                onClick={() => completeMission(mission.key)}
              >
                {mission.completed ? "انجام شد" : locked ? "قفل" : "علامت به‌عنوان انجام‌شده"}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
