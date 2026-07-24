"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { LabArt } from "@/components/LabArt";
import { BRAND, LABS } from "@/lib/constants";
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
        background: `linear-gradient(150deg, ${lab.color}22 0%, var(--deck) 42%, var(--bg) 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `radial-gradient(circle at 18% 12%, ${lab.color}30, transparent 38%), radial-gradient(circle at 85% -5%, rgba(232,197,71,0.12), transparent 32%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--brand-rgb),0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--brand-rgb),0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="mono text-[10px] text-[var(--ink-soft)]">
            کارت شناسایی موضوعی
          </div>
          <div className="display mt-2 text-sm font-semibold text-[var(--ink-soft)]">
            {BRAND.nameEn}
          </div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold"
          style={{
            color: lab.color,
            borderColor: `${lab.color}55`,
            background: `${lab.color}14`,
          }}
        >
          <ShieldCheck size={12} />
          فعال
        </div>
      </div>

      <div
        className="display relative mt-8 text-4xl font-bold md:text-5xl"
        style={{ color: lab.color }}
      >
        {student.studentId}
      </div>
      <div className="mono relative mt-1 text-[10px] text-[var(--ink-faint)]">
        subject id · permanent
      </div>

      <div className="relative mt-8 flex items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <LabArt lab={lab} size="lg" showBadge />
          <div>
            <div className="mono text-[10px] text-[var(--ink-faint)]">
              آزمایشگاه
            </div>
            <div className="display text-lg font-bold">{lab.nameEn}</div>
            <div className="mt-1 text-sm text-[var(--ink-soft)]">{lab.focus}</div>
          </div>
        </div>
        <div className="grid h-16 w-16 place-items-center rounded-xl bg-white p-2">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "conic-gradient(from 90deg, var(--bg) 0 25%, transparent 0 50%, var(--bg) 0 75%, transparent 0), linear-gradient(var(--bg) 0 0), linear-gradient(var(--bg) 0 0)",
              backgroundPosition: "center, 20% 20%, 80% 80%",
              backgroundSize: "100% 100%, 28% 28%, 28% 28%",
              backgroundRepeat: "no-repeat",
            }}
            aria-label="جایگاه کد QR"
          />
        </div>
      </div>

      <div className="relative mt-8 grid grid-cols-3 gap-3 border-t border-[var(--line)] pt-4">
        {[
          ["سطح", student.level],
          ["امتیاز", student.xp],
          ["مهر", student.stamps],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="mono text-[10px] text-[var(--ink-faint)]">
              {label}
            </div>
            <div className="display mt-1 text-xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
        {["نظم را حفظ کن", "به فرایند اعتماد کن", "آنزیم باش"].map((slogan) => (
          <span
            key={slogan}
            className="mono rounded-full border border-[var(--line)] bg-[rgba(var(--brand-rgb),0.06)] px-2.5 py-1 text-[9px] text-[var(--ink-soft)]"
          >
            {slogan}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
