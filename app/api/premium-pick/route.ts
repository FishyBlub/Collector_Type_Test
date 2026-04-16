import { NextResponse } from "next/server";
import { NoPremiumProfileError, pickPremiumProfileWithMinArtworks } from "@/lib/scraper";

export async function POST() {
  try {
    const { entries } = await pickPremiumProfileWithMinArtworks();

    return NextResponse.json({
      ok: true,
      artworks: entries,
    });
  } catch (err) {
    if (err instanceof NoPremiumProfileError) {
      return NextResponse.json(
        { error: "No premium profile with enough artworks found." },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Failed to pick a premium profile." },
      { status: 500 },
    );
  }
}
