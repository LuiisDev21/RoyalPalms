"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ListarMisReservas,
  type ReservaClienteResponse,
} from "@/Servicios/ClienteApiServicio";
import { ClavesQueryMiCuenta } from "@/Utilidades/QueryKeysMiCuenta";
import { FormatearMontoConMoneda, ObtenerPrecioTotalNumerico } from "@/Utilidades/FormatearMoneda";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";

function BadgeEstado(Estado: string) {
  const Clases: Record<string, string> = {
    pendiente: "bg-amber-100 text-amber-800",
    confirmada: "bg-emerald-100 text-emerald-800",
    cancelada: "bg-red-100 text-red-800",
    completada: "bg-sky-100 text-sky-800",
    no_show: "bg-amber-100 text-amber-800",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${Clases[Estado] ?? "bg-gray-100 text-gray-800"}`}
    >
      {Estado}
    </span>
  );
}

function TarjetaReserva({
  Reserva,
}: {
  Reserva: ReservaClienteResponse;
}) {
  const Entrada = new Date(Reserva.fecha_entrada).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const Salida = new Date(Reserva.fecha_salida).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const Precio = ObtenerPrecioTotalNumerico(Reserva.precio_total);
  const Moneda = Reserva.moneda ?? "USD";
  const PrecioTexto = FormatearMontoConMoneda(Precio, Moneda);
  const PuedeCancelar =
    Reserva.estado !== "cancelada" &&
    Reserva.estado !== "completada";

  return (
    <article className="rounded-xl border border-[#e5e0d8] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
              Reserva #{Reserva.id}
              {Reserva.codigo_reserva ? ` · ${Reserva.codigo_reserva}` : ""}
            </span>
            {BadgeEstado(Reserva.estado)}
          </div>
          <p className="mt-1 text-sm text-[#5b564d]">
            {Reserva.numero_habitacion
              ? `Habitación ${Reserva.numero_habitacion}`
              : "Habitación reservada"}
            {" · "}
            {Entrada} – {Salida}
          </p>
          <p className="mt-0.5 text-sm font-medium text-[#1c1a16]">
            Total: {PrecioTexto}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={`/mi-cuenta/reservas/${Reserva.id}`}
            className="rounded-lg bg-[#1c1a16] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d2a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
          >
            Ver detalle y pagos
          </Link>
          {PuedeCancelar && (
            <Link
              href={`/mi-cuenta/reservas/${Reserva.id}?cancelar=1`}
              className="rounded-lg border border-[#e5e0d8] bg-white px-4 py-2 text-sm font-medium text-[#5b564d] transition-colors hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
            >
              Cancelar
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default function PaginaMisReservas() {
  const {
    data: Reservas = [],
    isLoading: Cargando,
    isError,
    error,
  } = useQuery({
    queryKey: ClavesQueryMiCuenta.ListaReservas,
    queryFn: ListarMisReservas,
  });

  useEffect(() => {
    if (!isError || !error) return;
    const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
      error,
      "Error al cargar reservas"
    );
    Notificaciones.Error(Titulo, Descripcion);
  }, [isError, error]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
          Mis reservas
        </h1>
        <Link
          href="/mi-cuenta/reservas/nueva"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#b88f3a] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#a67c32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] sm:w-auto"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva reserva
        </Link>
      </div>

      {Cargando ? (
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
        </div>
      ) : Reservas.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-12 text-center">
          <p className="FuenteTitulo text-lg text-[#1c1a16]">
            No tienes reservas
          </p>
          <p className="mt-2 text-sm text-[#5b564d]">
            Crea tu primera reserva eligiendo fechas y habitación.
          </p>
          <Link
            href="/mi-cuenta/reservas/nueva"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#b88f3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#a67c32]"
          >
            Nueva reserva
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {Reservas.map((R) => (
            <TarjetaReserva key={R.id} Reserva={R} />
          ))}
        </div>
      )}
    </div>
  );
}
