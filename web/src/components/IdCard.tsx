"use client";

import { motion } from "framer-motion";
import { LABS } from "@/lib/constants";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

export function IdCard({
  student,
  className,
}: {
  student: Student;
  className?: string;
  interactive?: boolean;
}) {
  const lab = LABS.find((l) => l.id === student.lab) ?? LABS[0];

  return (
    <motion.div
      initial={false}
      className={cn(
        "relative overflow-hidden rounded-[30px] p-6 text-white shadow-[0_30px_80px_rgba(6,20,22,0.35)]",
        className,
      )}
      style={{
        background: `linear-gradient(150deg, ${lab.color} 0%, #061416 58%, #0b2428 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(47,245,194,0.45), transparent 35%), radial-gradient(circle at 85% 0%, rgba(255,106,61,0.3), transparent 28%)",
        }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.2em] text-white/60">
            DIGITAL ID
          </div>
          <div className="display mt-2 text-3xl">PEPSINO LAB</div>
        </div>
        <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
          لاب {lab.name}
        </div>
      </div>

      <div className="relative mt-8 flex items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--signal)] text-xl font-bold text-[var(--void)]">
            {student.avatar}
          </div>
          <div>
            <div className="display text-2xl">{student.name}</div>
            <div className="mt-1 font-mono text-sm tracking-[0.14em] text-white/75" dir="ltr">
              {student.studentId}
            </div>
          </div>
        </div>
        <div className="grid h-16 w-16 place-items-center rounded-xl bg-white p-2 text-[var(--ink)]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "conic-gradient(from 90deg, #061416 0 25%, transparent 0 50%, #061416 0 75%, transparent 0), linear-gradient(#061416 0 0), linear-gradient(#061416 0 0)",
              backgroundPosition: "center, 20% 20%, 80% 80%",
              backgroundSize: "100% 100%, 28% 28%, 28% 28%",
              backgroundRepeat: "no-repeat",
            }}
            aria-label="کد QR"
          />
        </div>
      </div>

      <div className="relative mt-8 grid grid-cols-3 gap-3 border-t border-white/15 pt-4 text-sm">
        <div>
          <div className="text-white/55">سطح</div>
          <div className="mt-1 text-lg font-bold">{student.level}</div>
        </div>
        <div>
          <div className="text-white/55">XP</div>
          <div className="mt-1 text-lg font-bold">{student.xp}</div>
        </div>
        <div>
          <div className="text-white/55">سکه</div>
          <div className="mt-1 text-lg font-bold">{student.coins}</div>
        </div>
      </div>
    </motion.div>
  );
}
