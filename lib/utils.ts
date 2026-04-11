import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `aw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const PANEL_CLASS =
  "reveal rounded-[var(--radius-panel)] border border-panel-border bg-panel/80 p-5 shadow-[0_12px_30px_rgba(46,34,20,0.12)] backdrop-blur-[6px]";

export const CARD_CLASS =
  "rounded-[var(--radius-card)] border border-card-border bg-card-inner p-4";

export const FORM_CLASS =
  "grid gap-2 rounded-xl border border-form-border bg-form-bg p-3";

export const INPUT_CLASS =
  "w-full rounded-[var(--radius-input)] border border-warm-500 bg-input-bg px-2 py-1.5 text-ink";

export const BUTTON_CLASS =
  "cursor-pointer rounded-full border border-btn-border bg-btn-bg px-4 py-2 text-sm font-bold text-btn-text";

export const BUTTON_SMALL_CLASS =
  "cursor-pointer rounded-full border border-btn-border bg-btn-bg px-2.5 py-1 text-[0.75rem] font-bold text-btn-text";

export const BUTTON_DANGER_CLASS =
  "cursor-pointer rounded-full border border-btn-danger-border bg-btn-danger-bg px-2.5 py-1 text-[0.75rem] font-bold text-btn-danger-text hover:bg-btn-danger-hover";

export const BUTTON_PRIMARY_CLASS =
  "cursor-pointer rounded-full border border-transparent bg-gradient-to-br from-[#be4033] to-[#cf7a2a] px-4 py-2.5 font-bold text-white";

export const LABEL_CLASS = "text-[0.78rem] text-label";
