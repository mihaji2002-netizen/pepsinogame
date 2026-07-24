"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { AvatarKey, Gender } from "@/lib/types";
import { cn } from "@/lib/utils";
import { avatarImagePath } from "@/lib/avatars";
import type { LabId } from "@/lib/types";

export function AvatarPicker({
  gender,
  labId,
  value,
  onChange,
  className,
}: {
  gender: Gender;
  labId: LabId;
  value: AvatarKey;
  onChange: (key: AvatarKey) => void;
  className?: string;
}) {
  const keys: AvatarKey[] = [1, 2, 3];

  return (
    <motion.div
      className={cn("grid grid-cols-3 gap-3", className)}
      role="radiogroup"
      aria-label="انتخاب آواتار"
    >
      {keys.map((key) => {
        const selected = value === key;
        return (
          <motion.button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(key)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative overflow-hidden rounded-2xl border-2 transition",
              selected
                ? "border-[var(--brand)] shadow-[0_0_24px_rgba(var(--brand-rgb),0.35)]"
                : "border-[var(--line)] hover:border-[var(--line-strong)]",
            )}
          >
            <div className="aspect-[3/4] w-full bg-[var(--deck)]">
              <Image
                src={avatarImagePath(labId, gender, key)}
                alt={`آواتار ${gender === "female" ? "دختر" : "پسر"} استایل ${key}`}
                width={160}
                height={210}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 py-2 text-center text-xs font-bold",
                selected ? "bg-[var(--brand)] text-[var(--brand-ink)]" : "bg-black/55 text-white",
              )}
            >
              استایل {key}
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
