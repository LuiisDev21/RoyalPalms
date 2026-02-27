"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMarca } from "@/Componentes/Comunes/LogoMarca";

const Enlaces = [
  {
    Href: "/mi-cuenta/reservas",
    Hijo: "Mis reservas",
    Icono: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    Href: "/mi-cuenta/reservas/nueva",
    Hijo: "Nueva reserva",
    Icono: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    Href: "/mi-cuenta/configuracion",
    Hijo: "Configuración",
    Icono: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
] as const;

export function SidebarMiCuenta() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col bg-[#1c1a16] text-white">
      <Link
        href="/mi-cuenta"
        className="flex items-center gap-2 border-b border-[#3d3a35] px-6 py-5"
        aria-label="Royal Palm - Mi cuenta"
      >
        <span className="text-[#b88f3a]">
          <LogoMarca ClaseAdicional="h-8 w-8" />
        </span>
        <span className="FuenteTitulo text-lg font-semibold text-white">Mi cuenta</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Área de cliente">
        {Enlaces.map(({ Href, Hijo, Icono }) => {
          const Activo = pathname === Href || (Href !== "/mi-cuenta/reservas" && pathname?.startsWith(Href));
          return (
            <Link
              key={Href}
              href={Href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] ${
                Activo
                  ? "bg-[#b88f3a]/20 text-[#b88f3a]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {Icono}
              {Hijo}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#3d3a35] p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </aside>
  );
}
