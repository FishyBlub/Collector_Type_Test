import { NextResponse } from "next/server";
import {
  pickPremiumProfileWithMinArtworks,
  NoPremiumProfileError,
} from "@/lib/scraper";

export async function POST(): Promise<NextResponse> {
  try {
    const result = await pickPremiumProfileWithMinArtworks();
    return NextResponse.json({
      ok: true,
      profileUrl: result.profileUrl,
      count: result.entries.length,
      artworks: result.entries,
    });
  } catch (err) {
    if (err instanceof NoPremiumProfileError) {
      return NextResponse.json(
        { ok: false, error: "No premium profile with 15+ artworks found." },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { ok: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
