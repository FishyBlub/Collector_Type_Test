"use client";

import { useRef } from "react";
import { useDNA } from "@/lib/DNAContext";
import { generateId, FORM_CLASS, INPUT_CLASS, BUTTON_CLASS, LABEL_CLASS } from "@/lib/utils";

export default function ManualEntryForm() {
  const { t, addArtwork } = useDNA();

  const titleRef = useRef<HTMLInputElement>(null);
  const artistRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = titleRef.current?.value.trim();
    const artist = artistRef.current?.value.trim();
    const imageUrl = imageRef.current?.value.trim() || "";
    if (!title) return;

    addArtwork({
      id: generateId(),
      artworkTitle: title,
      artistName: artist || "",
      imageUrl,
      source: "manual",
    });

    if (titleRef.current) titleRef.current.value = "";
    if (artistRef.current) artistRef.current.value = "";
    if (imageRef.current) imageRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className={FORM_CLASS} data-testid="manual-entry-form">
      <h3 className="m-0 mb-0.5 text-base">{t.manualFormTitle}</h3>
      <label className={LABEL_CLASS}>{t.artworkName}</label>
      <input ref={titleRef} type="text" required placeholder="Nell Acqua" className={INPUT_CLASS} data-testid="manual-title" />
      <label className={LABEL_CLASS}>{t.artistName}</label>
      <input ref={artistRef} type="text" placeholder="Lorenzo Mattotti" className={INPUT_CLASS} data-testid="manual-artist" />
      <label className={LABEL_CLASS}>{t.pictureUrl}</label>
      <input ref={imageRef} type="url" placeholder="https://example.com/image.jpg" className={INPUT_CLASS} data-testid="manual-image-url" />
      <button type="submit" className={BUTTON_CLASS} data-testid="manual-submit">
        {t.manualSubmit}
      </button>
    </form>
  );
}
