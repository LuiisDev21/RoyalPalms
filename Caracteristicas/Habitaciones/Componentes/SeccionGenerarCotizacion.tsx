"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { CampoFecha } from "@/Componentes/Base/CampoFecha";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import { GenerarCotizacionPdf } from "@/Utilidades/GenerarCotizacionPdf";

export function SeccionGenerarCotizacion({
  Habitacion,
  FechaEntradaInicial,
  FechaSalidaInicial,
  Deshabilitado = false,
}: {
  Habitacion: HabitacionResponse;
  FechaEntradaInicial: string | null;
  FechaSalidaInicial: string | null;
  Deshabilitado?: boolean;
}) {
  const Hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const Manana = useMemo(() => {
    const D = new Date();
    D.setDate(D.getDate() + 1);
    return D.toISOString().slice(0, 10);
  }, []);
  const [FechaEntrada, PonerFechaEntrada] = useState(
    FechaEntradaInicial || Hoy
  );
  const [FechaSalida, PonerFechaSalida] = useState(
    FechaSalidaInicial || Manana
  );
  const [EstaGenerando, PonerEstaGenerando] = useState(false);

  const PrecioPorNoche = useMemo(() => {
    const P = parseFloat(Habitacion.precio_por_noche);
    return Number.isNaN(P) ? 0 : P;
  }, [Habitacion.precio_por_noche]);

  const { Noches, Total } = useMemo(() => {
    const Entrada = new Date(FechaEntrada + "T12:00:00");
    const Salida = new Date(FechaSalida + "T12:00:00");
    if (Salida <= Entrada) {
      return { Noches: 0, Total: 0 };
    }
    const Diff = Math.ceil((Salida.getTime() - Entrada.getTime()) / (1000 * 60 * 60 * 24));
    const N = Math.max(0, Diff);
    return { Noches: N, Total: N * PrecioPorNoche };
  }, [FechaEntrada, FechaSalida, PrecioPorNoche]);

  const AlGenerar = useCallback(async () => {
    if (Noches <= 0 || Total <= 0) return;
    PonerEstaGenerando(true);
    try {
      await GenerarCotizacionPdf({
        Habitacion,
        FechaEntrada,
        FechaSalida,
        Noches,
        PrecioPorNoche,
        Total,
      });
    } finally {
      PonerEstaGenerando(false);
    }
  }, [
    Habitacion,
    FechaEntrada,
    FechaSalida,
    Noches,
    Total,
    PrecioPorNoche,
  ]);

  const MinSalida = FechaEntrada || Hoy;
  const PuedeGenerar = Noches > 0 && Total > 0 && !EstaGenerando && !Deshabilitado;

  return (
    <section
      className="rounded-2xl border-2 border-dotted border-[#b88f3a]/50 bg-white/95 p-6 shadow-lg shadow-[#b88f3a]/5 sm:p-8"
      aria-labelledby="cotizacion-titulo"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4">
          <div
            className="relative aspect-[16/9] w-full max-w-[380px] overflow-hidden rounded-xl"
            style={{ transform: "rotate(-4deg)" }}
          >
            <Image
              src="/postal.png"
              alt="Royal Palm"
              fill
              sizes="380px"
              className="object-cover"
            />
          </div>
          <h2
            id="cotizacion-titulo"
            className="FuenteTitulo text-2xl text-[#1c1a16]"
          >
            Generar cotización
          </h2>
          <p className="text-sm text-[#5b564d]">
            {Deshabilitado
              ? "Esta habitación no está disponible para reservar en este momento. La cotización no puede generarse."
              : "Indica las fechas de entrada y salida para calcular el total y descargar un comprobante en PDF."}
          </p>
        </div>
        <div className={`flex flex-wrap items-end gap-4 sm:gap-6 ${Deshabilitado ? "pointer-events-none opacity-60" : ""}`}>
          <CampoFecha
            Id="cotizacion-entrada"
            Etiqueta="Fecha de entrada"
            Min={Hoy}
            Valor={FechaEntrada}
            AlCambiar={PonerFechaEntrada}
            Deshabilitado={Deshabilitado}
          />
          <CampoFecha
            Id="cotizacion-salida"
            Etiqueta="Fecha de salida"
            Min={MinSalida}
            Valor={FechaSalida}
            AlCambiar={PonerFechaSalida}
            Deshabilitado={Deshabilitado}
          />
        <div className="flex flex-col gap-1 rounded-xl border border-[#b88f3a]/20 bg-[#b88f3a]/5 px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wider text-[#5b564d]">Total</span>
          <p className="FuenteTitulo text-xl text-[#b88f3a]">
            {Noches > 0 ? `${Noches} noche${Noches !== 1 ? "s" : ""} · $${Total.toFixed(2)}` : "—"}
          </p>
        </div>
        <button
          type="button"
          onClick={AlGenerar}
          disabled={!PuedeGenerar}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#b88f3a] px-6 py-3 text-sm font-medium text-white shadow-md shadow-[#b88f3a]/25 transition-all hover:bg-[#a67c32] hover:shadow-lg hover:shadow-[#b88f3a]/30 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
        >
          {EstaGenerando ? (
            "Generando…"
          ) : (
            <>
              <span aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
              Generar cotización (PDF)
            </>
          )}
        </button>
        </div>
      </div>
    </section>
  );
}
