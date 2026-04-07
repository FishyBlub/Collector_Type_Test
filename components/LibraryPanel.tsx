"use client";

import { useCallback, useRef, useState } from "react";
import { useDNA } from "@/lib/DNAContext";
import type { Artwork } from "@/types";
import ArtworkCard from "./ArtworkCard";

function generateId(): string {
  return `aw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface PdfSuggestion {
  title: string;
  artist: string;
}

export default function LibraryPanel() {
  const {
    t,
    artworks,
    addArtwork,
    addArtworks,
    clearArtworks,
    entries,
    slotsPerChamber,
    activeChamber,
    assignArtwork,
  } = useDNA();

  const [searchQuery, setSearchQuery] = useState("");
  const [pdfStatus, setPdfStatus] = useState<{ type: "ok" | "error" | ""; msg: string }>({ type: "", msg: "" });
  const [pdfProgress, setPdfProgress] = useState<number | null>(null);
  const [pdfSuggestions, setPdfSuggestions] = useState<PdfSuggestion[]>([]);
  const [scrapeStatus, setScrapeStatus] = useState<{ type: "ok" | "warn" | "error" | ""; msg: string }>({ type: "", msg: "" });

  const manualTitleRef = useRef<HTMLInputElement>(null);
  const manualArtistRef = useRef<HTMLInputElement>(null);
  const manualImageRef = useRef<HTMLInputElement>(null);
  const pdfFileRef = useRef<HTMLInputElement>(null);
  const scrapeUrlRef = useRef<HTMLInputElement>(null);

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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = manualTitleRef.current?.value.trim();
    const artist = manualArtistRef.current?.value.trim();
    const imageUrl = manualImageRef.current?.value.trim() || "";
    if (!title) return;

    addArtwork({
      id: generateId(),
      artworkTitle: title,
      artistName: artist || "",
      imageUrl,
      source: "manual",
    });

    if (manualTitleRef.current) manualTitleRef.current.value = "";
    if (manualArtistRef.current) manualArtistRef.current.value = "";
    if (manualImageRef.current) manualImageRef.current.value = "";
  };

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = pdfFileRef.current?.files?.[0];
    if (!file) return;

    setPdfProgress(0);
    setPdfStatus({ type: "", msg: t.pdfProgressAnalyzing });
    setPdfSuggestions([]);

    const formData = new FormData();
    formData.append("pdfFile", file);

    try {
      const res = await fetch("/api/pdf-extract", { method: "POST", body: formData });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const suggestions: PdfSuggestion[] = (data.suggestions ?? []).map(
        (s: { title?: string; artist?: string }) => ({
          title: s.title || "",
          artist: s.artist || "",
        })
      );
      setPdfSuggestions(suggestions);
      setPdfProgress(100);
      setPdfStatus({ type: "ok", msg: t.pdfProgressDone });
    } catch {
      setPdfProgress(null);
      setPdfStatus({ type: "error", msg: t.pdfProgressFailed });
    }
  };

  const handleImportPdfSuggestions = () => {
    const batch: Artwork[] = pdfSuggestions
      .filter((s) => s.title.trim())
      .map((s) => ({
        id: generateId(),
        artworkTitle: s.title.trim(),
        artistName: s.artist.trim(),
        imageUrl: "",
        source: "PDF",
      }));
    addArtworks(batch);
    setPdfSuggestions([]);
  };

  const handleRemovePdfSuggestion = (index: number) => {
    setPdfSuggestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleScrapeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = scrapeUrlRef.current?.value.trim();
    if (!url) return;
    setScrapeStatus({ type: "", msg: "Scraping..." });

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!data.artworks?.length) {
        setScrapeStatus({ type: "warn", msg: "No artworks found at this URL." });
        return;
      }

      const batch: Artwork[] = data.artworks.map(
        (a: { title?: string; artist?: string; imageUrl?: string }) => ({
          id: generateId(),
          artworkTitle: a.title || "Untitled",
          artistName: a.artist || "",
          imageUrl: a.imageUrl || "",
          source: "2DGalleries",
        })
      );
      addArtworks(batch);
      setScrapeStatus({ type: "ok", msg: `${batch.length} artworks imported.` });
    } catch {
      setScrapeStatus({ type: "error", msg: "Scrape failed. Is the URL correct?" });
    }
  };

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
    <section className="reveal rounded-[var(--radius-panel)] border border-[#e8d8bf] bg-[var(--color-panel)]/80 p-5 shadow-[0_12px_30px_rgba(46,34,20,0.12)] backdrop-blur-[6px]">
      <div className="mb-4">
        <h2 className="m-0 text-2xl">{t.libraryTitle}</h2>
        <p className="mt-1 mb-4 text-ink-soft">{t.libraryIntro}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(250px,320px)_minmax(0,1fr)]">
        {/* Forms column */}
        <div className="grid gap-2.5">
          {/* Manual entry */}
          <form onSubmit={handleManualSubmit} className="grid gap-2 rounded-xl border border-[#dcc8ac] bg-[#fffaf0] p-3">
            <h3 className="m-0 mb-0.5 text-base">{t.manualFormTitle}</h3>
            <label className="text-[0.78rem] text-[#5f4e40]">{t.artworkName}</label>
            <input ref={manualTitleRef} type="text" required placeholder="Nell Acqua" className="w-full rounded-[10px] border border-warm-500 bg-[#fffbf5] px-2 py-1.5 text-ink" />
            <label className="text-[0.78rem] text-[#5f4e40]">{t.artistName}</label>
            <input ref={manualArtistRef} type="text" placeholder="Lorenzo Mattotti" className="w-full rounded-[10px] border border-warm-500 bg-[#fffbf5] px-2 py-1.5 text-ink" />
            <label className="text-[0.78rem] text-[#5f4e40]">{t.pictureUrl}</label>
            <input ref={manualImageRef} type="url" placeholder="https://example.com/image.jpg" className="w-full rounded-[10px] border border-warm-500 bg-[#fffbf5] px-2 py-1.5 text-ink" />
            <button type="submit" className="cursor-pointer rounded-full border border-[#d9c2a0] bg-[#fef6ea] px-4 py-2 text-sm font-bold text-[#4f4136]">
              {t.manualSubmit}
            </button>
          </form>

          {/* PDF upload */}
          <form onSubmit={handlePdfSubmit} className="grid gap-2 rounded-xl border border-[#dcc8ac] bg-[#fffaf0] p-3">
            <h3 className="m-0 mb-0.5 text-base">{t.pdfFormTitle}</h3>
            <label className="text-[0.78rem] text-[#5f4e40]">{t.pdfFile}</label>
            <input ref={pdfFileRef} type="file" accept="application/pdf" required className="w-full text-sm" />
            <p className="m-0 text-[0.76rem] text-[#6b5b4d]">{t.pdfHint}</p>

            {pdfProgress !== null && (
              <div className="rounded-[10px] border border-[#e2cfb4] bg-[#fffdf8] px-2 py-1.5">
                <div className="flex items-center justify-between text-[0.75rem] text-[#5a4b3f]">
                  <span>{pdfStatus.msg}</span>
                  <span>{pdfProgress}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#efe1cd]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-2 via-[#16a087] to-accent-2 transition-[width] duration-300"
                    style={{ width: `${pdfProgress}%` }}
                  />
                </div>
              </div>
            )}

            {pdfSuggestions.length > 0 && (
              <div>
                <p className="mb-1 text-[0.78rem] font-bold text-[#5e4f42]">{t.pdfSuggestionsTitle}</p>
                <ul className="m-0 grid list-none gap-1.5 p-0">
                  {pdfSuggestions.map((s, i) => (
                    <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[10px] border border-[#e5d4bd] bg-[#fffdf9] p-2">
                      <div className="grid gap-1">
                        <input
                          value={s.title}
                          onChange={(e) =>
                            setPdfSuggestions((prev) =>
                              prev.map((item, j) => (j === i ? { ...item, title: e.target.value } : item))
                            )
                          }
                          className="w-full rounded-lg border border-[#d8c2a1] bg-[#fffefb] px-2 py-1 text-[0.76rem]"
                        />
                        <input
                          value={s.artist}
                          onChange={(e) =>
                            setPdfSuggestions((prev) =>
                              prev.map((item, j) => (j === i ? { ...item, artist: e.target.value } : item))
                            )
                          }
                          placeholder={t.artistName}
                          className="w-full rounded-lg border border-[#d8c2a1] bg-[#fffefb] px-2 py-1 text-[0.76rem]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePdfSuggestion(i)}
                        className="cursor-pointer whitespace-nowrap rounded-full border border-[#c89a97] bg-[#fff4f2] px-2.5 py-1 text-[0.75rem] font-bold text-[#7c2e2a] hover:bg-[#ffede9]"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={handleImportPdfSuggestions}
                  className="mt-2 cursor-pointer rounded-full border border-[#d9c2a0] bg-[#fef6ea] px-4 py-2 text-sm font-bold text-[#4f4136]"
                >
                  {t.pdfImportAll}
                </button>
              </div>
            )}

            {pdfStatus.type === "error" && (
              <p className="m-0 rounded-lg bg-[#ffe9e6] px-2 py-1.5 text-[0.78rem] text-[#7e2621]">{pdfStatus.msg}</p>
            )}

            <button type="submit" className="cursor-pointer rounded-full border border-[#d9c2a0] bg-[#fef6ea] px-4 py-2 text-sm font-bold text-[#4f4136]">
              {t.pdfSubmit}
            </button>
          </form>

          {/* Scrape */}
          <form onSubmit={handleScrapeSubmit} className="grid gap-2 rounded-xl border border-[#dcc8ac] bg-[#fffaf0] p-3">
            <h3 className="m-0 mb-0.5 text-base">{t.scrapeFormTitle}</h3>
            <label className="text-[0.78rem] text-[#5f4e40]">{t.profileUrl}</label>
            <input
              ref={scrapeUrlRef}
              type="url"
              required
              defaultValue="https://www.2dgalleries.com/profile/jan"
              placeholder="https://www.2dgalleries.com/profile/jan"
              className="w-full rounded-[10px] border border-warm-500 bg-[#fffbf5] px-2 py-1.5 text-ink"
            />
            <button type="submit" className="cursor-pointer rounded-full border border-[#d9c2a0] bg-[#fef6ea] px-4 py-2 text-sm font-bold text-[#4f4136]">
              {t.scrapeSubmit}
            </button>
            {scrapeStatus.type && (
              <p
                className={`m-0 rounded-lg px-2 py-1.5 text-[0.78rem] ${
                  scrapeStatus.type === "ok"
                    ? "bg-[#e7f6f3] text-[#1a5d56]"
                    : scrapeStatus.type === "warn"
                      ? "bg-[#fff7dd] text-[#735315]"
                      : "bg-[#ffe9e6] text-[#7e2621]"
                }`}
              >
                {scrapeStatus.msg}
              </p>
            )}
          </form>
        </div>

        {/* Artwork list column */}
        <div className="rounded-xl border border-[#dcc8ac] bg-[#fffaf0] p-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="m-0 text-lg">{t.artworkListTitle}</h3>
            <button
              type="button"
              onClick={clearArtworks}
              className="cursor-pointer rounded-full border border-[#d9c2a0] bg-[#fef6ea] px-3 py-1.5 text-[0.75rem] font-bold text-[#4f4136]"
            >
              {t.clearArtworkList}
            </button>
          </div>

          <p className="mt-1 mb-0 text-[0.85rem] text-ink-soft">{countText}</p>

          <div className="mt-2 mb-2">
            <label className="text-[0.74rem] font-bold text-[#6a5848]">{t.artworkSearchLabel}</label>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.artworkSearchPlaceholder}
              className="mt-0.5 w-full rounded-[9px] border border-warm-500 bg-[#fffefb] px-2 py-1.5 text-[0.8rem] text-[#4e4034] focus-visible:outline-2 focus-visible:outline-accent-2"
            />
          </div>

          <div className="grid max-h-[460px] gap-2 overflow-y-scroll">
            {filtered.map((a) => (
              <ArtworkCard
                key={a.id}
                artwork={a}
                actionLabel={assignLabel}
                onAssign={handleAssign}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-2 text-[0.88rem] text-[#706157]">
              {query ? t.emptyArtworksSearch : t.emptyArtworks}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
