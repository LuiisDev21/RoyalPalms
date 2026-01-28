import Image from "next/image";
import { BotonEnlace } from "@/Componentes/Base/BotonEnlace";
import { IndicadorDesplazamiento } from "@/Componentes/Comunes/IndicadorDesplazamiento";

export function HeroPortada() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Image
        src="/HotelHero.jpg"
        alt="Interior del hotel"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center px-6 pt-24 md:pt-28">
          <div className="mx-auto w-full max-w-3xl text-center">
            <p className="text-xs tracking-[0.35em] text-white/70">
              BIENVENIDO A
            </p>

            <h1 className="FuenteTitulo mt-4 text-5xl leading-none text-white md:text-7xl">
              Royal Palm
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
              Donde el lujo se encuentra con la serenidad. Descubre un refugio de
              elegancia y confort en el corazón del paraíso.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <BotonEnlace
                HRef="/#Habitaciones"
                Texto="Explorar Habitaciones"
                Variante="Dorado"
                Tamano="Grande"
              />

              <BotonEnlace
                HRef="/#ConocerMas"
                Texto="Conocer Más"
                Variante="ContornoClaro"
                Tamano="Grande"
              />
            </div>
          </div>
        </div>

        <div className="pb-10">
          <IndicadorDesplazamiento />
        </div>
      </div>
    </section>
  );
}
