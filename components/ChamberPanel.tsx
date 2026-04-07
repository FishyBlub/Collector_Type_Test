"use client";

import { useDNA } from "@/lib/DNAContext";
import { getChamberTitle, getChamberPrompt } from "@/lib/i18n";
import { CHAMBERS, SLOT_OPTIONS } from "@/constants/chambers";
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
    resetAll,
    report,
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
  const piecesValue = totalPieces;

  return (
    <section className="reveal rounded-[var(--radius-panel)] border border-[#e8d8bf] bg-[var(--color-panel)]/80 p-5 shadow-[0_12px_30px_rgba(46,34,20,0.12)] backdrop-blur-[6px]">
      <div className="mb-4">
        <h2 className="m-0 text-2xl">{t.inputTitle}</h2>
        <p className="mt-1 mb-4 text-ink-soft">{t.inputIntro}</p>
      </div>

      {/* Pieces picker */}
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-warm-400 bg-warm-100 px-3 py-2">
        <label className="text-[0.82rem] font-bold text-[#665447]">{t.piecesLabel}</label>
        <select
          value={piecesValue}
          onChange={(e) => setSlotsPerChamber(Number(e.target.value) / 3)}
          className="min-w-[190px] rounded-full border border-warm-500 bg-[#fff8ec] px-3 py-1.5 font-bold text-warm-800"
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
      <nav className="mb-3 flex flex-wrap gap-2">
        {CHAMBERS.map((ch) => (
          <button
            key={ch.key}
            type="button"
            onClick={() => setActiveChamber(ch.key as ChamberKey)}
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
          className="cursor-pointer rounded-full border border-[#d9c2a0] bg-[#fef6ea] px-4 py-2 text-sm font-bold text-[#4f4136] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {t.prevChamber}
        </button>
        <button
          type="button"
          onClick={goToNext}
          disabled={chamberIndex >= CHAMBERS.length - 1}
          className="cursor-pointer rounded-full border border-[#d9c2a0] bg-[#fef6ea] px-4 py-2 text-sm font-bold text-[#4f4136] disabled:cursor-not-allowed disabled:opacity-45"
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
          className="cursor-pointer rounded-full border border-transparent bg-gradient-to-br from-[#be4033] to-[#cf7a2a] px-4 py-2.5 font-bold text-white"
        >
          {t.analyzeBtn}
        </button>
        <button
          type="button"
          onClick={loadDemo}
          className="cursor-pointer rounded-full border border-[#d9c2a0] bg-[#fef6ea] px-4 py-2.5 font-bold text-[#4f4136]"
        >
          {t.demoBtn}
        </button>
        <button
          type="button"
          onClick={resetAll}
          className="cursor-pointer rounded-full border border-[#d9c2a0] bg-[#fef6ea] px-4 py-2.5 font-bold text-[#4f4136]"
        >
          {t.resetBtn}
        </button>
      </div>

      {report === null && (
        <p className="mt-3 min-h-[1.3rem] text-[0.92rem] font-semibold text-[#8e2d26]" />
      )}
    </section>
  );
}
