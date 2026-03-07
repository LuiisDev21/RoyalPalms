import type { Metadata } from "next";
import { BarraNavegacion } from "@/Componentes/Comunes/BarraNavegacion";
import { PiePagina } from "@/Componentes/Comunes/PiePagina";
import { HeroContacto } from "@/Caracteristicas/Contacto/Componentes/HeroContacto";
import { InformacionContacto } from "@/Caracteristicas/Contacto/Componentes/InformacionContacto";
import { FormularioContacto } from "@/Caracteristicas/Contacto/Componentes/FormularioContacto";
import { MapaHotel } from "@/Caracteristicas/Contacto/Componentes/MapaHotel";

export const metadata: Metadata = {
  title: "Contacto | Royal Palm",
  description:
    "Ponte en contacto con Royal Palm para reservas, eventos y consultas personalizadas.",
};

export default function PaginaContacto() {
  return (
    <main className="min-h-screen bg-[#ffffff]">
      <BarraNavegacion />
      <HeroContacto />
      <InformacionContacto />
      <FormularioContacto />
      <MapaHotel />
      <PiePagina />
    </main>
  );
}

