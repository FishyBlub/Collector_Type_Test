"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useDNA } from "@/lib/DNAContext";
import { getAxisLabel, getAxisQuestion } from "@/lib/i18n";
import { AXES } from "@/constants/axes";
import { BUTTON_SMALL_CLASS, BUTTON_DANGER_CLASS, INPUT_CLASS } from "@/lib/utils";
import { PLACEHOLDER_SMALL as PLACEHOLDER } from "@/lib/placeholders";
import type { Entry } from "@/types";

interface Props {
  entry: Entry;
  linkedCount: number;
}

export default function ObjectCard({ entry, linkedCount }: Props) {
  const {
    locale,
    t,
    getArtworkById,
    updateScore,
    assignArtwork,
    clearEntryArtwork,
    setEntryObjectName,
    axisVariants,
    toggleAxisVariant,
    artworks,
  } = useDNA();

  const artwork = getArtworkById(entry.selectedArtworkId);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // e.target is EventTarget; cast to Node for DOM containment check
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setFilterText("");
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      filterInputRef.current?.focus();
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const query = filterText.toLowerCase();
  const filteredArtworks = artworks.filter(
    (a) =>
      a.artworkTitle.toLowerCase().includes(query) ||
      (a.artistName || "").toLowerCase().includes(query)
  );

  return (
    <div className="rounded-xl border border-panel-border bg-card p-3 transition-all duration-200" data-testid={`object-card-${entry.id}`}>
      <h4 className="m-0 text-base">
        {entry.chamber} · {t.objectName} {entry.slot}
      </h4>

      {/* Artwork selection / preview */}
      {artwork ? (
        <div className="mt-2 grid grid-cols-[56px_minmax(0,1fr)] items-center gap-2 rounded-[var(--radius-input)] border border-card-border bg-card-inner p-2">
          <Image
            src={artwork.imageUrl || PLACEHOLDER}
            alt={artwork.artworkTitle}
            width={56}
            height={56}
            className="rounded-lg border border-img-border bg-img-bg object-cover"
            unoptimized={!artwork.imageUrl}
          />
          <div className="min-w-0">
            <strong className="block truncate text-[0.78rem]">{artwork.artworkTitle}</strong>
            <span className="block truncate text-[0.72rem] text-[#6b5c4f]">{artwork.artistName || t.noArtist}</span>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <label className="block text-[0.82rem] text-ink-muted">{t.objectName}</label>
          <input
            type="text"
            value={entry.objectName}
            onChange={(e) => setEntryObjectName(entry.id, e.target.value)}
            placeholder="e.g. mattotti_nell_acqua"
            className={`mt-0.5 ${INPUT_CLASS}`}
            data-testid={`object-name-${entry.id}`}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {!artwork && artworks.length > 0 && (
          <div ref={dropdownRef} className="relative w-full">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`${BUTTON_SMALL_CLASS} hover:brightness-[0.97]`}
              data-testid={`select-artwork-${entry.id}`}
            >
              {t.selectFromLibrary}
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 z-50 mt-1 w-full rounded-xl border border-btn-border bg-btn-bg shadow-lg">
                <div className="p-1.5">
                  <input
                    ref={filterInputRef}
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder={t.artworkSearchPlaceholder}
                    className="w-full rounded-lg border border-card-border bg-card-inner px-2 py-1 text-[0.75rem] text-ink outline-none focus:border-warm-300"
                  />
                </div>
                <ul className="max-h-[320px] overflow-y-scroll p-1.5 pt-0" role="listbox">
                  {filteredArtworks.length === 0 ? (
                    <li className="px-2 py-1.5 text-[0.72rem] text-[#8a7b6b]" role="option" aria-selected={false}>
                      {t.emptyArtworksSearch}
                    </li>
                  ) : (
                    filteredArtworks.map((a) => (
                      <li key={a.id} role="option" aria-selected={false}>
                        <button
                          type="button"
                          onClick={() => {
                            assignArtwork(entry.id, a.id);
                            setDropdownOpen(false);
                            setFilterText("");
                          }}
                          className="w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-[0.75rem] text-btn-text hover:bg-img-bg"
                          data-testid={`dropdown-option-${a.id}`}
                        >
                          <div className="flex items-center gap-2">
                            <Image
                              src={a.imageUrl || PLACEHOLDER}
                              alt={a.artworkTitle}
                              width={40}
                              height={40}
                              className="shrink-0 rounded-md border border-img-border bg-img-bg object-cover"
                              unoptimized={!a.imageUrl}
                            />
                            <div className="min-w-0">
                              <span className="block truncate font-bold">{a.artworkTitle}</span>
                              <span className="block truncate text-[0.7rem] text-[#8a7b6b]">{a.artistName || "?"}</span>
                            </div>
                          </div>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
        {artwork && (
          <button
            type="button"
            onClick={() => clearEntryArtwork(entry.id)}
            className={BUTTON_DANGER_CLASS}
            data-testid={`remove-artwork-${entry.id}`}
          >
            {t.removeSelection}
          </button>
        )}
      </div>

      {linkedCount > 1 && (
        <p className="mt-1 mb-1 rounded-lg border border-info-border bg-info-bg px-2 py-1 text-[0.74rem] text-info-text">
          {t.scoringLinked.replace("{count}", String(linkedCount))}
        </p>
      )}

      {/* Axis sliders */}
      <div className="mt-2 grid gap-1.5">
        {AXES.map((axis) => {
          const variant = axisVariants[axis.key];
          const question = getAxisQuestion(locale, axis.key, variant);
          const label = getAxisLabel(locale, axis.key);
          const value = entry.scores[axis.key];

          return (
            <div key={axis.key} className="mt-1">
              <div className="flex items-start justify-between gap-2 text-[0.72rem]">
                <span className="flex-1 leading-tight text-[#624d39]">{question}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAxisVariant(axis.key)}
                    className="cursor-pointer whitespace-nowrap rounded-full border border-[#c9b08f] bg-[#fff4e3] px-2 py-0.5 text-[0.68rem] text-[#6f4f2a] hover:brightness-[0.98]"
                  >
                    {variant === "primary" ? "Alt" : label}
                  </button>
                  <span className="font-bold text-accent-2">{value}</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={value}
                onChange={(e) => updateScore(entry.id, axis.key, Number(e.target.value))}
                aria-label={label}
                data-testid={`slider-${entry.id}-${axis.key}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
