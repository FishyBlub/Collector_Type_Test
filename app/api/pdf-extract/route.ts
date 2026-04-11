import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

interface Suggestion {
  title: string;
  artist: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdfFile");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Missing pdfFile field" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let text = "";
    let pageCount = 0;
    try {
      const data = await pdfParse(buffer);
      text = data.text || "";
      pageCount = data.numpages ?? 0;
    } catch {
      text = buffer
        .toString("utf-8")
        .replace(/[^\x20-\x7E\n\r\t\u00C0-\u024F]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    const suggestions = extractSuggestions(text);

    return NextResponse.json({
      ok: true,
      pageCount,
      textLength: text.length,
      suggestions,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process PDF upload." },
      { status: 500 }
    );
  }
}

function extractSuggestions(text: string): Suggestion[] {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  const suggestions: Suggestion[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    // Heuristic: "Title - Artist" or "Title by Artist"
    const separatorMatch = line.match(
      /^(.{3,80}?)\s*(?:[-–—]|,\s*by\s+|\s+by\s+)\s*(.{2,60})$/i
    );

    if (separatorMatch) {
      const title = separatorMatch[1].trim();
      const artist = separatorMatch[2].trim();
      const key = `${title.toLowerCase()}|${artist.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push({ title, artist });
      }
    }
  }

  // If no structured lines found, treat each line as a potential title
  if (suggestions.length === 0) {
    for (const line of lines.slice(0, 100)) {
      if (line.length >= 4 && line.length <= 120 && !line.match(/^\d+$/) && !line.match(/^page\s+\d+/i)) {
        const key = line.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          suggestions.push({ title: line, artist: "" });
        }
      }
    }
  }

  return suggestions.slice(0, 200);
}
