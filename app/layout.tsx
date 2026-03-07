import { ProveedorNotificaciones } from "@/Componentes/Comunes/ProveedorNotificaciones";
import { ProveedorReactQuery } from "@/Componentes/Comunes/ProveedorReactQuery";
import { ProveedorAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "sileo/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Royal Palms",
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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
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
