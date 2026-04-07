import type { Metadata } from "next";
import { IBM_Plex_Sans, Fraunces } from "next/font/google";
import { DNAProvider } from "@/lib/DNAContext";
import "./globals.css";

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const heading = Fraunces({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Collector DNA · The Narrative Engine",
  description:
    "Ontdek waarom je verzamelt, niet alleen wat je verzamelt. Selecteer kunstwerken, scoor ze op 7 DNA-assen en ontvang je psychologische verzamelprofiel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={`${body.variable} ${heading.variable}`}>
        <div className="bg-shape bg-shape-a" aria-hidden="true" />
        <div className="bg-shape bg-shape-b" aria-hidden="true" />
        <DNAProvider>{children}</DNAProvider>
      </body>
    </html>
  );
}
