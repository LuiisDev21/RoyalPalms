import { BarraNavegacion } from "@/Componentes/Comunes/BarraNavegacion";
import { HeroPortada } from "@/Componentes/Comunes/HeroPortada";
import { PiePagina } from "@/Componentes/Comunes/PiePagina";
import { SeccionExperiencias } from "@/Componentes/Comunes/SeccionExperiencias";
import { SeccionHistoria } from "@/Componentes/Comunes/SeccionHistoria";
import { BotonEnlace } from "@/Componentes/Base/BotonEnlace"; // Importación necesaria

export default function PaginaInicio() {
  return (
    <main className="min-h-screen">
      <BarraNavegacion />
      
  
      <HeroPortada /> 
          {/* Integración del botón Habitaciones*/}
      <div className="flex justify-center -mt-20 relative z-10">
         <BotonEnlace 
            HRef="/habitaciones" 
            Texto="Explorar Habitaciones" 
            Variante="Dorado" 
         />
      </div>

      <SeccionExperiencias />
      <SeccionHistoria />
      <div id="Habitaciones" />
      <div id="Contacto" />
      <PiePagina />
    </main>
  );
}