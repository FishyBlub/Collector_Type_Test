"use client";

import { useDNA } from "@/lib/DNAContext";
import { round2 } from "@/lib/engine";
import type { RepresentativeArtworks } from "@/types";
import ArtworkThumb from "./ArtworkThumb";

interface Props {
  representative: RepresentativeArtworks;
}

export default function RepresentativeSummary({ representative }: Props) {
  const { t } = useDNA();

  if (!representative.most && !representative.least) return null;

  return (
    <div className="mb-3 grid gap-2 sm:grid-cols-2" data-testid="representative-summary">
      {representative.most && (
        <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-2 rounded-lg border border-[#c4ddc8] bg-[#eef8ef] px-3 py-2">
          <ArtworkThumb item={representative.most} />
          <div className="min-w-0">
            <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#2f7748]">
              {t.representativeMost}
            </span>
            <p className="mt-0.5 truncate text-[0.82rem] font-bold text-ink">{representative.most.artworkTitle}</p>
            <p className="truncate text-[0.72rem] text-ink-soft">
              {representative.most.artistName || t.noArtist} · score {round2(representative.most.profileContributionScore)}
            </p>
          </div>
        </div>
      )}
      {representative.least && (
        <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-2 rounded-lg border border-[#ddc8b4] bg-[#fdf4ec] px-3 py-2">
          <ArtworkThumb item={representative.least} />
          <div className="min-w-0">
            <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#b05a37]">
              {t.representativeLeast}
            </span>
            <p className="mt-0.5 truncate text-[0.82rem] font-bold text-ink">{representative.least.artworkTitle}</p>
            <p className="truncate text-[0.72rem] text-ink-soft">
              {representative.least.artistName || t.noArtist} · score {round2(representative.least.profileContributionScore)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
