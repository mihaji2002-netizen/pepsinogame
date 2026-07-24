"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Stamp, CheckCheck, Coins, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LabArt } from "@/components/LabArt";
import { LABS, SCHOOL_GRADE_OPTIONS, schoolGradeLabel, STUDY_FIELD_OPTIONS, studyFieldLabel } from "@/lib/constants";
import { fa } from "@/lib/fa";
import { useApp } from "@/lib/store";
import type { SchoolGrade, StudyField } from "@/lib/types";

export default function MentorDashboardPage() {
  const {
    students,
    missions,
    approveMission,
    awardStamp,
    adjustXp,
    adjustCoins,
  } = useApp();
  const [query, setQuery] = useState("");
  const [labFilter, setLabFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState<SchoolGrade | "all">("all");
  const [fieldFilter, setFieldFilter] = useState<StudyField | "all">("all");

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesQuery =
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.studentId.toLowerCase().includes(query.toLowerCase());
      const matchesLab = labFilter === "all" || s.lab === labFilter;
      const matchesGrade = gradeFilter === "all" || s.grade === gradeFilter;
      const matchesField = fieldFilter === "all" || s.studyField === fieldFilter;
      return matchesQuery && matchesLab && matchesGrade && matchesField;
    });
  }, [students, query, labFilter, gradeFilter, fieldFilter]);

  const pending = missions.filter((m) => m.completed && !m.approved);

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">عملیات فصل ۲۶</div>
        <h1 className="display mt-2 text-4xl">
          مرکز فرماندهی منتور
        </h1>
        <p className="mt-2 max-w-xl text-[var(--ink-soft)]">
          مدیریت دانش‌آموزان، تأیید Missionها، اعطای Stamp و هدایت فصل بدون
          کاغذ.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[
          { label: "دانش‌آموزان", value: students.length },
          { label: "در انتظار تأیید", value: pending.length },
          {
            label: "میانگین Level",
            value: (
              students.reduce((sum, s) => sum + s.level, 0) /
              Math.max(students.length, 1)
            ).toFixed(1),
          },
          {
            label: "مجموع Stampها",
            value: students.reduce((sum, s) => sum + s.stamps, 0),
          },
        ].map((stat) => (
          <div key={stat.label} className="surface p-5">
            <div className="mono text-[10px] text-[var(--ink-faint)]">
              {stat.label}
            </div>
            <div className="display mt-2 text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="surface p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی نام یا شناسه دانش‌آموزی"
              className="field pl-11"
            />
          </div>
          <select
            value={labFilter}
            onChange={(e) => setLabFilter(e.target.value)}
            className="field md:w-44"
          >
            <option value="all">همه Labها</option>
            {LABS.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.nameEn}
              </option>
            ))}
          </select>
          <select
            value={gradeFilter}
            onChange={(e) =>
              setGradeFilter(
                e.target.value === "all" ? "all" : (Number(e.target.value) as SchoolGrade),
              )
            }
            className="field md:w-36"
          >
            <option value="all">همه پایه‌ها</option>
            {SCHOOL_GRADE_OPTIONS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
          <select
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value as StudyField | "all")}
            className="field md:w-36"
          >
            <option value="all">همه رشته‌ها</option>
            {STUDY_FIELD_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="surface border-[rgba(242,181,68,0.3)] p-5">
          <h2 className="display flex items-center gap-2 text-2xl">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[rgba(242,181,68,0.14)] text-[var(--accent)]">
              <CheckCheck size={16} />
            </span>
            صف تأیید Mission
          </h2>
          <ul className="mt-4 space-y-3">
            {pending.map((mission) => (
              <li
                key={mission.key}
                className="surface-flat flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <div className="font-bold">{mission.title}</div>
                  <div className="text-sm text-[var(--ink-soft)]">
                    در انتظار تأیید کیفیت · +{mission.xpReward} XP قبلاً اعطا شده
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() =>
                    approveMission(students[0]?.id ?? "", mission.key)
                  }
                >
                  <CheckCheck size={16} />
                  تأیید
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="surface overflow-hidden">
        <div className="mono grid grid-cols-[1.2fr_0.7fr_0.5fr_0.5fr_0.5fr_1fr] gap-3 border-b border-[var(--line)] px-5 py-3.5 text-[10px] text-[var(--ink-faint)] max-md:hidden">
          <span>دانش‌آموز</span>
          <span>Lab</span>
          <span>Level</span>
          <span>XP</span>
          <span>Coin</span>
          <span>اقدامات</span>
        </div>
        {filtered.map((student) => {
          const lab = LABS.find((l) => l.id === student.lab) ?? LABS[0];
          return (
            <div
              key={student.id}
              className="grid items-center gap-3 border-b border-[var(--line)] px-5 py-4 transition last:border-none hover:bg-[rgba(var(--brand-rgb),0.04)] md:grid-cols-[1.2fr_0.7fr_0.5fr_0.5fr_0.5fr_1fr]"
            >
              <div>
                <Link
                  href={`/mentor/students/${student.id}`}
                  className="font-bold transition hover:text-[var(--brand)]"
                >
                  {student.name}
                </Link>
                <div className="mono text-xs text-[var(--ink-faint)]">
                  {student.studentId} · {schoolGradeLabel(student.grade)} ·{" "}
                  {studyFieldLabel(student.studyField)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LabArt lab={lab} size="xs" />
                <span className="text-xs font-bold" style={{ color: lab.color }}>
                  {lab.nameEn}
                </span>
              </div>
              <div className="mono text-sm">{student.level}</div>
              <div className="mono text-sm">{student.xp}</div>
              <div className="mono text-sm">{student.coins}</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="px-3 py-2"
                  onClick={() => awardStamp(student.id)}
                  title="اعطای Stamp"
                >
                  <Stamp size={14} />
                </Button>
                <Button
                  variant="secondary"
                  className="px-3 py-2"
                  onClick={() => adjustXp(student.id, 50, fa.xp.mentorBoost)}
                  title="اعطای XP"
                >
                  <Zap size={14} />
                </Button>
                <Button
                  variant="secondary"
                  className="px-3 py-2"
                  onClick={() => adjustXp(student.id, -50, "کسر XP توسط منتور")}
                  title="کسر XP"
                >
                  <Zap size={14} className="text-[var(--danger)]" />
                </Button>
                <Button
                  variant="secondary"
                  className="px-3 py-2"
                  onClick={() => adjustCoins(student.id, -10)}
                  title="کسر Coin"
                >
                  <Coins size={14} className="text-[var(--danger)]" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
