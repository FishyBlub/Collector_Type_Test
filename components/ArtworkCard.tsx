"use client";

import { useState } from "react";
import Image from "next/image";
import { BUTTON_SMALL_CLASS } from "@/lib/utils";
import { PLACEHOLDER_LARGE as PLACEHOLDER } from "@/lib/placeholders";
import type { Artwork } from "@/types";

interface Props {
  artwork: Artwork;
  actionLabel: string;
  onAssign: (artworkId: string) => void;
}

export default function ArtworkCard({ artwork, actionLabel, onAssign }: Props) {
  const [imgSrc, setImgSrc] = useState(artwork.imageUrl || PLACEHOLDER);
  const isDataUri = imgSrc.startsWith("data:");

  return (
    <article className="grid grid-cols-[74px_minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--radius-input)] border border-card-border bg-card-inner p-2" data-testid={`artwork-card-${artwork.id}`}>
      <Image
        src={imgSrc}
        alt={artwork.artworkTitle}
        width={74}
        height={74}
        className="rounded-lg border border-img-border bg-img-bg object-cover"
        unoptimized={isDataUri}
        onError={() => setImgSrc(PLACEHOLDER)}
      />
      <div className="min-w-0">
        <p className="m-0 truncate text-[0.88rem] font-bold text-ink">
          {artwork.artworkTitle}
        </p>
        <p className="mt-0.5 m-0 truncate text-[0.78rem] text-ink-soft">
          {artwork.artistName || "—"}
        </p>
        {artwork.source && (
          <p className="mt-0.5 m-0 truncate text-[0.73rem] text-ink-faint">
            {artwork.source}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onAssign(artwork.id)}
        className={`${BUTTON_SMALL_CLASS} px-3 py-1.5`}
        data-testid={`assign-artwork-${artwork.id}`}
      >
        {actionLabel}
      </button>
    </article>
  );
}
