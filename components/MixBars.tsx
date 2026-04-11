"use client";

import type { MixItem } from "@/types";

interface Props {
  items: MixItem[];
}

export default function MixBars({ items }: Props) {
  return (
    <div className="mt-3 grid gap-1.5" data-testid="mix-bars">
      {items.map((item) => (
        <div
          key={item.key}
          className="grid grid-cols-[72px_1fr_50px] sm:grid-cols-[90px_1fr_54px] items-center gap-2 text-[0.86rem]"
        >
          <span>{item.label}</span>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#f1e7d7]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#14695f] to-[#d0742c]"
              style={{ width: `${item.share}%` }}
            />
          </div>
          <span>{item.share}%</span>
        </div>
      ))}
    </div>
  );
}
