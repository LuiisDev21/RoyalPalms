import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoyalPalms",
  description: "Tu hotel, tu momento.",
};

export default function DisenoRaiz({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
