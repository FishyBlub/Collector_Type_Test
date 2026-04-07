"use client";

import { useState, useRef, useEffect } from "react";
import { useDNA } from "@/lib/DNAContext";
import { getAxisLabel, getAxisQuestion } from "@/lib/i18n";
import { AXES } from "@/constants/axes";
import type { Entry } from "@/types";

const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><rect width='56' height='56' rx='8' fill='%23f7eddc'/><text x='28' y='32' text-anchor='middle' font-size='9' fill='%23725538' font-family='sans-serif'>—</text></svg>"
  );

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
    <div className="rounded-xl border border-[#e6d6bf] bg-card p-3 transition-all duration-200">
      <h4 className="m-0 text-base">
        {entry.chamber} · {t.objectName} {entry.slot}
      </h4>

      {/* Artwork selection / preview */}
      {artwork ? (
        <div className="mt-2 grid grid-cols-[56px_minmax(0,1fr)] items-center gap-2 rounded-[10px] border border-[#e2d2bb] bg-[#fffdf8] p-2">
          <img
            src={artwork.imageUrl || PLACEHOLDER}
            alt={artwork.artworkTitle}
            className="h-14 w-14 rounded-lg border border-[#dfccb0] bg-[#f7ecdc] object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
          />
          <div className="min-w-0">
            <strong className="block truncate text-[0.78rem]">{artwork.artworkTitle}</strong>
            <span className="block truncate text-[0.72rem] text-[#6b5c4f]">{artwork.artistName || t.noArtist}</span>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <label className="block text-[0.82rem] text-[#5d5045]">{t.objectName}</label>
          <input
            type="text"
            value={entry.objectName}
            onChange={(e) => setEntryObjectName(entry.id, e.target.value)}
            placeholder="e.g. mattotti_nell_acqua"
            className="mt-0.5 w-full rounded-[10px] border border-warm-500 bg-[#fffbf5] px-2 py-1.5 text-ink"
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
              className="cursor-pointer rounded-full border border-[#d9c2a0] bg-[#fef6ea] px-2.5 py-1 text-[0.75rem] font-bold text-[#4f4136] hover:brightness-[0.97]"
            >
              {t.selectFromLibrary}
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 z-50 mt-1 w-full rounded-xl border border-[#d9c2a0] bg-[#fef6ea] shadow-lg">
                <div className="p-1.5">
                  <input
                    ref={filterInputRef}
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder={t.artworkSearchPlaceholder}
                    className="w-full rounded-lg border border-[#e2d2bb] bg-[#fffdf8] px-2 py-1 text-[0.75rem] text-ink outline-none focus:border-[#c9a96e]"
                  />
                </div>
                <ul className="max-h-[250px] overflow-y-scroll p-1.5 pt-0">
                  {filteredArtworks.length === 0 ? (
                    <li className="px-2 py-1.5 text-[0.72rem] text-[#8a7b6b]">
                      {t.emptyArtworksSearch}
                    </li>
                  ) : (
                    filteredArtworks.map((a) => (
                      <li
                        key={a.id}
                        onClick={() => {
                          assignArtwork(entry.id, a.id);
                          setDropdownOpen(false);
                          setFilterText("");
                        }}
                        className="cursor-pointer rounded-lg px-2 py-1.5 text-[0.75rem] text-[#4f4136] hover:bg-[#f7ecdc]"
                      >
                        <span className="font-bold">{a.artworkTitle}</span>
                        <span className="text-[#8a7b6b]"> — {a.artistName || "?"}</span>
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
            className="cursor-pointer rounded-full border border-[#c89a97] bg-[#fff4f2] px-2.5 py-1 text-[0.75rem] font-bold text-[#7c2e2a] hover:bg-[#ffede9]"
          >
            {t.removeSelection}
          </button>
        )}
      </div>

      {linkedCount > 1 && (
        <p className="mt-1 mb-1 rounded-lg border border-[#bfdee2] bg-[#e8f6f8] px-2 py-1 text-[0.74rem] text-[#0c5e66]">
          Scoring linked across {linkedCount} slots
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
