"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BotonEnlace } from "@/Componentes/Base/BotonEnlace";

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
  const [ClaseAnimacion, PonerClaseAnimacion] = useState<
    "GotaEntrar" | "GotaSalir" | null
  >(null);
  const YaInicializado = useRef(false);

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

  useEffect(() => {
    if (!YaInicializado.current) {
      YaInicializado.current = true;
      return;
    }

    const SiguienteClase = EstaFlotante ? "GotaEntrar" : "GotaSalir";
    PonerClaseAnimacion(SiguienteClase);

    const Tiempo =
      SiguienteClase === "GotaEntrar" ? 650 : 520;
    const Temporizador = window.setTimeout(
      () => PonerClaseAnimacion(null),
      Tiempo + 40,
    );

    return () => window.clearTimeout(Temporizador);
  }, [EstaFlotante]);

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
          "relative mx-auto flex max-w-6xl items-center justify-between border border-transparent px-5 py-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:opacity-0 before:transition-opacity before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)]",
          ClaseAnimacion,
          EstaFlotante
            ? UnirClases(
                "w-[min(1100px,calc(100vw-2rem))] rounded-full backdrop-blur-2xl backdrop-saturate-150 shadow-[0_18px_60px_rgba(0,0,0,0.22)]",
                EsTemaClaro
                  ? "border-black/10 bg-white/65 before:opacity-100 before:bg-gradient-to-b before:from-white/70 before:via-white/35 before:to-transparent"
                  : "border-white/18 bg-white/12 before:opacity-100 before:bg-gradient-to-b before:from-white/40 before:via-white/16 before:to-transparent",
              )
            : "w-full",
        )}
      >
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className={UnirClases(
              "FuenteTitulo text-base tracking-wide transition-colors md:text-lg",
              ClaseTextoMarca,
            )}
          >
            Royal Palm
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {EnlacesNavegacion.map((Enlace) => (
              <Link
                key={Enlace.Texto}
                href={Enlace.HRef}
                className={UnirClases(
                  "text-sm transition-colors",
                  ClaseTextoEnlace,
                )}
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
              className={UnirClases(
                "text-sm transition-colors",
                ClaseTextoAccion,
              )}
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
    </header>
  );
}
