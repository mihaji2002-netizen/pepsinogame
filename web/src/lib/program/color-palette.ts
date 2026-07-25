import type { SubjectPalette } from "./types";

function clamp(n: number, min = 0, max = 255) {
  return Math.min(max, Math.max(min, n));
}

export function normalizeHex(hex: string): string {
  const raw = hex.trim().replace(/^#/, "");
  if (raw.length === 3) {
    return `#${raw
      .split("")
      .map((c) => c + c)
      .join("")}`.toUpperCase();
  }
  if (raw.length === 6) return `#${raw}`.toUpperCase();
  return "#1B4D3E";
}

function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex).slice(1);
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((v) => clamp(Math.round(v)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function mix(hex: string, target: string, amount: number): string {
  const [r1, g1, b1] = hexToRgb(hex);
  const [r2, g2, b2] = hexToRgb(target);
  return rgbToHex(
    r1 + (r2 - r1) * amount,
    g1 + (g2 - g1) * amount,
    b1 + (b2 - b1) * amount,
  );
}

export function generateSubjectPalette(hexColor: string): SubjectPalette {
  const primary = normalizeHex(hexColor);
  const dark = mix(primary, "#000000", 0.35);
  const header = mix(primary, "#0B1F18", 0.55);
  const light = mix(primary, "#FFFFFF", 0.72);
  const accent = mix(primary, "#FFFFFF", 0.25);
  const muted = mix(primary, "#FFFFFF", 0.88);
  const border = mix(primary, "#FFFFFF", 0.45);

  return { primary, dark, light, accent, muted, header, border };
}

export function paletteCssVars(palette: SubjectPalette): Record<string, string> {
  return {
    "--planner-primary": palette.primary,
    "--planner-dark": palette.dark,
    "--planner-light": palette.light,
    "--planner-accent": palette.accent,
    "--planner-muted": palette.muted,
    "--planner-header": palette.header,
    "--planner-border": palette.border,
  };
}
