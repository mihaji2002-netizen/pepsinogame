"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Official pepsiño LAB badge — flask, molecule, pencil, ladder, sprout */
export function PepsinoLogo({
  className,
  size = 120,
  animated = true,
}: {
  className?: string;
  size?: number;
  animated?: boolean;
}) {
  const Comp = animated ? motion.svg : "svg";
  const animProps = animated
    ? {
        whileHover: { scale: 1.04, rotate: -2 },
        transition: { type: "spring" as const, stiffness: 320, damping: 22 },
      }
    : {};

  return (
    <Comp
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={cn("shrink-0 drop-shadow-sm", className)}
      aria-label="pepsino LAB"
      role="img"
      {...animProps}
    >
      <defs>
        <linearGradient id="pl-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7CFF4A" />
          <stop offset="55%" stopColor="#2DB84B" />
          <stop offset="100%" stopColor="#178A34" />
        </linearGradient>
        <linearGradient id="pl-flask" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A8FF6E" />
          <stop offset="100%" stopColor="#1F9A3C" />
        </linearGradient>
        <radialGradient id="pl-bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#3A3A3A" />
          <stop offset="100%" stopColor="#1A1A1A" />
        </radialGradient>
        <filter id="pl-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Badge disc */}
      <circle cx="100" cy="100" r="94" fill="url(#pl-bg)" />
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="url(#pl-green)"
        strokeWidth="3.5"
      />
      <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

      {/* Molecule (left) */}
      <g transform="translate(42,48)" filter="url(#pl-soft)">
        <line x1="8" y1="10" x2="22" y2="4" stroke="#5FE86A" strokeWidth="2.2" />
        <line x1="22" y1="4" x2="34" y2="14" stroke="#5FE86A" strokeWidth="2.2" />
        <line x1="8" y1="10" x2="18" y2="24" stroke="#5FE86A" strokeWidth="2.2" />
        <circle cx="8" cy="10" r="4.5" fill="url(#pl-green)" />
        <circle cx="22" cy="4" r="4" fill="url(#pl-green)" />
        <circle cx="34" cy="14" r="4.2" fill="url(#pl-green)" />
        <circle cx="18" cy="24" r="3.8" fill="url(#pl-green)" />
      </g>

      {/* Flask */}
      <g transform="translate(78,38)" filter="url(#pl-soft)">
        <path
          d="M18 8h10v14l14 28c2 4 0 10-6 10H10c-6 0-8-6-6-10l14-28V8z"
          fill="none"
          stroke="white"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M14 42h26l4 8c1 2 0 5-3 5H13c-3 0-4-3-3-5l4-8z" fill="url(#pl-flask)" />
        <circle cx="20" cy="48" r="1.6" fill="white" opacity="0.75" />
        <circle cx="28" cy="51" r="1.2" fill="white" opacity="0.65" />
        <circle cx="24" cy="46" r="1" fill="white" opacity="0.55" />
        <rect x="18" y="4" width="10" height="5" rx="1" fill="white" />
      </g>

      {/* Pencil */}
      <g transform="translate(118,42)" filter="url(#pl-soft)">
        <rect x="4" y="2" width="7" height="42" rx="1" fill="white" />
        <rect x="4" y="2" width="7" height="8" fill="#2DB84B" />
        <path d="M4 44l3.5 10L11 44z" fill="#F5D76E" />
        <path d="M6.2 50l1.3 4 1.3-4z" fill="#1A1A1A" />
        <line x1="7.5" y1="12" x2="7.5" y2="40" stroke="#D1D5DB" strokeWidth="1" />
      </g>

      {/* Ladder */}
      <g transform="translate(138,48)" stroke="white" strokeWidth="2.2" fill="none" filter="url(#pl-soft)">
        <line x1="2" y1="2" x2="2" y2="40" />
        <line x1="16" y1="2" x2="16" y2="40" />
        <line x1="2" y1="10" x2="16" y2="10" />
        <line x1="2" y1="20" x2="16" y2="20" />
        <line x1="2" y1="30" x2="16" y2="30" />
      </g>

      {/* Sprout on rim */}
      <g transform="translate(156,78)" filter="url(#pl-soft)">
        <path d="M0 18c0-12 8-18 8-18s2 8 2 16" fill="none" stroke="#2DB84B" strokeWidth="2" />
        <ellipse cx="-2" cy="4" rx="7" ry="4.5" transform="rotate(-35 -2 4)" fill="url(#pl-green)" />
        <ellipse cx="10" cy="2" rx="6.5" ry="4" transform="rotate(28 10 2)" fill="url(#pl-green)" />
      </g>

      {/* Wordmark */}
      <text
        x="100"
        y="128"
        textAnchor="middle"
        fill="white"
        style={{ fontFamily: "var(--font-body), Rubik, sans-serif", fontWeight: 800, fontSize: 28 }}
      >
        pepsiño
      </text>

      {/* LAB with rules */}
      <line x1="52" y1="142" x2="78" y2="142" stroke="#2DB84B" strokeWidth="2" />
      <text
        x="100"
        y="147"
        textAnchor="middle"
        fill="#2DB84B"
        style={{ fontFamily: "var(--font-body), Rubik, sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: 4 }}
      >
        LAB
      </text>
      <line x1="122" y1="142" x2="148" y2="142" stroke="#2DB84B" strokeWidth="2" />

      {/* Curved tagline */}
      <defs>
        <path id="pl-arc" d="M40,168 A62,62 0 0 0 160,168" fill="none" />
      </defs>
      <text
        fill="white"
        style={{ fontFamily: "var(--font-body), Rubik, sans-serif", fontWeight: 600, fontSize: 7.5, letterSpacing: 2.2 }}
      >
        <textPath href="#pl-arc" startOffset="50%" textAnchor="middle">
          GET ACTIVE TO GROW
        </textPath>
      </text>
    </Comp>
  );
}
