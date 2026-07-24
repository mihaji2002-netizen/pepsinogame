"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { LabTheme } from "@/lib/types";

export function SubjectAvatar({
  lab,
  className,
}: {
  lab: LabTheme;
  className?: string;
}) {
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={lab.id}
          initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full"
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full blur-3xl"
            style={{ background: lab.color }}
            animate={{ opacity: [0.22, 0.42, 0.22], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <Image
            src={lab.avatar}
            alt={lab.avatarAlt}
            width={280}
            height={360}
            className="relative h-full w-full object-contain object-bottom"
            style={{ filter: `drop-shadow(0 0 24px ${lab.color}55)` }}
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
