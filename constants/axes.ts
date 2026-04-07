import type { AxisConfig, AxisI18n, AxisKey, Locale } from "@/types";

export const AXES: AxisConfig[] = [
  {
    key: "jager",
    label: "Jager",
    question: "Hoe groot was de adrenalinekick tijdens het aankoopproces?",
    altQuestion: "Hoeveel plezier haalde u uit het jagen en bemachtigen van dit werk?",
  },
  {
    key: "estheet",
    label: "Estheet",
    question: "Hoezeer bepaalt pure visuele schoonheid de waarde van dit stuk?",
    altQuestion: "In welke mate koos u dit werk vooral omdat het visueel raakt?",
  },
  {
    key: "verwant",
    label: "Verwant",
    question: "In welke mate herkent u uzelf of uw emoties in dit werk?",
    altQuestion: "Hoe sterk voelt dit werk persoonlijk of emotioneel verbonden met u?",
  },
  {
    key: "bewaker",
    label: "Bewaker",
    question: "Hoe belangrijk is dit werk als historisch erfgoed of canoniek stuk?",
    altQuestion: "In welke mate ziet u uzelf als bewaker van dit werk voor de toekomst?",
  },
  {
    key: "avonturier",
    label: "Avonturier",
    question: "Hoeveel intellectueel plezier gaf het ontdekken/begrijpen?",
    altQuestion: "Hoe belangrijk was nieuwsgierigheid en inhoudelijke ontdekking bij dit werk?",
  },
  {
    key: "speculant",
    label: "Speculant",
    question: "In hoeverre speelde financiële waarde of marktpotentie een rol?",
    altQuestion: "In welke mate dacht u aan toekomstige waarde of verkoopkansen?",
  },
  {
    key: "architect",
    label: "Architect",
    question: "Hoezeer draagt dit stuk bij aan orde en rust in uw leefomgeving?",
    altQuestion: "Hoe sterk helpt dit werk om uw ruimte coherent en gebalanceerd te maken?",
  },
];

export const AXIS_I18N: Record<AxisKey, Record<Exclude<Locale, "nl">, AxisI18n>> = {
  jager: {
    en: {
      label: "Hunter",
      question: "How strong was the acquisition thrill for this piece?",
      altQuestion: "How much did the hunt itself motivate this purchase?",
    },
    fr: {
      label: "Chasseur",
      question: "À quel point le frisson d'acquisition a-t-il été fort pour cette oeuvre ?",
      altQuestion: "Dans quelle mesure la chasse elle-même a motivé cet achat ?",
    },
  },
  estheet: {
    en: {
      label: "Aesthete",
      question: "How much does pure visual beauty define this piece's value for you?",
      altQuestion: "To what extent did you choose this work mainly for its visual impact?",
    },
    fr: {
      label: "Esthète",
      question: "Dans quelle mesure la beauté visuelle pure définit-elle la valeur de cette oeuvre ?",
      altQuestion: "À quel point avez-vous choisi cette oeuvre surtout pour son impact visuel ?",
    },
  },
  verwant: {
    en: {
      label: "Kindred",
      question: "To what extent do you recognize yourself or your emotions in this work?",
      altQuestion: "How personally or emotionally connected does this work feel to you?",
    },
    fr: {
      label: "Affinité",
      question: "Dans quelle mesure vous reconnaissez-vous, vous ou vos émotions, dans cette oeuvre ?",
      altQuestion: "À quel point cette oeuvre vous semble-t-elle personnellement ou émotionnellement proche ?",
    },
  },
  bewaker: {
    en: {
      label: "Custodian",
      question: "How important is this piece as historical heritage or a canonical work?",
      altQuestion: "To what extent do you see yourself as a steward of this work for the future?",
    },
    fr: {
      label: "Gardien",
      question: "Quelle importance cette oeuvre a-t-elle comme patrimoine historique ou oeuvre canonique ?",
      altQuestion: "Dans quelle mesure vous voyez-vous comme gardien de cette oeuvre pour l'avenir ?",
    },
  },
  avonturier: {
    en: {
      label: "Explorer",
      question: "How much intellectual joy did discovery and understanding bring you?",
      altQuestion: "How important were curiosity and intellectual discovery in this piece?",
    },
    fr: {
      label: "Explorateur",
      question: "Quel plaisir intellectuel vous ont apporté la découverte et la compréhension ?",
      altQuestion: "Dans quelle mesure la curiosité et la découverte intellectuelle ont-elles compté ?",
    },
  },
  speculant: {
    en: {
      label: "Speculator",
      question: "How much did financial value or market potential play a role?",
      altQuestion: "To what extent did future value or resale potential influence you?",
    },
    fr: {
      label: "Spéculateur",
      question: "Dans quelle mesure la valeur financière ou le potentiel de marché ont-ils joué un rôle ?",
      altQuestion: "À quel point la valeur future ou la revente potentielle vous ont-elles influencé ?",
    },
  },
  architect: {
    en: {
      label: "Architect",
      question: "How much does this piece contribute to order and calm in your space?",
      altQuestion: "How strongly does this work help create a coherent and balanced environment?",
    },
    fr: {
      label: "Architecte",
      question: "Dans quelle mesure cette oeuvre apporte-t-elle ordre et calme à votre espace ?",
      altQuestion: "À quel point cette oeuvre aide-t-elle à créer un environnement cohérent et équilibré ?",
    },
  },
};
