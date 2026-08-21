import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre menu",
  description:
    "Consultez le menu d'Adèle Délice : plats faits maison, spécialités familiales et saveurs généreuses à Lomé.",
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
