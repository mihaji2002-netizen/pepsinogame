"use client";

import { useMemo, useState } from "react";
import { paletteCssVars } from "@/lib/program/color-palette";
import type { WeeklyProgram } from "@/lib/program/types";
import {
  FOOTER_FIELDS,
  GRID_COL_KEYS,
  HEADER_FIELDS,
  MISSION_FIELDS,
  ROUTINE_FIELDS,
  TEMPLATE_FALLBACK,
  TEMPLATE_IMAGE,
  gridCellField,
  type OverlayField,
} from "@/lib/program/template-layout";
import "@/styles/program-studio.css";

function fieldValue(program: WeeklyProgram, id: string): string {
  if (id === "subjectName") return program.subjectName || program.subjectTheme.name;
  if (id === "subjectId") return program.subjectId;
  if (id === "level") return program.level;
  if (id === "xp") return program.xp;
  if (id === "rank") return program.rank;
  if (id === "nextLevelXp") return program.nextLevelXp;

  const routineMatch = id.match(/^routine_(\d+)$/);
  if (routineMatch) return program.routines[Number(routineMatch[1])]?.label ?? "";

  const missionMatch = id.match(/^mission_(\d+)$/);
  if (missionMatch) return program.missions[Number(missionMatch[1])]?.label ?? "";

  const gridMatch = id.match(/^grid_(\d+)_(.+)$/);
  if (gridMatch) {
    const row = program.gridRows[Number(gridMatch[1])];
    if (!row) return "";
    const key = gridMatch[2];
    if (key === "dayIcon") return row.dayIcon;
    return String(row[key as keyof typeof row] ?? "");
  }

  const reportMap: Record<string, string> = {
    studyHours: program.weeklyReport.studyHours,
    testPercentage: program.weeklyReport.testPercentage,
    strengths: program.weeklyReport.strengths,
    weaknesses: program.weeklyReport.weaknesses,
    nextWeekMission: program.weeklyReport.nextWeekMission,
    weeklyNotes: program.weeklyNotes,
    weeklyReflection: program.weeklyReflection,
    weekLevel: program.subjectOfWeek.level,
    weekXp: program.subjectOfWeek.xp,
    weekStreak: program.subjectOfWeek.streak,
  };
  return reportMap[id] ?? "";
}

function OverlayText({
  field,
  value,
  accent,
}: {
  field: OverlayField;
  value: string;
  accent: string;
}) {
  if (!value) return null;
  return (
    <div
      className={`template-overlay ${field.english ? "template-en" : "template-fa"}`}
      style={{
        left: `${field.left}%`,
        top: `${field.top}%`,
        width: `${field.width}%`,
        height: `${field.height}%`,
        fontSize: field.fontSize ? `${field.fontSize}px` : undefined,
        textAlign: field.align ?? "right",
        color: accent,
        WebkitLineClamp: field.multiline ? 4 : 2,
      }}
    >
      {value}
    </div>
  );
}

export default function NeuroLabTemplateCanvas({ program }: { program: WeeklyProgram }) {
  const [imgSrc, setImgSrc] = useState(TEMPLATE_IMAGE);
  const palette = program.subjectTheme.palette;
  const accent = palette.dark;

  const gridFields = useMemo(() => {
    const fields: OverlayField[] = [];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < GRID_COL_KEYS.length; col++) {
        fields.push(gridCellField(row, col));
      }
    }
    return fields;
  }, []);

  const allFields = useMemo(
    () => [...HEADER_FIELDS, ...ROUTINE_FIELDS, ...MISSION_FIELDS, ...gridFields, ...FOOTER_FIELDS],
    [gridFields],
  );

  return (
    <div
      className="template-canvas-root"
      style={paletteCssVars(palette) as React.CSSProperties}
    >
      <div className="template-canvas">
        <img
          src={imgSrc}
          alt="NEURO LAB Weekly Planner"
          className="template-bg"
          onError={() => setImgSrc(TEMPLATE_FALLBACK)}
        />
        <div className="template-overlays">
          {allFields.map((field) => (
            <OverlayText
              key={field.id}
              field={field}
              value={fieldValue(program, field.id)}
              accent={accent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
