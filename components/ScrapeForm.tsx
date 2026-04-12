"use client";

import { useRef, useState } from "react";
import { useDNA } from "@/lib/DNAContext";
import { generateId, FORM_CLASS, INPUT_CLASS, BUTTON_CLASS, LABEL_CLASS } from "@/lib/utils";
import type { Artwork } from "@/types";

export default function ScrapeForm() {
  const { t, addArtworks } = useDNA();

  const urlRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: "ok" | "warn" | "error" | "loading" | ""; msg: string }>({ type: "", msg: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = urlRef.current?.value.trim();
    if (!url) return;
    setStatus({ type: "loading", msg: t.scrapeInProgress });

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!data.artworks?.length) {
        setStatus({ type: "warn", msg: t.scrapeNoResults });
        return;
      }

      const batch: Artwork[] = data.artworks.map(
        (a: { title?: string; artist?: string; imageUrl?: string }) => ({
          id: generateId(),
          artworkTitle: a.title || "Untitled",
          artistName: a.artist || "",
          imageUrl: a.imageUrl || "",
          source: "2DGalleries",
        })
      );
      addArtworks(batch);
      setStatus({ type: "ok", msg: t.scrapeSuccess.replace("{count}", String(batch.length)) });
    } catch {
      setStatus({ type: "error", msg: t.scrapeFailed });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={FORM_CLASS} data-testid="scrape-form">
      <h3 className="m-0 mb-0.5 text-base">{t.scrapeFormTitle}</h3>
      <label className={LABEL_CLASS}>{t.profileUrl}</label>
      <input
        ref={urlRef}
        type="url"
        required
        placeholder="https://www.2dgalleries.com/profile/username"
        className={INPUT_CLASS}
        data-testid="scrape-url-input"
      />
      <button type="submit" className={BUTTON_CLASS} data-testid="scrape-submit">
        {t.scrapeSubmit}
      </button>
      {status.type && (
        <p
          data-testid="scrape-status"
          className={`m-0 rounded-lg px-2 py-1.5 text-[0.78rem] ${
            status.type === "ok"
              ? "bg-success-bg text-success-text"
              : status.type === "warn"
                ? "bg-warn-bg text-warn-text"
                : status.type === "loading"
                  ? "bg-info-bg text-info-text"
                  : "bg-error-bg text-error-text"
          }`}
        >
          {status.msg}
        </p>
      )}
    </form>
  );
}
