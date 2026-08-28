"use client";

import { useCallback, useEffect, useState } from "react";
import { generateSubjectPalette, normalizeHex } from "@/lib/program/color-palette";
import {
  createEmptyProgram,
  SUBJECT_COLOR_PRESETS,
} from "@/lib/program/defaults";
import type { WeeklyProgram } from "@/lib/program/types";
import NeuroLabTemplateCanvas from "./NeuroLabTemplateCanvas";
import "@/styles/program-studio.css";

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="studio-label">{label}</label>
      {multiline ? (
        <textarea
          className="studio-input min-h-[64px] resize-y"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="studio-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export default function ProgramStudioApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [program, setProgram] = useState<WeeklyProgram>(() => createEmptyProgram());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [savedPrograms, setSavedPrograms] = useState<
    Array<{ id: string; name: string; subject_name: string | null }>
  >([]);

  const updateProgram = useCallback((patch: Partial<WeeklyProgram>) => {
    setProgram((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    fetch("/api/program-studio/programs", { method: "HEAD" })
      .then((res) => setAuthenticated(res.ok))
      .finally(() => setChecking(false));
  }, []);

  const loadSavedList = useCallback(async () => {
    const res = await fetch("/api/program-studio/programs");
    if (res.ok) {
      const data = await res.json();
      setSavedPrograms(data.programs ?? []);
    }
  }, []);

  useEffect(() => {
    if (authenticated) loadSavedList();
  }, [authenticated, loadSavedList]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/program-studio/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("رمز عبور اشتباه است");
      return;
    }
    setAuthenticated(true);
  }

  async function applySubjectTheme(name: string, hex: string) {
    const normalized = normalizeHex(hex);
    let palette = generateSubjectPalette(normalized);
    try {
      const res = await fetch(
        `/api/program-studio/programs/theme?name=${encodeURIComponent(name)}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.theme?.palette) palette = data.theme.palette;
      }
    } catch {
      // ignore
    }
    updateProgram({ subjectTheme: { name, hexColor: normalized, palette } });
  }

  async function saveProgram() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/program-studio/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "خطا در ذخیره");
        return;
      }
      setProgram(data.program);
      setMessage("برنامه ذخیره شد");
      loadSavedList();
    } finally {
      setSaving(false);
    }
  }

  function updateGridRow(
    rowId: string,
    field: keyof WeeklyProgram["gridRows"][number],
    value: string,
  ) {
    setProgram((prev) => ({
      ...prev,
      gridRows: prev.gridRows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row,
      ),
    }));
  }

  if (checking) {
    return (
      <div className="program-studio grid min-h-screen place-items-center">
        در حال بررسی...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="program-studio flex min-h-screen items-center justify-center p-4">
        <div className="studio-card w-full max-w-sm p-6">
          <h1 className="text-2xl font-bold text-[#1b4d3e]">استودیو برنامه‌ساز</h1>
          <p className="mt-2 text-sm text-[#4a635c]">NEURO LAB · Weekly Planner</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="studio-label">رمز عبور</label>
              <input
                type="password"
                className="studio-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{loginError}</p>
            )}
            <button type="submit" className="studio-btn studio-btn-primary w-full">
              ورود
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="program-studio min-h-screen">
      <header className="no-print border-b border-[#c5ddd2] bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-xl font-bold text-[#1b4d3e]">استودیو برنامه‌ساز</h1>
            <p className="text-xs text-[#4a635c]">قالب ثابت NEURO LAB — پر کردن روی همان تصویر</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="studio-btn studio-btn-secondary"
              onClick={() => setProgram(createEmptyProgram())}
            >
              برنامه جدید
            </button>
            <button
              type="button"
              className="studio-btn studio-btn-primary"
              onClick={saveProgram}
              disabled={saving}
            >
              {saving ? "ذخیره..." : "ذخیره"}
            </button>
            <button type="button" className="studio-btn studio-btn-secondary" onClick={() => window.print()}>
              چاپ / PDF
            </button>
            <button
              type="button"
              className="studio-btn studio-btn-secondary"
              onClick={async () => {
                await fetch("/api/program-studio/logout", { method: "POST" });
                setAuthenticated(false);
              }}
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      {message && (
        <div className="no-print mx-auto max-w-[1600px] px-4 pt-3">
          <p className="rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{message}</p>
        </div>
      )}

      <div className="mx-auto grid max-w-[1600px] gap-4 p-4 xl:grid-cols-[380px_1fr]">
        <aside className="no-print studio-card max-h-[calc(100vh-88px)] overflow-y-auto p-4 space-y-5">
          {savedPrograms.length > 0 && (
            <div>
              <label className="studio-label">برنامه‌های ذخیره‌شده</label>
              <select
                className="studio-input"
                value={program.id}
                onChange={async (e) => {
                  const res = await fetch(
                    `/api/program-studio/programs?id=${encodeURIComponent(e.target.value)}`,
                  );
                  const data = await res.json();
                  if (data.program) setProgram(data.program);
                }}
              >
                {savedPrograms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <section>
            <h2 className="font-bold text-[#1b4d3e] mb-2">درس و رنگ</h2>
            <div className="space-y-2">
              <Field
                label="نام درس"
                value={program.subjectTheme.name}
                onChange={(name) => {
                  const preset = SUBJECT_COLOR_PRESETS.find((p) => p.name === name);
                  void applySubjectTheme(name, preset?.hexColor ?? program.subjectTheme.hexColor);
                }}
              />
              <div>
                <label className="studio-label">رنگ Hex (ثابت برای این درس)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={program.subjectTheme.hexColor}
                    onChange={(e) =>
                      void applySubjectTheme(program.subjectTheme.name, e.target.value)
                    }
                    className="h-10 w-14 rounded border"
                  />
                  <input
                    className="studio-input flex-1"
                    value={program.subjectTheme.hexColor}
                    onChange={(e) =>
                      void applySubjectTheme(program.subjectTheme.name, e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {SUBJECT_COLOR_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      className="text-xs px-2 py-1 rounded text-white"
                      style={{ backgroundColor: p.hexColor }}
                      onClick={() => void applySubjectTheme(p.name, p.hexColor)}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[#1b4d3e] mb-2">سربرگ</h2>
            <div className="space-y-2">
              <Field label="Subject Name" value={program.subjectName} onChange={(v) => updateProgram({ subjectName: v })} />
              <Field label="Subject ID" value={program.subjectId} onChange={(v) => updateProgram({ subjectId: v })} />
              <Field label="Level" value={program.level} onChange={(v) => updateProgram({ level: v })} />
              <Field label="XP" value={program.xp} onChange={(v) => updateProgram({ xp: v })} />
              <Field label="Rank" value={program.rank} onChange={(v) => updateProgram({ rank: v })} />
              <Field label="Next Level XP" value={program.nextLevelXp} onChange={(v) => updateProgram({ nextLevelXp: v })} />
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[#1b4d3e] mb-2">Routine</h2>
            {program.routines.map((item, i) => (
              <div key={item.id} className="mb-2">
                <Field
                  label={`Routine ${i + 1}`}
                  value={item.label}
                  onChange={(label) =>
                    setProgram((prev) => ({
                      ...prev,
                      routines: prev.routines.map((r) => (r.id === item.id ? { ...r, label } : r)),
                    }))
                  }
                />
              </div>
            ))}
          </section>

          <section>
            <h2 className="font-bold text-[#1b4d3e] mb-2">Missions</h2>
            {program.missions.map((item, i) => (
              <div key={item.id} className="mb-2">
                <Field
                  label={`Mission ${String(i + 1).padStart(2, "0")}`}
                  value={item.label}
                  onChange={(label) =>
                    setProgram((prev) => ({
                      ...prev,
                      missions: prev.missions.map((m) => (m.id === item.id ? { ...m, label } : m)),
                    }))
                  }
                />
              </div>
            ))}
          </section>

          <section>
            <h2 className="font-bold text-[#1b4d3e] mb-2">جدول هفتگی</h2>
            {program.gridRows.map((row) => (
              <details key={row.id} className="mb-2 rounded-lg border border-[#c5ddd2] p-2">
                <summary className="cursor-pointer font-semibold text-sm">{row.dayLabel}</summary>
                <div className="mt-2 space-y-2">
                  <Field label="Routine" value={row.routine} onChange={(v) => updateGridRow(row.id, "routine", v)} />
                  <Field label="Target 1" value={row.target1} onChange={(v) => updateGridRow(row.id, "target1", v)} />
                  <Field label="Target 2" value={row.target2} onChange={(v) => updateGridRow(row.id, "target2", v)} />
                  <Field label="Target 3" value={row.target3} onChange={(v) => updateGridRow(row.id, "target3", v)} />
                  <Field label="Target 4" value={row.target4} onChange={(v) => updateGridRow(row.id, "target4", v)} />
                  <Field label="Target 5" value={row.target5} onChange={(v) => updateGridRow(row.id, "target5", v)} />
                  <Field label="Target 6" value={row.target6} onChange={(v) => updateGridRow(row.id, "target6", v)} />
                  <Field label="آیکون روز" value={row.dayIcon} onChange={(v) => updateGridRow(row.id, "dayIcon", v)} />
                </div>
              </details>
            ))}
          </section>

          <section>
            <h2 className="font-bold text-[#1b4d3e] mb-2">پانویس</h2>
            <div className="space-y-2">
              <Field label="ساعت مطالعه" value={program.weeklyReport.studyHours} onChange={(v) => updateProgram({ weeklyReport: { ...program.weeklyReport, studyHours: v } })} />
              <Field label="درصد تست" value={program.weeklyReport.testPercentage} onChange={(v) => updateProgram({ weeklyReport: { ...program.weeklyReport, testPercentage: v } })} />
              <Field label="نقاط قوت" value={program.weeklyReport.strengths} onChange={(v) => updateProgram({ weeklyReport: { ...program.weeklyReport, strengths: v } })} />
              <Field label="نقاط ضعف" value={program.weeklyReport.weaknesses} onChange={(v) => updateProgram({ weeklyReport: { ...program.weeklyReport, weaknesses: v } })} />
              <Field label="Mission هفته بعد" value={program.weeklyReport.nextWeekMission} onChange={(v) => updateProgram({ weeklyReport: { ...program.weeklyReport, nextWeekMission: v } })} />
              <Field label="یادداشت" value={program.weeklyNotes} onChange={(v) => updateProgram({ weeklyNotes: v })} multiline />
              <Field label="بازتاب" value={program.weeklyReflection} onChange={(v) => updateProgram({ weeklyReflection: v })} multiline />
              <Field label="Level هفته" value={program.subjectOfWeek.level} onChange={(v) => updateProgram({ subjectOfWeek: { ...program.subjectOfWeek, level: v } })} />
              <Field label="XP هفته" value={program.subjectOfWeek.xp} onChange={(v) => updateProgram({ subjectOfWeek: { ...program.subjectOfWeek, xp: v } })} />
              <Field label="Streak" value={program.subjectOfWeek.streak} onChange={(v) => updateProgram({ subjectOfWeek: { ...program.subjectOfWeek, streak: v } })} />
            </div>
          </section>
        </aside>

        <main className="studio-card p-3">
          <p className="no-print mb-2 text-center text-xs text-[#4a635c]">
            پیش‌نمایش زنده — متن‌ها روی قالب ثابت NEURO LAB
          </p>
          <NeuroLabTemplateCanvas program={program} />
        </main>
      </div>
    </div>
  );
}
