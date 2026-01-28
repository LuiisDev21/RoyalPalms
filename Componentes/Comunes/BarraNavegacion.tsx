"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BotonEnlace } from "@/Componentes/Base/BotonEnlace";
import { LogoMarca } from "@/Componentes/Comunes/LogoMarca";

const EnlacesNavegacion = [
  { Texto: "Inicio", HRef: "/" },
  { Texto: "Habitaciones", HRef: "/#Habitaciones" },
  { Texto: "Nosotros", HRef: "/#Nosotros" },
  { Texto: "Contacto", HRef: "/#Contacto" },
] as const;

function UnirClases(...Clases: Array<string | undefined | false | null>) {
  return Clases.filter(Boolean).join(" ");
}

export function BarraNavegacion() {
  const [EstaFlotante, PonerEstaFlotante] = useState(false);
  const [EsTemaClaro, PonerEsTemaClaro] = useState(false);

  useEffect(() => {
    function AlHacerScroll() {
      const PosicionVertical = window.scrollY;
      const UmbralFlotante = 24;
      const UmbralTemaClaro = Math.max(UmbralFlotante, window.innerHeight - 120);

      PonerEstaFlotante(PosicionVertical > UmbralFlotante);
      PonerEsTemaClaro(PosicionVertical > UmbralTemaClaro);
    }

    AlHacerScroll();
    window.addEventListener("scroll", AlHacerScroll, { passive: true });
    return () => window.removeEventListener("scroll", AlHacerScroll);
  }, []);

  const ClaseTextoMarca = EstaFlotante
    ? EsTemaClaro
      ? "text-[#1c1a16]"
      : "text-white"
    : "text-white";

  const ClaseTextoEnlace = EstaFlotante
    ? EsTemaClaro
      ? "text-[#5b564d] hover:text-[#1c1a16]"
      : "text-white/75 hover:text-white"
    : "text-white/70 hover:text-white";

  const ClaseTextoAccion = EstaFlotante
    ? EsTemaClaro
      ? "text-[#5b564d] hover:text-[#1c1a16]"
      : "text-white/80 hover:text-white"
    : "text-white/75 hover:text-white";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
      <div
        className={UnirClases(
          "relative mx-auto w-full overflow-hidden rounded-full border border-transparent py-3",
          "transition-[max-width,background-color,border-color,box-shadow,backdrop-filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:opacity-0",
          "before:transition-opacity before:duration-700 before:ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:before:transition-none",
          EsTemaClaro
            ? "before:bg-gradient-to-b before:from-white/60 before:via-white/14 before:to-transparent"
            : "before:bg-gradient-to-b before:from-white/26 before:via-white/08 before:to-transparent",
          EstaFlotante
            ? UnirClases(
                "max-w-[1100px] backdrop-saturate-150 backdrop-contrast-125 shadow-[0_14px_46px_rgba(0,0,0,0.16)] before:opacity-100",
                EsTemaClaro
                  ? "border-black/10 bg-white/28 backdrop-blur-sm"
                  : "border-white/14 bg-black/16 backdrop-blur-md",
              )
            : "max-w-[1400px] bg-transparent shadow-none backdrop-blur-0 backdrop-saturate-100 backdrop-contrast-100",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className={UnirClases(
                "FuenteTitulo text-base tracking-wide transition-colors md:text-lg",
                ClaseTextoMarca,
              )}
            >
              <span className="flex items-center gap-3">
                <LogoMarca ClaseAdicional="h-6 w-6 md:h-7 md:w-7" />
                <span>Royal Palm</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {EnlacesNavegacion.map((Enlace) => (
                <Link
                  key={Enlace.Texto}
                  href={Enlace.HRef}
                  className={UnirClases("text-sm transition-colors", ClaseTextoEnlace)}
                >
                  {Enlace.Texto}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/#IniciarSesion"
              className={UnirClases(
                "hidden text-sm transition-colors sm:inline",
                ClaseTextoAccion,
              )}
            >
              Iniciar Sesión
            </Link>

            {EstaFlotante ? (
              <Link
                href="/#Reservar"
                className={UnirClases("text-sm transition-colors", ClaseTextoAccion)}
              >
                Reservar Ahora
              </Link>
            ) : (
              <BotonEnlace
                HRef="/#Reservar"
                Texto="Reservar Ahora"
                Variante="ContornoClaro"
                Tamano="Mediano"
                ClaseAdicional="rounded-full px-5"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}