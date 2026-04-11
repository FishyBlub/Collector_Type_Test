"use client";

import { useState } from "react";
import Image from "next/image";
import { PLACEHOLDER_SMALL } from "@/lib/placeholders";
import type { ArtworkContribution } from "@/types";

interface Props {
  item: ArtworkContribution;
}

export default function ArtworkThumb({ item }: Props) {
  const [src, setSrc] = useState(item.imageUrl || PLACEHOLDER_SMALL);
  const isDataUri = src.startsWith("data:");

  return (
    <Image
      src={src}
      alt={item.artworkTitle}
      width={48}
      height={48}
      className="rounded-lg border border-img-border bg-img-bg object-cover"
      unoptimized={isDataUri}
      onError={() => setSrc(PLACEHOLDER_SMALL)}
    />
  );
}
