"use client";

import Image from "next/image";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";

interface ListadoHabitacionesDisponiblesProps {
  Habitaciones: HabitacionResponse[];
  Noches: number;
  ReservandoId: number | null;
  onReservar: (H: HabitacionResponse) => void;
}

export function ListadoHabitacionesDisponibles({
  Habitaciones,
  Noches,
  ReservandoId,
  onReservar,
}: ListadoHabitacionesDisponiblesProps) {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Habitaciones.map((H) => {
        const PrecioNoche = parseFloat(H.precio_por_noche);
        const Total = Number.isNaN(PrecioNoche) ? 0 : PrecioNoche * Noches;
        const EstaReservando = ReservandoId === H.id;
        return (
          <article
            key={H.id}
            className="flex flex-col overflow-hidden rounded-xl border border-[#e5e0d8] bg-white shadow-sm"
          >
            <div className="relative aspect-[4/3] bg-[#f6f2ec]">
              {H.imagen_url ? (
                <Image
                  src={H.imagen_url}
                  alt={`Habitación ${H.numero}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#6a645a]/50">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
                Habitación {H.numero}
              </h3>
              {H.tipo_nombre && (
                <p className="mt-0.5 text-sm text-[#5b564d]">{H.tipo_nombre}</p>
              )}
              <p className="mt-2 text-sm font-medium text-[#1c1a16]">
                ${PrecioNoche.toFixed(0)}/noche · Total estimado: ${Total.toFixed(2)}
              </p>
              <p className="mt-0.5 text-xs text-[#6a645a]">
                Precio aproximado. El total final lo indica el sistema al confirmar.
              </p>
              <button
                type="button"
                onClick={() => onReservar(H)}
                disabled={ReservandoId !== null}
                className="mt-4 w-full rounded-lg bg-[#b88f3a] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#a67c32] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
              >
                {EstaReservando ? "Reservando…" : "Reservar esta habitación"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
