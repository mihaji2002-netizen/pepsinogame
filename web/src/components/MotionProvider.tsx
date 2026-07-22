"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Honors the user's prefers-reduced-motion setting for all framer-motion animations. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
