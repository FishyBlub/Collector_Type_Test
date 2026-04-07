import type { ChamberConfig, ChamberI18n, ChamberKey, Locale } from "@/types";

export const CHAMBERS: ChamberConfig[] = [
  {
    key: "Hart",
    title: "Kamer van het Hart",
    prompt: "Wat zou u nooit verkopen? Wat spiegelt uw ziel?",
  },
  {
    key: "Rede",
    title: "Kamer van de Rede",
    prompt: "Wat is historisch cruciaal of een slimme investering?",
  },
  {
    key: "Jacht",
    title: "Kamer van de Jacht",
    prompt: "Waar was de kick van het verwerven groter dan het bezit?",
  },
];

export const CHAMBER_I18N: Record<ChamberKey, Record<Exclude<Locale, "nl">, ChamberI18n>> = {
  Hart: {
    en: { key: "Heart", title: "Chamber of the Heart", prompt: "What would you never sell? What mirrors your soul?" },
    fr: { key: "Coeur", title: "Chambre du Coeur", prompt: "Que ne vendriez-vous jamais ? Qu'est-ce qui reflète votre âme ?" },
  },
  Rede: {
    en: { key: "Reason", title: "Chamber of Reason", prompt: "What is historically crucial or a smart investment?" },
    fr: { key: "Raison", title: "Chambre de la Raison", prompt: "Qu'est-ce qui est historiquement crucial ou un investissement avisé ?" },
  },
  Jacht: {
    en: { key: "Hunt", title: "Chamber of the Hunt", prompt: "Where was the thrill of acquiring greater than owning?" },
    fr: { key: "Chasse", title: "Chambre de la Chasse", prompt: "Où le frisson d'acquérir a-t-il été plus fort que la possession ?" },
  },
};

export const DEFAULT_SLOTS_PER_CHAMBER = 5;
export const SLOT_OPTIONS = [3, 4, 5] as const;
