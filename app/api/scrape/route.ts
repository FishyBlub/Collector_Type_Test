import { NextRequest, NextResponse } from "next/server";
import { TWO_DG_HOST, scrapeProfile } from "@/lib/scraper";

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

    parsedUrl.protocol = "https:";

    const entries = await scrapeProfile(parsedUrl);

    return NextResponse.json({
      ok: true,
      count: entries.length,
      artworks: entries,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to scrape the requested profile." },
      { status: 500 }
    );
  }
}
