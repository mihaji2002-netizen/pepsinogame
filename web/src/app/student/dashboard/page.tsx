"use client";

import { motion } from "framer-motion";
import {
  Atom,
  Beaker,
  Brain,
  Check,
  Crown,
  Droplets,
  Dumbbell,
  FlaskConical,
  Moon,
  BookOpen,
  Settings2,
  ClipboardList,
  Microscope,
  Star,
  Flame,
  ScanLine,
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BOARD_COLUMNS,
  BRAND,
  LABS,
  ROUTINES,
  WEEK_DAYS,
  xpProgress,
} from "@/lib/constants";
import { useApp } from "@/lib/store";
import type { MissionKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import { springSoft } from "@/lib/motion";

const dayIcons = [Beaker, Microscope, Atom, FlaskConical, Brain, Star, Moon];

const routineIcons = [Moon, ClipboardList, Dumbbell, BookOpen, Droplets, Settings2];

function HexMark({ color }: { color: string }) {
  return (
    <svg width="56" height="64" viewBox="0 0 56 64" aria-hidden>
      <polygon
        points="28,2 52,16 52,48 28,62 4,48 4,16"
        fill={color}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
      />
      <g transform="translate(16,20)" fill="none" stroke="#9ef" strokeWidth="1.6">
        <circle cx="12" cy="10" r="6" />
        <path d="M12 2v3M12 15v3M4 10H1M23 10h-3" />
        <circle cx="12" cy="10" r="2" fill="#9ef" stroke="none" />
      </g>
    </svg>
  );
}

function CheckDot({
  checked,
  onToggle,
  accent,
}: {
  checked: boolean;
  onToggle: () => void;
  accent: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={onToggle}
      className={cn(
        "grid h-5 w-5 place-items-center border transition",
        checked ? "text-white" : "bg-white/80 text-transparent",
      )}
      style={{
        borderColor: accent,
        background: checked ? accent : undefined,
      }}
      aria-pressed={checked}
    >
      <Check size={12} strokeWidth={3} />
    </motion.button>
  );
}

export default function StudentDashboardPage() {
  const { currentStudent, missions, completeMission, exams, logbook } = useApp();
  const [routineGrid, setRoutineGrid] = useState<Record<string, boolean[]>>(() =>
    Object.fromEntries(ROUTINES.map((r) => [r.id, Array(7).fill(false)])),
  );
  const [board, setBoard] = useState<Record<string, Record<string, boolean>>>(() =>
    Object.fromEntries(
      WEEK_DAYS.map((d) => [
        d.id,
        Object.fromEntries(BOARD_COLUMNS.map((c) => [c.key, false])),
      ]),
    ),
  );
  const [weeklyMissions, setWeeklyMissions] = useState(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      text: missions[i]?.title ?? `مأموریت ${i + 1}`,
      done: false,
    })),
  );

  const student = currentStudent;
  if (!student) return null;

  const lab = LABS.find((l) => l.id === student.lab) ?? LABS[0];
  const progress = xpProgress(student.xp);
  const avgExam =
    exams.length > 0
      ? Math.round(exams.reduce((s, e) => s + e.percentage, 0) / exams.length)
      : 0;

  const cssVars = useMemo(
    () =>
      ({
        "--lab": lab.color,
        "--lab-accent": lab.accent,
        "--lab-soft": lab.soft,
      }) as React.CSSProperties,
    [lab],
  );

  const toggleBoard = (dayId: string, key: string) => {
    setBoard((prev) => {
      const next = {
        ...prev,
        [dayId]: { ...prev[dayId], [key]: !prev[dayId][key] },
      };
      if (dayId === "mon" && !prev[dayId][key] && key !== "routine") {
        const mission = missions.find((m) => m.key === key);
        if (mission && !mission.completed) completeMission(key as MissionKey);
      }
      return next;
    });
  };

  return (
    <div className="lab-sheet" style={cssVars}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="lab-sheet__frame"
      >
        {/* TOP ROW */}
        <div className="lab-sheet__top">
          <motion.div
            className="lab-brand-card"
            style={{ background: lab.color }}
            whileHover={{ y: -2 }}
            transition={springSoft}
          >
            <HexMark color="rgba(0,0,0,0.25)" />
            <div>
              <div className="lab-brand-card__name">pepsino</div>
              <div className="lab-brand-card__lab">LAB</div>
              <div className="lab-brand-card__tag">{BRAND.tagline}</div>
            </div>
          </motion.div>

          <div className="lab-title-block">
            <div className="lab-title-block__illo" aria-hidden>
              <div className="lab-illo-core" style={{ background: lab.accent }} />
              <div className="lab-illo-ring" style={{ borderColor: lab.accent }} />
              <div className="lab-illo-ring lab-illo-ring--2" style={{ borderColor: lab.color }} />
            </div>
            <div>
              <h1 className="lab-title-block__h">
                {lab.nameEn.split(" ")[0]} <span style={{ color: lab.accent }}>LAB</span>
              </h1>
              <p className="lab-title-block__sub">{lab.department}</p>
              <p className="lab-title-block__tag">{BRAND.tagline}</p>
            </div>
          </div>

          <div className="lab-subject">
            <div className="lab-subject__fields">
              <label>
                <span>SUBJECT NAME</span>
                <strong>{student.name}</strong>
              </label>
              <label>
                <span>SUBJECT ID</span>
                <strong dir="ltr">{student.studentId}</strong>
              </label>
              <label>
                <span>LAB</span>
                <strong>{lab.nameEn}</strong>
              </label>
              <div className="lab-subject__labs">
                {LABS.map((l) => (
                  <span
                    key={l.id}
                    className={cn("lab-chip", student.lab === l.id && "is-active")}
                    style={
                      student.lab === l.id
                        ? { background: l.color, borderColor: l.color }
                        : undefined
                    }
                  >
                    {l.badge} {l.nameEn.split(" ")[0]}
                  </span>
                ))}
              </div>
            </div>

            <div className="lab-status">
              <div className="lab-stat">
                <FlaskConical size={16} style={{ color: lab.accent }} />
                <div>
                  <span>LEVEL</span>
                  <strong>{student.level}</strong>
                </div>
              </div>
              <div className="lab-stat">
                <Star size={16} style={{ color: lab.accent }} />
                <div>
                  <span>XP</span>
                  <strong>{student.xp}</strong>
                </div>
              </div>
              <div className="lab-stat">
                <Crown size={16} style={{ color: lab.accent }} />
                <div>
                  <span>RANK</span>
                  <strong>#{Math.max(1, 12 - student.level)}</strong>
                </div>
              </div>
              <div className="lab-next">
                <span>NEXT LEVEL</span>
                <div className="lab-next__bar">
                  <motion.div
                    className="lab-next__fill"
                    style={{ background: lab.accent }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percent}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <em>
                  {progress.current} / {progress.total} XP
                </em>
              </div>
            </div>

            <div className="lab-id-slot" style={{ borderColor: lab.accent }}>
              <div className="lab-id-slot__art" style={{ background: `linear-gradient(145deg, ${lab.accent}, ${lab.color})` }}>
                <Brain size={36} color="white" strokeWidth={1.4} />
              </div>
              <span>INSERT YOUR ID CARD HERE</span>
              <Link href="/student/id-card" className="lab-id-slot__link">
                باز کردن کارت
              </Link>
            </div>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="lab-sheet__mid">
          <aside className="lab-side">
            <section className="lab-panel">
              <header>ROUTINE TRACKER</header>
              <div className="routine-head">
                <span />
                {WEEK_DAYS.map((d) => (
                  <span key={d.id}>{d.en[0]}</span>
                ))}
              </div>
              <ul className="routine-list">
                {ROUTINES.map((r, i) => {
                  const Icon = routineIcons[i];
                  return (
                    <li key={r.id}>
                      <div className="routine-label">
                        <Icon size={14} style={{ color: lab.accent }} />
                        <span>{r.titleEn}</span>
                      </div>
                      <div className="routine-dots">
                        {WEEK_DAYS.map((d, di) => (
                          <CheckDot
                            key={d.id}
                            accent={lab.accent}
                            checked={routineGrid[r.id][di]}
                            onToggle={() =>
                              setRoutineGrid((prev) => {
                                const row = [...prev[r.id]];
                                row[di] = !row[di];
                                return { ...prev, [r.id]: row };
                              })
                            }
                          />
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="lab-panel">
              <header>WEEKLY MISSIONS</header>
              <ul className="weekly-missions">
                {weeklyMissions.map((m) => (
                  <li key={m.id}>
                    <CheckDot
                      accent={lab.accent}
                      checked={m.done}
                      onToggle={() =>
                        setWeeklyMissions((prev) =>
                          prev.map((x) => (x.id === m.id ? { ...x, done: !x.done } : x)),
                        )
                      }
                    />
                    <span className="wm-num">{String(m.id).padStart(2, "0")}</span>
                    <span className={cn("wm-text", m.done && "is-done")}>{m.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="lab-panel lab-qr">
              <ScanLine size={18} style={{ color: lab.accent }} />
              <div
                className="lab-qr__code"
                style={{
                  backgroundImage:
                    "conic-gradient(from 90deg, #0b1c22 0 25%, transparent 0 50%, #0b1c22 0 75%, transparent 0), linear-gradient(#0b1c22 0 0), linear-gradient(#0b1c22 0 0)",
                  backgroundPosition: "center, 18% 18%, 82% 82%",
                  backgroundSize: "100% 100%, 26% 26%, 26% 26%",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <div>
                <strong>HQ ACCESS</strong>
                <p>SCAN TO ACCESS HQ</p>
              </div>
            </section>
          </aside>

          <section className="lab-board lab-panel">
            <header>WEEKLY MISSION BOARD</header>
            <div className="board-grid">
              <div className="board-row board-row--head">
                <div className="board-day-col">DAY</div>
                {BOARD_COLUMNS.map((c) => (
                  <div key={c.key} className="board-cell board-cell--head">
                    {c.labelEn}
                  </div>
                ))}
              </div>
              {WEEK_DAYS.map((day, di) => {
                const DayIcon = dayIcons[di];
                return (
                  <motion.div
                    key={day.id}
                    className="board-row"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: di * 0.04 }}
                  >
                    <div className="board-day-col">
                      <DayIcon size={14} style={{ color: lab.accent }} />
                      <strong>{day.en}</strong>
                    </div>
                    {BOARD_COLUMNS.map((c) => (
                      <div key={c.key} className="board-cell">
                        <CheckDot
                          accent={lab.accent}
                          checked={board[day.id][c.key]}
                          onToggle={() => toggleBoard(day.id, c.key)}
                        />
                        <span className="board-line" />
                      </div>
                    ))}
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>

        {/* BOTTOM */}
        <div className="lab-sheet__bottom">
          <section className="lab-panel">
            <header>WEEKLY REPORT</header>
            <div className="report-grid">
              <div>
                <span>TOTAL STUDY HOURS</span>
                <strong>12.5</strong>
              </div>
              <div>
                <span>TEST PERCENTAGE</span>
                <strong>{avgExam || 82}%</strong>
              </div>
              <div>
                <span>STRENGTHS</span>
                <strong>تمرکز عمیق</strong>
              </div>
              <div>
                <span>WEAKNESSES</span>
                <strong>سرعت آزمون</strong>
              </div>
              <div className="report-next">
                <span>NEXT WEEK MISSION</span>
                <strong>{missions.find((m) => !m.completed)?.title ?? "پاک‌سازی بورد"}</strong>
              </div>
            </div>
            <div className="report-bars">
              {[72, 86, 64, 90, 58].map((v, i) => (
                <motion.div
                  key={i}
                  className="report-bar"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.45 }}
                  style={{ height: `${v}%`, background: lab.accent, transformOrigin: "bottom" }}
                />
              ))}
            </div>
          </section>

          <section className="lab-panel">
            <header>WEEKLY NOTES</header>
            <p className="lab-notes">
              {logbook.win || "یادداشت هفته را اینجا بنویس — یافته‌ها، مشاهدات، سیگنال‌ها."}
            </p>
          </section>

          <section className="lab-panel">
            <header>WEEKLY REFLECTION</header>
            <p className="lab-notes">
              {logbook.challenge ||
                "بازتاب: چه چیزی سخت بود؟ فردا روی چه چیزی قفل می‌کنی؟"}
            </p>
            <div className="lab-brain" style={{ color: lab.accent }}>
              <Brain size={40} strokeWidth={1.2} />
            </div>
          </section>

          <section className="lab-panel lab-sotw">
            <header>SUBJECT OF THE WEEK</header>
            <div className="sotw-stats">
              <div>
                <span>CURRENT LEVEL</span>
                <strong>{student.level}</strong>
              </div>
              <div>
                <span>CURRENT XP</span>
                <strong>{student.xp}</strong>
              </div>
              <div>
                <span>STREAK</span>
                <strong className="inline-flex items-center gap-1">
                  <Flame size={14} style={{ color: lab.accent }} /> 3
                </strong>
              </div>
            </div>
          </section>
        </div>

        <nav className="lab-footer-nav" style={{ background: lab.color }}>
          <span className="lab-footer-nav__side">
            {lab.nameEn} · {lab.department}
          </span>
          <div className="lab-footer-nav__actions">
            {[
              { t: "FOCUS", href: "/student/missions" },
              { t: "LEARN", href: "/student/logbook" },
              { t: "ADAPT", href: "/student/planner" },
              { t: "EVOLVE", href: "/student/profile" },
            ].map((a) => (
              <Link key={a.t} href={a.href} className="lab-footer-nav__btn">
                {a.t}
              </Link>
            ))}
          </div>
          <Link href="/student/leaderboard" className="lab-footer-nav__side">
            LEGEND HALL
          </Link>
        </nav>
      </motion.div>
    </div>
  );
}
