"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { CampoFecha } from "@/Componentes/Base/CampoFecha";
import type { TipoHabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";

function UnirClases(...Clases: Array<string | undefined | false | null>) {
  return Clases.filter(Boolean).join(" ");
}

export interface DatosBusquedaHabitaciones {
  FechaEntrada: string;
  FechaSalida: string;
  Huespedes: string;
  TipoId: string;
}

export function FormularioBusquedaHabitaciones({
  Tipos,
  AlBuscarConDatos,
  Deshabilitado = false,
}: {
  Tipos: TipoHabitacionResponse[];
  AlBuscarConDatos?: (datos: DatosBusquedaHabitaciones) => void | Promise<void>;
  Deshabilitado?: boolean;
}) {
  const Router = useRouter();
  const Parametros = useSearchParams();
  const [FechaEntrada, PonerFechaEntrada] = useState(
    () => Parametros.get("entrada") ?? ""
  );
  const [FechaSalida, PonerFechaSalida] = useState(
    () => Parametros.get("salida") ?? ""
  );
  const [Huespedes, PonerHuespedes] = useState(
    () => Parametros.get("huespedes") ?? "1"
  );
  const [TipoId, PonerTipoId] = useState(
    () => Parametros.get("tipo") ?? ""
  );

  const Hoy = new Date().toISOString().slice(0, 10);

  const AlBuscar = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (AlBuscarConDatos) {
        void AlBuscarConDatos({
          FechaEntrada,
          FechaSalida,
          Huespedes,
          TipoId,
        });
        return;
      }
      const Buscador = new URLSearchParams();
      if (FechaEntrada) Buscador.set("entrada", FechaEntrada);
      if (FechaSalida) Buscador.set("salida", FechaSalida);
      if (Huespedes) Buscador.set("huespedes", Huespedes);
      if (TipoId) Buscador.set("tipo", TipoId);
      Router.push(`/habitaciones?${Buscador.toString()}`);
    },
    [FechaEntrada, FechaSalida, Huespedes, TipoId, Router, AlBuscarConDatos]
  );

  return (
    <form
      onSubmit={AlBuscar}
      className={UnirClases(
        "mx-auto flex max-w-5xl flex-wrap items-end gap-4 rounded-2xl border-2 border-dotted border-[#b88f3a]/70 bg-[#f6f2ec]/98 p-5 shadow-lg shadow-[#b88f3a]/10 sm:gap-6 sm:p-6 md:p-7",
        "focus-within:ring-2 focus-within:ring-[#b88f3a]/50 focus-within:border-[#b88f3a]"
      )}
      aria-label="Buscar habitaciones disponibles"
    >
      <div className="flex min-w-[140px] flex-1">
        <CampoFecha
          Id="busqueda-llegada"
          Etiqueta="Llegada"
          Min={Hoy}
          Valor={FechaEntrada}
          AlCambiar={PonerFechaEntrada}
        />
      </div>
      <div className="flex min-w-[140px] flex-1">
        <CampoFecha
          Id="busqueda-salida"
          Etiqueta="Salida"
          Min={FechaEntrada || Hoy}
          Valor={FechaSalida}
          AlCambiar={PonerFechaSalida}
        />
      </div>
      <div className="flex min-w-[120px] flex-col gap-1">
        <label htmlFor="busqueda-huespedes" className="text-xs font-medium text-[#5b564d]">
          Huéspedes
        </label>
        <select
          id="busqueda-huespedes"
          value={Huespedes}
          onChange={(e) => PonerHuespedes(e.target.value)}
          className="rounded-lg border border-[#6a645a]/30 bg-white px-3 py-2.5 text-sm text-[#1c1a16] outline-none transition-colors focus:border-[#b88f3a] focus:ring-1 focus:ring-[#b88f3a]"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "huésped" : "huéspedes"}
            </option>
          ))}
        </select>
      </div>
      <div className="flex min-w-[160px] flex-col gap-1">
        <label htmlFor="busqueda-tipo" className="text-xs font-medium text-[#5b564d]">
          Tipo
        </label>
        <select
          id="busqueda-tipo"
          value={TipoId}
          onChange={(e) => PonerTipoId(e.target.value)}
          className="rounded-lg border border-[#6a645a]/30 bg-white px-3 py-2.5 text-sm text-[#1c1a16] outline-none transition-colors focus:border-[#b88f3a] focus:ring-1 focus:ring-[#b88f3a]"
        >
          <option value="">Todas las habitaciones</option>
          {Tipos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={Deshabilitado}
        className={UnirClases(
          "flex shrink-0 items-center gap-2 rounded-lg bg-[#b88f3a] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#a67c32] disabled:opacity-60",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
        )}
      >
        <span aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        {Deshabilitado ? "Buscando…" : "Buscar"}
      </button>
    </form>
  );
}
