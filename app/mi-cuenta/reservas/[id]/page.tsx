"use client";

import React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DesglosePrecios, TieneDesgloseCompleto } from "@/Componentes/Base/DesglosePrecios";
import { ModalConfirmacion } from "@/Componentes/Base/ModalConfirmacion";
import {
  ObtenerReservaCliente,
  ListarPagosDeReserva,
  CancelarReservaCliente,
  CrearPagoCliente,
} from "@/Servicios/ClienteApiServicio";
import { ClavesQueryMiCuenta } from "@/Utilidades/QueryKeysMiCuenta";
import { FormatearMontoConMoneda, ObtenerPrecioTotalNumerico } from "@/Utilidades/FormatearMoneda";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import { EtiquetaMetodoPagoApi, MetodosPagoApi } from "@/Utilidades/MetodosPago";

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

function BadgeEstadoPago(Estado: string) {
  const Clases: Record<string, string> = {
    pendiente: "bg-amber-100 text-amber-800",
    completado: "bg-emerald-100 text-emerald-800",
    rechazado: "bg-red-100 text-red-800",
    reembolsado: "bg-sky-100 text-sky-800",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${Clases[Estado] ?? "bg-gray-100 text-gray-800"}`}
    >
      {Estado}
    </span>
  );
}

export default function PaginaDetalleReserva() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const Id = typeof params.id === "string" ? parseInt(params.id, 10) : NaN;
  const QuiereCancelar = searchParams.get("cancelar") === "1";

  const [MostrarModalPago, setMostrarModalPago] = useState(false);
  const [MostrarConfirmacionCancelar, setMostrarConfirmacionCancelar] = useState(false);
  const [MontoPago, setMontoPago] = useState("");
  const [MetodoPago, setMetodoPago] = useState("tarjeta_credito");

  const {
    data: DatosReserva,
    isLoading: Cargando,
    isError: ErrorCarga,
    error: ErrorCargaObjeto,
  } = useQuery({
    queryKey: ClavesQueryMiCuenta.DetalleReserva(Id),
    queryFn: async () => {
      const [reserva, pagos] = await Promise.all([
        ObtenerReservaCliente(Id),
        ListarPagosDeReserva(Id),
      ]);
      return { reserva, pagos };
    },
    enabled: !Number.isNaN(Id),
  });

  const Reserva = DatosReserva?.reserva ?? null;
  const Pagos = DatosReserva?.pagos ?? [];

  useEffect(() => {
    if (!ErrorCarga || !ErrorCargaObjeto) return;
    const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
      ErrorCargaObjeto,
      "Error al cargar la reserva"
    );
    Notificaciones.Error(Titulo, Descripcion);
    router.push("/mi-cuenta/reservas");
  }, [ErrorCarga, ErrorCargaObjeto, router]);

  const MutacionCancelar = useMutation({
    mutationFn: () => CancelarReservaCliente(Id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClavesQueryMiCuenta.ListaReservas });
      queryClient.removeQueries({ queryKey: ClavesQueryMiCuenta.DetalleReserva(Id) });
      Notificaciones.Exito("Reserva cancelada");
      router.push("/mi-cuenta/reservas");
    },
    onError: (e) => {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
        e,
        "Error al cancelar"
      );
      Notificaciones.Error(Titulo, Descripcion);
    },
  });

  const MutacionPago = useMutation({
    mutationFn: (payload: { monto: string; metodo_pago: string }) =>
      CrearPagoCliente({
        reserva_id: Id,
        monto: payload.monto,
        metodo_pago: payload.metodo_pago,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClavesQueryMiCuenta.DetalleReserva(Id) });
      queryClient.invalidateQueries({ queryKey: ClavesQueryMiCuenta.ListaReservas });
      Notificaciones.Exito("Pago registrado", "El pago quedará pendiente de procesar.");
      setMostrarModalPago(false);
      setMontoPago("");
    },
    onError: (e) => {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
        e,
        "Error al registrar el pago"
      );
      Notificaciones.Error(Titulo, Descripcion);
    },
  });

  function SolicitarCancelarReserva() {
    if (!Reserva || Number.isNaN(Id)) return;
    setMostrarConfirmacionCancelar(true);
  }

  function ConfirmarCancelarReserva() {
    MutacionCancelar.mutate();
    setMostrarConfirmacionCancelar(false);
  }

  const CancelarDesdeQueryEjecutado = React.useRef(false);
  useEffect(() => {
    if (
      !QuiereCancelar ||
      !Reserva ||
      Cargando ||
      CancelarDesdeQueryEjecutado.current
    )
      return;
    CancelarDesdeQueryEjecutado.current = true;
    setMostrarConfirmacionCancelar(true);
  }, [QuiereCancelar, Reserva, Cargando]);

  function EnviarPago() {
    if (!Reserva || Number.isNaN(Id)) return;
    const Monto = parseFloat(MontoPago.replace(",", "."));
    const PendienteRedondeado = Math.round(PendientePago * 100) / 100;
    const MontoRedondeado = Math.round(Monto * 100) / 100;
    if (Number.isNaN(Monto) || Monto <= 0) {
      Notificaciones.Error("Monto inválido", "Indica un monto mayor que 0.");
      return;
    }
    if (Math.abs(MontoRedondeado - PendienteRedondeado) > 0.01) {
      Notificaciones.Error(
        "Debe abonar el pendiente completo",
        `El monto debe coincidir con el pendiente ($${PendientePago.toFixed(2)}).`
      );
      return;
    }
    MutacionPago.mutate({
      monto: PendientePago.toFixed(2),
      metodo_pago: MetodoPago,
    });
  }

  const Cancelando = MutacionCancelar.isPending;
  const EnviandoPago = MutacionPago.isPending;

  if (Cargando || !Reserva) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
      </div>
    );
  }

  const Entrada = new Date(Reserva.fecha_entrada).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const Salida = new Date(Reserva.fecha_salida).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const MonedaReserva = Reserva.moneda ?? "USD";
  const PrecioTotal = ObtenerPrecioTotalNumerico(Reserva.precio_total);
  const PrecioTexto = FormatearMontoConMoneda(PrecioTotal, MonedaReserva);
  const TotalPagado = Pagos.reduce((s, P) => s + parseFloat(P.monto), 0);
  const PendientePago = Math.max(0, PrecioTotal - TotalPagado);
  const EstaPagadoCompleto = PendientePago < 0.01;
  const TienePagoTotalCompletado = Pagos.some(
    (P) => P.tipo === "cargo" && P.estado === "completado"
  );
  const PuedeCancelar =
    Reserva.estado !== "cancelada" && Reserva.estado !== "completada";
  const PuedePagar =
    Reserva.estado !== "cancelada" &&
    !TienePagoTotalCompletado &&
    PendientePago > 0.01;

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

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
            Reserva #{Reserva.id}
            {Reserva.codigo_reserva ? ` · ${Reserva.codigo_reserva}` : ""}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            {BadgeEstado(Reserva.estado)}
            {Reserva.numero_habitacion && (
              <span className="text-sm text-[#5b564d]">
                Habitación {Reserva.numero_habitacion}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PuedePagar && (
            <button
              type="button"
              onClick={() => {
                setMontoPago(PendientePago.toFixed(2));
                setMostrarModalPago(true);
              }}
              className="rounded-lg bg-[#b88f3a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#a67c32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
            >
              Realizar pago
            </button>
          )}
          {PuedeCancelar && (
            <button
              type="button"
              onClick={SolicitarCancelarReserva}
              disabled={Cancelando}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              {Cancelando ? "Cancelando…" : "Cancelar reserva"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-[#e5e0d8] bg-white p-6">
          <h2 className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
            Detalles de la estancia
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-[#6a645a]">Entrada</dt>
              <dd className="font-medium text-[#1c1a16] capitalize">{Entrada}</dd>
            </div>
            <div>
              <dt className="text-[#6a645a]">Salida</dt>
              <dd className="font-medium text-[#1c1a16] capitalize">{Salida}</dd>
            </div>
            <div>
              <dt className="text-[#6a645a]">Huéspedes</dt>
              <dd className="font-medium text-[#1c1a16]">{Reserva.numero_huespedes}</dd>
            </div>
            <div>
              <dt className="text-[#6a645a]">Total reserva</dt>
              <dd className="font-medium text-[#1c1a16]">{PrecioTexto}</dd>
            </div>
            {TieneDesgloseCompleto(Reserva) && (
              <div className="pt-3 border-t border-[#e5e0d8]">
                <DesglosePrecios
                  moneda={Reserva.moneda!}
                  subtotal={Reserva.subtotal!}
                  impuestos={Reserva.impuestos!}
                  descuentos={Reserva.descuentos!}
                  otros_cargos={Reserva.otros_cargos!}
                  precio_total={
                    typeof Reserva.precio_total === "number"
                      ? Reserva.precio_total
                      : parseFloat(String(Reserva.precio_total))
                  }
                />
              </div>
            )}
            {TotalPagado > 0 && (
              <>
                <div>
                  <dt className="text-[#6a645a]">Pagado</dt>
                  <dd className="font-medium text-[#1c1a16]">
                    {FormatearMontoConMoneda(TotalPagado, MonedaReserva)}
                  </dd>
                </div>
                {!EstaPagadoCompleto && (
                  <div>
                    <dt className="text-[#6a645a]">Pendiente</dt>
                    <dd className="font-medium text-[#1c1a16]">
                      {FormatearMontoConMoneda(PendientePago, MonedaReserva)}
                    </dd>
                  </div>
                )}
              </>
            )}
            {Reserva.notas && (
              <div>
                <dt className="text-[#6a645a]">Notas</dt>
                <dd className="text-[#1c1a16]">{Reserva.notas}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-xl border border-[#e5e0d8] bg-white p-6">
          <h2 className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
            Pagos
          </h2>
          {EstaPagadoCompleto && (
            <p className="mt-4 text-sm font-medium text-emerald-700">
              Esta reserva está pagada en su totalidad.
            </p>
          )}
          {Pagos.length > 0 && !EstaPagadoCompleto && (
            <p className="mt-4 text-sm text-[#5b564d]">
              Solo puede registrarse un pago por reserva. Si tu pago está pendiente, se procesará próximamente.
            </p>
          )}
          {Pagos.length === 0 ? (
            !EstaPagadoCompleto && (
              <p className="mt-4 text-sm text-[#5b564d]">
                No hay pagos registrados para esta reserva.
              </p>
            )
          ) : (
            <ul className="mt-4 space-y-3">
              {Pagos.map((P) => {
                const MontoNum = parseFloat(P.monto);
                const EsReembolso = P.tipo === "reembolso";
                return (
                  <li
                    key={P.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e0d8] pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <span className="font-medium text-[#1c1a16]">
                        {FormatearMontoConMoneda(MontoNum, MonedaReserva)}
                        {EsReembolso && (
                          <span className="ml-1.5 text-xs font-normal text-[#6a645a]">(Reembolso)</span>
                        )}
                      </span>
                      <span className="ml-2 text-sm text-[#5b564d]">
                        {EtiquetaMetodoPagoApi(P.metodo_pago)} · {BadgeEstadoPago(P.estado)}
                      </span>
                    </div>
                    <span className="text-xs text-[#6a645a]">
                      {P.fecha_pago
                        ? new Date(P.fecha_pago).toLocaleDateString("es-ES")
                        : new Date(P.fecha_creacion).toLocaleDateString("es-ES")}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          {PuedePagar && (
            <button
              type="button"
              onClick={() => {
                setMontoPago(PendientePago.toFixed(2));
                setMostrarModalPago(true);
              }}
              className="mt-4 rounded-lg border border-[#b88f3a] bg-white px-4 py-2 text-sm font-medium text-[#b88f3a] transition-colors hover:bg-[#b88f3a]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
            >
              Añadir pago
            </button>
          )}
        </section>
      </div>

      {MostrarModalPago && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-pago-titulo"
        >
          <div className="w-full max-w-md rounded-xl border border-[#e5e0d8] bg-white p-6 shadow-xl">
            <h2 id="modal-pago-titulo" className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
              Realizar pago
            </h2>
            <p className="mt-1 text-sm text-[#5b564d]">
              Total reserva: {PrecioTexto}
              {TotalPagado !== 0 && (
                <> · Pendiente: {FormatearMontoConMoneda(PendientePago, MonedaReserva)}</>
              )}
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="pago-monto" className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]">
                  Monto a abonar
                </label>
                <input
                  id="pago-monto"
                  type="text"
                  inputMode="decimal"
                  value={MontoPago}
                  onChange={(e) => setMontoPago(e.target.value)}
                  readOnly
                  className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 bg-[#f6f2ec]/60 px-3 py-2 text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                  aria-describedby="pago-monto-desc"
                />
                <p id="pago-monto-desc" className="mt-1 text-xs text-[#6a645a]">
                  Pendiente completo de la reserva.
                </p>
              </div>
              <div>
                <label
                  htmlFor="pago-metodo"
                  className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
                >
                  Método de pago
                </label>
                <select
                  id="pago-metodo"
                  value={MetodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 px-3 py-2 text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                >
                  {MetodosPagoApi.map((M) => (
                    <option key={M.Valor} value={M.Valor}>
                      {M.Etiqueta}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setMostrarModalPago(false);
                  setMontoPago("");
                }}
                className="flex-1 rounded-lg border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm font-medium text-[#5b564d] hover:bg-[#f6f2ec]"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={EnviarPago}
                disabled={EnviandoPago}
                className="flex-1 rounded-lg bg-[#b88f3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#a67c32] disabled:opacity-60"
              >
                {EnviandoPago ? "Enviando…" : "Pagar pendiente"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ModalConfirmacion
        Abierto={MostrarConfirmacionCancelar}
        Titulo="Cancelar reserva"
        Mensaje="¿Estás seguro de cancelar esta reserva?"
        TextoConfirmar="Cancelar reserva"
        Variante="peligro"
        AlConfirmar={ConfirmarCancelarReserva}
        AlCancelar={() => setMostrarConfirmacionCancelar(false)}
      />
    </div>
  );
}
