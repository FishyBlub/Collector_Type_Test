"use client";

import { useDNA } from "@/lib/DNAContext";
import type { Locale } from "@/types";

export default function HeroSection() {
  const { locale, setLocale, t, getActiveEntries, slotsPerChamber } = useDNA();

  const active = getActiveEntries();
  const filled = active.filter((e) => e.selectedArtworkId).length;
  const total = slotsPerChamber * 3;

  const badge = t.completionBadge
    .replace("{count}", String(filled))
    .replace("{total}", String(total));

  return (
    <header className="reveal rounded-[var(--radius-panel)] border border-[#e8d8bf] bg-[var(--color-panel)]/80 p-7 shadow-[0_12px_30px_rgba(46,34,20,0.12)] backdrop-blur-[6px]">
      <p className="m-0 text-[0.85rem] font-bold uppercase tracking-[0.08em] text-accent-2">
        Collector DNA · The Narrative Engine
      </p>

      <div className="mt-2.5 inline-flex items-center gap-2">
        <label htmlFor="lang-select" className="text-[0.8rem] text-warm-700">
          {t.languageLabel}
        </label>
        <select
          id="lang-select"
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          className="rounded-full border border-warm-500 bg-bg px-2.5 py-1 text-[0.8rem] text-warm-800"
        >
          <option value="nl">Nederlands</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <h1 className="mt-2 mb-3 text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.13]">
        {t.heroTitle}
      </h1>

      <p className="m-0 max-w-[76ch]">{t.heroIntro}</p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <span className="rounded-full border border-warm-300 bg-warm-200 px-3 py-1.5 text-[0.88rem] text-warm-900">
          {badge}
        </span>
        <span className="rounded-full border border-warm-300 bg-warm-200 px-3 py-1.5 text-[0.88rem] text-warm-900">
          {t.heroMeta}
        </span>
      </div>
    </header>
  );
}
