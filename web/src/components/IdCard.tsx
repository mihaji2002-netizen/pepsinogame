"use client";

import { motion } from "framer-motion";
import { LABS } from "@/lib/constants";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

export function IdCard({
  student,
  className,
  interactive = true,
}: {
  student: Student;
  className?: string;
  interactive?: boolean;
}) {
  const lab = LABS.find((l) => l.id === student.lab) ?? LABS[0];

  return (
    <motion.div
      initial={interactive ? { opacity: 0, y: 18, rotateX: 8 } : false}
      animate={interactive ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-[28px] p-6 text-white shadow-[0_30px_80px_rgba(16,32,39,0.28)]",
        className,
      )}
      style={{
        background: `linear-gradient(145deg, ${lab.color} 0%, #102027 62%, #0b5f63 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 35%), radial-gradient(circle at 80% 0%, rgba(212,160,23,0.35), transparent 30%)",
        }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-white/70">
            Digital ID
          </div>
          <div className="display mt-2 text-3xl font-bold tracking-tight">
            PEPSINO LAB
          </div>
        </div>
        <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
          {lab.name} Lab
        </div>
      </div>

      <div className="relative mt-8 flex items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur">
            {student.avatar}
          </div>
          <div>
            <div className="display text-2xl font-bold">{student.name}</div>
            <div className="mt-1 font-mono text-sm tracking-[0.16em] text-white/80">
              {student.studentId}
            </div>
          </div>
        </div>
        <div className="grid h-16 w-16 place-items-center rounded-xl bg-white p-2 text-[var(--ink)]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "conic-gradient(from 90deg, #102027 0 25%, transparent 0 50%, #102027 0 75%, transparent 0), linear-gradient(#102027 0 0), linear-gradient(#102027 0 0)",
              backgroundPosition: "center, 20% 20%, 80% 80%",
              backgroundSize: "100% 100%, 28% 28%, 28% 28%",
              backgroundRepeat: "no-repeat",
            }}
            aria-label="QR code placeholder"
          />
        </div>
      </div>

      <div className="relative mt-8 grid grid-cols-3 gap-3 border-t border-white/15 pt-4 text-sm">
        <div>
          <div className="text-white/60">Level</div>
          <div className="mt-1 text-lg font-semibold">{student.level}</div>
        </div>
        <div>
          <div className="text-white/60">XP</div>
          <div className="mt-1 text-lg font-semibold">{student.xp}</div>
        </div>
        <div>
          <div className="text-white/60">Coins</div>
          <div className="mt-1 text-lg font-semibold">{student.coins}</div>
        </div>
      </div>
    </motion.div>
  );
}
