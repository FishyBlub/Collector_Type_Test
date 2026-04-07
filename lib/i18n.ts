import type { AxisKey, ChamberKey, Locale } from "@/types";
import { AXES, AXIS_I18N } from "@/constants/axes";
import { CHAMBERS, CHAMBER_I18N } from "@/constants/chambers";
import { ARCHETYPE_I18N } from "@/constants/archetypes";
import { SHADOW_I18N } from "@/constants/shadows";
import { UI_STRINGS } from "@/constants/ui-strings";

export function getUiStrings(locale: Locale) {
  return UI_STRINGS[locale] ?? UI_STRINGS.nl;
}

export function getAxisLabel(locale: Locale, key: AxisKey): string {
  if (locale === "nl") {
    return AXES.find((a) => a.key === key)?.label ?? key;
  }
  return AXIS_I18N[key]?.[locale as "en" | "fr"]?.label ?? AXES.find((a) => a.key === key)?.label ?? key;
}

export function getAxisQuestion(
  locale: Locale,
  key: AxisKey,
  variant: "primary" | "alt" = "primary"
): string {
  const base = AXES.find((a) => a.key === key);
  if (!base) return "";

  if (locale === "nl") {
    return variant === "alt" ? base.altQuestion : base.question;
  }

  const i18n = AXIS_I18N[key]?.[locale as "en" | "fr"];
  if (i18n) {
    return variant === "alt" ? i18n.altQuestion : i18n.question;
  }
  return variant === "alt" ? base.altQuestion : base.question;
}

export function getChamberTitle(locale: Locale, key: ChamberKey): string {
  if (locale === "nl") {
    return CHAMBERS.find((c) => c.key === key)?.title ?? key;
  }
  return CHAMBER_I18N[key]?.[locale as "en" | "fr"]?.title ?? CHAMBERS.find((c) => c.key === key)?.title ?? key;
}

export function getChamberPrompt(locale: Locale, key: ChamberKey): string {
  if (locale === "nl") {
    return CHAMBERS.find((c) => c.key === key)?.prompt ?? "";
  }
  return CHAMBER_I18N[key]?.[locale as "en" | "fr"]?.prompt ?? CHAMBERS.find((c) => c.key === key)?.prompt ?? "";
}

export function getArchetypeName(locale: Locale, nlName: string): string {
  if (locale === "nl") return nlName;
  return ARCHETYPE_I18N[nlName]?.[locale as "en" | "fr"]?.name ?? nlName;
}

export function getArchetypeMotto(locale: Locale, nlName: string, nlMotto: string): string {
  if (locale === "nl") return nlMotto;
  return ARCHETYPE_I18N[nlName]?.[locale as "en" | "fr"]?.motto ?? nlMotto;
}

export function getArchetypeDescription(locale: Locale, nlName: string, nlDesc: string): string {
  if (locale === "nl") return nlDesc;
  return ARCHETYPE_I18N[nlName]?.[locale as "en" | "fr"]?.description ?? nlDesc;
}

export function getShadowTitle(locale: Locale, id: string, nlTitle: string): string {
  if (locale === "nl") return nlTitle;
  return SHADOW_I18N[id]?.[locale as "en" | "fr"]?.title ?? nlTitle;
}

export function getShadowText(locale: Locale, id: string, nlText: string): string {
  if (locale === "nl") return nlText;
  return SHADOW_I18N[id]?.[locale as "en" | "fr"]?.text ?? nlText;
}

export function getStatusLabel(locale: Locale, status: string): string {
  const s = getUiStrings(locale);
  switch (status) {
    case "high_intensity_explorer": return s.statusHighIntensity;
    case "anchor_curator": return s.statusAnchorCurator;
    case "market_hunter": return s.statusMarketHunter;
    case "adaptive_collector": return s.statusAdaptiveCollector;
    default: return status;
  }
}
