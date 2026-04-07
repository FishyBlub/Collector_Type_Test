export type Locale = "nl" | "en" | "fr";

export type AxisKey =
  | "jager"
  | "estheet"
  | "verwant"
  | "bewaker"
  | "avonturier"
  | "speculant"
  | "architect";

export type ChamberKey = "Hart" | "Rede" | "Jacht";

export type QuestionVariant = "primary" | "alt";

export interface AxisConfig {
  key: AxisKey;
  label: string;
  question: string;
  altQuestion: string;
}

export interface AxisI18n {
  label: string;
  question: string;
  altQuestion: string;
}

export interface ChamberConfig {
  key: ChamberKey;
  title: string;
  prompt: string;
}

export interface ChamberI18n {
  key: string;
  title: string;
  prompt: string;
}

export type AxisScores = Record<AxisKey, number>;

export interface Archetype {
  name: string;
  motto: string;
  description: string;
  scores: AxisScores;
}

export interface ArchetypeI18n {
  name: string;
  motto: string;
  description: string;
}

export interface ShadowRule {
  id: string;
  check: (avg: AxisScores) => boolean;
  title: string;
  text: string;
}

export interface ShadowI18n {
  title: string;
  text: string;
}

export interface Artwork {
  id: string;
  artworkTitle: string;
  artistName: string;
  imageUrl: string;
  source: string;
}

export interface Entry {
  id: string;
  chamber: ChamberKey;
  slot: number;
  objectName: string;
  selectedArtworkId: string | null;
  scores: AxisScores;
}

export interface RankedArchetype extends Archetype {
  distance: number;
  adjustedDistance: number;
}

export interface ArchetypeMatch {
  name: string;
  motto: string;
  description: string;
  distance: number;
  adjustedDistance: number;
  runnerUp: string;
  marginToNext: number;
  confidence: "high" | "medium" | "hybrid" | "low";
}

export interface ProfileDistributionItem extends RankedArchetype {
  percentage: number;
}

export interface MixItem {
  key: AxisKey;
  label: string;
  value: number;
  share: number;
}

export interface ShadowHit {
  title: string;
  text: string;
}

export type StatusLabel =
  | "high_intensity_explorer"
  | "anchor_curator"
  | "market_hunter"
  | "adaptive_collector";

export interface Report {
  averages: AxisScores;
  match: ArchetypeMatch;
  profileDistribution: ProfileDistributionItem[];
  mix: MixItem[];
  shadow: ShadowHit[];
  status: StatusLabel;
  topDrivers: MixItem[];
  keyRejection: MixItem;
  jsonPayload: unknown[];
}
