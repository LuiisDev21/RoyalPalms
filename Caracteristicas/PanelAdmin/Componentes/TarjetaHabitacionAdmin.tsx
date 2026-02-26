"use client";

import { IconoSpinner } from "@/Componentes/Base/IconoSpinner";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";

function EtiquetaEstado({ Estado }: { Estado: string }) {
  const EsDisponible = Estado === "disponible";
  return (
    <span
      className={
        EsDisponible
          ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
          : "rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700"
      }
    >
      {EsDisponible ? "Disponible" : Estado}
    </span>
  );
}

export function TarjetaHabitacionAdmin({
  Habitacion,
  PuedeEditar,
  PuedeEliminar,
  CargandoEditar,
  CargandoEliminar,
  AlEditar,
  AlEliminar,
}: {
  Habitacion: HabitacionResponse;
  PuedeEditar: boolean;
  PuedeEliminar: boolean;
  CargandoEditar?: boolean;
  CargandoEliminar?: boolean;
  AlEditar: () => void;
  AlEliminar: () => void;
}) {
  const DeshabilitarEditar = CargandoEditar ?? false;
  const DeshabilitarEliminar = CargandoEliminar ?? false;
  const Precio = parseFloat(Habitacion.precio_por_noche);
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#e5e0d8] bg-white shadow-sm">
      <div className="flex items-start justify-between p-4">
        <h3 className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
          Habitación {Habitacion.numero}
        </h3>
        <EtiquetaEstado Estado={Habitacion.estado} />
      </div>
      {Habitacion.imagen_url ? (
        <div className="relative h-48 w-full shrink-0">
          <img
            src={Habitacion.imagen_url}
            alt={`Habitación ${Habitacion.numero}`}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-[#f0ebe3] text-[#6a645a]">
          <span>Sin imagen</span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-sm text-[#5b564d]">
          <span className="font-medium text-[#1c1a16]">Tipo:</span>{" "}
          {Habitacion.tipo_nombre ?? "—"}
        </p>
        <p className="text-sm text-[#5b564d]">
          <span className="font-medium text-[#1c1a16]">Capacidad:</span>{" "}
          {Habitacion.capacidad} {Habitacion.capacidad === 1 ? "persona" : "personas"}
        </p>
        <p className="text-sm text-[#5b564d]">
          <span className="font-medium text-[#1c1a16]">Precio por Noche:</span>{" "}
          ${Precio.toFixed(2)}
        </p>
        {Habitacion.politica_nombre ? (
          <p className="text-sm text-[#5b564d]">
            <span className="font-medium text-[#1c1a16]">Política cancelación:</span>{" "}
            {Habitacion.politica_nombre}
          </p>
        ) : null}
      </div>
      <div className="flex gap-2 border-t border-[#e5e0d8] p-4">
        {PuedeEditar && (
          <button
            type="button"
            onClick={AlEditar}
            disabled={DeshabilitarEditar}
            className="flex items-center gap-2 rounded-lg bg-[#1c1a16] px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#2d2a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {CargandoEditar ? <IconoSpinner /> : null}
            Editar
          </button>
        )}
        {PuedeEliminar && (
          <button
            type="button"
            onClick={AlEliminar}
            disabled={DeshabilitarEliminar}
            className="flex items-center gap-2 rounded-lg border border-[#1c1a16] bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#1c1a16] transition-colors hover:bg-[#f0ebe3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {CargandoEliminar ? <IconoSpinner /> : null}
            Eliminar
          </button>
        )}
      </div>
    </article>
  );
}
