"use client";

import { useCallback, useEffect, useState } from "react";
import { generateSubjectPalette, normalizeHex } from "@/lib/program/color-palette";
import {
  createEmptyProgram,
  LAB_OPTIONS,
  PLANNER_BACKGROUNDS,
  SUBJECT_COLOR_PRESETS,
} from "@/lib/program/defaults";
import type { WeeklyProgram } from "@/lib/program/types";
import WeeklyPlannerPreview from "./WeeklyPlannerPreview";

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const cls = "input-field text-sm";
  return (
    <div>
      <label className="label text-xs">{label}</label>
      {multiline ? (
        <textarea
          className={`${cls} min-h-[72px] resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={cls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

export default function ProgramBuilderPanel() {
  const [program, setProgram] = useState<WeeklyProgram>(() => createEmptyProgram());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [savedPrograms, setSavedPrograms] = useState<
    Array<{ id: string; name: string; subject_name: string | null }>
  >([]);

  const updateProgram = useCallback((patch: Partial<WeeklyProgram>) => {
    setProgram((prev) => ({ ...prev, ...patch }));
  }, []);

  const loadSavedList = useCallback(async () => {
    const res = await fetch("/api/admin/programs");
    if (res.ok) {
      const data = await res.json();
      setSavedPrograms(data.programs ?? []);
    }
  }, []);

  useEffect(() => {
    loadSavedList();
  }, [loadSavedList]);

  async function applySubjectTheme(name: string, hex: string) {
    const normalized = normalizeHex(hex);
    let palette = generateSubjectPalette(normalized);

    try {
      const res = await fetch(`/api/admin/programs/theme?name=${encodeURIComponent(name)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.theme?.palette) {
          palette = data.theme.palette;
        }
      }
    } catch {
      // use generated palette
    }

    updateProgram({
      subjectTheme: { name, hexColor: normalized, palette },
    });
  }

  async function saveProgram() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/programs", {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-lg">برنامه‌ساز هفتگی</h2>
          <p className="text-sm text-slate-500 mt-1">
            محتوا را تایپ کنید — پیش‌نمایش زنده روی قالب NEURO LAB
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary text-sm"
            onClick={() => setProgram(createEmptyProgram())}
          >
            برنامه جدید
          </button>
          <button type="button" className="btn-primary text-sm" onClick={saveProgram} disabled={saving}>
            {saving ? "در حال ذخیره..." : "ذخیره برنامه"}
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-xl text-sm">{message}</div>
      )}

      {savedPrograms.length > 0 && (
        <div className="card-soft p-3">
          <label className="label text-xs">برنامه‌های ذخیره‌شده</label>
          <select
            className="input-field mt-1"
            value={program.id}
            onChange={async (e) => {
              const id = e.target.value;
              const res = await fetch(`/api/admin/programs?id=${encodeURIComponent(id)}`);
              const data = await res.json();
              if (res.ok && data.program) setProgram(data.program);
            }}
          >
            {savedPrograms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.subject_name ? `· ${p.subject_name}` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="card space-y-4 max-h-[85vh] overflow-y-auto">
          <section>
            <h3 className="font-bold text-sm mb-3 text-emerald-800">۱. درس و رنگ</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="نام درس (مثلاً زیست)"
                value={program.subjectTheme.name}
                onChange={(name) => {
                  const preset = SUBJECT_COLOR_PRESETS.find((p) => p.name === name);
                  void applySubjectTheme(name, preset?.hexColor ?? program.subjectTheme.hexColor);
                }}
                placeholder="زیست"
              />
              <div>
                <label className="label text-xs">رنگ ثابت درس (Hex)</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={program.subjectTheme.hexColor}
                    onChange={(e) => void applySubjectTheme(program.subjectTheme.name, e.target.value)}
                    className="h-10 w-14 rounded-lg border border-slate-200"
                  />
                  <input
                    className="input-field flex-1"
                    value={program.subjectTheme.hexColor}
                    onChange={(e) => void applySubjectTheme(program.subjectTheme.name, e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {SUBJECT_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      className="text-xs px-2 py-1 rounded-lg border border-slate-200 hover:border-emerald-400"
                      style={{ backgroundColor: preset.hexColor, color: "#fff" }}
                      onClick={() => void applySubjectTheme(preset.name, preset.hexColor)}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-3 text-emerald-800">۲. پس‌زمینه برنامه</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {PLANNER_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => updateProgram({ backgroundId: bg.id })}
                  className={`text-right rounded-xl border p-3 transition ${
                    program.backgroundId === bg.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="font-bold text-sm">{bg.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{bg.description}</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-3 text-emerald-800">۳. سربرگ Subject</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="نام Subject"
                value={program.subjectName}
                onChange={(v) => updateProgram({ subjectName: v })}
                placeholder="آوا کریمی"
              />
              <Field
                label="Subject ID"
                value={program.subjectId}
                onChange={(v) => updateProgram({ subjectId: v })}
                placeholder="N-021"
              />
              <div>
                <label className="label text-xs">Lab</label>
                <select
                  className="input-field"
                  value={program.lab}
                  onChange={(e) =>
                    updateProgram({ lab: e.target.value as WeeklyProgram["lab"] })
                  }
                >
                  {LAB_OPTIONS.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.label}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Level" value={program.level} onChange={(v) => updateProgram({ level: v })} />
              <Field label="XP" value={program.xp} onChange={(v) => updateProgram({ xp: v })} />
              <Field label="Rank" value={program.rank} onChange={(v) => updateProgram({ rank: v })} />
              <Field
                label="Next Level XP"
                value={program.nextLevelXp}
                onChange={(v) => updateProgram({ nextLevelXp: v })}
              />
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-3 text-emerald-800">۴. Routine روزانه</h3>
            <div className="space-y-2">
              {program.routines.map((item, index) => (
                <Field
                  key={item.id}
                  label={`Routine ${index + 1}`}
                  value={item.label}
                  onChange={(label) =>
                    setProgram((prev) => ({
                      ...prev,
                      routines: prev.routines.map((r) =>
                        r.id === item.id ? { ...r, label } : r,
                      ),
                    }))
                  }
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-3 text-emerald-800">۵. Weekly Missions</h3>
            <div className="space-y-2">
              {program.missions.map((item, index) => (
                <Field
                  key={item.id}
                  label={`Mission ${String(index + 1).padStart(2, "0")}`}
                  value={item.label}
                  onChange={(label) =>
                    setProgram((prev) => ({
                      ...prev,
                      missions: prev.missions.map((m) =>
                        m.id === item.id ? { ...m, label } : m,
                      ),
                    }))
                  }
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-3 text-emerald-800">۶. جدول هفتگی</h3>
            <div className="space-y-4">
              {program.gridRows.map((row) => (
                <div key={row.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="font-bold text-sm mb-2">{row.dayLabel}</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Field
                      label="Routine"
                      value={row.routine}
                      onChange={(v) => updateGridRow(row.id, "routine", v)}
                    />
                    <Field
                      label="Target 1"
                      value={row.target1}
                      onChange={(v) => updateGridRow(row.id, "target1", v)}
                    />
                    <Field
                      label="Target 2"
                      value={row.target2}
                      onChange={(v) => updateGridRow(row.id, "target2", v)}
                    />
                    <Field
                      label="Target 3"
                      value={row.target3}
                      onChange={(v) => updateGridRow(row.id, "target3", v)}
                    />
                    <Field
                      label="Target 4"
                      value={row.target4}
                      onChange={(v) => updateGridRow(row.id, "target4", v)}
                    />
                    <Field
                      label="Target 5"
                      value={row.target5}
                      onChange={(v) => updateGridRow(row.id, "target5", v)}
                    />
                    <Field
                      label="Target 6"
                      value={row.target6}
                      onChange={(v) => updateGridRow(row.id, "target6", v)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-3 text-emerald-800">۷. پانویس هفته</h3>
            <div className="grid gap-3">
              <Field
                label="ساعت مطالعه"
                value={program.weeklyReport.studyHours}
                onChange={(v) =>
                  updateProgram({ weeklyReport: { ...program.weeklyReport, studyHours: v } })
                }
              />
              <Field
                label="درصد تست"
                value={program.weeklyReport.testPercentage}
                onChange={(v) =>
                  updateProgram({ weeklyReport: { ...program.weeklyReport, testPercentage: v } })
                }
              />
              <Field
                label="نقاط قوت"
                value={program.weeklyReport.strengths}
                onChange={(v) =>
                  updateProgram({ weeklyReport: { ...program.weeklyReport, strengths: v } })
                }
              />
              <Field
                label="نقاط ضعف"
                value={program.weeklyReport.weaknesses}
                onChange={(v) =>
                  updateProgram({ weeklyReport: { ...program.weeklyReport, weaknesses: v } })
                }
              />
              <Field
                label="Mission هفته بعد"
                value={program.weeklyReport.nextWeekMission}
                onChange={(v) =>
                  updateProgram({ weeklyReport: { ...program.weeklyReport, nextWeekMission: v } })
                }
              />
              <Field
                label="یادداشت هفتگی"
                value={program.weeklyNotes}
                onChange={(v) => updateProgram({ weeklyNotes: v })}
                multiline
              />
              <Field
                label="بازتاب هفتگی"
                value={program.weeklyReflection}
                onChange={(v) => updateProgram({ weeklyReflection: v })}
                multiline
              />
              <Field
                label="Level هفته"
                value={program.subjectOfWeek.level}
                onChange={(v) =>
                  updateProgram({ subjectOfWeek: { ...program.subjectOfWeek, level: v } })
                }
              />
              <Field
                label="XP هفته"
                value={program.subjectOfWeek.xp}
                onChange={(v) =>
                  updateProgram({ subjectOfWeek: { ...program.subjectOfWeek, xp: v } })
                }
              />
              <Field
                label="Streak"
                value={program.subjectOfWeek.streak}
                onChange={(v) =>
                  updateProgram({ subjectOfWeek: { ...program.subjectOfWeek, streak: v } })
                }
              />
            </div>
          </section>
        </div>

        <div className="card-soft p-3 sticky top-20 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">پیش‌نمایش زنده</h3>
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={() => window.print()}
            >
              چاپ
            </button>
          </div>
          <WeeklyPlannerPreview program={program} />
        </div>
      </div>
    </div>
  );
}
