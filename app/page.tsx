"use client";

import HeroSection from "@/components/HeroSection";
import LibraryPanel from "@/components/LibraryPanel";
import ChamberPanel from "@/components/ChamberPanel";
import ResultsPanel from "@/components/ResultsPanel";

export default function Home() {
  return (
    <main className="mx-auto my-10 grid w-[min(1200px,calc(100%-2rem))] gap-4">
      <HeroSection />
      <LibraryPanel />
      <ChamberPanel />
      <ResultsPanel />
    </main>
  );
}
