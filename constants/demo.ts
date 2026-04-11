import type { Artwork, AxisScores } from "@/types";

export const DEMO_ARTWORKS: Artwork[] = [
  { id: "demo_1", artworkTitle: "Nell Acqua", artistName: "Lorenzo Mattotti", imageUrl: "https://www.2dgalleries.com/planches/200H/2024/327/mattotti-nell-acqua-3iq3.jpg", source: "2DGalleries" },
  { id: "demo_2", artworkTitle: "On the road XIX", artistName: "Lorenzo Mattotti", imageUrl: "https://www.2dgalleries.com/planches/200H/2026/18/mattotti-on-the-road-xix-2rvo.jpg", source: "2DGalleries" },
  { id: "demo_3", artworkTitle: "Van Gogh sous la pluie", artistName: "Lorenzo Mattotti", imageUrl: "https://www.2dgalleries.com/planches/200H/2025/157/mattotti-van-gogh-sous-la-pluie-31hq.jpg", source: "2DGalleries" },
  { id: "demo_4", artworkTitle: "La fameuse invasion des ours en Italie", artistName: "Lorenzo Mattotti", imageUrl: "https://www.2dgalleries.com/planches/200H/2020/69/mattotti-la-fameuse-invasion-des-ours-en-italie-2vmi.jpg", source: "2DGalleries" },
  { id: "demo_5", artworkTitle: "Blake et Mortimer", artistName: "Floc'h", imageUrl: "https://www.2dgalleries.com/planches/200H/2024/115/floc-h-blake-et-mortimer-343u.jpg", source: "2DGalleries" },
  { id: "demo_6", artworkTitle: "Monsieur Hulot", artistName: "Floc'h", imageUrl: "https://www.2dgalleries.com/planches/200H/2019/348/floch-monsieur-hulot-3h01.jpg", source: "2DGalleries" },
  { id: "demo_7", artworkTitle: "Couma Aco", artistName: "Edmond Baudoin", imageUrl: "https://www.2dgalleries.com/planches/200H/2019/348/baudoin-couma-aco-2juz.jpg", source: "2DGalleries" },
  { id: "demo_8", artworkTitle: "Pour Elles I", artistName: "Edmond Baudoin", imageUrl: "https://www.2dgalleries.com/planches/200H/2019/347/baudoin-pour-elles-i-37w6.jpg", source: "2DGalleries" },
  { id: "demo_9", artworkTitle: "Mars", artistName: "François Schuiten", imageUrl: "https://www.2dgalleries.com/planches/200H/2022/339/schuiten-mars-3kt3.jpg", source: "2DGalleries" },
  { id: "demo_10", artworkTitle: "De Bruxelles à Brüsel", artistName: "François Schuiten", imageUrl: "https://www.2dgalleries.com/planches/200H/2019/348/schuiten-de-bruxelles-a-brusel-2oaa.jpg", source: "2DGalleries" },
  { id: "demo_11", artworkTitle: "Gauloises", artistName: "Andrea Serio", imageUrl: "https://www.2dgalleries.com/planches/200H/2024/285/serio-gauloises-39wk.jpg", source: "2DGalleries" },
  { id: "demo_12", artworkTitle: "Lysistrata", artistName: "Ralf König", imageUrl: "https://www.2dgalleries.com/planches/200H/2019/347/konig-lysistrata-3g03.jpg", source: "2DGalleries" },
  { id: "demo_13", artworkTitle: "Saveur Coco", artistName: "Renaud Dillies", imageUrl: "https://www.2dgalleries.com/planches/200H/2020/273/dillies-saveur-coco-3er5.jpg", source: "2DGalleries" },
  { id: "demo_14", artworkTitle: "Foules et Files", artistName: "Yves Chaland", imageUrl: "https://www.2dgalleries.com/planches/200H/2019/347/chaland-foules-et-files-33es.jpg", source: "2DGalleries" },
  { id: "demo_15", artworkTitle: "La Vache", artistName: "Johan De Moor", imageUrl: "https://www.2dgalleries.com/planches/200H/2020/335/de-moor-la-vache-2s35.jpg", source: "2DGalleries" },
];

export const DEMO_SCORES: AxisScores[] = [
  { jager: 5, estheet: 5, verwant: 4, bewaker: 2, avonturier: 5, speculant: 2, architect: 1 },
  { jager: 4, estheet: 5, verwant: 3, bewaker: 3, avonturier: 4, speculant: 2, architect: 2 },
  { jager: 3, estheet: 4, verwant: 5, bewaker: 4, avonturier: 3, speculant: 1, architect: 2 },
  { jager: 4, estheet: 3, verwant: 2, bewaker: 3, avonturier: 4, speculant: 3, architect: 3 },
  { jager: 3, estheet: 5, verwant: 3, bewaker: 2, avonturier: 5, speculant: 1, architect: 1 },
  { jager: 2, estheet: 3, verwant: 4, bewaker: 5, avonturier: 2, speculant: 3, architect: 4 },
  { jager: 2, estheet: 4, verwant: 3, bewaker: 1, avonturier: 3, speculant: 1, architect: 2 },
  { jager: 4, estheet: 3, verwant: 2, bewaker: 3, avonturier: 3, speculant: 4, architect: 3 },
  { jager: 3, estheet: 4, verwant: 4, bewaker: 3, avonturier: 4, speculant: 1, architect: 2 },
  { jager: 5, estheet: 3, verwant: 1, bewaker: 4, avonturier: 2, speculant: 5, architect: 3 },
  { jager: 2, estheet: 2, verwant: 2, bewaker: 5, avonturier: 4, speculant: 2, architect: 4 },
  { jager: 3, estheet: 3, verwant: 3, bewaker: 2, avonturier: 3, speculant: 2, architect: 2 },
  { jager: 2, estheet: 4, verwant: 4, bewaker: 2, avonturier: 4, speculant: 1, architect: 1 },
  { jager: 3, estheet: 4, verwant: 3, bewaker: 3, avonturier: 3, speculant: 2, architect: 2 },
  { jager: 3, estheet: 4, verwant: 3, bewaker: 2, avonturier: 4, speculant: 1, architect: 2 },
];
