import type { AxisScores, Locale, ShadowI18n, ShadowRule } from "@/types";

export const SHADOW_TRIGGER_THRESHOLD = 2.1;

export const SHADOW_RULES: ShadowRule[] = [
  {
    id: "lage_architect",
    check: (avg: AxisScores) => avg.architect <= SHADOW_TRIGGER_THRESHOLD,
    title: "De Vrijbuiter",
    text: "U verzamelt voor vrijheid, niet voor orde. Uw muren blijven een experimenteel veld in plaats van een fort.",
  },
  {
    id: "lage_speculant",
    check: (avg: AxisScores) => avg.speculant <= SHADOW_TRIGGER_THRESHOLD,
    title: "De Purist",
    text: "Geld speelt nauwelijks mee in de kern van uw keuzes. Passie stuurt, markt volgt op afstand.",
  },
  {
    id: "lage_jager_lage_speculant",
    check: (avg: AxisScores) => avg.jager <= SHADOW_TRIGGER_THRESHOLD && avg.speculant <= SHADOW_TRIGGER_THRESHOLD,
    title: "De Onbaatzuchtige",
    text: "U staat buiten de commerciële arena. Noch jacht, noch rendement vormt de drijvende motor.",
  },
  {
    id: "lage_architect_lage_bewaker",
    check: (avg: AxisScores) => avg.architect <= SHADOW_TRIGGER_THRESHOLD && avg.bewaker <= SHADOW_TRIGGER_THRESHOLD,
    title: "De Nomade",
    text: "Worteling en erfgoed zijn geen primaire behoefte. Uw collectie blijft bewust beweeglijk en open.",
  },
  {
    id: "lage_speculant_lage_avonturier",
    check: (avg: AxisScores) => avg.speculant <= SHADOW_TRIGGER_THRESHOLD && avg.avonturier <= SHADOW_TRIGGER_THRESHOLD,
    title: "De Anti-Hype Verzamelaar",
    text: "U bent immuun voor marktlawaai en intellectuele modegolven. U volgt een eigen, stabiele lijn.",
  },
];

export const SHADOW_I18N: Record<string, Record<Exclude<Locale, "nl">, ShadowI18n>> = {
  lage_architect: {
    en: { title: "The Free Spirit", text: "You collect for freedom, not for order. Your walls stay an experimental field rather than a fortress." },
    fr: { title: "L'Esprit Libre", text: "Vous collectionnez pour la liberté, pas pour l'ordre. Vos murs restent un terrain d'expérimentation plutôt qu'une forteresse." },
  },
  lage_speculant: {
    en: { title: "The Purist", text: "Money barely sits at the core of your choices. Passion leads; the market follows at a distance." },
    fr: { title: "Le Puriste", text: "L'argent pèse très peu au coeur de vos choix. La passion guide, le marché suit de loin." },
  },
  lage_jager_lage_speculant: {
    en: { title: "The Unselfish Collector", text: "You stand outside the commercial arena. Neither hunting nor returns is the driving motor." },
    fr: { title: "Le Désintéressé", text: "Vous vous tenez hors de l'arène commerciale. Ni la chasse ni le rendement ne sont votre moteur." },
  },
  lage_architect_lage_bewaker: {
    en: { title: "The Nomad", text: "Rooting and heritage are not primary needs. Your collection deliberately stays fluid and open." },
    fr: { title: "Le Nomade", text: "L'ancrage et l'héritage ne sont pas des besoins centraux. Votre collection reste volontairement mobile et ouverte." },
  },
  lage_speculant_lage_avonturier: {
    en: { title: "The Anti-Hype Collector", text: "You are immune to market noise and intellectual trend waves. You follow your own stable line." },
    fr: { title: "Le Collectionneur Anti-Hype", text: "Vous êtes immunisé contre le bruit du marché et les modes intellectuelles. Vous suivez votre propre ligne stable." },
  },
};
