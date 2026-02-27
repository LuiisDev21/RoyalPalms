import { ProveedorNotificaciones } from "@/Componentes/Comunes/ProveedorNotificaciones";
import { ProveedorReactQuery } from "@/Componentes/Comunes/ProveedorReactQuery";
import { ProveedorAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "sileo/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Royal Palm",
  description: "Tu hotel, tu momento.",
  icons: {
    icon: "/Logo.svg",
  },
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
        <ProveedorNotificaciones>
          <ProveedorReactQuery>
            <ProveedorAuth>{children}</ProveedorAuth>
          </ProveedorReactQuery>
        </ProveedorNotificaciones>
      </body>
    </html>
  );
}
