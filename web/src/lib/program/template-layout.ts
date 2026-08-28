/** Fixed overlay positions (% of template width/height) for NEURO LAB planner image */

export const TEMPLATE_IMAGE = "/program/neuro-lab-template.png";
export const TEMPLATE_FALLBACK = "/program/neuro-lab-template.svg";
export const TEMPLATE_WIDTH = 3300;
export const TEMPLATE_HEIGHT = 2550;

export type OverlayField = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize?: number;
  english?: boolean;
  align?: "right" | "center" | "left";
  multiline?: boolean;
};

export const HEADER_FIELDS: OverlayField[] = [
  { id: "subjectName", left: 34.5, top: 9.2, width: 22, height: 2.2, fontSize: 14, align: "right" },
  { id: "subjectId", left: 34.5, top: 11.8, width: 22, height: 2, fontSize: 12, english: true, align: "left" },
  { id: "level", left: 60.5, top: 10.2, width: 6.5, height: 2.5, fontSize: 13, english: true, align: "center" },
  { id: "xp", left: 67.5, top: 10.2, width: 6.5, height: 2.5, fontSize: 13, english: true, align: "center" },
  { id: "rank", left: 74.5, top: 10.2, width: 6.5, height: 2.5, fontSize: 13, english: true, align: "center" },
  { id: "nextLevelXp", left: 60, top: 14.2, width: 21, height: 2, fontSize: 11, english: true, align: "center" },
];

export const ROUTINE_FIELDS: OverlayField[] = Array.from({ length: 6 }, (_, i) => ({
  id: `routine_${i}`,
  left: 4.2,
  top: 26.8 + i * 2.35,
  width: 14.5,
  height: 2,
  fontSize: 9,
  align: "right" as const,
}));

export const MISSION_FIELDS: OverlayField[] = Array.from({ length: 7 }, (_, i) => ({
  id: `mission_${i}`,
  left: 5.5,
  top: 43.2 + i * 2.55,
  width: 13,
  height: 2,
  fontSize: 9,
  align: "right" as const,
}));

export const GRID_BOUNDS = {
  left: 19.5,
  top: 24.8,
  width: 78.5,
  height: 48.5,
  rows: 7,
  cols: 8,
};

export const GRID_COL_KEYS = [
  "routine",
  "target6",
  "target5",
  "target4",
  "target3",
  "target2",
  "target1",
  "dayIcon",
] as const;

export const FOOTER_FIELDS: OverlayField[] = [
  { id: "studyHours", left: 3.5, top: 76.5, width: 18, height: 1.8, fontSize: 9, align: "right" },
  { id: "testPercentage", left: 3.5, top: 78.8, width: 18, height: 1.8, fontSize: 9, align: "right" },
  { id: "strengths", left: 3.5, top: 81, width: 18, height: 2.2, fontSize: 8, align: "right", multiline: true },
  { id: "weaknesses", left: 3.5, top: 84, width: 18, height: 2.2, fontSize: 8, align: "right", multiline: true },
  { id: "nextWeekMission", left: 3.5, top: 87, width: 18, height: 2.5, fontSize: 8, align: "right", multiline: true },
  { id: "weeklyNotes", left: 27, top: 77, width: 20, height: 12, fontSize: 9, align: "right", multiline: true },
  { id: "weeklyReflection", left: 50, top: 77, width: 20, height: 12, fontSize: 9, align: "right", multiline: true },
  { id: "weekLevel", left: 74, top: 77.5, width: 10, height: 2, fontSize: 10, english: true, align: "center" },
  { id: "weekXp", left: 74, top: 81, width: 10, height: 2, fontSize: 10, english: true, align: "center" },
  { id: "weekStreak", left: 74, top: 84.5, width: 10, height: 2, fontSize: 10, english: true, align: "center" },
];

export function gridCellField(row: number, col: number): OverlayField {
  const { left, top, width, height, rows, cols } = GRID_BOUNDS;
  const cellW = width / cols;
  const cellH = height / (rows + 0.6);
  const rowTop = top + cellH * 1.05 + row * cellH;
  return {
    id: `grid_${row}_${GRID_COL_KEYS[col]}`,
    left: left + col * cellW + 0.15,
    top: rowTop,
    width: cellW - 0.3,
    height: cellH - 0.35,
    fontSize: col === 7 ? 11 : 8,
    align: col === 7 ? "center" : "right",
    english: col === 7,
  };
}
