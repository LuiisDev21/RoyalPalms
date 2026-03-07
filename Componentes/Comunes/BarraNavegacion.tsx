"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EnlaceScrollInicio } from "@/Componentes/Base/EnlaceScrollInicio";
import { LogoMarca } from "@/Componentes/Comunes/LogoMarca";
import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { EsHuesped, ObtenerRolesUsuario } from "@/Tipos/Auth";
import { ObtenerUsuarioAlmacenado } from "@/Servicios/ApiCliente";

const EnlacesNavegacion = [
  { Texto: "Habitaciones", HRef: "/habitaciones" },
  { Texto: "Nosotros", HRef: "/nosotros" },
  { Texto: "Contacto", HRef: "/contacto" },
] as const;

function UnirClases(...Clases: Array<string | undefined | false | null>) {
  return Clases.filter(Boolean).join(" ");
}

function IconoMenu({ ClaseAdicional }: { ClaseAdicional?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      className={ClaseAdicional}
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconoCerrar({ ClaseAdicional }: { ClaseAdicional?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      className={ClaseAdicional}
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BarraNavegacion() {
  const { Usuario, Cargando } = UseAuth();
  const [Montado, PonerMontado] = useState(false);
  const [EstaFlotante, PonerEstaFlotante] = useState(false);
  const [EsTemaClaro, PonerEsTemaClaro] = useState(false);
  const [EstaMenuMovilAbierto, PonerEstaMenuMovilAbierto] = useState(false);

  useEffect(() => {
    PonerMontado(true);
  }, []);

  const UsuarioActual = Montado ? (Usuario ?? ObtenerUsuarioAlmacenado()) : null;
  const Roles = ObtenerRolesUsuario(UsuarioActual);
  const EsSoloHuesped = EsHuesped(Roles);
  const MostrarMiCuenta = Montado && !!UsuarioActual && EsSoloHuesped;
  const MostrarPanel = Montado && !!UsuarioActual && !EsSoloHuesped;
  const MostrarIniciarSesion = Montado && !UsuarioActual && !Cargando;

  useEffect(() => {
    function AlHacerScroll() {
      const PosicionVertical = window.scrollY;
      const UmbralFlotante = 24;
      const UmbralTemaClaro = Math.max(UmbralFlotante, window.innerHeight - 120);

      PonerEstaFlotante(PosicionVertical > UmbralFlotante);
      if (typeof ForzarTemaClaro === "boolean") {
        PonerEsTemaClaro(ForzarTemaClaro);
      } else {
        PonerEsTemaClaro(PosicionVertical > UmbralTemaClaro);
      }
    }

    AlHacerScroll();
    window.addEventListener("scroll", AlHacerScroll, { passive: true });
    return () => window.removeEventListener("scroll", AlHacerScroll);
  }, []);

  useEffect(() => {
    function AlCambiarTamano() {
      if (window.innerWidth >= 768) {
        PonerEstaMenuMovilAbierto(false);
      }
    }

    window.addEventListener("resize", AlCambiarTamano, { passive: true });
    return () => window.removeEventListener("resize", AlCambiarTamano);
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

  const ClaseBotonMenu = UnirClases(
    "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
    EstaFlotante
      ? EsTemaClaro
        ? "text-[#1c1a16] hover:bg-black/5"
        : "text-white hover:bg-white/10"
      : "text-white hover:bg-white/10",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
  );

  const ClasePanelMovil = UnirClases(
    "md:hidden absolute left-0 right-0 top-full mt-3 origin-top rounded-2xl border p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-saturate-150 backdrop-contrast-125",
    "transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
    EstaMenuMovilAbierto
      ? "opacity-100 translate-y-0 scale-100"
      : "pointer-events-none opacity-0 -translate-y-2 scale-95",
    EstaFlotante
      ? EsTemaClaro
        ? "border-black/10 bg-white/78 backdrop-blur-xl"
        : "border-white/16 bg-black/45 backdrop-blur-2xl"
      : "border-white/16 bg-black/50 backdrop-blur-2xl",
  );

  const ClaseEnlaceMovil = UnirClases(
    "block rounded-xl px-3 py-2 text-sm transition-colors",
    EstaFlotante && EsTemaClaro
      ? "text-[#1c1a16] hover:bg-black/5"
      : "text-white hover:bg-white/10",
  );

  const ClaseAccionMovil = UnirClases(
    "block rounded-xl px-3 py-2 text-sm transition-colors",
    EstaFlotante && EsTemaClaro
      ? "text-[#1c1a16] hover:bg-black/5"
      : "text-white hover:bg-white/10",
  );

  const ClaseBotonReservar = UnirClases(
    "inline-flex h-9 items-center justify-center rounded-full px-5 text-sm transition-colors",
    EstaFlotante
      ? UnirClases("bg-transparent border border-transparent", ClaseTextoAccion)
      : "border border-white/70 text-white hover:bg-white/10",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
  );

  function AlternarMenuMovil() {
    PonerEstaMenuMovilAbierto((Valor) => !Valor);
  }

  function CerrarMenuMovil() {
    PonerEstaMenuMovilAbierto(false);
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 sm:pt-[calc(1.5rem+env(safe-area-inset-top))] transform-gpu will-change-transform"
      style={{ WebkitTransform: "translate3d(0,0,0)" }}
    >
      <div
        className={UnirClases(
          "relative mx-auto w-full rounded-full border border-transparent py-3",
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
            <EnlaceScrollInicio
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
            </EnlaceScrollInicio>

            <nav className="hidden items-center gap-8 md:flex">
              {EnlacesNavegacion.map((Enlace) => (
                <EnlaceScrollInicio
                  key={Enlace.Texto}
                  href={Enlace.HRef}
                  className={UnirClases("text-sm transition-colors", ClaseTextoEnlace)}
                >
                  {Enlace.Texto}
                </EnlaceScrollInicio>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {MostrarIniciarSesion && (
              <EnlaceScrollInicio
                href="/login"
                className={UnirClases(
                  "hidden text-sm transition-colors sm:inline",
                  ClaseTextoAccion,
                )}
              >
                Iniciar Sesión
              </EnlaceScrollInicio>
            )}
            {MostrarMiCuenta && (
              <Link
                href="/mi-cuenta"
                className={UnirClases(
                  "hidden text-sm transition-colors sm:inline",
                  ClaseTextoAccion,
                )}
              >
                Mi cuenta
              </Link>
            )}
            {MostrarPanel && (
              <Link
                href="/admin"
                className={UnirClases(
                  "hidden text-sm transition-colors sm:inline",
                  ClaseTextoAccion,
                )}
              >
                Panel
              </Link>
            )}

            <Link
              href={UsuarioActual ? "/mi-cuenta/reservas/nueva" : "/login"}
              className={ClaseBotonReservar}
            >
              Reservar Ahora
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              aria-label={EstaMenuMovilAbierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={EstaMenuMovilAbierto}
              onClick={AlternarMenuMovil}
              className={ClaseBotonMenu}
            >
              {EstaMenuMovilAbierto ? <IconoCerrar /> : <IconoMenu />}
            </button>
          </div>
        </div>

        <div className={ClasePanelMovil} role="dialog" aria-label="Menú">
          <nav className="space-y-1">
            {EnlacesNavegacion.map((Enlace) => (
              <EnlaceScrollInicio
                key={Enlace.Texto}
                href={Enlace.HRef}
                className={ClaseEnlaceMovil}
                onClick={CerrarMenuMovil}
              >
                {Enlace.Texto}
              </EnlaceScrollInicio>
            ))}
          </nav>

          <div className="mt-3 border-t border-white/10 pt-3">
            {MostrarIniciarSesion && (
              <EnlaceScrollInicio
                href="/login"
                className={ClaseAccionMovil}
                onClick={CerrarMenuMovil}
              >
                Iniciar Sesión
              </EnlaceScrollInicio>
            )}
            {MostrarMiCuenta && (
              <Link
                href="/mi-cuenta"
                className={ClaseAccionMovil}
                onClick={CerrarMenuMovil}
              >
                Mi cuenta
              </Link>
            )}
            {MostrarPanel && (
              <Link
                href="/admin"
                className={ClaseAccionMovil}
                onClick={CerrarMenuMovil}
              >
                Panel
              </Link>
            )}
            <Link
              href={UsuarioActual ? "/mi-cuenta/reservas/nueva" : "/login"}
              className={ClaseAccionMovil}
              onClick={CerrarMenuMovil}
            >
              Reservar Ahora
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}