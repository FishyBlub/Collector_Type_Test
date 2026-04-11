import type { AxisKey, ChamberKey, Locale, StatusLabel } from "@/types";
import { AXES, AXIS_I18N } from "@/constants/axes";
import { CHAMBERS, CHAMBER_I18N } from "@/constants/chambers";
import { ARCHETYPE_I18N } from "@/constants/archetypes";
import { SHADOW_I18N } from "@/constants/shadows";
import { UI_STRINGS } from "@/constants/ui-strings";

type TranslationLocale = "en" | "fr";

function translationKey(locale: Locale): TranslationLocale {
  return locale === "fr" ? "fr" : "en";
}

export function getUiStrings(locale: Locale) {
  return UI_STRINGS[locale] ?? UI_STRINGS.nl;
}

export function getAxisLabel(locale: Locale, key: AxisKey): string {
  if (locale === "nl") {
    return AXES.find((a) => a.key === key)?.label ?? key;
  }
  const tl = translationKey(locale);
  return AXIS_I18N[key]?.[tl]?.label ?? AXES.find((a) => a.key === key)?.label ?? key;
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

  const tl = translationKey(locale);
  const i18n = AXIS_I18N[key]?.[tl];
  if (i18n) {
    return variant === "alt" ? i18n.altQuestion : i18n.question;
  }
  return variant === "alt" ? base.altQuestion : base.question;
}

export function getChamberTitle(locale: Locale, key: ChamberKey): string {
  if (locale === "nl") {
    return CHAMBERS.find((c) => c.key === key)?.title ?? key;
  }
  const tl = translationKey(locale);
  return CHAMBER_I18N[key]?.[tl]?.title ?? CHAMBERS.find((c) => c.key === key)?.title ?? key;
}

export function getChamberPrompt(locale: Locale, key: ChamberKey): string {
  if (locale === "nl") {
    return CHAMBERS.find((c) => c.key === key)?.prompt ?? "";
  }
  const tl = translationKey(locale);
  return CHAMBER_I18N[key]?.[tl]?.prompt ?? CHAMBERS.find((c) => c.key === key)?.prompt ?? "";
}

export function getArchetypeName(locale: Locale, nlName: string): string {
  if (locale === "nl") return nlName;
  const tl = translationKey(locale);
  return ARCHETYPE_I18N[nlName]?.[tl]?.name ?? nlName;
}

export function getArchetypeMotto(locale: Locale, nlName: string, nlMotto: string): string {
  if (locale === "nl") return nlMotto;
  const tl = translationKey(locale);
  return ARCHETYPE_I18N[nlName]?.[tl]?.motto ?? nlMotto;
}

export function getArchetypeDescription(locale: Locale, nlName: string, nlDesc: string): string {
  if (locale === "nl") return nlDesc;
  const tl = translationKey(locale);
  return ARCHETYPE_I18N[nlName]?.[tl]?.description ?? nlDesc;
}

export function getShadowTitle(locale: Locale, id: string, nlTitle: string): string {
  if (locale === "nl") return nlTitle;
  const tl = translationKey(locale);
  return SHADOW_I18N[id]?.[tl]?.title ?? nlTitle;
}

export function getShadowText(locale: Locale, id: string, nlText: string): string {
  if (locale === "nl") return nlText;
  const tl = translationKey(locale);
  return SHADOW_I18N[id]?.[tl]?.text ?? nlText;
}

export function getStatusLabel(locale: Locale, status: StatusLabel): string {
  const s = getUiStrings(locale);
  switch (status) {
    case "high_intensity_explorer": return s.statusHighIntensity;
    case "anchor_curator": return s.statusAnchorCurator;
    case "market_hunter": return s.statusMarketHunter;
    case "adaptive_collector": return s.statusAdaptiveCollector;
    default: return status;
  }
}
