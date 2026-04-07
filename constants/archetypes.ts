import type { Archetype, ArchetypeI18n, Locale } from "@/types";

export const ARCHETYPES: Archetype[] = [
  {
    name: "Verlichte Jager",
    motto: "Ik jaag op de lijn die de wereld verklaart.",
    description:
      "U verzamelt als intellectuele ontdekkingsreiziger. De jacht, esthetiek en denkkracht versterken elkaar en maken elk object een toegangspoort tot dieper begrip.",
    scores: { jager: 5, estheet: 5, verwant: 4, bewaker: 2, avonturier: 5, speculant: 2, architect: 1 },
  },
  {
    name: "Spirituele Bewoner",
    motto: "Mijn collectie is een thuis voor betekenis.",
    description:
      "U verzamelt voor resonantie en verankering. Objecten worden dragers van emotie, ritueel en persoonlijke geborgenheid.",
    scores: { jager: 2, estheet: 3, verwant: 5, bewaker: 3, avonturier: 2, speculant: 1, architect: 5 },
  },
  {
    name: "Analytische Archivaris",
    motto: "Bewaren is begrijpen.",
    description:
      "U bouwt een kennis-ecosysteem. Context, herkomst en structuur wegen zwaar, en uw verzameling wordt een levend geheugen.",
    scores: { jager: 2, estheet: 2, verwant: 2, bewaker: 5, avonturier: 4, speculant: 2, architect: 3 },
  },
  {
    name: "Koele Strategist",
    motto: "Ik zie patronen voordat de markt ze ziet.",
    description:
      "U beslist met afstand en timing. U combineert competitieve jacht met berekende keuzes rond schaarste, waarde en positie.",
    scores: { jager: 5, estheet: 3, verwant: 1, bewaker: 4, avonturier: 2, speculant: 5, architect: 3 },
  },
  {
    name: "Pure Estheet",
    motto: "Vorm eerst, al het andere volgt.",
    description:
      "Uw beslissingen vertrekken bij visuele impact. U zoekt verfijning, ritme en compositie met minimale ruis van markt of prestige.",
    scores: { jager: 2, estheet: 5, verwant: 2, bewaker: 1, avonturier: 2, speculant: 1, architect: 2 },
  },
  {
    name: "Territorium-Bouwer",
    motto: "Mijn muren zijn een strategisch landschap.",
    description:
      "U verzamelt om ruimte te claimen. Elk object dient zowel impact als ordening en helpt een coherent territorium te markeren.",
    scores: { jager: 5, estheet: 3, verwant: 2, bewaker: 3, avonturier: 1, speculant: 3, architect: 5 },
  },
  {
    name: "Nieuwsgierige Pelgrim",
    motto: "Ik verzamel om mezelf te ontmoeten.",
    description:
      "U beweegt op innerlijke herkenning en intellectuele groei. De collectie is een routekaart van uw persoonlijke evolutie.",
    scores: { jager: 1, estheet: 3, verwant: 5, bewaker: 2, avonturier: 5, speculant: 1, architect: 2 },
  },
  {
    name: "Conceptuele Minimalist",
    motto: "Minder objecten, scherpere ideeën.",
    description:
      "U zoekt hoge conceptuele densiteit per stuk. Visuele helderheid en intellectuele spanning gaan boven bezit als volume.",
    scores: { jager: 2, estheet: 5, verwant: 3, bewaker: 2, avonturier: 5, speculant: 1, architect: 1 },
  },
  {
    name: "Recreatieve Omnivoor",
    motto: "Breed kijken houdt mijn verzameling levend.",
    description:
      "U combineert meerdere motieven zonder rigiditeit. U schakelt soepel tussen esthetiek, ontdekking en plezier in variatie.",
    scores: { jager: 3, estheet: 4, verwant: 3, bewaker: 2, avonturier: 4, speculant: 2, architect: 2 },
  },
  {
    name: "Onvrijwillige Curator",
    motto: "Ik draag zorg voor wat groter is dan mijzelf.",
    description:
      "U verzamelt vanuit plichtsbesef en behoud. Erfgoed en ordening domineren, terwijl jacht en markt op de achtergrond blijven.",
    scores: { jager: 1, estheet: 2, verwant: 3, bewaker: 5, avonturier: 1, speculant: 1, architect: 5 },
  },
];

export const ARCHETYPE_I18N: Record<string, Record<Exclude<Locale, "nl">, ArchetypeI18n>> = {
  "Verlichte Jager": {
    en: { name: "Enlightened Hunter", motto: "I hunt for the line that explains the world.", description: "You collect as an intellectual explorer. Hunt, aesthetics, and thinking reinforce each other and make each object a gateway to deeper understanding." },
    fr: { name: "Chasseur Éclairé", motto: "Je poursuis la ligne qui explique le monde.", description: "Vous collectionnez comme un explorateur intellectuel. La chasse, l'esthétique et la pensée se renforcent, faisant de chaque oeuvre une porte vers une compréhension plus profonde." },
  },
  "Spirituele Bewoner": {
    en: { name: "Spiritual Dweller", motto: "My collection is a home for meaning.", description: "You collect for resonance and grounding. Objects become carriers of emotion, ritual, and personal shelter." },
    fr: { name: "Habitant Spirituel", motto: "Ma collection est un foyer de sens.", description: "Vous collectionnez pour la résonance et l'ancrage. Les oeuvres deviennent des vecteurs d'émotion, de rituel et de refuge personnel." },
  },
  "Analytische Archivaris": {
    en: { name: "Analytical Archivist", motto: "To preserve is to understand.", description: "You build a knowledge ecosystem. Context, provenance, and structure carry serious weight, and your collection becomes a living memory." },
    fr: { name: "Archiviste Analytique", motto: "Conserver, c'est comprendre.", description: "Vous construisez un écosystème de connaissance. Le contexte, la provenance et la structure pèsent lourd, et votre collection devient une mémoire vivante." },
  },
  "Koele Strategist": {
    en: { name: "Cool Strategist", motto: "I see patterns before the market does.", description: "You decide with distance and timing. You combine competitive hunting with calculated choices around scarcity, value, and position." },
    fr: { name: "Stratège Lucide", motto: "Je vois les motifs avant le marché.", description: "Vous décidez avec recul et timing. Vous combinez une chasse compétitive et des choix calculés autour de la rareté, de la valeur et du positionnement." },
  },
  "Pure Estheet": {
    en: { name: "Pure Aesthete", motto: "Form first, everything else follows.", description: "Your decisions start from visual impact. You seek refinement, rhythm, and composition with minimal noise from market or prestige." },
    fr: { name: "Esthète Pur", motto: "La forme d'abord, le reste suit.", description: "Vos décisions partent de l'impact visuel. Vous recherchez raffinement, rythme et composition, avec un minimum de bruit lié au marché ou au prestige." },
  },
  "Territorium-Bouwer": {
    en: { name: "Territory Builder", motto: "My walls are a strategic landscape.", description: "You collect to claim space. Each object serves both impact and order, helping mark a coherent territory." },
    fr: { name: "Bâtisseur de Territoire", motto: "Mes murs forment un paysage stratégique.", description: "Vous collectionnez pour affirmer un territoire. Chaque oeuvre sert l'impact et l'ordre, et contribue à une cohérence spatiale." },
  },
  "Nieuwsgierige Pelgrim": {
    en: { name: "Curious Pilgrim", motto: "I collect to meet myself.", description: "You move through inner recognition and intellectual growth. The collection becomes a map of your personal evolution." },
    fr: { name: "Pèlerin Curieux", motto: "Je collectionne pour me rencontrer.", description: "Vous avancez par reconnaissance intérieure et croissance intellectuelle. La collection devient la carte de votre évolution personnelle." },
  },
  "Conceptuele Minimalist": {
    en: { name: "Conceptual Minimalist", motto: "Fewer objects, sharper ideas.", description: "You seek high conceptual density per piece. Visual clarity and intellectual tension matter more than volume of possession." },
    fr: { name: "Minimaliste Conceptuel", motto: "Moins d'objets, des idées plus nettes.", description: "Vous recherchez une forte densité conceptuelle par oeuvre. La clarté visuelle et la tension intellectuelle priment sur l'accumulation." },
  },
  "Recreatieve Omnivoor": {
    en: { name: "Recreational Omnivore", motto: "Looking broadly keeps my collection alive.", description: "You combine multiple motives without rigidity. You switch smoothly between aesthetics, discovery, and the pleasure of variation." },
    fr: { name: "Omnivore Récréatif", motto: "Voir large maintient ma collection vivante.", description: "Vous combinez plusieurs motivations sans rigidité. Vous passez souplement de l'esthétique à la découverte et au plaisir de la variété." },
  },
  "Onvrijwillige Curator": {
    en: { name: "Reluctant Curator", motto: "I care for what is larger than myself.", description: "You collect from duty and preservation. Heritage and order dominate, while hunt and market stay in the background." },
    fr: { name: "Curateur Malgré Lui", motto: "Je prends soin de ce qui me dépasse.", description: "Vous collectionnez par devoir et préservation. L'héritage et l'ordre dominent, tandis que la chasse et le marché restent en arrière-plan." },
  },
};

export const OMNIVORE_NAME = "Recreatieve Omnivoor";
export const OMNIVORE_DISTANCE_PENALTY = 0.4;
export const HYBRID_MARGIN_THRESHOLD = 0.06;
