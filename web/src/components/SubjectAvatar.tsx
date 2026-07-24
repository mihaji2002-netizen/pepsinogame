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
          initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full overflow-hidden rounded-[20px]"
        >
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 90% 70% at 50% 20%, ${lab.color}44, transparent 70%)`,
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background: `linear-gradient(180deg, transparent, ${lab.color}22)`,
            }}
          />
          <Image
            src={lab.avatar}
            alt={lab.avatarAlt}
            width={400}
            height={520}
            sizes="(max-width: 768px) 45vw, 200px"
            className="relative h-full w-full object-cover object-top"
            style={{
              filter: `drop-shadow(0 0 28px ${lab.color}66)`,
            }}
            priority
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[20px] border"
            style={{ borderColor: `${lab.color}33` }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
