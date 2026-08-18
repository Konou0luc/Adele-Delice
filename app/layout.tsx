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
  title: "Adèle Délice - Restaurant",
  description: "Mangez comme si vous êtes à la maison.",
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
