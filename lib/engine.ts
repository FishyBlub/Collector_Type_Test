import type {
  ArtworkContribution,
  AxisKey,
  AxisScores,
  ArchetypeMatch,
  BoxplotStats,
  Entry,
  MixItem,
  ProfileDistributionItem,
  RankedArchetype,
  RepresentativeArtworks,
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
import { SHADOW_RULES } from "@/constants/shadows";

export function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

export function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function round3(v: number): number {
  return Math.round(v * 1000) / 1000;
}

export function computeAverages(entries: Entry[]): AxisScores {
  // Seed as empty object, progressively filled by the AXES loop to form a complete AxisScores
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

function euclideanDistance(a: AxisScores, b: AxisScores): number {
  return Math.sqrt(
    AXES.reduce((sum, axis) => {
      const delta = (a[axis.key] ?? 0) - (b[axis.key] ?? 0);
      return sum + delta * delta;
    }, 0)
  );
}

export function rankArchetypes(averages: AxisScores): RankedArchetype[] {
  return ARCHETYPES.map((archetype) => {
    const rawDistance = euclideanDistance(averages, archetype.scores);
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

interface ArchetypeFallbackStrings {
  unknownProfile: string;
  unknownProfileMotto: string;
  unknownProfileDescription: string;
  hybridProfileMotto: string;
  hybridProfileDescription: string;
}

export function findClosestArchetype(
  averages: AxisScores,
  fallback: ArchetypeFallbackStrings
): ArchetypeMatch {
  const ranked = rankArchetypes(averages);

  if (ranked.length === 0) {
    return {
      name: fallback.unknownProfile,
      motto: fallback.unknownProfileMotto,
      description: fallback.unknownProfileDescription,
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
      motto: fallback.hybridProfileMotto,
      description: fallback.hybridProfileDescription
        .replace("{primary}", primary.name)
        .replace("{secondary}", secondary.name),
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
  getShadowI18n: (rule: { id: string; title: string; text: string }) => ShadowHit,
  noShadowFallback: ShadowHit
): ShadowHit[] {
  const hits = SHADOW_RULES.filter((rule) => rule.check(averages));

  if (hits.length === 0) {
    return [noShadowFallback];
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

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 3;
  return Math.max(1, Math.min(5, Math.round(value)));
}

function normalizeScores(rawScores: AxisScores): AxisScores {
  // Seed as empty object, progressively filled by the AXES loop to form a complete AxisScores
  return AXES.reduce((acc, axis) => {
    acc[axis.key] = clampScore(Number(rawScores?.[axis.key]));
    return acc;
  }, {} as AxisScores);
}

function averageEntriesScores(entries: Entry[]): AxisScores {
  const MIDPOINT = 3;
  // Seed as empty object, progressively filled by the AXES loop to form a complete AxisScores
  if (entries.length === 0) {
    return AXES.reduce((acc, axis) => {
      acc[axis.key] = 0;
      return acc;
    }, {} as AxisScores);
  }
  return AXES.reduce((acc, axis) => {
    const total = entries.reduce((sum, e) => sum + (e.scores[axis.key] ?? MIDPOINT), 0);
    acc[axis.key] = total / entries.length;
    return acc;
  }, {} as AxisScores);
}


export function quantile(numbers: number[], q: number): number {
  const values = numbers
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v))
    .sort((a, b) => a - b);
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];
  const clampedQ = Math.max(0, Math.min(1, q));
  const position = (values.length - 1) * clampedQ;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return values[lower];
  const fraction = position - lower;
  return values[lower] * (1 - fraction) + values[upper] * fraction;
}

export function computeBoxplotStats(values: number[]): BoxplotStats {
  const list = values
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v))
    .sort((a, b) => a - b);

  if (list.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0, lowerFence: 0, upperFence: 0 };
  }

  const min = list[0];
  const max = list[list.length - 1];
  const q1 = quantile(list, 0.25);
  const median = quantile(list, 0.5);
  const q3 = quantile(list, 0.75);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  return { min, q1, median, q3, max, iqr, lowerFence, upperFence };
}

export function calculateArtworkContributions(
  entries: Entry[],
  averages: AxisScores,
  getArtwork: (id: string | null) => Artwork | null
): ArtworkContribution[] {
  if (entries.length === 0) return [];

  const totalVolume = entries.reduce(
    (sum, entry) =>
      sum + AXES.reduce((axisSum, axis) => axisSum + (Number(entry?.scores?.[axis.key]) || 0), 0),
    0
  );

  const raw = entries.map((entry, index) => {
    const entryScores = normalizeScores(entry.scores);
    const artwork = getArtwork(entry.selectedArtworkId);
    const artworkTitle = artwork ? artwork.artworkTitle : entry.objectName || "";
    const artistName = artwork ? artwork.artistName : "";
    const imageUrl = artwork ? artwork.imageUrl : "";
    const source = artwork ? artwork.source : "";

    const volume = AXES.reduce((sum, axis) => sum + entryScores[axis.key], 0);
    const otherEntries = entries.filter((_, otherIndex) => otherIndex !== index);
    const withoutAverage = averageEntriesScores(otherEntries);
    const impactDistance =
      otherEntries.length > 0
        ? euclideanDistance(averages, withoutAverage)
        : euclideanDistance(averages, entryScores);
    const distanceToProfile = euclideanDistance(entryScores, averages);
    // Seed as empty object, progressively filled by the AXES loop to form a complete AxisScores
    const axisContribution = AXES.reduce((acc, axis) => {
      acc[axis.key] = round3(entryScores[axis.key] / entries.length);
      return acc;
    }, {} as AxisScores);

    return {
      entryId: entry.id,
      chamber: entry.chamber,
      slot: entry.slot,
      artworkTitle,
      artistName,
      imageUrl,
      source,
      scores: { ...entryScores },
      volume,
      distanceToProfile,
      impactDistance,
      axisContribution,
      volumeShare: 0,
      impactShare: 0,
      profileContributionScore: 0,
    };
  });

  const totalImpactDistance = raw.reduce((sum, item) => sum + item.impactDistance, 0);
  const fallbackShare = round1(100 / raw.length);

  const enriched: ArtworkContribution[] = raw.map((item) => ({
    ...item,
    volumeShare: totalVolume > 0 ? round1((item.volume / totalVolume) * 100) : fallbackShare,
    impactShare:
      totalImpactDistance > 0
        ? round1((item.impactDistance / totalImpactDistance) * 100)
        : fallbackShare,
    distanceToProfile: round3(item.distanceToProfile),
    impactDistance: round3(item.impactDistance),
  }));

  const summedImpact = enriched.reduce((sum, item) => sum + item.impactShare, 0);
  const impactCorrection = round1(100 - summedImpact);
  if (Math.abs(impactCorrection) >= 0.1 && enriched.length > 0) {
    enriched[0].impactShare = round1(enriched[0].impactShare + impactCorrection);
  }

  const summedVolume = enriched.reduce((sum, item) => sum + item.volumeShare, 0);
  const volumeCorrection = round1(100 - summedVolume);
  if (Math.abs(volumeCorrection) >= 0.1 && enriched.length > 0) {
    enriched[0].volumeShare = round1(enriched[0].volumeShare + volumeCorrection);
  }

  const maxDistance = enriched.reduce(
    (maxVal, item) => Math.max(maxVal, Number(item.distanceToProfile) || 0),
    0
  );
  enriched.forEach((item) => {
    const normalizedDistance = maxDistance > 0 ? (Number(item.distanceToProfile) || 0) / maxDistance : 0;
    const coherenceFactor = Math.max(0, 1 - normalizedDistance);
    item.profileContributionScore = round2((Number(item.impactShare) || 0) * coherenceFactor);
  });

  return enriched.sort(
    (a, b) =>
      b.volumeShare - a.volumeShare ||
      b.impactShare - a.impactShare ||
      a.distanceToProfile - b.distanceToProfile
  );
}

export function deriveRepresentativeArtworks(
  contributions: ArtworkContribution[]
): RepresentativeArtworks {
  if (contributions.length === 0) return { most: null, least: null };

  const rankedMost = [...contributions].sort(
    (a, b) =>
      (Number(b.profileContributionScore) || 0) - (Number(a.profileContributionScore) || 0) ||
      (Number(b.impactShare) || 0) - (Number(a.impactShare) || 0) ||
      (Number(a.distanceToProfile) || 0) - (Number(b.distanceToProfile) || 0)
  );
  const rankedLeast = [...contributions].sort(
    (a, b) =>
      (Number(a.profileContributionScore) || 0) - (Number(b.profileContributionScore) || 0) ||
      (Number(a.impactShare) || 0) - (Number(b.impactShare) || 0) ||
      (Number(b.distanceToProfile) || 0) - (Number(a.distanceToProfile) || 0)
  );

  return { most: rankedMost[0] ?? null, least: rankedLeast[0] ?? null };
}

export function buildReport(
  entries: Entry[],
  getAxisLabel: (key: AxisKey) => string,
  getShadowI18n: (rule: { id: string; title: string; text: string }) => ShadowHit,
  getArtwork: (id: string | null) => Artwork | null,
  archetypeFallback: ArchetypeFallbackStrings,
  noShadowFallback: ShadowHit
): Report {
  const averages = computeAverages(entries);
  const match = findClosestArchetype(averages, archetypeFallback);
  const profileDistribution = calculateProfileDistribution(averages);
  const mix = calculateMix(averages, getAxisLabel);
  const shadow = computeShadow(averages, getShadowI18n, noShadowFallback);
  const status = deriveStatus(averages);
  const artworkContributions = calculateArtworkContributions(entries, averages, getArtwork);
  const representative = deriveRepresentativeArtworks(artworkContributions);

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
    artworkContributions,
    representative,
  };
}
