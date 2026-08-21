import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avis clients",
  description:
    "Consultez les avis des clients d'Adèle Délice et partagez votre expérience dans notre restaurant à Lomé.",
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
