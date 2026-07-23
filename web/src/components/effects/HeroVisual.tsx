"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { FlaskConical, Sparkles, Zap } from "lucide-react";
import { LABS } from "@/lib/constants";

const orbitItems = [
  { label: "N-021", color: LABS[0].color, delay: 0 },
  { label: "XP +640", color: LABS[2].color, delay: 0.4 },
  { label: "LEVEL 3", color: LABS[3].color, delay: 0.8 },
];

export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 180,
    damping: 22,
  });

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto aspect-square w-full max-w-[520px]"
      initial={{ opacity: 0, scale: 0.88, filter: "blur(16px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="absolute inset-[8%] rounded-full border border-[var(--line)]"
        style={{ rotateX, rotateY }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[18%] rounded-full border border-dashed border-[rgba(80,200,120,0.25)]"
        style={{ rotateX, rotateY }}
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      />

      {orbitItems.map((item, i) => (
        <motion.div
          key={item.label}
          className="absolute left-1/2 top-1/2"
          style={{ rotateX, rotateY }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 16 + i * 4,
            repeat: Infinity,
            ease: "linear",
            delay: item.delay,
          }}
        >
          <motion.div
            className="chip -translate-x-1/2 -translate-y-1/2 whitespace-nowrap shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            style={{
              transform: `rotate(${-i * 120}deg) translateY(-${150 + i * 18}px)`,
              borderColor: `${item.color}44`,
              color: item.color,
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {item.label}
          </motion.div>
        </motion.div>
      ))}

      <motion.div
        className="hero-card relative mx-auto mt-[12%] w-[78%] rounded-[28px] border p-6 md:p-7"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          borderColor: "rgba(80,200,120,0.35)",
          background:
            "linear-gradient(145deg, rgba(80,200,120,0.18) 0%, rgba(15,29,22,0.95) 45%, rgba(8,16,12,0.98) 100%)",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.55), 0 0 80px rgba(80,200,120,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="label-en">SUBJECT ID</div>
            <div className="fa-heading mt-2 text-4xl font-black text-[var(--brand)]">
              N-021
            </div>
          </div>
          <motion.div
            className="grid h-12 w-12 place-items-center rounded-2xl border border-[rgba(80,200,120,0.4)] bg-[rgba(80,200,120,0.12)] text-[var(--brand)]"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <FlaskConical size={22} />
          </motion.div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            ["سطح", "۳"],
            ["امتیاز", "۱٬۲۵۰"],
            ["مهر", "۵"],
          ].map(([k, v]) => (
            <motion.div
              key={k}
              className="rounded-2xl border border-[var(--line)] bg-[rgba(0,0,0,0.25)] p-3 text-center"
              whileHover={{ scale: 1.04, borderColor: "rgba(80,200,120,0.4)" }}
            >
              <div className="text-[11px] text-[var(--ink-faint)]">{k}</div>
              <div className="fa-heading mt-1 text-xl font-bold">{v}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-5 flex items-center gap-2 rounded-2xl border border-[rgba(232,197,71,0.3)] bg-[rgba(232,197,71,0.08)] px-4 py-3 text-sm"
          animate={{
            boxShadow: [
              "0 0 0 rgba(232,197,71,0)",
              "0 0 24px rgba(232,197,71,0.15)",
              "0 0 0 rgba(232,197,71,0)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Sparkles size={16} className="text-[var(--accent)]" />
          <span className="text-[var(--ink-soft)]">ماموریت امروز آماده است</span>
          <Zap size={14} className="mr-auto text-[var(--brand)]" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
