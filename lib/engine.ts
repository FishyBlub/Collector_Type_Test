import type {
  AxisKey,
  AxisScores,
  ArchetypeMatch,
  Entry,
  MixItem,
  ProfileDistributionItem,
  RankedArchetype,
  Report,
  ShadowHit,
  StatusLabel,
  Artwork,
} from "@/types";
import { AXES } from "@/constants/axes";
import {
  ARCHETYPES,
  OMNIVORE_NAME,
  OMNIVORE_DISTANCE_PENALTY,
  HYBRID_MARGIN_THRESHOLD,
} from "@/constants/archetypes";
import { SHADOW_RULES, SHADOW_TRIGGER_THRESHOLD } from "@/constants/shadows";

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function round3(v: number): number {
  return Math.round(v * 1000) / 1000;
}

export function computeAverages(entries: Entry[]): AxisScores {
  if (entries.length === 0) {
    return AXES.reduce((acc, a) => {
      acc[a.key] = 0;
      return acc;
    }, {} as AxisScores);
  }

  return AXES.reduce((acc, axis) => {
    const total = entries.reduce((sum, e) => sum + (e.scores[axis.key] ?? 3), 0);
    acc[axis.key] = round2(total / entries.length);
    return acc;
  }, {} as AxisScores);
}

function calculateArchetypeDistance(
  averages: AxisScores,
  scores: AxisScores
): number {
  return Math.sqrt(
    AXES.reduce((sum, axis) => {
      const delta = averages[axis.key] - scores[axis.key];
      return sum + delta * delta;
    }, 0)
  );
}

export function rankArchetypes(averages: AxisScores): RankedArchetype[] {
  return ARCHETYPES.map((archetype) => {
    const rawDistance = calculateArchetypeDistance(averages, archetype.scores);
    const bias = archetype.name === OMNIVORE_NAME ? OMNIVORE_DISTANCE_PENALTY : 0;
    return {
      ...archetype,
      distance: round3(rawDistance),
      adjustedDistance: round3(rawDistance + bias),
    };
  }).sort((a, b) => {
    if (a.adjustedDistance !== b.adjustedDistance)
      return a.adjustedDistance - b.adjustedDistance;
    return a.distance - b.distance;
  });
}

export function calculateProfileDistribution(
  averages: AxisScores
): ProfileDistributionItem[] {
  const ranked = rankArchetypes(averages);
  if (ranked.length === 0) return [];

  const minDistance = ranked.reduce(
    (min, item) => Math.min(min, item.adjustedDistance),
    Infinity
  );
  const temperature = 0.75;
  const rawWeights = ranked.map((item) => {
    const shifted = item.adjustedDistance - minDistance;
    return Math.exp(-shifted / temperature);
  });
  const totalWeight = rawWeights.reduce((s, w) => s + w, 0);

  if (!Number.isFinite(totalWeight) || totalWeight <= 0) {
    const eq = round1(100 / ranked.length);
    return ranked.map((item) => ({ ...item, percentage: eq }));
  }

  const withPct = ranked.map((item, i) => ({
    ...item,
    percentage: round1((rawWeights[i] / totalWeight) * 100),
  }));

  const summed = withPct.reduce((s, item) => s + item.percentage, 0);
  const correction = round1(100 - summed);
  if (Math.abs(correction) >= 0.1 && withPct.length > 0) {
    withPct[0].percentage = round1(withPct[0].percentage + correction);
  }

  return withPct;
}

export function findClosestArchetype(averages: AxisScores): ArchetypeMatch {
  const ranked = rankArchetypes(averages);

  if (ranked.length === 0) {
    return {
      name: "Onbekend profiel",
      motto: "-",
      description: "Geen archetype data beschikbaar.",
      distance: 0,
      adjustedDistance: 0,
      runnerUp: "",
      marginToNext: 0,
      confidence: "low",
    };
  }

  const primary = ranked[0];
  const secondary = ranked[1] ?? null;

  if (!secondary) {
    return {
      ...primary,
      runnerUp: "",
      marginToNext: Infinity,
      confidence: "high",
    };
  }

  const margin = secondary.adjustedDistance - primary.adjustedDistance;

  if (margin <= HYBRID_MARGIN_THRESHOLD) {
    return {
      name: `Hybride profiel: ${primary.name} × ${secondary.name}`,
      motto: "Uw verzamel-DNA balanceert tussen twee archetypen.",
      description: `Uw scorepatroon ligt heel dicht bij zowel ${primary.name} als ${secondary.name}. Dit resultaat wordt bewust als gemengd profiel getoond.`,
      distance: round3((primary.distance + secondary.distance) / 2),
      adjustedDistance: primary.adjustedDistance,
      runnerUp: secondary.name,
      marginToNext: round3(margin),
      confidence: "hybrid",
    };
  }

  return {
    ...primary,
    runnerUp: secondary.name,
    marginToNext: round3(margin),
    confidence: margin <= HYBRID_MARGIN_THRESHOLD * 1.6 ? "medium" : "high",
  };
}

export function calculateMix(
  averages: AxisScores,
  getLabel: (key: AxisKey) => string
): MixItem[] {
  const total = AXES.reduce((sum, a) => sum + averages[a.key], 0);
  return AXES.map((axis) => ({
    key: axis.key,
    label: getLabel(axis.key),
    value: averages[axis.key],
    share: total === 0 ? 0 : round1((averages[axis.key] / total) * 100),
  })).sort((a, b) => b.share - a.share);
}

export function computeShadow(
  averages: AxisScores,
  getShadowI18n: (rule: { id: string; title: string; text: string }) => ShadowHit
): ShadowHit[] {
  const hits = SHADOW_RULES.filter((rule) => rule.check(averages));

  if (hits.length === 0) {
    return [
      {
        title: "Geen dominante schaduwtrigger",
        text: `Er is geen as op of onder ${SHADOW_TRIGGER_THRESHOLD.toFixed(1)}. Uw profiel toont eerder een evenwichtige mix dan een uitgesproken actieve nee.`,
      },
    ];
  }

  return hits.map(getShadowI18n);
}

export function deriveStatus(averages: AxisScores): StatusLabel {
  const values = AXES.map((a) => averages[a.key]);
  const spread = Math.max(...values) - Math.min(...values);

  if (spread >= 2.1 && averages.avonturier >= 4 && averages.estheet >= 4) {
    return "high_intensity_explorer";
  }
  if (averages.architect >= 4 && averages.bewaker >= 4) {
    return "anchor_curator";
  }
  if (averages.speculant >= 4 && averages.jager >= 4) {
    return "market_hunter";
  }
  return "adaptive_collector";
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function buildJsonPayload(
  entries: Entry[],
  getArtwork: (id: string | null) => Artwork | null
): unknown[] {
  const seen = new Map<string, number>();

  return entries.map((entry, index) => {
    const artwork = getArtwork(entry.selectedArtworkId);
    const idSeed = artwork
      ? artwork.artworkTitle
      : entry.objectName || `${entry.chamber}_object_${entry.slot}`;
    const baseId = slugify(idSeed) || `object_${index + 1}`;
    const nextCount = (seen.get(baseId) || 0) + 1;
    seen.set(baseId, nextCount);
    const objectId = nextCount === 1 ? baseId : `${baseId}_${nextCount}`;

    return {
      object_id: objectId,
      kamer: entry.chamber,
      selected_artwork: artwork
        ? {
            artwork_title: artwork.artworkTitle,
            artist_name: artwork.artistName,
            image_url: artwork.imageUrl,
          }
        : null,
      scores: { ...entry.scores },
    };
  });
}

export function buildReport(
  entries: Entry[],
  getAxisLabel: (key: AxisKey) => string,
  getShadowI18n: (rule: { id: string; title: string; text: string }) => ShadowHit,
  getArtwork: (id: string | null) => Artwork | null
): Report {
  const averages = computeAverages(entries);
  const match = findClosestArchetype(averages);
  const profileDistribution = calculateProfileDistribution(averages);
  const mix = calculateMix(averages, getAxisLabel);
  const shadow = computeShadow(averages, getShadowI18n);
  const status = deriveStatus(averages);

  return {
    averages,
    match,
    profileDistribution,
    mix,
    shadow,
    status,
    topDrivers: mix.slice(0, 3),
    keyRejection: mix[mix.length - 1],
    jsonPayload: buildJsonPayload(entries, getArtwork),
  };
}
