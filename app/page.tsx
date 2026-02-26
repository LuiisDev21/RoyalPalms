import { BarraNavegacion } from "@/Componentes/Comunes/BarraNavegacion";
import { HeroPortada } from "@/Componentes/Comunes/HeroPortada";
import { PiePagina } from "@/Componentes/Comunes/PiePagina";
import { SeccionExperiencias } from "@/Componentes/Comunes/SeccionExperiencias";
import { SeccionHistoria } from "@/Componentes/Comunes/SeccionHistoria";

export default function PaginaInicio() {
  return (
    <main className="min-h-screen">
      <BarraNavegacion />
      <HeroPortada />
      <SeccionExperiencias />
      <SeccionHistoria />
      <div id="Habitaciones" />
      <div id="Contacto" />
      <PiePagina />
    </main>
  );
}
