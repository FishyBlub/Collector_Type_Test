"use client";

import type { Artwork } from "@/types";

const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='132' height='92' viewBox='0 0 132 92'><rect width='132' height='92' fill='%23f7eddc'/><rect x='8' y='8' width='116' height='76' rx='8' fill='%23fff7ec' stroke='%23dcb98a'/><circle cx='44' cy='41' r='13' fill='%23ffd19d'/><path d='M22 68 L48 49 L66 61 L82 46 L110 68 Z' fill='%239dcab3'/><text x='66' y='84' text-anchor='middle' font-size='10' fill='%23725538' font-family='Trebuchet MS'>No image</text></svg>"
  );

interface Props {
  artwork: Artwork;
  actionLabel: string;
  onAssign: (artworkId: string) => void;
}

export default function ArtworkCard({ artwork, actionLabel, onAssign }: Props) {
  return (
    <article className="grid grid-cols-[74px_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] border border-[#e3d3bb] bg-[#fffdf8] p-2">
      <img
        src={artwork.imageUrl || PLACEHOLDER}
        alt={artwork.artworkTitle}
        className="h-[74px] w-[74px] rounded-lg border border-[#e0ceb2] bg-[#f6ebdb] object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = PLACEHOLDER;
        }}
      />
      <div className="min-w-0">
        <p className="m-0 truncate text-[0.88rem] font-bold text-[#352f2b]">
          {artwork.artworkTitle}
        </p>
        <p className="mt-0.5 m-0 truncate text-[0.78rem] text-[#594b42]">
          {artwork.artistName || "—"}
        </p>
        {artwork.source && (
          <p className="mt-0.5 m-0 truncate text-[0.73rem] text-[#7b6650]">
            {artwork.source}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onAssign(artwork.id)}
        className="cursor-pointer rounded-full border border-[#d9c2a0] bg-[#fef6ea] px-3 py-1.5 text-[0.75rem] font-bold text-[#4f4136] hover:bg-[#f5ebda]"
      >
        {actionLabel}
      </button>
    </article>
  );
}
