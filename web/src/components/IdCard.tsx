"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SubjectAvatar } from "@/components/SubjectAvatar";
import { SubjectBarcode, SubjectQr } from "@/components/SubjectQr";
import { BRAND } from "@/lib/constants";
import {
  cardStatus,
  cardStatusFa,
  labTierLevel,
  studentLab,
} from "@/lib/id-card";
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
  const lab = studentLab(student);
  const tierLevel = labTierLevel(student.level);
  const status = cardStatus(student);
  const statusFa = cardStatusFa(student);

  return (
    <motion.article
      initial={interactive ? { opacity: 0, y: 18, rotateX: 6 } : false}
      animate={interactive ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
      whileHover={interactive ? { y: -4 } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "subject-id-card relative mx-auto aspect-[5/7] w-full max-w-[380px] overflow-hidden rounded-[26px] border text-[var(--ink)] shadow-[0_40px_100px_rgba(0,0,0,0.65)]",
        className,
      )}
      style={{
        borderColor: `${lab.color}55`,
        background: `linear-gradient(155deg, ${lab.color}18 0%, #0a0a12 38%, #05050a 100%)`,
        ["--card-accent" as string]: lab.color,
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 20% 0%, ${lab.color}28, transparent 60%), radial-gradient(ellipse 60% 40% at 100% 100%, ${lab.color}14, transparent 55%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex h-full flex-col p-5 md:p-6">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <motion.div
              className="grid h-9 w-9 place-items-center rounded-xl border"
              style={{
                borderColor: `${lab.color}44`,
                background: `${lab.color}12`,
              }}
            >
              <Image
                src={lab.image}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
                aria-hidden
              />
            </motion.div>
            <div>
              <div className="label-en text-[10px] font-bold tracking-[0.2em] text-[var(--ink-soft)]">
                pepsino
              </div>
              <div
                className="label-en text-[11px] font-bold tracking-[0.28em]"
                style={{ color: lab.color }}
              >
                LAB
              </div>
            </div>
          </div>
          <div
            className="rounded-full border px-3 py-1 text-[9px] font-bold tracking-[0.18em]"
            style={{
              color: "#f0c060",
              borderColor: "rgba(240,192,96,0.45)",
              background: "rgba(240,192,96,0.1)",
            }}
          >
            SUBJECT CARD
          </div>
        </header>

        <div className="mt-4 grid flex-1 grid-cols-[1.05fr_0.95fr] gap-3">
          <div className="relative min-h-[220px]">
            <SubjectAvatar lab={lab} className="absolute inset-0" />
            <motion.div
              key={lab.id}
              className="absolute bottom-2 left-2 rounded-lg border px-2 py-1 text-[9px] font-bold tracking-wider"
              style={{
                color: lab.color,
                borderColor: `${lab.color}44`,
                background: "rgba(5,5,10,0.72)",
              }}
            >
              {lab.nameEn}
            </motion.div>
          </div>

          <motion.div className="flex flex-col justify-center gap-4 py-2">
            <div>
              <div className="label-en text-[9px] tracking-[0.2em] text-[var(--ink-faint)]">
                SUBJECT ID
              </div>
              <motion.div
                key={student.studentId}
                className="display mt-1 text-3xl font-bold leading-none md:text-4xl"
                style={{ color: lab.color }}
              >
                {student.studentId}
              </motion.div>
            </div>

            <div>
              <div className="label-en text-[9px] tracking-[0.2em] text-[var(--ink-faint)]">
                DEPARTMENT
              </div>
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-1 text-sm font-bold"
                style={{ color: lab.color }}
              >
                {lab.nameEn}
              </motion.div>
              <p className="mt-0.5 text-[11px] text-[var(--ink-soft)]">{lab.focus}</p>
            </div>

            <div>
              <div className="label-en text-[9px] tracking-[0.2em] text-[var(--ink-faint)]">
                LEVEL
              </div>
              <motion.div
                key={student.level}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="display mt-1 text-3xl font-bold"
              >
                {tierLevel}
                <span className="mr-1 text-sm font-medium text-[var(--ink-faint)]">
                  / {student.level}
                </span>
              </motion.div>
            </div>

            <div>
              <div className="label-en text-[9px] tracking-[0.2em] text-[var(--ink-faint)]">
                STATUS
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <motion.span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{
                    background: lab.color,
                    boxShadow: `0 0 12px ${lab.color}`,
                  }}
                  animate={{ opacity: [1, 0.45, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  className="label-en text-xs font-bold tracking-[0.16em]"
                  style={{ color: lab.color }}
                >
                  {status}
                </span>
                <span className="text-[10px] text-[var(--ink-faint)]">
                  · {statusFa}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="mt-3 border-t border-[var(--line)] pt-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p
                className="label-en text-[10px] font-bold tracking-[0.22em]"
                style={{ color: lab.color }}
              >
                {BRAND.motto}
              </p>
              <p className="mt-1 text-[10px] text-[var(--ink-faint)]">{BRAND.tagline}</p>
            </div>
            <div className="rounded-lg bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
              <SubjectQr value={student.studentId} size={68} />
            </div>
          </div>
          <div className="mt-3 text-[var(--card-accent)]">
            <SubjectBarcode value={student.studentId} />
          </div>
        </footer>
      </div>
    </motion.article>
  );
}
