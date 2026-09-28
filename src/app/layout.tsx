import type { Metadata } from "next";
import { Playfair_Display, Pinyon_Script, EB_Garamond } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const accent = Pinyon_Script({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const body = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Catarina & Vitor — Chá de Panela",
  description:
    "Catarina & Vitor estão construindo um novo lar. Conheça a nossa história e faça parte deste começo com um presente especial.",
  openGraph: {
    title: "Catarina & Vitor — Chá de Panela",
    description:
      "Um novo capítulo começa aqui. Conheça a nossa história e a nossa lista de presentes.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${accent.variable} ${body.variable}`}>
      <body className="min-h-screen bg-paper text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
