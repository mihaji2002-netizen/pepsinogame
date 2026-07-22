"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";
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
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
          className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 rounded-full border border-[rgba(47,214,195,0.4)] bg-[#0a1218] px-5 py-3 text-sm font-bold text-[var(--brand)] shadow-[0_16px_50px_rgba(47,214,195,0.35)]">
            <Zap size={16} className="fill-current" />
            +{xpToast} امتیاز
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
