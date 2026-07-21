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
      whileHover={interactive ? { y: -4 } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-[24px] border p-6 text-[var(--ink)] shadow-[0_30px_80px_rgba(0,0,0,0.55)]",
        className,
      )}
      style={{
        borderColor: `${lab.color}44`,
        background: `linear-gradient(150deg, ${lab.color}26 0%, #0a1218 42%, #05090c 100%)`,
      }}
    >
      {/* Holographic sweep */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `radial-gradient(circle at 18% 12%, ${lab.color}30, transparent 38%), radial-gradient(circle at 85% -5%, rgba(242,181,68,0.14), transparent 32%)`,
        }}
      />
      {/* Micro grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,210,216,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,210,216,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">
            Digital ID · Season 26
          </div>
          <div className="display mt-2 text-2xl font-bold tracking-tight">
            PEPSINO LAB
          </div>
        </div>
        <div
          className="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider"
          style={{
            color: lab.color,
            borderColor: `${lab.color}55`,
            background: `${lab.color}14`,
          }}
        >
          {lab.name} Lab
        </div>
      </div>

      <div className="relative mt-8 flex items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="grid h-16 w-16 place-items-center rounded-2xl border text-xl font-bold"
            style={{
              color: lab.color,
              borderColor: `${lab.color}55`,
              background: `${lab.color}18`,
            }}
          >
            {student.avatar}
          </div>
          <div>
            <div className="display text-2xl font-bold">{student.name}</div>
            <div className="mono mt-1 text-sm tracking-[0.18em] text-[var(--ink-soft)]">
              {student.studentId}
            </div>
          </div>
        </div>
        <div className="grid h-16 w-16 place-items-center rounded-xl bg-white p-2">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "conic-gradient(from 90deg, #05090c 0 25%, transparent 0 50%, #05090c 0 75%, transparent 0), linear-gradient(#05090c 0 0), linear-gradient(#05090c 0 0)",
              backgroundPosition: "center, 20% 20%, 80% 80%",
              backgroundSize: "100% 100%, 28% 28%, 28% 28%",
              backgroundRepeat: "no-repeat",
            }}
            aria-label="QR code placeholder"
          />
        </div>
      </div>

      <div className="relative mt-8 grid grid-cols-3 gap-3 border-t border-[var(--line)] pt-4">
        {[
          ["Level", student.level],
          ["XP", student.xp],
          ["Coins", student.coins],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              {label}
            </div>
            <div className="display mt-1 text-xl font-bold">{value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
