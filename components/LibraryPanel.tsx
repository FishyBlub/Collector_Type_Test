"use client";

import { useCallback, useState } from "react";
import { useDNA } from "@/lib/DNAContext";
import { PANEL_CLASS, FORM_CLASS, BUTTON_SMALL_CLASS } from "@/lib/utils";
import ArtworkCard from "./ArtworkCard";
import PdfUploadForm from "./PdfUploadForm";
import ScrapeForm from "./ScrapeForm";
import ImageUploadForm from "./ImageUploadForm";

export default function LibraryPanel() {
  const {
    t,
    artworks,
    clearArtworks,
    entries,
    slotsPerChamber,
    activeChamber,
    assignArtwork,
  } = useDNA();

  const [searchQuery, setSearchQuery] = useState("");

  const findTargetEntry = useCallback(() => {
    const active = entries.filter((e) => e.slot <= slotsPerChamber);
    const chamberEntries = active.filter((e) => e.chamber === activeChamber);
    return chamberEntries.find((e) => !e.selectedArtworkId) ?? active.find((e) => !e.selectedArtworkId) ?? null;
  }, [entries, slotsPerChamber, activeChamber]);

  const handleAssign = useCallback(
    (artworkId: string) => {
      const target = findTargetEntry();
      if (target) assignArtwork(target.id, artworkId);
    },
    [findTargetEntry, assignArtwork]
  );

  const query = searchQuery.toLowerCase().trim();
  const filtered = query
    ? artworks.filter(
        (a) =>
          a.artworkTitle.toLowerCase().includes(query) ||
          a.artistName.toLowerCase().includes(query) ||
          a.source.toLowerCase().includes(query)
      )
    : artworks;

  const target = findTargetEntry();
  const assignLabel = target
    ? t.assignForSlot.replace("{chamber}", target.chamber).replace("{slot}", String(target.slot))
    : t.selectFromLibrary;

  const countText = query
    ? t.artworkCountFiltered
        .replace("{shown}", String(filtered.length))
        .replace("{total}", String(artworks.length))
    : t.artworkCount.replace("{count}", String(artworks.length));

  return (
    <section className={PANEL_CLASS} data-testid="library-panel">
      <div className="mb-4">
        <h2 className="m-0 text-2xl">{t.libraryTitle}</h2>
        <p className="mt-1 mb-4 text-ink-soft">{t.libraryIntro}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(250px,320px)_minmax(0,1fr)]">
        <div className="grid gap-2.5">
          <ImageUploadForm />
          <PdfUploadForm />
          <ScrapeForm />
        </div>

        <div className={FORM_CLASS}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="m-0 text-lg">{t.artworkListTitle}</h3>
            <button
              type="button"
              onClick={clearArtworks}
              className={BUTTON_SMALL_CLASS}
              data-testid="clear-artworks"
            >
              {t.clearArtworkList}
            </button>
          </div>

          <p className="mt-1 mb-0 text-[0.85rem] text-ink-soft">{countText}</p>

          <div className="mt-2 mb-2">
            <label htmlFor="artwork-search" className="text-[0.74rem] font-bold text-warm-700">{t.artworkSearchLabel}</label>
            <input
              id="artwork-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.artworkSearchPlaceholder}
              className="mt-0.5 w-full rounded-[9px] border border-warm-500 bg-card-inner px-2 py-1.5 text-[0.8rem] text-warm-800 focus-visible:outline-2 focus-visible:outline-accent-2"
              data-testid="artwork-search"
            />
          </div>

          <div className="grid min-h-[460px] max-h-[460px] content-start gap-2 overflow-y-auto" data-testid="artwork-list">
            {filtered.length > 0 ? (
              filtered.map((a) => (
                <ArtworkCard
                  key={a.id}
                  artwork={a}
                  actionLabel={assignLabel}
                  onAssign={handleAssign}
                />
              ))
            ) : (
              <p className="mt-2 text-[0.88rem] text-ink-faint">
                {query ? t.emptyArtworksSearch : t.emptyArtworks}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
