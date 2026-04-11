"use client";

import type { Locale, ProfileDistributionItem } from "@/types";
import { ARCHETYPES } from "@/constants/archetypes";
import { getArchetypeName, getArchetypeMotto, getArchetypeDescription } from "@/lib/i18n";

interface Props {
  distribution: ProfileDistributionItem[];
  locale: Locale;
}

export default function ProfileCatalog({ distribution, locale }: Props) {
  const distMap = new Map(
    distribution.map((d) => [d.name, d.percentage])
  );

  const items = ARCHETYPES.map((a) => ({
    name: getArchetypeName(locale, a.name),
    motto: getArchetypeMotto(locale, a.name, a.motto),
    description: getArchetypeDescription(locale, a.name, a.description),
    percentage: distMap.get(a.name) ?? 0,
  })).sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="grid gap-1.5" data-testid="profile-catalog">
      {items.map((item) => (
        <article
          key={item.name}
          className="rounded-[10px] border border-[#e2d3be] bg-[#fffefb] px-2.5 py-2"
        >
          <p className="m-0 flex items-baseline justify-between gap-2">
            <strong className="text-[#3f3531]">{item.name}</strong>
            <span className="whitespace-nowrap text-[0.76rem] font-bold text-accent-2">
              {item.percentage}%
            </span>
          </p>
          <p className="mt-0.5 m-0 text-[0.78rem] italic text-[#5c4c42]">
            {item.motto}
          </p>
          <p className="mt-0.5 m-0 text-[0.78rem] leading-tight text-[#5a4e46]">
            {item.description}
          </p>
        </article>
      ))}
    </div>
  );
}
