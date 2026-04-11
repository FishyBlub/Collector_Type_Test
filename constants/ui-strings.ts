import type { Locale } from "@/types";

export interface UiStrings {
  languageLabel: string;
  heroTitle: string;
  heroIntro: string;
  heroMeta: string;
  libraryTitle: string;
  libraryIntro: string;
  manualFormTitle: string;
  pdfFormTitle: string;
  scrapeFormTitle: string;
  artworkListTitle: string;
  artworkSearchLabel: string;
  artworkSearchPlaceholder: string;
  inputTitle: string;
  inputIntro: string;
  resultsTitle: string;
  resultsIntro: string;
  radarCardTitle: string;
  archetypeCardTitle: string;
  archetypeMatchLabel: string;
  profileDistributionLabel: string;
  shadowCardTitle: string;
  shadowCardLabel: string;
  profileCatalogTitle: string;
  mixCardTitle: string;
  jsonCardTitle: string;
  manualSubmit: string;
  pdfSubmit: string;
  scrapeSubmit: string;
  clearArtworkList: string;
  analyzeBtn: string;
  demoBtn: string;
  resetBtn: string;
  pdfImportAll: string;
  pdfSuggestionsTitle: string;
  pdfProgressAnalyzing: string;
  pdfProgressDone: string;
  pdfProgressFailed: string;
  piecesLabel: string;
  pieces15: string;
  pieces12: string;
  pieces9: string;
  nextChamber: string;
  prevChamber: string;
  artworkName: string;
  artistName: string;
  pictureUrl: string;
  pdfFile: string;
  pictureUrlOptional: string;
  profileUrl: string;
  objectName: string;
  selectFromLibrary: string;
  removeSelection: string;
  noArtist: string;
  topDrivers: string;
  keyRejection: string;
  distanceRef: string;
  distanceHybrid: string;
  runnerUp: string;
  margin: string;
  autosaveActive: string;
  statusHighIntensity: string;
  statusAnchorCurator: string;
  statusMarketHunter: string;
  statusAdaptiveCollector: string;
  statusLabel: string;
  completionBadge: string;
  noShadowTitle: string;
  noShadowText: string;
  pdfHint: string;
  emptyArtworks: string;
  emptyArtworksSearch: string;
  artworkCount: string;
  artworkCountFiltered: string;
  entryHint: string;
  assignForSlot: string;
  representativeCardTitle: string;
  contributionChartTitle: string;
  contributionChartIntro: string;
  contributionAxisY: string;
  contributionAxisX: string;
  contributionChartLegend: string;
  representativeMost: string;
  representativeLeast: string;
  representativeNoData: string;
  contributionInBox: string;
  contributionBelowBox: string;
  contributionAboveBox: string;
  contributionOutlier: string;
  contributionRank: string;
  contributionImpactShare: string;
  contributionDistance: string;
  contributionTopAxes: string;
  heroSubtitle: string;
  scrapeInProgress: string;
  scrapeNoResults: string;
  scrapeSuccess: string;
  scrapeFailed: string;
  scoringLinked: string;
  unknownProfile: string;
  unknownProfileMotto: string;
  unknownProfileDescription: string;
  hybridProfileMotto: string;
  hybridProfileDescription: string;
}

export const UI_STRINGS: Record<Locale, UiStrings> = {
  nl: {
    languageLabel: "Taal",
    heroTitle: "Ontdek waarom je verzamelt, niet alleen wat je verzamelt",
    heroIntro:
      "Bouw eerst je artwork-bibliotheek, selecteer daarna 9, 12 of 15 topstukken via de Drie Kamers, scoor elk stuk op 7 DNA-assen en laat de engine jouw psychologische verzamelprofiel berekenen.",
    heroMeta: "7 assen · 10 archetypen · Shadow profiles",
    libraryTitle: "Data Entry Module · Artwork Bibliotheek",
    libraryIntro:
      "Integreert je data-entry module: voeg artworks toe (manueel of via scrape-link) en selecteer ze daarna per room-slot.",
    manualFormTitle: "Manuele invoer",
    pdfFormTitle: "PDF workflow",
    scrapeFormTitle: "Scrape vanaf 2DGalleries",
    artworkListTitle: "Beschikbare artworks",
    artworkSearchLabel: "Zoek in artworklijst",
    artworkSearchPlaceholder: "Zoek op titel, artiest of bron",
    inputTitle: "Input-Laag · De Drie Kamers",
    inputIntro:
      "Kies 9, 12 of 15 objecten. De app verdeelt die gelijkmatig over de 3 kamers. Elk object krijgt 7 scores op een schaal van 1 (laag) tot 5 (hoog).",
    resultsTitle: "Interpretatie-Laag · Jouw DNA-rapport",
    resultsIntro: "Radar chart, primair archetype, shadow analysis, DNA-mix en technische JSON-output.",
    radarCardTitle: "DNA-Vingerafdruk",
    archetypeCardTitle: "Primair Archetype",
    archetypeMatchLabel: "Match",
    profileDistributionLabel: "Profielverdeling",
    shadowCardTitle: "Shadow Analysis",
    shadowCardLabel: "Jouw actieve nee",
    profileCatalogTitle: "Alle profieltypes",
    mixCardTitle: "DNA-Mix",
    jsonCardTitle: "JSON Data-structuur",
    manualSubmit: "Voeg artwork toe",
    pdfSubmit: "Voeg PDF-lijst toe",
    scrapeSubmit: "Scrape artworks",
    clearArtworkList: "Wis artworklijst",
    analyzeBtn: "Analyseer mijn DNA",
    demoBtn: "Laad voorbeeldprofiel",
    resetBtn: "Reset formulier",
    pdfImportAll: "Voeg voorgestelde PDF-lijst toe",
    pdfSuggestionsTitle: "Voorgestelde kunstwerken uit PDF",
    pdfProgressAnalyzing: "PDF-analyse bezig...",
    pdfProgressDone: "PDF-analyse voltooid.",
    pdfProgressFailed: "PDF-analyse onderbroken.",
    piecesLabel: "Aantal objecten voor analyse",
    pieces15: "15 (volledig profiel)",
    pieces12: "12",
    pieces9: "9",
    nextChamber: "Volgende kamer",
    prevChamber: "Vorige kamer",
    artworkName: "Artwork naam",
    artistName: "Artiest naam",
    pictureUrl: "Picture URL",
    pdfFile: "PDF bestand",
    pictureUrlOptional: "Picture URL (optioneel)",
    profileUrl: "Profiel URL",
    objectName: "Objectnaam of ID",
    selectFromLibrary: "Selecteer uit bibliotheek",
    removeSelection: "Verwijder selectie",
    noArtist: "Onbekende artiest",
    topDrivers: "Top 3 drijfveren",
    keyRejection: "Sterkste afwijzing",
    distanceRef: "Euclidische afstand tot referentie",
    distanceHybrid: "Indicatieve afstand tot dubbelprofiel",
    runnerUp: "runner-up",
    margin: "marge",
    autosaveActive: "Autosave actief.",
    statusHighIntensity: "Hoog-intensieve verkenner",
    statusAnchorCurator: "Verankerende curator",
    statusMarketHunter: "Marktgedreven jager",
    statusAdaptiveCollector: "Adaptieve verzamelaar",
    statusLabel: "Status",
    completionBadge: "{count} / {total} artworks geselecteerd",
    noShadowTitle: "Geen dominante schaduwtrigger",
    noShadowText:
      "Er is geen as op of onder {threshold}. Uw profiel toont eerder een evenwichtige mix dan een uitgesproken actieve nee.",
    pdfHint:
      "Upload een PDF; de app stelt een lijst kunstwerken voor. Verwijder wat niet klopt en voeg daarna de lijst toe.",
    emptyArtworks: "Nog geen artworks beschikbaar. Voeg eerst items toe in deze module.",
    emptyArtworksSearch: "Geen artworks gevonden voor deze zoekterm.",
    artworkCount: "{count} artworks in bibliotheek",
    artworkCountFiltered: "{shown} van {total} artworks in bibliotheek",
    entryHint: "Kamer {n} van 3 · Duplicaten zijn toegestaan indien dat inhoudelijk klopt.",
    assignForSlot: "Selecteer voor {chamber} · {slot}",
    representativeCardTitle: "Representativiteit van kunstwerken",
    contributionChartTitle: "Bijdrage per kunstwerk (lollipop)",
    contributionChartIntro: "Hoe hoger een werk scoort, hoe sterker het je profiel mee bepaalt. Werken boven Q3 zijn het meest representatief; werken onder Q1 dragen het minst bij.",
    contributionAxisY: "Profielbijdrage-score",
    contributionAxisX: "Kunstwerken (laag → hoog)",
    contributionChartLegend: "Gesorteerde lollipop chart (laag naar hoog): elk punt = één kunstwerk. Q1, mediaan en Q3 tonen de boxplot-drempels.",
    representativeMost: "Meest representatief",
    representativeLeast: "Minst representatief",
    representativeNoData: "Geen bijdragedata beschikbaar.",
    contributionInBox: "Binnen IQR",
    contributionBelowBox: "Onder Q1",
    contributionAboveBox: "Boven Q3",
    contributionOutlier: "Uitbijter",
    contributionRank: "Rang",
    contributionImpactShare: "Impact-aandeel",
    contributionDistance: "Afstand",
    contributionTopAxes: "Sterkste assen",
    heroSubtitle: "Collector DNA · The Narrative Engine",
    scrapeInProgress: "Scraping bezig...",
    scrapeNoResults: "Geen artworks gevonden op deze URL.",
    scrapeSuccess: "{count} artworks geïmporteerd.",
    scrapeFailed: "Scrapen mislukt. Is de URL correct?",
    scoringLinked: "Scoring gelinkt over {count} slots",
    unknownProfile: "Onbekend profiel",
    unknownProfileMotto: "-",
    unknownProfileDescription: "Geen archetype data beschikbaar.",
    hybridProfileMotto: "Uw verzamel-DNA balanceert tussen twee archetypen.",
    hybridProfileDescription: "Uw scorepatroon ligt heel dicht bij zowel {primary} als {secondary}. Dit resultaat wordt bewust als gemengd profiel getoond.",
  },
  en: {
    languageLabel: "Language",
    heroTitle: "Discover why you collect, not only what you collect",
    heroIntro:
      "First build your artwork library, then select 9, 12 or 15 key works through the Three Chambers, score each work on 7 DNA axes, and let the engine calculate your psychological collector profile.",
    heroMeta: "7 axes · 10 archetypes · Shadow profiles",
    libraryTitle: "Data Entry Module · Artwork Library",
    libraryIntro:
      "Integrates your data-entry module: add artworks (manual or scrape link) and then assign them per room slot.",
    manualFormTitle: "Manual entry",
    pdfFormTitle: "PDF workflow",
    scrapeFormTitle: "Scrape from 2DGalleries",
    artworkListTitle: "Available artworks",
    artworkSearchLabel: "Search in artwork list",
    artworkSearchPlaceholder: "Search by title, artist, or source",
    inputTitle: "Input Layer · The Three Chambers",
    inputIntro:
      "Choose 9, 12 or 15 objects. The app distributes them evenly across 3 chambers. Each object gets 7 scores on a 1 (low) to 5 (high) scale.",
    resultsTitle: "Interpretation Layer · Your DNA Report",
    resultsIntro: "Radar chart, primary archetype, shadow analysis, DNA mix, and technical JSON output.",
    radarCardTitle: "DNA Fingerprint",
    archetypeCardTitle: "Primary Archetype",
    archetypeMatchLabel: "Match",
    profileDistributionLabel: "Profile distribution",
    shadowCardTitle: "Shadow Analysis",
    shadowCardLabel: "Your active no",
    profileCatalogTitle: "All profile types",
    mixCardTitle: "DNA Mix",
    jsonCardTitle: "JSON Data Structure",
    manualSubmit: "Add artwork",
    pdfSubmit: "Add PDF list",
    scrapeSubmit: "Scrape artworks",
    clearArtworkList: "Clear artwork list",
    analyzeBtn: "Analyze my DNA",
    demoBtn: "Load demo profile",
    resetBtn: "Reset form",
    pdfImportAll: "Add suggested PDF list",
    pdfSuggestionsTitle: "Suggested artworks from PDF",
    pdfProgressAnalyzing: "PDF analysis in progress...",
    pdfProgressDone: "PDF analysis completed.",
    pdfProgressFailed: "PDF analysis interrupted.",
    piecesLabel: "Number of objects for analysis",
    pieces15: "15 (full profile)",
    pieces12: "12",
    pieces9: "9",
    nextChamber: "Next chamber",
    prevChamber: "Previous chamber",
    artworkName: "Artwork name",
    artistName: "Artist name",
    pictureUrl: "Picture URL",
    pdfFile: "PDF file",
    pictureUrlOptional: "Picture URL (optional)",
    profileUrl: "Profile URL",
    objectName: "Object name or ID",
    selectFromLibrary: "Select from library",
    removeSelection: "Remove selection",
    noArtist: "Unknown artist",
    topDrivers: "Top 3 drivers",
    keyRejection: "Key rejection",
    distanceRef: "Euclidean distance to reference",
    distanceHybrid: "Indicative distance to dual profile",
    runnerUp: "runner-up",
    margin: "margin",
    autosaveActive: "Autosave active.",
    statusHighIntensity: "High-Intensity Explorer",
    statusAnchorCurator: "Anchor Curator",
    statusMarketHunter: "Market-Driven Hunter",
    statusAdaptiveCollector: "Adaptive Collector",
    statusLabel: "Status",
    completionBadge: "{count} / {total} artworks selected",
    noShadowTitle: "No dominant shadow trigger",
    noShadowText:
      "No axis is at or below {threshold}. Your profile shows a balanced mix rather than a pronounced active no.",
    pdfHint:
      "Upload a PDF; the app suggests a list of artworks. Remove incorrect entries and then add the list.",
    emptyArtworks: "No artworks available yet. Add items first in this module.",
    emptyArtworksSearch: "No artworks found for this search term.",
    artworkCount: "{count} artworks in library",
    artworkCountFiltered: "{shown} of {total} artworks in library",
    entryHint: "Chamber {n} of 3 · Duplicates are allowed if it makes sense.",
    assignForSlot: "Select for {chamber} · {slot}",
    representativeCardTitle: "Artwork Representativeness",
    contributionChartTitle: "Contribution per artwork (lollipop)",
    contributionChartIntro: "The higher an artwork scores, the more it shapes your profile. Works above Q3 are the most representative; works below Q1 contribute the least.",
    contributionAxisY: "Profile contribution score",
    contributionAxisX: "Artworks (low → high)",
    contributionChartLegend: "Sorted lollipop chart (low to high): each dot = one artwork. Q1, median and Q3 show the boxplot thresholds.",
    representativeMost: "Most representative",
    representativeLeast: "Least representative",
    representativeNoData: "No contribution data available.",
    contributionInBox: "Inside IQR",
    contributionBelowBox: "Below Q1",
    contributionAboveBox: "Above Q3",
    contributionOutlier: "Outlier",
    contributionRank: "Rank",
    contributionImpactShare: "Impact share",
    contributionDistance: "Distance",
    contributionTopAxes: "Strongest axes",
    heroSubtitle: "Collector DNA · The Narrative Engine",
    scrapeInProgress: "Scraping...",
    scrapeNoResults: "No artworks found at this URL.",
    scrapeSuccess: "{count} artworks imported.",
    scrapeFailed: "Scrape failed. Is the URL correct?",
    scoringLinked: "Scoring linked across {count} slots",
    unknownProfile: "Unknown profile",
    unknownProfileMotto: "-",
    unknownProfileDescription: "No archetype data available.",
    hybridProfileMotto: "Your collector DNA balances between two archetypes.",
    hybridProfileDescription: "Your score pattern is very close to both {primary} and {secondary}. This result is deliberately shown as a mixed profile.",
  },
  fr: {
    languageLabel: "Langue",
    heroTitle: "Découvrez pourquoi vous collectionnez, pas seulement ce que vous collectionnez",
    heroIntro:
      "Commencez par construire votre bibliothèque d'oeuvres, puis sélectionnez 9, 12 ou 15 pièces clés via les Trois Chambres, notez chaque oeuvre sur 7 axes ADN et laissez le moteur calculer votre profil psychologique de collectionneur.",
    heroMeta: "7 axes · 10 archétypes · Profils d'ombre",
    libraryTitle: "Module Data Entry · Bibliothèque d'oeuvres",
    libraryIntro:
      "Intègre votre module d'encodage: ajoutez des oeuvres (manuel ou lien de scrape), puis assignez-les par emplacement de salle.",
    manualFormTitle: "Encodage manuel",
    pdfFormTitle: "Workflow PDF",
    scrapeFormTitle: "Scrape depuis 2DGalleries",
    artworkListTitle: "Oeuvres disponibles",
    artworkSearchLabel: "Rechercher dans la liste",
    artworkSearchPlaceholder: "Rechercher par titre, artiste ou source",
    inputTitle: "Couche d'Entrée · Les Trois Chambres",
    inputIntro:
      "Choisissez 9, 12 ou 15 objets. L'application les répartit équitablement sur 3 chambres. Chaque objet reçoit 7 scores sur une échelle de 1 (faible) à 5 (élevé).",
    resultsTitle: "Couche d'Interprétation · Votre Rapport ADN",
    resultsIntro: "Radar chart, archétype principal, analyse d'ombre, mix ADN et sortie JSON technique.",
    radarCardTitle: "Empreinte ADN",
    archetypeCardTitle: "Archétype Principal",
    archetypeMatchLabel: "Correspondance",
    profileDistributionLabel: "Répartition des profils",
    shadowCardTitle: "Analyse d'Ombre",
    shadowCardLabel: "Votre non actif",
    profileCatalogTitle: "Tous les types de profils",
    mixCardTitle: "Mix ADN",
    jsonCardTitle: "Structure JSON",
    manualSubmit: "Ajouter l'oeuvre",
    pdfSubmit: "Ajouter la liste PDF",
    scrapeSubmit: "Scraper les oeuvres",
    clearArtworkList: "Vider la liste",
    analyzeBtn: "Analyser mon ADN",
    demoBtn: "Charger un profil démo",
    resetBtn: "Réinitialiser le formulaire",
    pdfImportAll: "Ajouter la liste PDF suggérée",
    pdfSuggestionsTitle: "Oeuvres suggérées depuis le PDF",
    pdfProgressAnalyzing: "Analyse du PDF en cours...",
    pdfProgressDone: "Analyse du PDF terminée.",
    pdfProgressFailed: "Analyse du PDF interrompue.",
    piecesLabel: "Nombre d'objets pour l'analyse",
    pieces15: "15 (profil complet)",
    pieces12: "12",
    pieces9: "9",
    nextChamber: "Chambre suivante",
    prevChamber: "Chambre précédente",
    artworkName: "Nom de l'oeuvre",
    artistName: "Nom de l'artiste",
    pictureUrl: "URL image",
    pdfFile: "Fichier PDF",
    pictureUrlOptional: "URL image (optionnel)",
    profileUrl: "URL du profil",
    objectName: "Nom d'objet ou ID",
    selectFromLibrary: "Sélectionner depuis la bibliothèque",
    removeSelection: "Retirer la sélection",
    noArtist: "Artiste inconnu",
    topDrivers: "Top 3 moteurs",
    keyRejection: "Rejet clé",
    distanceRef: "Distance euclidienne à la référence",
    distanceHybrid: "Distance indicative au profil double",
    runnerUp: "deuxième",
    margin: "écart",
    autosaveActive: "Autosave actif.",
    statusHighIntensity: "Explorateur Haute Intensité",
    statusAnchorCurator: "Curateur d'Ancrage",
    statusMarketHunter: "Chasseur Orienté Marché",
    statusAdaptiveCollector: "Collectionneur Adaptatif",
    statusLabel: "Statut",
    completionBadge: "{count} / {total} oeuvres sélectionnées",
    noShadowTitle: "Aucun déclencheur d'ombre dominant",
    noShadowText:
      "Aucun axe n'est à ou sous {threshold}. Votre profil montre un mélange équilibré plutôt qu'un non actif marqué.",
    pdfHint:
      "Uploadez un PDF ; l'app suggère une liste d'oeuvres. Supprimez les erreurs puis ajoutez la liste.",
    emptyArtworks: "Aucune oeuvre disponible pour l'instant. Ajoutez d'abord des éléments dans ce module.",
    emptyArtworksSearch: "Aucune oeuvre trouvée pour ce terme de recherche.",
    artworkCount: "{count} oeuvres dans la bibliothèque",
    artworkCountFiltered: "{shown} sur {total} oeuvres dans la bibliothèque",
    entryHint: "Chambre {n} de 3 · Les doublons sont autorisés si cela fait sens.",
    assignForSlot: "Sélectionner pour {chamber} · {slot}",
    representativeCardTitle: "Représentativité des oeuvres",
    contributionChartTitle: "Contribution par oeuvre (lollipop)",
    contributionChartIntro: "Plus une oeuvre obtient un score élevé, plus elle détermine votre profil. Les oeuvres au-dessus de Q3 sont les plus représentatives ; celles en dessous de Q1 contribuent le moins.",
    contributionAxisY: "Score de contribution au profil",
    contributionAxisX: "Oeuvres (faible → élevé)",
    contributionChartLegend: "Graphique lollipop trié (faible vers élevé) : chaque point = une oeuvre. Q1, médiane et Q3 montrent les seuils du boxplot.",
    representativeMost: "La plus représentative",
    representativeLeast: "La moins représentative",
    representativeNoData: "Aucune donnée de contribution disponible.",
    contributionInBox: "Dans l'IQR",
    contributionBelowBox: "Sous Q1",
    contributionAboveBox: "Au-dessus de Q3",
    contributionOutlier: "Valeur aberrante",
    contributionRank: "Rang",
    contributionImpactShare: "Part d'impact",
    contributionDistance: "Distance",
    contributionTopAxes: "Axes les plus forts",
    heroSubtitle: "Collector DNA · The Narrative Engine",
    scrapeInProgress: "Scraping en cours...",
    scrapeNoResults: "Aucune oeuvre trouvée à cette URL.",
    scrapeSuccess: "{count} oeuvres importées.",
    scrapeFailed: "Échec du scraping. L'URL est-elle correcte ?",
    scoringLinked: "Scoring lié sur {count} emplacements",
    unknownProfile: "Profil inconnu",
    unknownProfileMotto: "-",
    unknownProfileDescription: "Aucune donnée d'archétype disponible.",
    hybridProfileMotto: "Votre ADN de collectionneur oscille entre deux archétypes.",
    hybridProfileDescription: "Votre patron de scores est très proche de {primary} et {secondary}. Ce résultat est volontairement affiché comme profil mixte.",
  },
};
