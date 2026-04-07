import { NextRequest, NextResponse } from "next/server";

const TWO_DG_HOST = "www.2dgalleries.com";
const TWO_DG_BASE_URL = `https://${TWO_DG_HOST}`;

const DEFAULT_HEADERS: Record<string, string> = {
  "accept-language": "en-US,en;q=0.9",
  "user-agent": "DataEntryPOC/1.0 (+https://localhost)",
};

interface ArtworkEntry {
  title: string;
  artist: string;
  imageUrl: string;
  artworkUrl: string;
}

// --- HTML helpers ported from scraper.js ---

const ENTITY_MAP: Record<string, string> = {
  amp: "&", apos: "'", quot: '"', lt: "<", gt: ">", nbsp: " ",
  eacute: "é", Eacute: "É", aacute: "á", agrave: "à",
  egrave: "è", ecirc: "ê", ccedil: "ç", uuml: "ü", ouml: "ö", auml: "ä",
};

function decodeHtmlEntities(value: string): string {
  let decoded = value.replace(
    /&([a-zA-Z]+);/g,
    (full, named: string) => ENTITY_MAP[named] ?? full,
  );
  decoded = decoded.replace(/&#(\d+);/g, (_, cp: string) => {
    const n = Number(cp);
    return Number.isNaN(n) ? _ : String.fromCodePoint(n);
  });
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => {
    const n = Number.parseInt(hex, 16);
    return Number.isNaN(n) ? _ : String.fromCodePoint(n);
  });
  return decoded;
}

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, " ");
}

function cleanText(value: string): string {
  return decodeHtmlEntities(stripTags(value || "")).replace(/\s+/g, " ").trim();
}

function toAbsoluteUrl(value: string): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${TWO_DG_BASE_URL}${value}`;
  return `${TWO_DG_BASE_URL}/${value}`;
}

function firstMatch(regex: RegExp, content: string): string {
  const m = content.match(regex);
  return m ? m[1] : "";
}

// --- Core scraping logic ---

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: DEFAULT_HEADERS });
  if (!res.ok) throw new Error(`Request failed for ${url} with status ${res.status}.`);
  return res.text();
}

function extractUserId(profileHtml: string): number {
  const m = profileHtml.match(/\/userartworks\/(\d+)/i);
  if (!m) throw new Error("Could not detect the profile user id from 2DGalleries page.");
  return Number(m[1]);
}

function splitArtworkBlocks(pageHtml: string): string[] {
  return pageHtml
    .split('<div class="artworkcontainer">')
    .slice(1)
    .map((partial) => `<div class="artworkcontainer">${partial}`);
}

function parseArtworkBlock(blockHtml: string): ArtworkEntry | null {
  const artworkPath = firstMatch(/<a class="img"\s+href="([^"]+)"/i, blockHtml);
  if (!artworkPath) return null;

  const imagePath = firstMatch(/<img[^>]+src="([^"]+)"/i, blockHtml);
  const titleRaw = firstMatch(/<h3[^>]*>([\s\S]*?)<\/h3>/i, blockHtml);
  const artistMatches = [...blockHtml.matchAll(/<a class="artist"[^>]*>([\s\S]*?)<\/a>/gi)];

  const artists = artistMatches.map((m) => cleanText(m[1])).filter(Boolean);

  return {
    title: cleanText(titleRaw) || "Untitled artwork",
    artist: artists.length > 0 ? artists.join(", ") : "Unknown artist",
    artworkUrl: toAbsoluteUrl(artworkPath),
    imageUrl: toAbsoluteUrl(imagePath),
  };
}

function findNextOffset(pageHtml: string, currentOffset: number): number | null {
  const matches = [...pageHtml.matchAll(/data-url="\/userartworks\/\d+\?uid=\d+&\s*offset=(\d+)"/gi)];
  const higher = matches
    .map((m) => Number(m[1]))
    .filter((o) => Number.isFinite(o) && o > currentOffset);

  return higher.length === 0 ? null : Math.min(...higher);
}

function dedupeEntries(entries: ArtworkEntry[]): ArtworkEntry[] {
  const seen = new Set<string>();
  const result: ArtworkEntry[] = [];
  for (const entry of entries) {
    const key = entry.artworkUrl || `${entry.title}|${entry.artist}|${entry.imageUrl}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(entry);
    }
  }
  return result;
}

// --- Route handler ---

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const inputUrl = String(body.url || "").trim();

    if (!inputUrl) {
      return NextResponse.json({ error: "Missing url field" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(inputUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL provided." }, { status: 400 });
    }

    const isValidHost =
      parsedUrl.hostname === TWO_DG_HOST ||
      parsedUrl.hostname.endsWith(`.${TWO_DG_HOST}`);
    const isProfilePath = /^\/profile\/.+/i.test(parsedUrl.pathname);

    if (!isValidHost || !isProfilePath) {
      return NextResponse.json(
        { error: "Only 2DGalleries profile URLs are supported (e.g. /profile/jan)" },
        { status: 400 },
      );
    }

    // Step 1: fetch the profile page to extract the numeric userId
    parsedUrl.searchParams.set("lang", "en");
    const profileHtml = await fetchHtml(parsedUrl.href);
    const userId = extractUserId(profileHtml);

    // Step 2: paginate through AJAX artwork pages using offset
    const collected: ArtworkEntry[] = [];
    const visitedOffsets = new Set<number>();
    let currentOffset = 0;
    let iteration = 0;

    while (iteration < 100) {
      if (visitedOffsets.has(currentOffset)) break;
      visitedOffsets.add(currentOffset);

      const pageUrl =
        `${TWO_DG_BASE_URL}/userartworks/${userId}` +
        `?uid=${userId}&offset=${currentOffset}&ajx=1&pager=1&hr=1&pid=${userId}`;
      const pageHtml = await fetchHtml(pageUrl);

      const pageEntries = splitArtworkBlocks(pageHtml)
        .map(parseArtworkBlock)
        .filter((e): e is ArtworkEntry => e !== null);

      if (pageEntries.length === 0) break;

      collected.push(...pageEntries);

      const nextOffset = findNextOffset(pageHtml, currentOffset);
      if (nextOffset === null) break;

      currentOffset = nextOffset;
      iteration++;
    }

    const entries = dedupeEntries(collected);

    return NextResponse.json({
      ok: true,
      count: entries.length,
      artworks: entries,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
