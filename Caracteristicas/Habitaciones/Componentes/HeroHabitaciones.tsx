import Image from "next/image";
import { Suspense } from "react";
import { FormularioBusquedaHabitaciones } from "./FormularioBusquedaHabitaciones";
import type { TipoHabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";

export function HeroHabitaciones({
  Tipos,
}: {
  Tipos: TipoHabitacionResponse[];
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[42vh] min-h-[280px] md:h-[50vh] md:min-h-[340px]">
        <Image
          src="/HotelHero.jpg"
          alt="Habitaciones Royal Palm"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 md:pt-28">
          <p className="text-xs tracking-[0.35em] text-white/70">
            BIENVENIDO AL PARAÍSO
          </p>
          <h1 className="FuenteTitulo mt-4 text-4xl leading-none text-white md:text-5xl lg:text-6xl">
            Nuestras Habitaciones
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/85 md:text-base">
            Descubre un refugio de elegancia y confort donde cada detalle ha sido
            diseñado para tu descanso.
          </p>
        </div>
      </div>
      <div className="relative z-20 -mt-8 mb-16 px-4 sm:px-6 md:mb-24">
        <Suspense fallback={<div className="mx-auto h-24 max-w-5xl animate-pulse rounded-2xl bg-[#f6f2ec]/90" />}>
          <FormularioBusquedaHabitaciones Tipos={Tipos} />
        </Suspense>
      </div>
    </section>
  );
}
