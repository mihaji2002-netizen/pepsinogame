import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fa-IR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
