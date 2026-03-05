"use client";

import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { useRouter } from "next/navigation";

export function EncabezadoMiCuenta({ onAbrirMenu }: { onAbrirMenu?: () => void } = {}) {
  const router = useRouter();
  const { Usuario, CerrarSesion } = UseAuth();
  const NombreCompleto = Usuario
    ? `${Usuario.nombre} ${Usuario.apellido}`.trim() || "Usuario"
    : "";
  const Email = Usuario?.email ?? "";

  async function AlCerrarSesion() {
    await CerrarSesion();
    router.push("/");
  }

  // Obtenemos iniciales para el avatar
  const iniciales = NombreCompleto
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#e5e0d8] bg-white/50 px-4 backdrop-blur-md sm:h-[72px] sm:justify-end sm:px-6 sm:px-8">
      {onAbrirMenu ? (
        <button
          type="button"
          onClick={onAbrirMenu}
          aria-label="Abrir menú de navegación"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#5b564d] hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] md:hidden"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      ) : (
        <div className="w-10 md:hidden" />
      )}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-6">
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3.5">
          <div className="flex min-w-0 flex-col items-end justify-center">
            <span className="truncate text-sm font-semibold text-[#1c1a16] sm:text-[15px] sm:leading-none sm:tracking-tight">
              {NombreCompleto}
            </span>
            <span className="mt-0.5 truncate text-xs text-[#8a8479] sm:mt-1 sm:text-[13px] sm:leading-tight sm:pr-0.5">
              {Email}
            </span>
          </div>

          {/* Avatar Premium */}
          <div
            className="hidden shrink-0 sm:flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#2a2825] to-[#1c1a16] text-[#e8dcc4] font-medium text-sm shadow-md ring-2 ring-white border border-[#3a3630]/20"
            aria-hidden
          >
            {iniciales}
          </div>
        </div>

        {/* Separador Visual */}
        <div className="hidden sm:block h-8 w-px bg-[#e5e0d8]"></div>

        <button
          type="button"
          onClick={AlCerrarSesion}
          className="group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#1c1a16] shadow-sm ring-1 ring-[#e5e0d8] transition-all hover:bg-[#fcfaf7] hover:ring-[#d4b982]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] sm:px-4 sm:py-2.5 sm:text-[13px]"
        >
          <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            <span className="hidden sm:inline">Cerrar sesión</span>
            <span className="sm:hidden">Salir</span>
            <svg
              className="h-3.5 w-3.5 text-[#8a8479] transition-transform group-hover:translate-x-0.5 group-hover:text-[#b88f3a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </span>
        </button>
      </div>
    </header>
  );
}
