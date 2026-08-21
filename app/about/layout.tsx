import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos de nous",
  description:
    "Découvrez l'histoire, les valeurs et la vision d'Adèle Délice, restaurant de cuisine familiale à Lomé.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
