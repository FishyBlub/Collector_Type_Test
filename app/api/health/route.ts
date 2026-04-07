import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "collector-dna-rewrite",
    timestamp: new Date().toISOString(),
  });
}
