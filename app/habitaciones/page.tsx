import type { Metadata } from "next";
import { BarraNavegacion } from "@/Componentes/Comunes/BarraNavegacion";
import { PiePagina } from "@/Componentes/Comunes/PiePagina";
import { HeroHabitaciones } from "@/Caracteristicas/Habitaciones/Componentes/HeroHabitaciones";
import { ListadoHabitaciones } from "@/Caracteristicas/Habitaciones/Componentes/ListadoHabitaciones";
import { ListarTiposHabitacion } from "@/Servicios/HabitacionesServicio";

export const metadata: Metadata = {
  title: "Habitaciones | Royal Palm",
  description:
    "Descubre nuestras habitaciones y suites. Elegancia y confort para tu descanso.",
};

export default async function PaginaHabitaciones({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const Params = await searchParams;
  const Entrada = typeof Params.entrada === "string" ? Params.entrada : null;
  const Salida = typeof Params.salida === "string" ? Params.salida : null;
  const Huespedes = typeof Params.huespedes === "string" ? Params.huespedes : null;
  const TipoId = typeof Params.tipo === "string" ? Params.tipo : null;
  const PaginaRaw = typeof Params.pagina === "string" ? Params.pagina : "1";
  const Pagina = parseInt(PaginaRaw, 10) || 1;

  const Tipos = await ListarTiposHabitacion();

  return (
    <main className="min-h-screen bg-[#f6f2ec]">
      <BarraNavegacion />
      <HeroHabitaciones Tipos={Tipos} />
      <ListadoHabitaciones
        Entrada={Entrada}
        Salida={Salida}
        Huespedes={Huespedes}
        TipoId={TipoId}
        Pagina={Pagina}
      />
      <PiePagina />
    </main>
  );
}
