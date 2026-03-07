import type { Metadata } from "next";
import { BarraNavegacion } from "@/Componentes/Comunes/BarraNavegacion";
import { PiePagina } from "@/Componentes/Comunes/PiePagina";
import { ContenidoNosotros } from "@/Caracteristicas/Nosotros/Componentes/ContenidoNosotros";
import { HeroNosotros } from "@/Caracteristicas/Nosotros/Componentes/HeroNosotros";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Royal Palm",
  description:
    "Royal Palm: un santuario donde el lujo reside en la tranquilidad, la atención personalizada y los momentos que perduran en la memoria.",
};

export default function PaginaNosotros() {
  return (
    <main className="min-h-screen">
      <BarraNavegacion />
      <HeroNosotros />
      <ContenidoNosotros />
      <PiePagina />
    </main>
  );
}
