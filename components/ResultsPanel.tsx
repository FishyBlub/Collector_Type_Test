"use client";

import { useDNA } from "@/lib/DNAContext";
import {
  getArchetypeName,
  getArchetypeMotto,
  getArchetypeDescription,
  getStatusLabel,
} from "@/lib/i18n";
import { PANEL_CLASS, CARD_CLASS } from "@/lib/utils";
import DNARadarChart from "./RadarChart";
import MixBars from "./MixBars";
import ProfileCatalog from "./ProfileCatalog";
import ContributionChart from "./ContributionChart";

export default function ResultsPanel() {
  const { report, locale, t } = useDNA();
  if (!report) return null;

  const {
    averages,
    match,
    profileDistribution,
    mix,
    shadow,
    status,
    topDrivers,
    keyRejection,
    jsonPayload,
    artworkContributions,
    representative,
  } = report;

  const matchName = match.confidence === "hybrid"
    ? match.name
    : getArchetypeName(locale, match.name);
  const matchMotto = match.confidence === "hybrid"
    ? match.motto
    : getArchetypeMotto(locale, match.name, match.motto);
  const matchDesc = match.confidence === "hybrid"
    ? match.description
    : getArchetypeDescription(locale, match.name, match.description);

  const distLabel =
    match.confidence === "hybrid" ? t.distanceHybrid : t.distanceRef;

  const meta: string[] = [];
  if (match.runnerUp) {
    meta.push(`${t.runnerUp}: ${getArchetypeName(locale, match.runnerUp)}`);
  }
  if (Number.isFinite(match.marginToNext)) {
    meta.push(`${t.margin}: ${match.marginToNext}`);
  }

  return (
    <section className={PANEL_CLASS} data-testid="results-panel">
      <div className="mb-4">
        <h2 className="m-0 text-2xl">{t.resultsTitle}</h2>
        <p className="mt-1 mb-4 text-ink-soft">{t.resultsIntro}</p>
      </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {/* Radar chart */}
        <article className={CARD_CLASS} data-testid="radar-card">
          <h3 className="m-0 mb-2 text-lg">{t.radarCardTitle}</h3>
          <DNARadarChart averages={averages} locale={locale} />
        </article>

        {/* Primary archetype */}
        <article className={CARD_CLASS} data-testid="archetype-card">
          <h3 className="m-0 mb-2 text-lg">{t.archetypeCardTitle}</h3>
          <p className="m-0 text-[0.74rem] font-bold uppercase tracking-[0.06em] text-accent-2">
            {t.archetypeMatchLabel}
          </p>
          <h4 className="my-1 text-xl">{matchName}</h4>
          <p className="mt-1 mb-2 italic">{matchMotto}</p>
          <p className="m-0">{matchDesc}</p>
          <p className="mt-2 text-ink-soft">
            {distLabel}: {match.distance}
            {meta.length > 0 && ` · ${meta.join(" · ")}`}
          </p>

          <p className="mt-3 mb-1 text-[0.74rem] font-bold uppercase tracking-[0.06em] text-accent-2">
            {t.profileDistributionLabel}
          </p>
          <ul className="mt-2 pl-4 text-[0.82rem] text-ink-muted">
            {profileDistribution.map((item) => (
              <li key={item.name} className="mt-0.5">
                <strong>{getArchetypeName(locale, item.name)}:</strong> {item.percentage}%
              </li>
            ))}
          </ul>
        </article>

        {/* Shadow analysis */}
        <article className={CARD_CLASS} data-testid="shadow-card">
          <h3 className="m-0 mb-2 text-lg">{t.shadowCardTitle}</h3>
          <p className="m-0 text-[0.74rem] font-bold uppercase tracking-[0.06em] text-accent-2">
            {t.shadowCardLabel}
          </p>
          <ul className="mt-2 pl-4 text-ink-muted">
            {shadow.map((s, i) => (
              <li key={i} className="mt-1.5">
                <strong>{s.title}:</strong> {s.text}
              </li>
            ))}
          </ul>
        </article>

        {/* DNA Mix */}
        <article className={CARD_CLASS} data-testid="mix-card">
          <h3 className="m-0 mb-2 text-lg">{t.mixCardTitle}</h3>
          <p className="mt-1 text-ink-soft">
            {t.topDrivers}: {topDrivers.map((d) => `${d.label} (${d.share}%)`).join(", ")}
          </p>
          <p className="mt-0.5 text-ink-soft">
            {t.keyRejection}: {keyRejection.label} ({keyRejection.share}%)
          </p>
          <p className="mt-0.5 text-ink-soft">
            {t.statusLabel}: {getStatusLabel(locale, status)}
          </p>
          <MixBars items={mix} />
        </article>

        {/* Profile catalog */}
        <article className={`col-span-full ${CARD_CLASS}`}>
          <h3 className="m-0 mb-2 text-lg">{t.profileCatalogTitle}</h3>
          <ProfileCatalog distribution={profileDistribution} locale={locale} />
        </article>

        {/* Artwork contribution chart */}
        <article className={`col-span-full ${CARD_CLASS}`}>
          <h3 className="m-0 mb-2 text-lg">{t.representativeCardTitle}</h3>
          <h4 className="m-0 mb-1 text-base">{t.contributionChartTitle}</h4>
          <p className="mb-3 text-[0.82rem] text-ink-soft">{t.contributionChartIntro}</p>
          <ContributionChart contributions={artworkContributions} representative={representative} />
        </article>

        {/* JSON output */}
        <article className={`col-span-full ${CARD_CLASS}`} data-testid="json-card">
          <h3 className="m-0 mb-2 text-lg">{t.jsonCardTitle}</h3>
          <pre className="m-0 max-h-[280px] overflow-auto rounded-[10px] bg-[#121415] p-3 text-[0.78rem] text-[#d8e2dd]">
            {JSON.stringify(jsonPayload, null, 2)}
          </pre>
        </article>
      </div>
    </section>
  );
}
