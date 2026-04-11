"use client";

import { useRef, useState } from "react";
import { useDNA } from "@/lib/DNAContext";
import {
  generateId,
  FORM_CLASS,
  BUTTON_CLASS,
  BUTTON_DANGER_CLASS,
  LABEL_CLASS,
} from "@/lib/utils";
import type { Artwork } from "@/types";

interface PdfSuggestion {
  title: string;
  artist: string;
}

export default function PdfUploadForm() {
  const { t, addArtworks } = useDNA();

  const pdfFileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: "ok" | "error" | ""; msg: string }>({ type: "", msg: "" });
  const [progress, setProgress] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<PdfSuggestion[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = pdfFileRef.current?.files?.[0];
    if (!file) return;

    setProgress(0);
    setStatus({ type: "", msg: t.pdfProgressAnalyzing });
    setSuggestions([]);

    const formData = new FormData();
    formData.append("pdfFile", file);

    try {
      const res = await fetch("/api/pdf-extract", { method: "POST", body: formData });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const parsed: PdfSuggestion[] = (data.suggestions ?? []).map(
        (s: { title?: string; artist?: string }) => ({
          title: s.title || "",
          artist: s.artist || "",
        })
      );
      setSuggestions(parsed);
      setProgress(100);
      setStatus({ type: "ok", msg: t.pdfProgressDone });
    } catch {
      setProgress(null);
      setStatus({ type: "error", msg: t.pdfProgressFailed });
    }
  };

  const handleImportAll = () => {
    const batch: Artwork[] = suggestions
      .filter((s) => s.title.trim())
      .map((s) => ({
        id: generateId(),
        artworkTitle: s.title.trim(),
        artistName: s.artist.trim(),
        imageUrl: "",
        source: "PDF",
      }));
    addArtworks(batch);
    setSuggestions([]);
  };

  const handleRemove = (index: number) => {
    setSuggestions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className={FORM_CLASS} data-testid="pdf-upload-form">
      <h3 className="m-0 mb-0.5 text-base">{t.pdfFormTitle}</h3>
      <label className={LABEL_CLASS}>{t.pdfFile}</label>
      <input ref={pdfFileRef} type="file" accept="application/pdf" required className="w-full text-sm" data-testid="pdf-file-input" />
      <p className="m-0 text-[0.76rem] text-ink-muted">{t.pdfHint}</p>

      {progress !== null && (
        <div className="rounded-[var(--radius-input)] border border-card-border bg-card-inner px-2 py-1.5">
          <div className="flex items-center justify-between text-[0.75rem] text-ink-muted">
            <span>{status.msg}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-warm-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-2 via-[#16a087] to-accent-2 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <p className="mb-1 text-[0.78rem] font-bold text-ink-muted">{t.pdfSuggestionsTitle}</p>
          <ul className="m-0 grid list-none gap-1.5 p-0">
            {suggestions.map((s, i) => (
              <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[var(--radius-input)] border border-card-border bg-card-inner p-2">
                <div className="grid gap-1">
                  <input
                    value={s.title}
                    onChange={(e) =>
                      setSuggestions((prev) =>
                        prev.map((item, j) => (j === i ? { ...item, title: e.target.value } : item))
                      )
                    }
                    className="w-full rounded-lg border border-btn-border bg-card-inner px-2 py-1 text-[0.76rem]"
                  />
                  <input
                    value={s.artist}
                    onChange={(e) =>
                      setSuggestions((prev) =>
                        prev.map((item, j) => (j === i ? { ...item, artist: e.target.value } : item))
                      )
                    }
                    placeholder={t.artistName}
                    className="w-full rounded-lg border border-btn-border bg-card-inner px-2 py-1 text-[0.76rem]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className={`${BUTTON_DANGER_CLASS} whitespace-nowrap`}
                  aria-label="Remove suggestion"
                  data-testid={`pdf-remove-${i}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={handleImportAll}
            className={`mt-2 ${BUTTON_CLASS}`}
            data-testid="pdf-import-all"
          >
            {t.pdfImportAll}
          </button>
        </div>
      )}

      {status.type === "error" && (
        <p className="m-0 rounded-lg bg-error-bg px-2 py-1.5 text-[0.78rem] text-error-text">{status.msg}</p>
      )}

      <button type="submit" className={BUTTON_CLASS} data-testid="pdf-submit">
        {t.pdfSubmit}
      </button>
    </form>
  );
}
