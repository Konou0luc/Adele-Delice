import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "react-international-phone/style.css";
import { Providers } from "@/providers";
import { Toaster } from "sonner";
import CartFloatingButton from "@/components/CartFloatingButton";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: "#111111",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://adele-delice.vercel.app"),
  title: {
    default: "Adèle Délice | Restaurant à Lomé",
    template: "%s | Adèle Délice",
  },
  description:
    "Adèle Délice, restaurant à Lomé : découvrez notre cuisine familiale, nos plats faits maison et réservez votre table en ligne.",
  applicationName: "Adèle Délice",
  keywords: [
    "restaurant Lomé",
    "restaurant au Togo",
    "cuisine familiale",
    "plats faits maison",
    "Adèle Délice",
  ],
  authors: [{ name: "Adèle Délice" }],
  creator: "Adèle Délice",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Adèle Délice",
    title: "Adèle Délice | Restaurant à Lomé",
    description:
      "Cuisine familiale et plats faits maison à Lomé. Découvrez notre menu et réservez votre table.",
    images: [
      {
        url: "/logo-small.webp",
        width: 1200,
        height: 1200,
        alt: "Logo Adèle Délice",
      },
      {
        url: "/Gallery/interior-shot-cafe-with-chairs-near-bar-with-wooden-tables.webp",
        width: 1200,
        height: 800,
        alt: "Salle du restaurant Adèle Délice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adèle Délice | Restaurant à Lomé",
    description:
      "Cuisine familiale et plats faits maison à Lomé.",
    images: ["/logo-small.webp"],
  },
  icons: {
    icon: "/logo-small.webp",
    apple: "/logo-small.webp",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${montserrat.variable} font-montserrat antialiased`}
      >
        <Providers>{children}</Providers>
        <CartFloatingButton />

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  );
}
