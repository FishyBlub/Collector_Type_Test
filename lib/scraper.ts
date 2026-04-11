export const TWO_DG_HOST = "www.2dgalleries.com";
const TWO_DG_BASE_URL = `https://${TWO_DG_HOST}`;

const DEFAULT_HEADERS: Record<string, string> = {
  "accept-language": "en-US,en;q=0.9",
  "user-agent": "DataEntryPOC/1.0 (+https://localhost)",
};

export interface ArtworkEntry {
  title: string;
  artist: string;
  imageUrl: string;
  artworkUrl: string;
}

const ENTITY_MAP: Record<string, string> = {
  amp: "&", apos: "'", quot: '"', lt: "<", gt: ">", nbsp: " ",
  eacute: "é", Eacute: "É", aacute: "á", agrave: "à",
  egrave: "è", ecirc: "ê", ccedil: "ç", uuml: "ü", ouml: "ö", auml: "ä",
};

export function decodeHtmlEntities(value: string): string {
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

export function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, " ");
}

export function cleanText(value: string): string {
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

const FETCH_TIMEOUT_MS = 15_000;

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: DEFAULT_HEADERS,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Request failed for ${url} with status ${res.status}.`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

export function extractUserId(profileHtml: string): number {
  const m = profileHtml.match(/\/userartworks\/(\d+)/i);
  if (!m) throw new Error("Could not detect the profile user id from 2DGalleries page.");
  return Number(m[1]);
}

export function splitArtworkBlocks(pageHtml: string): string[] {
  return pageHtml
    .split('<div class="artworkcontainer">')
    .slice(1)
    .map((partial) => `<div class="artworkcontainer">${partial}`);
}

export function parseArtworkBlock(blockHtml: string): ArtworkEntry | null {
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

export function findNextOffset(pageHtml: string, currentOffset: number): number | null {
  const matches = [...pageHtml.matchAll(/data-url="\/userartworks\/\d+\?uid=\d+&\s*offset=(\d+)"/gi)];
  const higher = matches
    .map((m) => Number(m[1]))
    .filter((o) => Number.isFinite(o) && o > currentOffset);

  return higher.length === 0 ? null : Math.min(...higher);
}

export function dedupeEntries(entries: ArtworkEntry[]): ArtworkEntry[] {
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

export async function scrapeProfile(profileUrl: URL): Promise<ArtworkEntry[]> {
  profileUrl.searchParams.set("lang", "en");
  const profileHtml = await fetchHtml(profileUrl.href);
  const userId = extractUserId(profileHtml);

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

  return dedupeEntries(collected);
}
