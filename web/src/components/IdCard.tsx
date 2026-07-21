"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className={cn("relative overflow-hidden p-6 text-white", className)}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(150deg, ${lab.color} 0%, #0f766e 45%, #0b1c22 100%)`,
        }}
      />
      <motion.div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--mint)]/30 blur-2xl"
        animate={{ x: [0, 18, 0], y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.2em] text-white/60">
            DIGITAL ID
          </div>
          <div className="display mt-2 text-3xl">PEPSINO LAB</div>
        </div>
        <div className="border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold">
          لاب {lab.name}
        </div>
      </div>

      <div className="relative mt-8 flex items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            className="grid h-16 w-16 place-items-center bg-[var(--mint)] text-xl font-bold text-[var(--ink)]"
            whileHover={{ scale: 1.08, rotate: -4 }}
          >
            {student.avatar}
          </motion.div>
          <div>
            <div className="display text-2xl">{student.name}</div>
            <div className="mt-1 font-mono text-sm tracking-[0.14em] text-white/75" dir="ltr">
              {student.studentId}
            </div>
          </div>
        </div>
        <div className="grid h-16 w-16 place-items-center bg-white p-2 text-[var(--ink)]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "conic-gradient(from 90deg, #0b1c22 0 25%, transparent 0 50%, #0b1c22 0 75%, transparent 0), linear-gradient(#0b1c22 0 0), linear-gradient(#0b1c22 0 0)",
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
