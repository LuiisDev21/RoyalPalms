"use client";

import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { useRouter } from "next/navigation";

function FormatearRol(nombre: string): string {
  const n = nombre.toLowerCase();
  if (n === "administrador") return "Administrador";
  if (n === "gerente") return "Gerente";
  if (n === "recepcionista") return "Recepcionista";
  if (n === "huesped") return "Huésped";
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

export function EncabezadoPanel() {
  const router = useRouter();
  const { Usuario, CerrarSesion } = UseAuth();
  const NombreCompleto = Usuario ? `${Usuario.nombre} ${Usuario.apellido}`.trim() || "Usuario" : "";
  const Email = Usuario?.email ?? "";
  const RolesTexto =
    Usuario?.roles?.length ?
      Usuario.roles.map((r) => FormatearRol(r.nombre)).join(", ")
    : "";

  async function AlCerrarSesion() {
    await CerrarSesion();
    router.push("/login");
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-[#e5e0d8] bg-[#f6f2ec] px-6">
      <div className="flex flex-col items-end gap-0.5 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex flex-col items-end sm:items-start">
          <span className="text-sm font-medium text-[#1c1a16]">
            {NombreCompleto}
            {RolesTexto ? (
              <span className="ml-1.5 font-normal text-[#6a645a]">· {RolesTexto}</span>
            ) : null}
          </span>
          <span className="text-xs text-[#6a645a]">{Email}</span>
        </div>
        <span
          className="hidden shrink-0 sm:flex h-9 w-9 items-center justify-center rounded-full bg-[#1c1a16] text-white"
          aria-hidden
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
      </div>
      <button
        type="button"
        onClick={AlCerrarSesion}
        className="rounded-lg bg-[#1c1a16] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d2a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
      >
        Cerrar Sesión
      </button>
    </header>
  );
}
