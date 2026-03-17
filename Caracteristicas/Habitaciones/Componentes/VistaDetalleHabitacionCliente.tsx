"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EnlaceReservarAhora } from "@/Componentes/Base/EnlaceReservarAhora";
import { BarraNavegacion } from "@/Componentes/Comunes/BarraNavegacion";
import { PiePagina } from "@/Componentes/Comunes/PiePagina";
import { SeccionGenerarCotizacion } from "@/Caracteristicas/Habitaciones/Componentes/SeccionGenerarCotizacion";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import { ObtenerHabitacionCliente } from "@/Servicios/ClienteApiServicio";

export function VistaDetalleHabitacionCliente({
  Id,
  Entrada,
  Salida,
}: {
  Id: number;
  Entrada: string | null;
  Salida: string | null;
}) {
  const [Habitacion, PonerHabitacion] = useState<HabitacionResponse | null>(null);
  const [Cargando, PonerCargando] = useState(true);
  const [ErrorCarga, PonerErrorCarga] = useState<string | null>(null);

  useEffect(() => {
    let Activo = true;
    async function CargarDetalle() {
      PonerCargando(true);
      PonerErrorCarga(null);
      try {
        const Datos = await ObtenerHabitacionCliente(Id);
        if (!Activo) return;
        PonerHabitacion(Datos);
      } catch (ErrorDesconocido) {
        if (!Activo) return;
        PonerHabitacion(null);
        const Mensaje =
          ErrorDesconocido instanceof Error
            ? ErrorDesconocido.message
            : "No se pudo cargar la habitación.";
        PonerErrorCarga(Mensaje);
      } finally {
        if (!Activo) return;
        PonerCargando(false);
      }
    }
    CargarDetalle();
    return () => {
      Activo = false;
    };
  }, [Id]);

  if (Cargando) {
    return (
      <main className="min-h-screen bg-[#f6f2ec]">
        <BarraNavegacion />
        <section className="mx-auto max-w-4xl px-4 pt-32 pb-16 sm:px-6 md:pt-40">
          <div className="rounded-2xl border border-[#6a645a]/15 bg-white p-10 text-center">
            <p className="FuenteTitulo text-lg text-[#1c1a16]">Cargando habitación...</p>
          </div>
        </section>
        <PiePagina />
      </main>
    );
  }

  if (!Habitacion) {
    return (
      <main className="min-h-screen bg-[#f6f2ec]">
        <BarraNavegacion />
        <section className="mx-auto max-w-4xl px-4 pt-32 pb-16 sm:px-6 md:pt-40">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="FuenteTitulo text-lg text-red-700">No se pudo cargar la habitación</p>
            <p className="mt-2 text-sm text-red-600">
              {ErrorCarga ?? "Intenta nuevamente en unos segundos."}
            </p>
            <div className="mt-5">
              <Link
                href="/habitaciones"
                className="inline-flex items-center justify-center rounded-lg border border-[#6a645a]/30 bg-white px-6 py-3 text-sm font-medium text-[#5b564d] transition-colors hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
              >
                Volver a habitaciones
              </Link>
            </div>
          </div>
        </section>
        <PiePagina />
      </main>
    );
  }

  const Precio = parseFloat(Habitacion.precio_por_noche);
  const PrecioFormato = Number.isNaN(Precio) ? "—" : `$${Precio.toFixed(0)}`;
  const EstaDisponible = Habitacion.estado === "disponible";

  return (
    <main
      className="min-h-screen bg-white"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, #bf9a4f 0%, #bf9a4f 100px, transparent 100px),
          radial-gradient(circle at center, rgba(106, 100, 90, 0.2) 1.5px, transparent 1.5px)
        `,
        backgroundSize: "100% 100%, 20px 20px",
      }}
    >
      <BarraNavegacion />
      <article className="mx-auto max-w-4xl px-4 pt-32 pb-16 sm:px-6 md:pt-40">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
          <div className="relative aspect-[16/9] bg-[#f6f2ec]">
            {Habitacion.imagen_url ? (
              <Image
                src={Habitacion.imagen_url}
                alt={`Habitación ${Habitacion.numero}`}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[#6a645a]/50">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-8 md:p-10">
            <h1 className="FuenteTitulo text-3xl text-[#1c1a16] md:text-4xl">
              Habitación {Habitacion.numero}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {Habitacion.tipo_nombre && (
                <span className="rounded-full border border-[#b88f3a]/20 bg-[#b88f3a]/12 px-3 py-1 text-sm font-medium text-[#b88f3a]">
                  {Habitacion.tipo_nombre}
                </span>
              )}
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  Habitacion.estado === "disponible"
                    ? "bg-[#2d5a3d]/12 text-[#2d5a3d]"
                    : "bg-[#6a645a]/12 text-[#5b564d]"
                }`}
              >
                {Habitacion.estado === "disponible"
                  ? "Disponible"
                  : Habitacion.estado.charAt(0).toUpperCase() +
                    Habitacion.estado.slice(1).replace(/_/g, " ")}
              </span>
            </div>
            {Habitacion.descripcion && (
              <p className="mt-6 leading-relaxed text-[#5b564d]">
                {Habitacion.descripcion}
              </p>
            )}
            <ul className="mt-8 flex flex-wrap gap-4 text-sm text-[#5b564d]">
              <li>Capacidad: {Habitacion.capacidad} huésped{Habitacion.capacidad !== 1 ? "es" : ""}</li>
              {Habitacion.politica_nombre && (
                <li>Política de cancelación: {Habitacion.politica_nombre}</li>
              )}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <p className="FuenteTitulo text-2xl text-[#b88f3a]">
                {PrecioFormato}/noche
              </p>
              {EstaDisponible ? (
                <EnlaceReservarAhora
                  className="inline-flex items-center justify-center rounded-lg bg-[#b88f3a] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#a67c32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
                >
                  Reservar ahora
                </EnlaceReservarAhora>
              ) : (
                <span
                  className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-[#6a645a]/30 bg-[#6a645a]/10 px-6 py-3 text-sm font-medium text-[#5b564d]"
                  aria-disabled="true"
                >
                  No disponible para reservar
                </span>
              )}
              <Link
                href="/habitaciones"
                className="inline-flex items-center justify-center rounded-lg border border-[#6a645a]/30 bg-white px-6 py-3 text-sm font-medium text-[#5b564d] transition-colors hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
              >
                Ver más habitaciones
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <SeccionGenerarCotizacion
            Habitacion={Habitacion}
            FechaEntradaInicial={Entrada}
            FechaSalidaInicial={Salida}
            Deshabilitado={!EstaDisponible}
          />
        </div>
      </article>
      <PiePagina />
    </main>
  );
}
