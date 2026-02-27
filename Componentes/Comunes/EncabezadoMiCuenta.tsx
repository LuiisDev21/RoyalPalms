"use client";

import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { useRouter } from "next/navigation";

export function EncabezadoMiCuenta() {
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
    <header className="flex h-[72px] shrink-0 items-center justify-end gap-5 border-b border-[#e5e0d8] bg-white/50 backdrop-blur-md px-6 sm:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Información del Usuario */}
        <div className="flex items-center gap-3.5">
          <div className="flex flex-col items-end sm:items-end justify-center">
            <span className="text-[15px] leading-none font-semibold text-[#1c1a16] tracking-tight">
              {NombreCompleto}
            </span>
            <span className="text-[13px] leading-tight text-[#8a8479] mt-1 pr-0.5">
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

        {/* Botón Cerrar Sesión Premium */}
        <button
          type="button"
          onClick={AlCerrarSesion}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-white px-4 py-2.5 text-[13px] font-medium text-[#1c1a16] shadow-sm ring-1 ring-[#e5e0d8] transition-all hover:bg-[#fcfaf7] hover:ring-[#d4b982]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
        >
          <span className="relative z-10 flex items-center gap-2">
            Cerrar sesión
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
