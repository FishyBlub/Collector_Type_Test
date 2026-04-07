"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Artwork,
  AxisKey,
  AxisScores,
  ChamberKey,
  Entry,
  Locale,
  QuestionVariant,
  Report,
} from "@/types";
import { AXES } from "@/constants/axes";
import { CHAMBERS, DEFAULT_SLOTS_PER_CHAMBER } from "@/constants/chambers";
import { buildReport } from "@/lib/engine";
import {
  getAxisLabel,
  getShadowTitle,
  getShadowText,
  getUiStrings,
} from "@/lib/i18n";

const STORAGE_KEY = "collector_dna_entries_v1";
const LOCALE_KEY = "collector_dna_locale_v1";
const AUTOSAVE_DELAY = 300;

function defaultScores(): AxisScores {
  return AXES.reduce((acc, a) => {
    acc[a.key] = 3;
    return acc;
  }, {} as AxisScores);
}

function createInitialEntries(): Entry[] {
  const entries: Entry[] = [];
  for (const chamber of CHAMBERS) {
    for (let slot = 1; slot <= 5; slot++) {
      entries.push({
        id: `${chamber.key.toLowerCase()}_${slot}`,
        chamber: chamber.key,
        slot,
        objectName: "",
        selectedArtworkId: null,
        scores: defaultScores(),
      });
    }
  }
  return entries;
}

interface SavedState {
  entries: Entry[];
  artworks: Artwork[];
  slotsPerChamber: number;
  activeChamber: ChamberKey;
}

interface DNAContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: ReturnType<typeof getUiStrings>;

  artworks: Artwork[];
  addArtwork: (a: Artwork) => void;
  addArtworks: (a: Artwork[]) => void;
  clearArtworks: () => void;

  entries: Entry[];
  slotsPerChamber: number;
  setSlotsPerChamber: (n: number) => void;
  activeChamber: ChamberKey;
  setActiveChamber: (c: ChamberKey) => void;

  updateScore: (entryId: string, axis: AxisKey, value: number) => void;
  assignArtwork: (entryId: string, artworkId: string) => void;
  clearEntryArtwork: (entryId: string) => void;
  setEntryObjectName: (entryId: string, name: string) => void;

  axisVariants: Record<AxisKey, QuestionVariant>;
  toggleAxisVariant: (axis: AxisKey) => void;

  getArtworkById: (id: string | null) => Artwork | null;
  getActiveEntries: () => Entry[];
  getMissingCount: () => number;

  report: Report | null;
  runAnalysis: () => Report | null;
  resetAll: () => void;
  loadDemo: () => void;

  saveStatus: string;
}

const DNACtx = createContext<DNAContextValue | null>(null);

export function useDNA(): DNAContextValue {
  const ctx = useContext(DNACtx);
  if (!ctx) throw new Error("useDNA must be used inside DNAProvider");
  return ctx;
}

export function DNAProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("nl");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [entries, setEntries] = useState<Entry[]>(createInitialEntries);
  const [slotsPerChamber, setSlotsPerChamber] = useState(DEFAULT_SLOTS_PER_CHAMBER);
  const [activeChamber, setActiveChamber] = useState<ChamberKey>("Hart");
  const [report, setReport] = useState<Report | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [axisVariants, setAxisVariants] = useState<Record<AxisKey, QuestionVariant>>(
    () => AXES.reduce((acc, a) => { acc[a.key] = "primary"; return acc; }, {} as Record<AxisKey, QuestionVariant>)
  );

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrated = useRef(false);

  const t = useMemo(() => getUiStrings(locale), [locale]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem(LOCALE_KEY);
      if (savedLocale && ["nl", "en", "fr"].includes(savedLocale)) {
        setLocaleState(savedLocale as Locale);
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: SavedState = JSON.parse(raw);
        if (saved.entries?.length) setEntries(saved.entries);
        if (saved.artworks?.length) setArtworks(saved.artworks);
        if (saved.slotsPerChamber) setSlotsPerChamber(saved.slotsPerChamber);
        if (saved.activeChamber) setActiveChamber(saved.activeChamber);
      }
    } catch {
      // ignore
    }
    hydrated.current = true;
  }, []);

  const scheduleSave = useCallback(
    (msg?: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        try {
          const data: SavedState = {
            entries,
            artworks,
            slotsPerChamber,
            activeChamber,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          setSaveStatus(msg ?? t.autosaveActive);
        } catch {
          // ignore
        }
      }, AUTOSAVE_DELAY);
    },
    [entries, artworks, slotsPerChamber, activeChamber, t.autosaveActive]
  );

  useEffect(() => {
    if (hydrated.current) scheduleSave();
  }, [entries, artworks, slotsPerChamber, activeChamber, scheduleSave]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(LOCALE_KEY, l); } catch { /* */ }
  }, []);

  const addArtwork = useCallback((a: Artwork) => {
    setArtworks((prev) => {
      if (prev.some((x) => x.id === a.id)) return prev;
      return [...prev, a];
    });
  }, []);

  const addArtworks = useCallback((batch: Artwork[]) => {
    setArtworks((prev) => {
      const ids = new Set(prev.map((x) => x.id));
      const fresh = batch.filter((a) => !ids.has(a.id));
      return fresh.length ? [...prev, ...fresh] : prev;
    });
  }, []);

  const clearArtworks = useCallback(() => setArtworks([]), []);

  const getArtworkById = useCallback(
    (id: string | null): Artwork | null => {
      if (!id) return null;
      return artworks.find((a) => a.id === id) ?? null;
    },
    [artworks]
  );

  const getActiveEntries = useCallback(
    (): Entry[] => entries.filter((e) => e.slot <= slotsPerChamber),
    [entries, slotsPerChamber]
  );

  const getMissingCount = useCallback((): number => {
    const active = entries.filter((e) => e.slot <= slotsPerChamber);
    return active.filter((e) => !e.selectedArtworkId).length;
  }, [entries, slotsPerChamber]);

  const updateScore = useCallback(
    (entryId: string, axis: AxisKey, value: number) => {
      const clamped = Math.max(1, Math.min(5, Math.round(value)));
      setEntries((prev) => {
        const target = prev.find((e) => e.id === entryId);
        const artworkId = target?.selectedArtworkId;
        return prev.map((e) => {
          if (e.id === entryId)
            return { ...e, scores: { ...e.scores, [axis]: clamped } };
          if (artworkId && e.selectedArtworkId === artworkId && e.slot <= slotsPerChamber)
            return { ...e, scores: { ...e.scores, [axis]: clamped } };
          return e;
        });
      });
    },
    [slotsPerChamber]
  );

  const assignArtwork = useCallback(
    (entryId: string, artworkId: string) => {
      const artwork = artworks.find((a) => a.id === artworkId);
      if (!artwork) return;

      setEntries((prev) => {
        const linked = prev.find(
          (e) => e.id !== entryId && e.selectedArtworkId === artworkId && e.slot <= slotsPerChamber
        );
        return prev.map((e) => {
          if (e.id !== entryId) return e;
          return {
            ...e,
            selectedArtworkId: artworkId,
            objectName: artwork.artworkTitle,
            scores: linked ? { ...linked.scores } : e.scores,
          };
        });
      });
    },
    [artworks, slotsPerChamber]
  );

  const clearEntryArtwork = useCallback((entryId: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId ? { ...e, selectedArtworkId: null, objectName: "" } : e
      )
    );
  }, []);

  const setEntryObjectName = useCallback((entryId: string, name: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, objectName: name } : e))
    );
  }, []);

  const toggleAxisVariant = useCallback((axis: AxisKey) => {
    setAxisVariants((prev) => ({
      ...prev,
      [axis]: prev[axis] === "primary" ? "alt" : "primary",
    }));
  }, []);

  const runAnalysis = useCallback((): Report | null => {
    const active = entries.filter((e) => e.slot <= slotsPerChamber);
    const missing = active.filter((e) => !e.selectedArtworkId);
    if (missing.length > 0) return null;

    const r = buildReport(
      active,
      (key) => getAxisLabel(locale, key),
      (rule) => ({
        title: getShadowTitle(locale, rule.id, rule.title),
        text: getShadowText(locale, rule.id, rule.text),
      }),
      (id) => getArtworkById(id)
    );
    setReport(r);
    return r;
  }, [entries, slotsPerChamber, locale, getArtworkById]);

  const resetAll = useCallback(() => {
    setEntries(createInitialEntries());
    setArtworks([]);
    setSlotsPerChamber(DEFAULT_SLOTS_PER_CHAMBER);
    setActiveChamber("Hart");
    setReport(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
  }, []);

  const loadDemo = useCallback(() => {
    const demoArtworks: Artwork[] = [
      { id: "demo_1", artworkTitle: "Nell Acqua", artistName: "Lorenzo Mattotti", imageUrl: "", source: "demo" },
      { id: "demo_2", artworkTitle: "Blacksad", artistName: "Juanjo Guarnido", imageUrl: "", source: "demo" },
      { id: "demo_3", artworkTitle: "Corto Maltese", artistName: "Hugo Pratt", imageUrl: "", source: "demo" },
      { id: "demo_4", artworkTitle: "Blueberry", artistName: "Jean Giraud", imageUrl: "", source: "demo" },
      { id: "demo_5", artworkTitle: "Akira", artistName: "Katsuhiro Otomo", imageUrl: "", source: "demo" },
      { id: "demo_6", artworkTitle: "Tintin", artistName: "Hergé", imageUrl: "", source: "demo" },
      { id: "demo_7", artworkTitle: "Le Chat", artistName: "Philippe Geluck", imageUrl: "", source: "demo" },
      { id: "demo_8", artworkTitle: "XIII", artistName: "William Vance", imageUrl: "", source: "demo" },
      { id: "demo_9", artworkTitle: "Thorgal", artistName: "Grzegorz Rosiński", imageUrl: "", source: "demo" },
      { id: "demo_10", artworkTitle: "Largo Winch", artistName: "Philippe Francq", imageUrl: "", source: "demo" },
      { id: "demo_11", artworkTitle: "Blake & Mortimer", artistName: "Edgar P. Jacobs", imageUrl: "", source: "demo" },
      { id: "demo_12", artworkTitle: "Lucky Luke", artistName: "Morris", imageUrl: "", source: "demo" },
      { id: "demo_13", artworkTitle: "Gaston Lagaffe", artistName: "André Franquin", imageUrl: "", source: "demo" },
      { id: "demo_14", artworkTitle: "Astérix", artistName: "Albert Uderzo", imageUrl: "", source: "demo" },
      { id: "demo_15", artworkTitle: "Spirou", artistName: "André Franquin", imageUrl: "", source: "demo" },
    ];

    const demoScores: AxisScores[] = [
      { jager: 5, estheet: 5, verwant: 4, bewaker: 2, avonturier: 5, speculant: 2, architect: 1 },
      { jager: 4, estheet: 5, verwant: 3, bewaker: 3, avonturier: 4, speculant: 2, architect: 2 },
      { jager: 3, estheet: 4, verwant: 5, bewaker: 4, avonturier: 3, speculant: 1, architect: 2 },
      { jager: 4, estheet: 3, verwant: 2, bewaker: 3, avonturier: 4, speculant: 3, architect: 3 },
      { jager: 3, estheet: 5, verwant: 3, bewaker: 2, avonturier: 5, speculant: 1, architect: 1 },
      { jager: 2, estheet: 3, verwant: 4, bewaker: 5, avonturier: 2, speculant: 3, architect: 4 },
      { jager: 2, estheet: 4, verwant: 3, bewaker: 1, avonturier: 3, speculant: 1, architect: 2 },
      { jager: 4, estheet: 3, verwant: 2, bewaker: 3, avonturier: 3, speculant: 4, architect: 3 },
      { jager: 3, estheet: 4, verwant: 4, bewaker: 3, avonturier: 4, speculant: 1, architect: 2 },
      { jager: 5, estheet: 3, verwant: 1, bewaker: 4, avonturier: 2, speculant: 5, architect: 3 },
      { jager: 2, estheet: 2, verwant: 2, bewaker: 5, avonturier: 4, speculant: 2, architect: 4 },
      { jager: 3, estheet: 3, verwant: 3, bewaker: 2, avonturier: 3, speculant: 2, architect: 2 },
      { jager: 2, estheet: 4, verwant: 4, bewaker: 2, avonturier: 4, speculant: 1, architect: 1 },
      { jager: 3, estheet: 4, verwant: 3, bewaker: 3, avonturier: 3, speculant: 2, architect: 2 },
      { jager: 3, estheet: 4, verwant: 3, bewaker: 2, avonturier: 4, speculant: 1, architect: 2 },
    ];

    setArtworks(demoArtworks);
    setSlotsPerChamber(5);
    setActiveChamber("Hart");

    const newEntries = createInitialEntries();
    const chamberKeys: ChamberKey[] = ["Hart", "Rede", "Jacht"];
    let artIdx = 0;
    for (const ck of chamberKeys) {
      for (let slot = 1; slot <= 5; slot++) {
        const entry = newEntries.find((e) => e.chamber === ck && e.slot === slot);
        if (entry && artIdx < demoArtworks.length) {
          entry.selectedArtworkId = demoArtworks[artIdx].id;
          entry.objectName = demoArtworks[artIdx].artworkTitle;
          entry.scores = demoScores[artIdx];
          artIdx++;
        }
      }
    }
    setEntries(newEntries);
    setReport(null);
  }, []);

  const value = useMemo<DNAContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      artworks,
      addArtwork,
      addArtworks,
      clearArtworks,
      entries,
      slotsPerChamber,
      setSlotsPerChamber,
      activeChamber,
      setActiveChamber,
      updateScore,
      assignArtwork,
      clearEntryArtwork,
      setEntryObjectName,
      axisVariants,
      toggleAxisVariant,
      getArtworkById,
      getActiveEntries,
      getMissingCount,
      report,
      runAnalysis,
      resetAll,
      loadDemo,
      saveStatus,
    }),
    [
      locale, setLocale, t,
      artworks, addArtwork, addArtworks, clearArtworks,
      entries, slotsPerChamber, activeChamber,
      updateScore, assignArtwork, clearEntryArtwork, setEntryObjectName,
      axisVariants, toggleAxisVariant,
      getArtworkById, getActiveEntries, getMissingCount,
      report, runAnalysis, resetAll, loadDemo, saveStatus,
    ]
  );

  return <DNACtx.Provider value={value}>{children}</DNACtx.Provider>;
}
