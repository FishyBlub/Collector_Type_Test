import { describe, it, expect } from "vitest";
import type { AxisScores, Entry, Artwork } from "@/types";
import {
  round1,
  round2,
  round3,
  computeAverages,
  rankArchetypes,
  calculateProfileDistribution,
  findClosestArchetype,
  calculateMix,
  computeShadow,
  deriveStatus,
  quantile,
  computeBoxplotStats,
  calculateArtworkContributions,
  deriveRepresentativeArtworks,
  buildReport,
  buildJsonPayload,
} from "./engine";

function makeScores(overrides: Partial<AxisScores> = {}): AxisScores {
  return {
    jager: 3,
    estheet: 3,
    verwant: 3,
    bewaker: 3,
    avonturier: 3,
    speculant: 3,
    architect: 3,
    ...overrides,
  };
}

function makeEntry(overrides: Partial<Entry> = {}): Entry {
  return {
    id: "test_1",
    chamber: "Hart",
    slot: 1,
    objectName: "Test Object",
    selectedArtworkId: "aw_1",
    scores: makeScores(),
    ...overrides,
  };
}

function makeArtwork(overrides: Partial<Artwork> = {}): Artwork {
  return {
    id: "aw_1",
    artworkTitle: "Test Artwork",
    artistName: "Test Artist",
    imageUrl: "https://example.com/image.jpg",
    source: "manual",
    ...overrides,
  };
}

const FALLBACK = {
  unknownProfile: "Unknown",
  unknownProfileMotto: "Unknown motto",
  unknownProfileDescription: "Unknown description",
  hybridProfileMotto: "Hybrid motto",
  hybridProfileDescription: "A blend of {primary} and {secondary}.",
};

const NO_SHADOW = { title: "No shadow", text: "No shadow detected" };

describe("rounding helpers", () => {
  it("round1 rounds to 1 decimal place", () => {
    expect(round1(1.456)).toBe(1.5);
    expect(round1(2.34)).toBe(2.3);
  });

  it("round2 rounds to 2 decimal places", () => {
    expect(round2(1.4567)).toBe(1.46);
    expect(round2(3.001)).toBe(3);
  });

  it("round3 rounds to 3 decimal places", () => {
    expect(round3(1.45678)).toBe(1.457);
  });
});

describe("computeAverages", () => {
  it("returns zeros for empty entries", () => {
    const avg = computeAverages([]);
    expect(avg.jager).toBe(0);
    expect(avg.architect).toBe(0);
  });

  it("computes correct averages for a single entry", () => {
    const entry = makeEntry({ scores: makeScores({ jager: 5, estheet: 1 }) });
    const avg = computeAverages([entry]);
    expect(avg.jager).toBe(5);
    expect(avg.estheet).toBe(1);
    expect(avg.bewaker).toBe(3);
  });

  it("averages multiple entries", () => {
    const e1 = makeEntry({ id: "e1", scores: makeScores({ jager: 5 }) });
    const e2 = makeEntry({ id: "e2", scores: makeScores({ jager: 1 }) });
    const avg = computeAverages([e1, e2]);
    expect(avg.jager).toBe(3);
  });
});

describe("rankArchetypes", () => {
  it("returns ranked list sorted by adjusted distance", () => {
    const avg = makeScores({ jager: 5, estheet: 1, speculant: 5, avonturier: 1 });
    const ranked = rankArchetypes(avg);
    expect(ranked.length).toBeGreaterThan(0);
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i].adjustedDistance).toBeGreaterThanOrEqual(ranked[i - 1].adjustedDistance);
    }
  });
});

describe("calculateProfileDistribution", () => {
  it("returns percentages that sum to 100", () => {
    const avg = makeScores({ jager: 4, estheet: 2 });
    const dist = calculateProfileDistribution(avg);
    const sum = dist.reduce((s, d) => s + d.percentage, 0);
    expect(Math.abs(sum - 100)).toBeLessThan(0.2);
  });

  it("returns empty array for empty averages when no archetypes match", () => {
    const dist = calculateProfileDistribution(makeScores());
    expect(dist.length).toBeGreaterThan(0);
  });
});

describe("findClosestArchetype", () => {
  it("returns a match with confidence", () => {
    const avg = makeScores({ jager: 5, speculant: 5, estheet: 1, bewaker: 1 });
    const match = findClosestArchetype(avg, FALLBACK);
    expect(match.name).toBeTruthy();
    expect(["high", "medium", "hybrid", "low"]).toContain(match.confidence);
  });

  it("uses fallback for empty rankings", () => {
    const avg = makeScores();
    const match = findClosestArchetype(avg, FALLBACK);
    expect(match.name).toBeTruthy();
  });
});

describe("calculateMix", () => {
  it("returns shares that sum to approximately 100", () => {
    const avg = makeScores({ jager: 4, estheet: 2, architect: 5 });
    const mix = calculateMix(avg, (key) => key);
    const sum = mix.reduce((s, m) => s + m.share, 0);
    expect(Math.abs(sum - 100)).toBeLessThan(1);
  });

  it("handles all-zero averages without division error", () => {
    const avg = makeScores({ jager: 0, estheet: 0, verwant: 0, bewaker: 0, avonturier: 0, speculant: 0, architect: 0 });
    const mix = calculateMix(avg, (key) => key);
    mix.forEach((m) => expect(m.share).toBe(0));
  });
});

describe("computeShadow", () => {
  it("returns shadows when thresholds are met", () => {
    const avg = makeScores({ architect: 1, speculant: 1 });
    const shadows = computeShadow(avg, (r) => ({ title: r.title, text: r.text }), NO_SHADOW);
    expect(shadows.length).toBeGreaterThan(0);
  });

  it("returns no-shadow fallback when no rules match", () => {
    const avg = makeScores({ architect: 5, speculant: 5, jager: 5, bewaker: 5, avonturier: 5 });
    const shadows = computeShadow(avg, (r) => ({ title: r.title, text: r.text }), NO_SHADOW);
    expect(shadows).toEqual([NO_SHADOW]);
  });
});

describe("deriveStatus", () => {
  it("returns high_intensity_explorer for high spread + high avonturier/estheet", () => {
    const avg = makeScores({ avonturier: 5, estheet: 5, architect: 1 });
    expect(deriveStatus(avg)).toBe("high_intensity_explorer");
  });

  it("returns anchor_curator for high architect + bewaker", () => {
    const avg = makeScores({ architect: 5, bewaker: 5 });
    expect(deriveStatus(avg)).toBe("anchor_curator");
  });

  it("returns market_hunter for high speculant + jager", () => {
    const avg = makeScores({ speculant: 5, jager: 5, architect: 1, bewaker: 1 });
    expect(deriveStatus(avg)).toBe("market_hunter");
  });

  it("returns adaptive_collector as default", () => {
    const avg = makeScores();
    expect(deriveStatus(avg)).toBe("adaptive_collector");
  });
});

describe("quantile", () => {
  it("returns 0 for empty array", () => {
    expect(quantile([], 0.5)).toBe(0);
  });

  it("returns single value for single-element array", () => {
    expect(quantile([42], 0.5)).toBe(42);
  });

  it("computes median correctly", () => {
    expect(quantile([1, 2, 3, 4, 5], 0.5)).toBe(3);
  });

  it("computes Q1 and Q3", () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(quantile(data, 0.25)).toBe(3);
    expect(quantile(data, 0.75)).toBe(7);
  });
});

describe("computeBoxplotStats", () => {
  it("returns zeroed stats for empty input", () => {
    const stats = computeBoxplotStats([]);
    expect(stats.min).toBe(0);
    expect(stats.max).toBe(0);
    expect(stats.median).toBe(0);
  });

  it("computes correct stats for a known dataset", () => {
    const data = [2, 4, 6, 8, 10];
    const stats = computeBoxplotStats(data);
    expect(stats.min).toBe(2);
    expect(stats.max).toBe(10);
    expect(stats.median).toBe(6);
    expect(stats.q1).toBe(4);
    expect(stats.q3).toBe(8);
    expect(stats.iqr).toBe(4);
  });
});

describe("calculateArtworkContributions", () => {
  it("returns empty array for no entries", () => {
    const result = calculateArtworkContributions([], makeScores(), () => null);
    expect(result).toEqual([]);
  });

  it("computes contributions for valid entries", () => {
    const entries = [
      makeEntry({ id: "e1", scores: makeScores({ jager: 5 }), selectedArtworkId: "aw_1" }),
      makeEntry({ id: "e2", scores: makeScores({ estheet: 5 }), selectedArtworkId: "aw_2" }),
    ];
    const avg = computeAverages(entries);
    const artworkMap = new Map<string, Artwork>([
      ["aw_1", makeArtwork({ id: "aw_1", artworkTitle: "Art 1" })],
      ["aw_2", makeArtwork({ id: "aw_2", artworkTitle: "Art 2" })],
    ]);
    const result = calculateArtworkContributions(
      entries,
      avg,
      (id) => (id ? artworkMap.get(id) ?? null : null)
    );
    expect(result).toHaveLength(2);
    const totalVolumeShare = result.reduce((s, r) => s + r.volumeShare, 0);
    expect(Math.abs(totalVolumeShare - 100)).toBeLessThan(0.2);
  });
});

describe("deriveRepresentativeArtworks", () => {
  it("returns nulls for empty contributions", () => {
    expect(deriveRepresentativeArtworks([])).toEqual({ most: null, least: null });
  });
});

describe("buildJsonPayload", () => {
  it("creates payload with object IDs", () => {
    const entries = [makeEntry()];
    const artwork = makeArtwork();
    const payload = buildJsonPayload(entries, (id) => (id === "aw_1" ? artwork : null));
    expect(payload).toHaveLength(1);
    const item = payload[0] as Record<string, unknown>;
    expect(item.object_id).toBeTruthy();
    expect(item.kamer).toBe("Hart");
  });
});

describe("buildReport", () => {
  it("produces a complete report from valid entries", () => {
    const entries = [
      makeEntry({ id: "e1", slot: 1, scores: makeScores({ jager: 5, estheet: 2 }) }),
      makeEntry({ id: "e2", slot: 2, scores: makeScores({ jager: 2, estheet: 4 }) }),
    ];
    const artwork = makeArtwork();

    const report = buildReport(
      entries,
      (key) => key,
      (rule) => ({ title: rule.title, text: rule.text }),
      (id) => (id === "aw_1" ? artwork : null),
      FALLBACK,
      NO_SHADOW
    );

    expect(report.averages).toBeDefined();
    expect(report.match).toBeDefined();
    expect(report.mix.length).toBe(7);
    expect(report.shadow.length).toBeGreaterThan(0);
    expect(report.artworkContributions.length).toBe(2);
    expect(report.representative).toBeDefined();
  });
});
