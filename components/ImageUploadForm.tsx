"use client";

import { useRef, useState } from "react";
import { useDNA } from "@/lib/DNAContext";
import { generateId, FORM_CLASS, BUTTON_CLASS } from "@/lib/utils";

function cleanFilename(name: string): string {
  const withoutExt = name.replace(/\.[^.]+$/, "");
  return withoutExt.replace(/[-_.]+/g, " ").trim();
}

export default function ImageUploadForm() {
  const { t, addArtworks } = useDNA();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const batch = files.map((file) => ({
      id: generateId(),
      artworkTitle: cleanFilename(file.name),
      artistName: "",
      imageUrl: URL.createObjectURL(file),
      source: "device",
    }));

    addArtworks(batch);

    const message = t.imageUploadSuccess.replace("{count}", String(batch.length));
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3000);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={FORM_CLASS} data-testid="image-upload-form">
      <h3 className="m-0 mb-0.5 text-base">{t.imageUploadFormTitle}</h3>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        data-testid="image-upload-input"
        onChange={handleChange}
      />
      <button
        type="button"
        className={BUTTON_CLASS}
        data-testid="image-upload-submit"
        onClick={() => fileInputRef.current?.click()}
      >
        {t.imageUploadSubmit}
      </button>
      {feedback && (
        <p className="mt-1 text-[0.8rem] text-ink-soft" data-testid="image-upload-feedback">
          {feedback}
        </p>
      )}
    </div>
  );
}
