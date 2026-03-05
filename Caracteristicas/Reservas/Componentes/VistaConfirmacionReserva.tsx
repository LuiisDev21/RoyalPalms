"use client";

import Image from "next/image";
import { DesglosePrecios } from "@/Componentes/Base/DesglosePrecios";
import { MetodosPagoApi } from "@/Utilidades/MetodosPago";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import type { PrevisualizarPrecioResponse } from "@/Servicios/ClienteApiServicio";
import { FormularioPagoTarjeta } from "./FormularioPagoTarjeta";
import type { PagoTarjetaSimulado } from "@/Tipos/Pagos";

interface VistaConfirmacionReservaProps {
  Habitacion: HabitacionResponse;
  PrevisualizacionPrecio: PrevisualizarPrecioResponse | undefined;
  CargandoPrevisualizacion: boolean;
  ErrorPrevisualizacion: boolean;
  ErrorPrevisualizacionObjeto: unknown;
  Noches: number;
  FechaEntrada: string;
  FechaSalida: string;
  NumeroHuespedes: number;
  Notas: string;
  MetodoPago: string;
  setMetodoPago: (v: string) => void;
  PagoTarjeta: PagoTarjetaSimulado;
  setPagoTarjeta: (v: PagoTarjetaSimulado) => void;
  PuedeConfirmar: boolean;
  ProcesandoReserva: boolean;
  onVolver: () => void;
  onConfirmar: () => void;
}

export function VistaConfirmacionReserva({
  Habitacion,
  PrevisualizacionPrecio,
  CargandoPrevisualizacion,
  ErrorPrevisualizacion,
  ErrorPrevisualizacionObjeto,
  Noches,
  FechaEntrada,
  FechaSalida,
  NumeroHuespedes,
  Notas,
  MetodoPago,
  setMetodoPago,
  PagoTarjeta,
  setPagoTarjeta,
  PuedeConfirmar,
  ProcesandoReserva,
  onVolver,
  onConfirmar,
}: VistaConfirmacionReservaProps) {
  const MensajeErrorPrecio =
    ErrorPrevisualizacion && ErrorPrevisualizacionObjeto
      ? (() => {
          const R = ObtenerTituloYDescripcionError(
            ErrorPrevisualizacionObjeto,
            "No se pudo calcular el precio"
          );
          return R.Descripcion || R.Titulo;
        })()
      : "";

  return (
    <div className="relative">
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={onVolver}
          className="text-sm text-[#5b564d] transition-colors hover:text-[#1c1a16]"
        >
          ← Volver a la búsqueda
        </button>
      </div>

      <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
        Confirmar reserva y pago
      </h1>
      <p className="mt-1 text-sm text-[#5b564d]">
        Revisa el resumen de tu estancia, el total estimado por noche y el método de pago que se
        registrará por el importe completo de la reserva.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <div className="rounded-xl border border-[#e5e0d8] bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#f6f2ec] sm:w-1/2">
              {Habitacion.imagen_url ? (
                <Image
                  src={Habitacion.imagen_url}
                  alt={`Habitación ${Habitacion.numero}`}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#6a645a]/50">
                  <svg
                    width="40"
                    height="40"
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
            <div className="flex-1 space-y-2">
              <h2 className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
                Habitación {Habitacion.numero}
              </h2>
              {Habitacion.tipo_nombre && (
                <p className="text-sm text-[#5b564d]">{Habitacion.tipo_nombre}</p>
              )}
              <p className="text-sm text-[#5b564d]">
                {Noches} noche{Noches !== 1 ? "s" : ""} · Desde{" "}
                {new Date(FechaEntrada).toLocaleDateString("es-ES")} hasta{" "}
                {new Date(FechaSalida).toLocaleDateString("es-ES")}
              </p>
              <p className="text-sm text-[#5b564d]">
                {NumeroHuespedes} huésped{NumeroHuespedes !== 1 ? "es" : ""}
              </p>
              {Notas.trim() && (
                <p className="mt-2 text-sm text-[#5b564d]">
                  <span className="font-medium text-[#1c1a16]">Notas:</span> {Notas.trim()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#e5e0d8] bg-white p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6a645a]">
              Precio total ({PrevisualizacionPrecio?.moneda ?? "—"})
            </h2>
            {CargandoPrevisualizacion && (
              <div className="mt-4 flex items-center gap-3 text-sm text-[#5b564d]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
                <span>Cargando precio…</span>
              </div>
            )}
            {ErrorPrevisualizacion && MensajeErrorPrecio && (
              <div
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                role="alert"
              >
                {MensajeErrorPrecio}
              </div>
            )}
            {PrevisualizacionPrecio && !CargandoPrevisualizacion && !ErrorPrevisualizacion && (
              <div className="mt-4">
                <DesglosePrecios
                  moneda={PrevisualizacionPrecio.moneda}
                  subtotal={PrevisualizacionPrecio.subtotal}
                  impuestos={PrevisualizacionPrecio.impuestos}
                  descuentos={PrevisualizacionPrecio.descuentos}
                  otros_cargos={PrevisualizacionPrecio.otros_cargos}
                  precio_total={PrevisualizacionPrecio.precio_total}
                />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#e5e0d8] bg-white p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6a645a]">
              Método de pago
            </h2>
            <label
              htmlFor="confirmacion-metodo-pago"
              className="mt-3 block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
            >
              Selecciona el método de pago
            </label>
            <select
              id="confirmacion-metodo-pago"
              value={MetodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
            >
              {MetodosPagoApi.map((M) => (
                <option key={M.Valor} value={M.Valor}>
                  {M.Etiqueta}
                </option>
              ))}
            </select>
            {(MetodoPago === "tarjeta_credito" || MetodoPago === "tarjeta_debito") && (
              <FormularioPagoTarjeta PagoTarjeta={PagoTarjeta} setPagoTarjeta={setPagoTarjeta} />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onVolver}
          className="flex-1 rounded-lg border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm font-medium text-[#5b564d] hover:bg-[#f6f2ec]"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={onConfirmar}
          disabled={!PuedeConfirmar || ProcesandoReserva}
          className="flex-1 rounded-lg bg-[#b88f3a] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#a67c32] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
        >
          {ProcesandoReserva ? "Confirmando…" : "Confirmar reserva"}
        </button>
      </div>

      {ProcesandoReserva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
            <h2 className="text-base font-semibold text-[#1c1a16]">
              Estamos procesando tu reserva…
            </h2>
            <p className="mt-1 text-sm text-[#5b564d]">
              Por favor, no cierres esta ventana mientras finalizamos el registro.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
