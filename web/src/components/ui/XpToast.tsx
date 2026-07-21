"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useApp } from "@/lib/store";

export function XpToast() {
  const { xpToast, clearXpToast } = useApp();

  useEffect(() => {
    if (xpToast == null) return;
    const t = setTimeout(clearXpToast, 1600);
    return () => clearTimeout(t);
  }, [xpToast, clearXpToast]);

  return (
    <AnimatePresence>
      {xpToast != null && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.85, rotate: -4 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="bg-[var(--ink)] px-6 py-3 text-sm font-bold text-[var(--mint)]">
            +{xpToast} امتیاز
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
