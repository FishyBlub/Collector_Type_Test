"use client";

import { useDNA } from "@/lib/DNAContext";
import { getChamberTitle, getChamberPrompt } from "@/lib/i18n";
import { CHAMBERS, SLOT_OPTIONS } from "@/constants/chambers";
import { PANEL_CLASS, BUTTON_CLASS, BUTTON_PRIMARY_CLASS } from "@/lib/utils";
import type { ChamberKey } from "@/types";
import ObjectCard from "./ObjectCard";

export default function ChamberPanel() {
  const {
    locale,
    t,
    entries,
    slotsPerChamber,
    setSlotsPerChamber,
    activeChamber,
    setActiveChamber,
    saveStatus,
    runAnalysis,
    loadDemo,
    demoLoading,
    demoError,
    resetAll,
  } = useDNA();

  const chamberIndex = CHAMBERS.findIndex((c) => c.key === activeChamber);

  const chamberEntries = entries.filter(
    (e) => e.chamber === activeChamber && e.slot <= slotsPerChamber
  );

  const linkedCounts = new Map<string, number>();
  const active = entries.filter((e) => e.slot <= slotsPerChamber);
  for (const e of active) {
    if (e.selectedArtworkId) {
      linkedCounts.set(e.selectedArtworkId, (linkedCounts.get(e.selectedArtworkId) || 0) + 1);
    }
  }

  const goToPrev = () => {
    if (chamberIndex > 0) setActiveChamber(CHAMBERS[chamberIndex - 1].key);
  };
  const goToNext = () => {
    if (chamberIndex < CHAMBERS.length - 1) setActiveChamber(CHAMBERS[chamberIndex + 1].key);
  };

  const totalPieces = slotsPerChamber * 3;

  return (
    <section className={PANEL_CLASS} data-testid="chamber-panel">
      <div className="mb-4">
        <h2 className="m-0 text-2xl">{t.inputTitle}</h2>
        <p className="mt-1 mb-4 text-ink-soft">{t.inputIntro}</p>
      </div>

      {/* Pieces picker */}
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-warm-400 bg-warm-100 px-3 py-2">
        <label className="text-[0.82rem] font-bold text-[#665447]">{t.piecesLabel}</label>
        <select
          value={totalPieces}
          onChange={(e) => setSlotsPerChamber(Number(e.target.value) / 3)}
          className="min-w-[190px] rounded-full border border-warm-500 bg-[#fff8ec] px-3 py-1.5 font-bold text-warm-800"
          data-testid="pieces-select"
        >
          {SLOT_OPTIONS.map((s) => (
            <option key={s} value={s * 3}>
              {s * 3 === 15 ? t.pieces15 : s * 3 === 12 ? t.pieces12 : t.pieces9}
            </option>
          ))}
        </select>
      </div>

      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-[0.85rem] text-[#605246]">
          {t.entryHint.replace("{n}", String(chamberIndex + 1))}
        </p>
        {saveStatus && (
          <p className="m-0 text-[0.85rem] font-semibold text-[#1f6a62]">{saveStatus}</p>
        )}
      </div>

      {/* Chamber tabs */}
      <nav className="mb-3 flex flex-wrap gap-2" data-testid="chamber-tabs">
        {CHAMBERS.map((ch) => (
          <button
            key={ch.key}
            type="button"
            onClick={() => {
              // ch.key is typed as string from ChamberConfig; it always matches ChamberKey
              setActiveChamber(ch.key as ChamberKey);
            }}
            data-testid={`chamber-tab-${ch.key}`}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-[0.84rem] font-bold ${
              activeChamber === ch.key
                ? "border-accent-2 bg-accent-2 text-white"
                : "border-[#d2b895] bg-[#fdf3e3] text-[#5d4b3b]"
            }`}
          >
            {getChamberTitle(locale, ch.key)}
          </button>
        ))}
      </nav>

      {/* Chamber navigation */}
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={goToPrev}
          disabled={chamberIndex <= 0}
          className={`${BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-45`}
          data-testid="prev-chamber"
        >
          {t.prevChamber}
        </button>
        <button
          type="button"
          onClick={goToNext}
          disabled={chamberIndex >= CHAMBERS.length - 1}
          className={`${BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-45`}
          data-testid="next-chamber"
        >
          {t.nextChamber}
        </button>
      </div>

      {/* Active chamber content */}
      <div className="rounded-2xl border border-line bg-[#fffaf1] p-4">
        <h3 className="m-0 text-lg">{getChamberTitle(locale, activeChamber)}</h3>
        <p className="mt-1 mb-4 text-[0.95rem] text-[#66584c]">
          {getChamberPrompt(locale, activeChamber)}
        </p>

        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {chamberEntries.map((entry) => (
            <ObjectCard
              key={entry.id}
              entry={entry}
              linkedCount={entry.selectedArtworkId ? linkedCounts.get(entry.selectedArtworkId) || 1 : 0}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => runAnalysis()}
          className={BUTTON_PRIMARY_CLASS}
          data-testid="analyze-btn"
        >
          {t.analyzeBtn}
        </button>
        <button
          type="button"
          onClick={() => { void loadDemo(); }}
          disabled={demoLoading}
          className={`${BUTTON_CLASS} py-2.5 disabled:cursor-not-allowed disabled:opacity-45`}
          data-testid="demo-btn"
        >
          {demoLoading ? t.demoLoading : t.demoBtn}
        </button>
        <button
          type="button"
          onClick={resetAll}
          className={`${BUTTON_CLASS} py-2.5`}
          data-testid="reset-btn"
        >
          {t.resetBtn}
        </button>
      </div>

      {demoError && (
        <p className="mt-2 rounded-lg bg-warn-bg px-2 py-1.5 text-[0.78rem] text-warn-text" data-testid="demo-error">
          {demoError}
        </p>
      )}

    </section>
  );
}
