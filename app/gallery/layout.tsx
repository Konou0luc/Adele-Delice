import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Découvrez en images l'univers, les plats et la salle du restaurant Adèle Délice à Lomé.",
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
