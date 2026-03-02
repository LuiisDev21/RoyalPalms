import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Royal Palms",
  description: "Tu hotel, tu momento.",
};

const FuenteCuerpo = Inter({
  subsets: ["latin"],
  variable: "--FuenteCuerpo",
  display: "swap",
});

const FuenteTitulo = Playfair_Display({
  subsets: ["latin"],
  variable: "--FuenteTitulo",
  display: "swap",
});

export default function DisenoRaiz({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${FuenteCuerpo.variable} ${FuenteTitulo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
