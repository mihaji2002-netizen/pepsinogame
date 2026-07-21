"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Stamp, CheckCheck, Coins, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LABS } from "@/lib/constants";
import { useApp } from "@/lib/store";

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

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesQuery =
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.studentId.toLowerCase().includes(query.toLowerCase());
      const matchesLab = labFilter === "all" || s.lab === labFilter;
      return matchesQuery && matchesLab;
    });
  }, [students, query, labFilter]);

  const pending = missions.filter((m) => m.completed && !m.approved);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-4xl font-bold">مرکز فرمان منتور</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          مدیریت دانش‌آموزان، تأیید مأموریت، اعطای مهر و هدایت فصل بدون کاغذ.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "دانش‌آموزان", value: students.length },
          { label: "تأییدهای در انتظار", value: pending.length },
          {
            label: "میانگین سطح",
            value: (
              students.reduce((sum, s) => sum + s.level, 0) / Math.max(students.length, 1)
            ).toFixed(1),
          },
          {
            label: "مجموع مهرها",
            value: students.reduce((sum, s) => sum + s.stamps, 0),
          },
        ].map((stat) => (
          <div key={stat.label} className="surface p-5">
            <div className="text-sm text-[var(--ink-soft)]">{stat.label}</div>
            <div className="display mt-2 text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="surface p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی نام یا شناسه دانش‌آموز"
              className="w-full rounded-2xl border border-[var(--line)] bg-white py-3 pr-10 pl-4 outline-none ring-[var(--brand)] focus:ring-2"
            />
          </div>
          <select
            value={labFilter}
            onChange={(e) => setLabFilter(e.target.value)}
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none"
          >
            <option value="all">همه لاب‌ها</option>
            {LABS.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="surface p-5">
          <h2 className="display text-2xl font-bold">صف تأیید مأموریت</h2>
          <ul className="mt-4 space-y-3">
            {pending.map((mission) => (
              <li
                key={mission.key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--paper-deep)] px-4 py-3"
              >
                <div>
                  <div className="font-semibold">{mission.title}</div>
                  <div className="text-sm text-[var(--ink-soft)]">
                    در انتظار تأیید کیفیت · +{mission.xpReward} XP قبلاً داده شده
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => approveMission(students[0]?.id ?? "", mission.key)}
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
        <div className="grid grid-cols-[1.2fr_0.7fr_0.5fr_0.5fr_0.5fr_1fr] gap-3 border-b border-[var(--line)] px-5 py-3 text-xs text-[var(--ink-soft)] max-md:hidden">
          <span>دانش‌آموز</span>
          <span>لاب</span>
          <span>سطح</span>
          <span>XP</span>
          <span>سکه</span>
          <span>اقدامات</span>
        </div>
        {filtered.map((student) => {
          const lab = LABS.find((l) => l.id === student.lab)?.name ?? student.lab;
          return (
            <div
              key={student.id}
              className="grid items-center gap-3 border-b border-[var(--line)] px-5 py-4 last:border-none md:grid-cols-[1.2fr_0.7fr_0.5fr_0.5fr_0.5fr_1fr]"
            >
              <div>
                <Link
                  href={`/mentor/students/detail/?id=${student.id}`}
                  className="font-semibold hover:text-[var(--brand-deep)]"
                >
                  {student.name}
                </Link>
                <div className="font-mono text-xs tracking-wider text-[var(--ink-soft)]" dir="ltr">
                  {student.studentId}
                </div>
              </div>
              <div className="text-sm">{lab}</div>
              <div className="text-sm">{student.level}</div>
              <div className="text-sm">{student.xp}</div>
              <div className="text-sm">{student.coins}</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="px-3 py-2"
                  onClick={() => awardStamp(student.id)}
                  title="اعطای مهر"
                >
                  <Stamp size={14} />
                </Button>
                <Button
                  variant="secondary"
                  className="px-3 py-2"
                  onClick={() => adjustXp(student.id, 50, "تقویت XP منتور")}
                  title="اعطای XP"
                >
                  <Zap size={14} />
                </Button>
                <Button
                  variant="secondary"
                  className="px-3 py-2"
                  onClick={() => adjustCoins(student.id, 10)}
                  title="اعطای سکه"
                >
                  <Coins size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
