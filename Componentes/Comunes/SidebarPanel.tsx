"use client";

import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { LogoMarca } from "@/Componentes/Comunes/LogoMarca";
import { EnlaceSidebar } from "@/Componentes/Comunes/EnlaceSidebar";
import {
  PuedeVerSeccionConfiguracion,
  PuedeVerSeccionUsuarios,
  TienePermiso,
} from "@/Utilidades/PermisosPanel";
import Link from "next/link";

export function SidebarPanel() {
  const { Roles } = UseAuth();
  const PuedeUsuarios = PuedeVerSeccionUsuarios(Roles);
  const PuedeConfiguracion = PuedeVerSeccionConfiguracion(Roles);
  const PuedeHabitaciones = TienePermiso(Roles, "habitaciones");
  const PuedeReservas = TienePermiso(Roles, "reservas");
  const PuedePagos = TienePermiso(Roles, "pagos");
  const PuedePoliticas = TienePermiso(Roles, "politicas");
  const PuedeReportes = TienePermiso(Roles, "reportes");

  return (
    <aside className="flex h-full w-64 flex-col bg-[#1c1a16] text-white">
      <Link
        href="/admin"
        className="flex items-center gap-2 border-b border-[#3d3a35] px-6 py-5"
        aria-label="Royal Palm - Ir al panel"
      >
        <span className="text-[#b88f3a]">
          <LogoMarca ClaseAdicional="h-8 w-8" />
        </span>
        <span className="FuenteTitulo text-lg font-semibold text-white">Royal Palm</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Panel de administración">
        <EnlaceSidebar
          Href="/admin/habitaciones"
          Hijo="Habitaciones"
          Deshabilitado={!PuedeHabitaciones}
          Icono={
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
        <EnlaceSidebar
          Href="/admin/reservas"
          Hijo="Reservas"
          Deshabilitado={!PuedeReservas}
          Icono={
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <EnlaceSidebar
          Href="/admin/pagos"
          Hijo="Pagos"
          Deshabilitado={!PuedePagos}
          Icono={
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
        />
        <EnlaceSidebar
          Href="/admin/usuarios"
          Hijo="Usuarios"
          Deshabilitado={!PuedeUsuarios}
          Icono={
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <EnlaceSidebar
          Href="/admin/politicas"
          Hijo="Políticas"
          Deshabilitado={!PuedePoliticas}
          Icono={
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <EnlaceSidebar
          Href="/admin/configuracion"
          Hijo="Configuración"
          Deshabilitado={!PuedeConfiguracion}
          Icono={
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <EnlaceSidebar
          Href="/admin/reportes"
          Hijo="Reportes"
          Deshabilitado={!PuedeReportes}
          Icono={
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </nav>
    </aside>
  );
}
