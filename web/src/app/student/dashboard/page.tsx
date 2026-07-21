"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Check,
  Compass,
  Crown,
  Droplets,
  Dumbbell,
  Mountain,
  Moon,
  BookOpen,
  Settings2,
  ClipboardList,
  Star,
  Flame,
  ScanLine,
  Trophy,
  Landmark,
  Heart,
  Feather,
} from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { BRAND, LABS, ROUTINES, xpProgress } from "@/lib/constants";
import { PepsinoLogo } from "@/components/PepsinoLogo";
import {
  LAB_SHEETS,
  PIONEER_PASTELS,
  SAMPLE_BOARD,
  SHEET_DAYS,
  TARGET_COLS,
  WEEKLY_MISSION_SAMPLES,
  type DayId,
} from "@/lib/lab-sheet";
import { useApp } from "@/lib/store";
import type { MissionKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import { springSoft } from "@/lib/motion";

const routineIcons = [Moon, ClipboardList, Dumbbell, BookOpen, Droplets, Settings2];

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
        "grid h-4 w-4 shrink-0 place-items-center border transition",
        checked ? "text-white" : "bg-white/90 text-transparent",
      )}
      style={{
        borderColor: accent,
        background: checked ? accent : undefined,
      }}
      aria-pressed={checked}
    >
      <Check size={10} strokeWidth={3} />
    </motion.button>
  );
}

export default function StudentDashboardPage() {
  const { currentStudent, missions, completeMission, exams, logbook } = useApp();
  const [routineGrid, setRoutineGrid] = useState<Record<string, boolean[]>>(() =>
    Object.fromEntries(ROUTINES.map((r) => [r.id, Array(7).fill(false)])),
  );
  const [board, setBoard] = useState<Record<DayId, boolean[]>>(() =>
    Object.fromEntries(SHEET_DAYS.map((d) => [d.id, Array(7).fill(false)])) as Record<
      DayId,
      boolean[]
    >,
  );
  const [weeklyMissions, setWeeklyMissions] = useState(() =>
    WEEKLY_MISSION_SAMPLES.map((text, i) => ({ id: i + 1, text, done: false })),
  );

  const student = currentStudent;
  if (!student) return null;

  const lab = LABS.find((l) => l.id === student.lab) ?? LABS[0];
  const sheet = LAB_SHEETS[lab.id];
  const progress = xpProgress(student.xp);
  const avgExam =
    exams.length > 0
      ? Math.round(exams.reduce((s, e) => s + e.percentage, 0) / exams.length)
      : 82;
  const isPioneer = sheet.motif === "pioneer";

  const cssVars = useMemo(
    () =>
      ({
        "--lab": lab.color,
        "--lab-accent": lab.accent,
        "--lab-soft": lab.soft,
      }) as CSSProperties,
    [lab],
  );

  const toggleCell = (dayId: DayId, col: number) => {
    setBoard((prev) => {
      const row = [...prev[dayId]];
      const nextVal = !row[col];
      row[col] = nextVal;
      if (dayId === "tue" && nextVal && col < 6) {
        const key = TARGET_COLS[col].key;
        if (key !== "extra") {
          const mission = missions.find((m) => m.key === key);
          if (mission && !mission.completed) completeMission(key as MissionKey);
        }
      }
      return { ...prev, [dayId]: row };
    });
  };

  return (
    <div className={cn("lab-sheet", isPioneer && "lab-sheet--pioneer")} style={cssVars}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="lab-sheet__frame"
      >
        <div className="lab-sheet__top">
          <motion.div
            className="lab-brand-card lab-brand-card--logo"
            whileHover={{ y: -2 }}
            transition={springSoft}
          >
            <PepsinoLogo size={132} />
          </motion.div>

          <div className="lab-title-block">
            <div className="lab-title-block__illo" aria-hidden>
              {isPioneer ? (
                <Compass size={56} style={{ color: lab.accent }} strokeWidth={1.2} />
              ) : (
                <>
                  <div className="lab-illo-core" style={{ background: lab.accent }} />
                  <div className="lab-illo-ring" style={{ borderColor: lab.accent }} />
                  <div
                    className="lab-illo-ring lab-illo-ring--2"
                    style={{ borderColor: lab.color }}
                  />
                </>
              )}
            </div>
            <div>
              <h1 className="lab-title-block__h">
                {lab.nameEn.replace(" LAB", "")}{" "}
                <span style={{ color: lab.accent }}>LAB</span>
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
                    {l.nameEn.replace(" LAB", "")}
                  </span>
                ))}
              </div>
            </div>

            <div className="lab-status">
              <div className="lab-stat">
                {isPioneer ? (
                  <Mountain size={16} style={{ color: lab.accent }} />
                ) : (
                  <Brain size={16} style={{ color: lab.accent }} />
                )}
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
                  <strong>{sheet.rankLabel(student.level)}</strong>
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
              <div
                className={cn("lab-id-slot__art", isPioneer && "lab-id-slot__art--arch")}
                style={{
                  background: `linear-gradient(145deg, ${lab.accent}, ${lab.color})`,
                }}
              >
                {isPioneer ? (
                  <Landmark size={32} color="white" strokeWidth={1.4} />
                ) : (
                  <Brain size={36} color="white" strokeWidth={1.4} />
                )}
              </div>
              <span>INSERT YOUR ID CARD HERE</span>
              <Link href="/student/id-card" className="lab-id-slot__link">
                باز کردن کارت
              </Link>
            </div>
          </div>
        </div>

        <div className="lab-sheet__mid lab-sheet__mid--pioneer">
          <aside className="lab-side">
            <section className="lab-panel">
              <header>ROUTINE TRACKER</header>
              <div className="routine-head">
                <span />
                {SHEET_DAYS.map((d) => (
                  <span key={d.id}>{d.letter}</span>
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
                        {SHEET_DAYS.map((d, di) => (
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
              {isPioneer && (
                <Landmark size={28} className="lab-qr__deco" style={{ color: lab.accent }} />
              )}
            </section>
          </aside>

          <section className="lab-board lab-panel">
            <header>WEEKLY MISSION BOARD</header>
            <div className="board-grid board-grid--filled">
              <div className="board-row board-row--head board-row--7">
                {TARGET_COLS.map((c) => (
                  <div key={c.key} className="board-cell board-cell--head">
                    {c.labelEn}
                  </div>
                ))}
              </div>
              {SHEET_DAYS.map((day, di) => (
                <motion.div
                  key={day.id}
                  className="board-row board-row--7"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: di * 0.04 }}
                >
                  {TARGET_COLS.map((col, ci) => {
                    const text = SAMPLE_BOARD[day.id][ci];
                    const checked = board[day.id][ci];
                    const pastel = sheet.boardPastels
                      ? PIONEER_PASTELS[(di + ci) % PIONEER_PASTELS.length]
                      : "#fff";
                    const isHeart = day.id === "tue" && ci === 3;
                    return (
                      <button
                        key={col.key}
                        type="button"
                        className={cn("board-cell board-cell--task", checked && "is-checked")}
                        style={{ background: pastel }}
                        onClick={() => toggleCell(day.id, ci)}
                      >
                        <div className="board-cell__top">
                          <CheckDot
                            accent={lab.accent}
                            checked={checked}
                            onToggle={() => toggleCell(day.id, ci)}
                          />
                          {isHeart && <Heart size={12} fill={lab.accent} color={lab.accent} />}
                        </div>
                        <span className="board-cell__text">{text}</span>
                      </button>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </section>

          <aside className="lab-days">
            <section className="lab-panel lab-days__panel">
              <header>WEEK PATH</header>
              <ul>
                {sheet.dayStages.map((d) => {
                  const meta = SHEET_DAYS.find((x) => x.id === d.id)!;
                  return (
                    <li key={d.id}>
                      <strong>{meta.fa}</strong>
                      <span className="lab-days__stage">{d.stage}</span>
                      {d.hint && <em className="lab-days__hint">{d.hint}</em>}
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>
        </div>

        <div className="lab-sheet__bottom">
          <section className="lab-panel">
            <header>WEEKLY REPORT</header>
            <div className="report-grid">
              <div>
                <span>TOTAL STUDY HOURS</span>
                <strong>14</strong>
              </div>
              <div>
                <span>TEST PERCENTAGE</span>
                <strong>{avgExam}%</strong>
              </div>
              <div>
                <span>STRENGTHS</span>
                <strong>پایداری مسیر</strong>
              </div>
              <div>
                <span>WEAKNESSES</span>
                <strong>شروع کند صبح</strong>
              </div>
              <div className="report-next">
                <span>NEXT WEEK MISSION</span>
                <strong>پاک‌سازی کامل بورد</strong>
              </div>
            </div>
          </section>

          <section className="lab-panel">
            <header>
              WEEKLY NOTES <Feather size={12} className="inline" style={{ color: lab.accent }} />
            </header>
            <p className="lab-notes lab-notes--hand">
              {logbook.win || "ما می‌ترکونیم :)"}
            </p>
          </section>

          <section className="lab-panel">
            <header>WEEKLY REFLECTION</header>
            <p className="lab-notes">
              {logbook.challenge || "این هفته چه مرزی را جابه‌جا کردی؟"}
            </p>
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
                  <Flame size={14} style={{ color: lab.accent }} /> 5
                </strong>
              </div>
            </div>
            <Trophy
              size={36}
              className="lab-sotw__trophy"
              style={{ color: lab.accent }}
              strokeWidth={1.2}
            />
          </section>
        </div>

        <nav className="lab-footer-nav" style={{ background: lab.color }}>
          <span className="lab-footer-nav__side">
            {lab.nameEn} · {lab.department}
          </span>
          <div className="lab-footer-nav__actions">
            {sheet.footer.map((a) => (
              <Link key={a.label} href={a.href} className="lab-footer-nav__btn">
                {a.label}
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
