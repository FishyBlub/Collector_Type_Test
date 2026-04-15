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
import { DEMO_ARTWORKS, DEMO_SCORES } from "@/constants/demo";
import { buildReport } from "@/lib/engine";
import { generateId } from "@/lib/utils";
import { SHADOW_TRIGGER_THRESHOLD } from "@/constants/shadows";
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
  // Seed as empty object, progressively filled by the AXES loop to form a complete AxisScores
  return AXES.reduce((acc, a) => {
    acc[a.key] = 3;
    return acc;
  }, {} as AxisScores);
}

function createInitialEntries(): Entry[] {
  const entries: Entry[] = [];
  for (const chamber of CHAMBERS) {
    for (let slot = 1; slot <= DEFAULT_SLOTS_PER_CHAMBER; slot++) {
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

function isValidSavedState(data: unknown): data is SavedState {
  if (typeof data !== "object" || data === null) return false;
  // Narrowed to non-null object above; cast to index into properties
  const obj = data as Record<string, unknown>;
  return (
    Array.isArray(obj.entries) &&
    Array.isArray(obj.artworks) &&
    typeof obj.slotsPerChamber === "number" &&
    typeof obj.activeChamber === "string"
  );
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
  loadDemo: () => Promise<void>;
  demoLoading: boolean;
  demoError: string | null;

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
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [axisVariants, setAxisVariants] = useState<Record<AxisKey, QuestionVariant>>(
    // Seed as empty object, progressively filled by the AXES loop
    () => AXES.reduce((acc, a) => { acc[a.key] = "primary"; return acc; }, {} as Record<AxisKey, QuestionVariant>)
  );

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const t = useMemo(() => getUiStrings(locale), [locale]);

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem(LOCALE_KEY);
      if (savedLocale && ["nl", "en", "fr"].includes(savedLocale)) {
        // Validated by the includes check above
        setLocaleState(savedLocale as Locale);
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isValidSavedState(parsed)) {
          if (parsed.entries.length) setEntries(parsed.entries);
          if (parsed.artworks.length) setArtworks(parsed.artworks);
          if (parsed.slotsPerChamber) setSlotsPerChamber(parsed.slotsPerChamber);
          if (parsed.activeChamber) setActiveChamber(parsed.activeChamber);
        }
      }
    } catch {
      // ignore corrupt localStorage
    }
    setHydrated(true);
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
          // ignore quota errors
        }
      }, AUTOSAVE_DELAY);
    },
    [entries, artworks, slotsPerChamber, activeChamber, t.autosaveActive]
  );

  // Only autosave after hydration is committed to state, preventing
  // overwrite of localStorage with default values on first render.
  useEffect(() => {
    if (hydrated) scheduleSave();
  }, [hydrated, entries, artworks, slotsPerChamber, activeChamber, scheduleSave]);

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
      (id) => getArtworkById(id),
      {
        unknownProfile: t.unknownProfile,
        unknownProfileMotto: t.unknownProfileMotto,
        unknownProfileDescription: t.unknownProfileDescription,
        hybridProfileMotto: t.hybridProfileMotto,
        hybridProfileDescription: t.hybridProfileDescription,
      },
      {
        title: t.noShadowTitle,
        text: t.noShadowText.replace("{threshold}", String(SHADOW_TRIGGER_THRESHOLD)),
      }
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

  const applyDemoArtworks = useCallback(
    (demoArtworks: { id: string; artworkTitle: string }[]) => {
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
            entry.scores = DEMO_SCORES[artIdx] ?? entry.scores;
            artIdx++;
          }
        }
      }
      setEntries(newEntries);
      setReport(null);
    },
    [],
  );

  const loadDemo = useCallback(async () => {
    setDemoLoading(true);
    setDemoError(null);

    try {
      const res = await fetch("/api/premium-pick", { method: "POST" });
      if (res.ok) {
        const data: unknown = await res.json();
        if (
          typeof data === "object" &&
          data !== null &&
          "artworks" in data &&
          Array.isArray((data as Record<string, unknown>).artworks) &&
          ((data as Record<string, unknown>).artworks as unknown[]).length >= 15
        ) {
          type RawArtwork = { title?: string; artist?: string; imageUrl?: string };
          const raw = (data as { artworks: RawArtwork[] }).artworks;
          const premiumArtworks = raw.map((a) => ({
            id: generateId(),
            artworkTitle: a.title || "Untitled",
            artistName: a.artist || "",
            imageUrl: a.imageUrl || "",
            source: "2DGalleries",
          }));
          setArtworks(premiumArtworks);
          applyDemoArtworks(premiumArtworks);
          return;
        }
      }
      // API failed or returned insufficient artworks — fall back to static demo
      throw new Error("premium-pick unavailable");
    } catch {
      setDemoError(t.demoPremiumFailed);
      setArtworks(DEMO_ARTWORKS);
      applyDemoArtworks(DEMO_ARTWORKS);
    } finally {
      setDemoLoading(false);
    }
  }, [applyDemoArtworks, t.demoPremiumFailed]);

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
      demoLoading,
      demoError,
      saveStatus,
    }),
    [
      locale, setLocale, t,
      artworks, addArtwork, addArtworks, clearArtworks,
      entries, slotsPerChamber, activeChamber,
      updateScore, assignArtwork, clearEntryArtwork, setEntryObjectName,
      axisVariants, toggleAxisVariant,
      getArtworkById, getActiveEntries, getMissingCount,
      report, runAnalysis, resetAll, loadDemo, demoLoading, demoError, saveStatus,
    ]
  );

  return <DNACtx.Provider value={value}>{children}</DNACtx.Provider>;
}
