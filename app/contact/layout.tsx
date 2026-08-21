import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact et réservation",
  description:
    "Contactez Adèle Délice à Lomé ou réservez votre table dans notre restaurant de cuisine familiale.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
