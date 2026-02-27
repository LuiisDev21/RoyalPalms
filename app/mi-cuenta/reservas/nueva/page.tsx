"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BuscarHabitacionesDisponiblesCliente,
  CrearReservaCliente,
  CrearPagoCliente,
  ListarTiposHabitacionCliente,
  type ReservaClienteResponse,
} from "@/Servicios/ClienteApiServicio";
import { DesglosePrecios, TieneDesgloseCompleto } from "@/Componentes/Base/DesglosePrecios";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import { FormatearMontoConMoneda } from "@/Utilidades/FormatearMoneda";
import type { TipoHabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import {
  FormularioBusquedaHabitaciones,
  type DatosBusquedaHabitaciones,
} from "@/Caracteristicas/Habitaciones/Componentes/FormularioBusquedaHabitaciones";
import { ClavesQueryMiCuenta } from "@/Utilidades/QueryKeysMiCuenta";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import { useRouter } from "next/navigation";
import { MetodosPagoApi } from "@/Utilidades/MetodosPago";
import type { PagoTarjetaSimulado } from "@/Tipos/Pagos";

function CalcularNoches(Entrada: string, Salida: string): number {
  const A = new Date(Entrada).getTime();
  const B = new Date(Salida).getTime();
  if (A >= B) return 0;
  return Math.floor((B - A) / (24 * 60 * 60 * 1000));
}

function ObtenerMarcaTarjeta(NumeroCrudo: string): "visa" | "mastercard" | "amex" | "discover" | null {
  const Numero = NumeroCrudo.replace(/[\s-]/g, "");
  if (!Numero) return null;
  const Inicial = Numero[0];
  if (Inicial === "4") return "visa";
  if (Inicial === "5") return "mastercard";
  if (Inicial === "3") return "amex";
  if (Inicial === "6") return "discover";
  return null;
}

export default function PaginaNuevaReserva() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [Tipos, setTipos] = useState<TipoHabitacionResponse[]>([]);
  const [FechaEntrada, setFechaEntrada] = useState("");
  const [FechaSalida, setFechaSalida] = useState("");
  const [NumeroHuespedes, setNumeroHuespedes] = useState(1);
  const [Notas, setNotas] = useState("");
  const [Buscando, setBuscando] = useState(false);
  const [Habitaciones, setHabitaciones] = useState<HabitacionResponse[]>([]);
  const [ReservandoId, setReservandoId] = useState<number | null>(null);
  const [ReservaCreada, setReservaCreada] = useState<ReservaClienteResponse | null>(null);
  const [HabitacionSeleccionada, setHabitacionSeleccionada] = useState<HabitacionResponse | null>(null);
  const [MetodoPago, setMetodoPago] = useState("tarjeta_credito");
  const [Paso, setPaso] = useState<"busqueda" | "confirmacion">("busqueda");
  const [PagoTarjeta, setPagoTarjeta] = useState<PagoTarjetaSimulado>({
    Numero: "",
    Expiracion: "",
    Cvv: "",
  });

  const MutacionReservar = useMutation({
    mutationFn: (payload: {
      habitacion_id: number;
      fecha_entrada: string;
      fecha_salida: string;
      numero_huespedes: number;
      notas: string | null;
    }) => CrearReservaCliente(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClavesQueryMiCuenta.ListaReservas });
    },
    onError: (e) => {
      setReservandoId(null);
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
        e,
        "Error al crear la reserva"
      );
      Notificaciones.Error(Titulo, Descripcion);
    },
  });

  useEffect(() => {
    ListarTiposHabitacionCliente()
      .then(setTipos)
      .catch(() => {});
  }, []);

  const MutacionPagoInicial = useMutation({
    mutationFn: (payload: { reserva_id: number; monto: string; metodo_pago: string }) =>
      CrearPagoCliente(payload),
  });

  async function AlBuscarConDatos(datos: DatosBusquedaHabitaciones) {
    if (!datos.FechaEntrada || !datos.FechaSalida) {
      Notificaciones.Error("Fechas requeridas", "Indica fecha de entrada y salida.");
      return;
    }
    if (new Date(datos.FechaEntrada) >= new Date(datos.FechaSalida)) {
      Notificaciones.Error("Fechas inválidas", "La salida debe ser posterior a la entrada.");
      return;
    }
    setFechaEntrada(datos.FechaEntrada);
    setFechaSalida(datos.FechaSalida);
    setNumeroHuespedes(parseInt(datos.Huespedes, 10) || 1);
    setBuscando(true);
    setHabitaciones([]);
    try {
      const CapacidadNum = parseInt(datos.Huespedes, 10);
      const Capacidad = Number.isNaN(CapacidadNum) || CapacidadNum <= 0 ? undefined : CapacidadNum;
      const TipoNum = datos.TipoId ? parseInt(datos.TipoId, 10) : undefined;
      const Lista = await BuscarHabitacionesDisponiblesCliente(
        datos.FechaEntrada,
        datos.FechaSalida,
        Capacidad,
        TipoNum && !Number.isNaN(TipoNum) ? TipoNum : undefined
      );
      setHabitaciones(Lista);
      if (Lista.length === 0) {
        Notificaciones.Advertencia(
          "Sin disponibilidad",
          "No hay habitaciones disponibles para esas fechas. Prueba otras."
        );
      }
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
        e,
        "Error al buscar habitaciones"
      );
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      setBuscando(false);
    }
  }

  function IrAConfirmacion(H: HabitacionResponse) {
    if (!FechaEntrada || !FechaSalida) {
      Notificaciones.Error("Fechas requeridas", "Indica fecha de entrada y salida.");
      return;
    }
    setHabitacionSeleccionada(H);
    setMetodoPago("tarjeta_credito");
    setPaso("confirmacion");
  }

  async function ConfirmarReservaSeleccionada() {
    if (!HabitacionSeleccionada || !FechaEntrada || !FechaSalida) return;
    const EsTarjeta = MetodoPago === "tarjeta_credito" || MetodoPago === "tarjeta_debito";
    if (EsTarjeta) {
      const NumeroLimpio = PagoTarjeta.Numero.replace(/[\s-]/g, "");
      const Exp = PagoTarjeta.Expiracion.trim();
      const Cvv = PagoTarjeta.Cvv.trim();
      const RegexExp = /^(\d{2})\/(\d{2})$/;
      const RegexCvv = /^\d{3,4}$/;
      const Marca = ObtenerMarcaTarjeta(NumeroLimpio);
      if (!NumeroLimpio || !Marca || NumeroLimpio.length < 13 || !RegexExp.test(Exp) || !RegexCvv.test(Cvv)) {
        Notificaciones.Error(
          "Datos de tarjeta inválidos",
          "Revisa el número de tarjeta, la fecha de expiración (MM/AA) y el CVV.",
        );
        return;
      }
    }
    try {
      setReservandoId(HabitacionSeleccionada.id);
      const Reserva = await MutacionReservar.mutateAsync({
        habitacion_id: HabitacionSeleccionada.id,
        fecha_entrada: FechaEntrada,
        fecha_salida: FechaSalida,
        numero_huespedes: NumeroHuespedes,
        notas: Notas.trim() || null,
      });

      let PagoExitoso = false;
      try {
        const Moneda = Reserva.moneda ?? "USD";
        const PrecioTotalNum =
          typeof Reserva.precio_total === "number"
            ? Reserva.precio_total
            : parseFloat(String(Reserva.precio_total));
        const MontoTexto = PrecioTotalNum.toFixed(2);
        await MutacionPagoInicial.mutateAsync({
          reserva_id: Reserva.id,
          monto: MontoTexto,
          metodo_pago: MetodoPago,
        });
        PagoExitoso = true;
        Notificaciones.Exito(
          "Reserva y pago registrados",
          `Se registró un pago por el total de la reserva en ${Moneda}.`,
        );
      } catch (e) {
        const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
          e,
          "La reserva se creó pero hubo un problema al registrar el pago",
        );
        Notificaciones.Advertencia(Titulo, Descripcion);
      }

      setReservaCreada(Reserva);
      setPaso("busqueda");

      if (!PagoExitoso) {
        Notificaciones.Info(
          "Reserva creada sin pago",
          "Podrás completar el pago más adelante desde el detalle de la reserva.",
        );
      }
    } finally {
      setReservandoId(null);
    }
  }

  const Noches = FechaEntrada && FechaSalida ? CalcularNoches(FechaEntrada, FechaSalida) : 0;

  if (ReservaCreada) {
    const Moneda = ReservaCreada.moneda ?? "USD";
    const PrecioTotalNum =
      typeof ReservaCreada.precio_total === "number"
        ? ReservaCreada.precio_total
        : parseFloat(String(ReservaCreada.precio_total));
    const PrecioTexto = FormatearMontoConMoneda(PrecioTotalNum, Moneda);
    return (
      <div>
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/mi-cuenta/reservas"
            className="text-sm text-[#5b564d] transition-colors hover:text-[#1c1a16]"
          >
            ← Mis reservas
          </Link>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
          <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
            Reserva confirmada
          </h1>
          <p className="mt-2 text-sm text-[#5b564d]">
            Tu reserva #{ReservaCreada.id}
            {ReservaCreada.codigo_reserva ? ` (${ReservaCreada.codigo_reserva})` : ""} se ha creado correctamente. Total: {PrecioTexto}
          </p>
          {TieneDesgloseCompleto(ReservaCreada) && (
            <div className="mt-6 rounded-lg border border-[#e5e0d8] bg-white p-4">
              <DesglosePrecios
                moneda={ReservaCreada.moneda!}
                subtotal={ReservaCreada.subtotal!}
                impuestos={ReservaCreada.impuestos!}
                descuentos={ReservaCreada.descuentos!}
                otros_cargos={ReservaCreada.otros_cargos!}
                precio_total={PrecioTotalNum}
              />
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push(`/mi-cuenta/reservas/${ReservaCreada.id}`)}
              className="rounded-lg bg-[#1c1a16] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d2a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
            >
              Ver detalle y pagos
            </button>
            <button
              type="button"
              onClick={() => router.push("/mi-cuenta/reservas")}
              className="rounded-lg border border-[#6a645a] bg-white px-4 py-2.5 text-sm font-medium text-[#5b564d] transition-colors hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
            >
              Mis reservas
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (Paso === "confirmacion" && HabitacionSeleccionada) {
    const PrecioNoche = parseFloat(HabitacionSeleccionada.precio_por_noche);
    const TotalEstimado = Number.isNaN(PrecioNoche) ? 0 : PrecioNoche * Noches;
    const ProcesandoReserva =
      ReservandoId !== null || MutacionReservar.isPending || MutacionPagoInicial.isPending;

    return (
      <div className="relative">
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setPaso("busqueda");
              setHabitacionSeleccionada(null);
            }}
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
                {HabitacionSeleccionada.imagen_url ? (
                  <Image
                    src={HabitacionSeleccionada.imagen_url}
                    alt={`Habitación ${HabitacionSeleccionada.numero}`}
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
                  Habitación {HabitacionSeleccionada.numero}
                </h2>
                {HabitacionSeleccionada.tipo_nombre && (
                  <p className="text-sm text-[#5b564d]">{HabitacionSeleccionada.tipo_nombre}</p>
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
                Resumen de importe estimado
              </h2>
              <p className="mt-2 text-sm text-[#5b564d]">
                Precio por noche:{" "}
                <span className="font-medium text-[#1c1a16]">
                  ${Number.isNaN(PrecioNoche) ? "0" : PrecioNoche.toFixed(2)}
                </span>
              </p>
              <p className="mt-1 text-sm text-[#5b564d]">
                Noches: <span className="font-medium text-[#1c1a16]">{Noches}</span>
              </p>
              <p className="mt-1 text-sm text-[#5b564d]">
                Total estimado por estancia:{" "}
                <span className="font-semibold text-[#1c1a16]">
                  ${TotalEstimado.toFixed(2)}
                </span>
              </p>
              <p className="mt-2 text-xs text-[#6a645a]">
                El total definitivo, con impuestos y otros cargos aplicables, lo calculará el
                sistema al confirmar la reserva.
              </p>
            </div>

            <div className="rounded-xl border border-[#e5e0d8] bg-white p-4 sm:p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6a645a]">
                Método de pago
              </h2>
              <p className="mt-1 text-xs text-[#6a645a]">
                Se registrará un pago por el importe pendiente completo de la reserva. No se
                permiten pagos parciales.
              </p>
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
                <div className="mt-4 space-y-3">
                  <div>
                    <label
                      htmlFor="pago-tarjeta-numero"
                      className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
                    >
                      Número de tarjeta
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        id="pago-tarjeta-numero"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="•••• •••• •••• ••••"
                        value={PagoTarjeta.Numero}
                        onChange={(e) => {
                          const SoloDigitos = e.target.value.replace(/\D/g, "");
                          const MarcaLocal = ObtenerMarcaTarjeta(SoloDigitos);
                          let Max = 16;
                          if (MarcaLocal === "visa" || MarcaLocal === "mastercard") Max = 16;
                          else if (MarcaLocal === "amex" || MarcaLocal === "discover") Max = 15;
                          const Recortado = SoloDigitos.slice(0, Max);
                          setPagoTarjeta({ ...PagoTarjeta, Numero: Recortado });
                        }}
                        className="w-full rounded-lg border border-[#6a645a]/40 px-3 py-2 pr-10 text-sm text-[#1c1a16] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                      />
                      {(() => {
                        const Marca = ObtenerMarcaTarjeta(PagoTarjeta.Numero);
                        let Icono = "";
                        if (Marca === "visa") Icono = "fa-cc-visa";
                        else if (Marca === "mastercard") Icono = "fa-cc-mastercard";
                        else if (Marca === "amex") Icono = "fa-cc-amex";
                        else if (Marca === "discover") Icono = "fa-cc-discover";
                        if (!Icono) return null;
                        return (
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#6a645a]">
                            <i className={`fa-brands ${Icono} text-lg`} aria-hidden="true" />
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="pago-tarjeta-expiracion"
                        className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
                      >
                        Fecha de expiración
                      </label>
                      <input
                        id="pago-tarjeta-expiracion"
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/AA"
                        value={PagoTarjeta.Expiracion}
                        onChange={(e) =>
                          setPagoTarjeta({ ...PagoTarjeta, Expiracion: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 px-3 py-2 text-sm text-[#1c1a16] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="pago-tarjeta-cvv"
                        className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
                      >
                        CVV
                      </label>
                      <input
                        id="pago-tarjeta-cvv"
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={PagoTarjeta.Cvv}
                        onChange={(e) =>
                          setPagoTarjeta({ ...PagoTarjeta, Cvv: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 px-3 py-2 text-sm text-[#1c1a16] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#6a645a]">
                    Esta sección es un pago simulado; los datos no se envían a un procesador real.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setPaso("busqueda");
                  setHabitacionSeleccionada(null);
                }}
                className="flex-1 rounded-lg border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm font-medium text-[#5b564d] hover:bg-[#f6f2ec]"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={ConfirmarReservaSeleccionada}
                disabled={ReservandoId !== null || MutacionReservar.isPending || MutacionPagoInicial.isPending}
                className="flex-1 rounded-lg bg-[#b88f3a] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#a67c32] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
              >
                {ReservandoId !== null || MutacionReservar.isPending || MutacionPagoInicial.isPending
                  ? "Confirmando…"
                  : "Confirmar reserva"}
              </button>
            </div>
          </div>
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

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/mi-cuenta/reservas"
          className="text-sm text-[#5b564d] transition-colors hover:text-[#1c1a16]"
        >
          ← Mis reservas
        </Link>
      </div>
      <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
        Nueva reserva
      </h1>
      <p className="mt-1 text-sm text-[#5b564d]">
        Indica fechas y huéspedes para ver habitaciones disponibles.
      </p>

      <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-6">
        <FormularioBusquedaHabitaciones
          Tipos={Tipos}
          AlBuscarConDatos={AlBuscarConDatos}
          Deshabilitado={Buscando}
        />
        <div className="mt-4">
          <label
            htmlFor="nueva-notas"
            className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
          >
            Notas (opcional)
          </label>
          <textarea
            id="nueva-notas"
            rows={2}
            value={Notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Peticiones especiales..."
            className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 px-3 py-2 text-sm text-[#1c1a16] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
          />
        </div>
      </div>

      {Habitaciones.length > 0 && (
        <div className="mt-10">
          <h2 className="FuenteTitulo text-xl font-semibold text-[#1c1a16]">
            Habitaciones disponibles
          </h2>
          <p className="mt-1 text-sm text-[#5b564d]">
            {Noches} noche{Noches !== 1 ? "s" : ""} · Elige una para avanzar al resumen y
            confirmar el pago y la reserva.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Habitaciones.map((H) => {
              const PrecioNoche = parseFloat(H.precio_por_noche);
              const Total =
                Number.isNaN(PrecioNoche) ? 0 : PrecioNoche * Noches;
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
                      onClick={() => IrAConfirmacion(H)}
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
        </div>
      )}
    </div>
  );
}
