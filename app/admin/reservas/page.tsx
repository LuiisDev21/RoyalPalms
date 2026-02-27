"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ModalConfirmacion } from "@/Componentes/Base/ModalConfirmacion";
import {
  FormatearMontoConMoneda,
  ObtenerPrecioTotalNumerico,
} from "@/Utilidades/FormatearMoneda";
import {
  ListarTodasReservasPanel,
  ObtenerReservaPanel,
  ActualizarReservaPanel,
  CancelarReservaPanel,
  type ReservaResponse,
} from "@/Servicios/PanelApiServicio";
import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { ClavesQueryPanel } from "@/Utilidades/QueryKeysPanel";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import {
  PuedeCancelarReserva,
  PuedeActualizarEstadoReserva,
} from "@/Utilidades/PermisosPanel";

const ESTADOS_RESERVA = ["pendiente", "confirmada", "cancelada", "completada", "no_show"] as const;

function BadgeEstadoReserva(Estado: string) {
  const clases: Record<string, string> = {
    pendiente: "bg-amber-100 text-amber-800",
    confirmada: "bg-emerald-100 text-emerald-800",
    cancelada: "bg-red-100 text-red-800",
    completada: "bg-sky-100 text-sky-800",
    no_show: "bg-amber-100 text-amber-800",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${clases[Estado] ?? "bg-gray-100 text-gray-800"}`}
    >
      {Estado}
    </span>
  );
}

export default function PaginaReservasAdmin() {
  const { Roles } = UseAuth();
  const queryClient = useQueryClient();
  const PuedeCancelar = PuedeCancelarReserva(Roles);
  const PuedeActualizarEstado = PuedeActualizarEstadoReserva(Roles);
  const [ModalReserva, setModalReserva] = useState<ReservaResponse | null>(null);
  const [TextoBusqueda, setTextoBusqueda] = useState("");
  const [FiltroEstado, setFiltroEstado] = useState<string>("");
  const [ConfirmacionReserva, setConfirmacionReserva] = useState<
    { accion: "checkout"; id: number } | { accion: "no_show"; id: number } | { accion: "cancelar"; id: number } | null
  >(null);

  const { data: Reservas = [], isLoading: Cargando, isError, error } = useQuery({
    queryKey: ClavesQueryPanel.Reservas,
    queryFn: () => ListarTodasReservasPanel(),
  });

  const MutacionActualizar = useMutation({
    mutationFn: ({ Id, estado }: { Id: number; estado: string }) =>
      ActualizarReservaPanel(Id, { estado }),
    onSuccess: (_, { estado }) => {
      queryClient.invalidateQueries({ queryKey: ClavesQueryPanel.Reservas });
      setModalReserva(null);
      Notificaciones.Exito(estado === "completada" ? "Reserva marcada como completada" : "Reserva marcada como no-show");
    },
    onError: (e) => {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al actualizar");
      Notificaciones.Error(Titulo, Descripcion);
    },
  });

  const MutacionCancelar = useMutation({
    mutationFn: CancelarReservaPanel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClavesQueryPanel.Reservas });
      setModalReserva(null);
      Notificaciones.Exito("Reserva cancelada correctamente");
    },
    onError: (e) => {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al cancelar");
      Notificaciones.Error(Titulo, Descripcion);
    },
  });

  useEffect(() => {
    if (!isError || !error) return;
    const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(error, "Error al cargar reservas");
    Notificaciones.Error(Titulo, Descripcion);
  }, [isError, error]);

  const ReservasFiltradas = Reservas.filter((r) => {
    const Texto = TextoBusqueda.trim().toLowerCase();
    if (Texto) {
      const CoincideId = r.id.toString().includes(Texto);
      const CoincideCodigo = (r.codigo_reserva ?? "").toLowerCase().includes(Texto);
      const CoincideUsuario = (r.nombre_usuario ?? "").toLowerCase().includes(Texto) || r.usuario_id.toString().includes(Texto);
      const CoincideHabitacion = (r.numero_habitacion ?? "").toLowerCase().includes(Texto) || r.habitacion_id.toString().includes(Texto);
      const CoincideFechas = r.fecha_entrada.includes(Texto) || r.fecha_salida.includes(Texto);
      if (!CoincideId && !CoincideCodigo && !CoincideUsuario && !CoincideHabitacion && !CoincideFechas) return false;
    }
    if (FiltroEstado && r.estado !== FiltroEstado) return false;
    return true;
  });

  async function VerDetalle(Id: number) {
    try {
      const r = await ObtenerReservaPanel(Id);
      setModalReserva(r);
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al cargar reserva");
      Notificaciones.Error(Titulo, Descripcion);
    }
  }

  function SolicitarCheckout(Id: number) {
    setConfirmacionReserva({ accion: "checkout", id: Id });
  }

  function SolicitarNoShow(Id: number) {
    setConfirmacionReserva({ accion: "no_show", id: Id });
  }

  function SolicitarCancelar(Id: number) {
    setConfirmacionReserva({ accion: "cancelar", id: Id });
  }

  function ConfirmarAccionReserva() {
    if (!ConfirmacionReserva) return;
    if (ConfirmacionReserva.accion === "cancelar") {
      MutacionCancelar.mutate(ConfirmacionReserva.id);
    } else {
      MutacionActualizar.mutate({
        Id: ConfirmacionReserva.id,
        estado: ConfirmacionReserva.accion === "checkout" ? "completada" : "no_show",
      });
    }
    setConfirmacionReserva(null);
  }

  const ConfigConfirmacion =
    ConfirmacionReserva?.accion === "checkout"
      ? { Titulo: "Marcar como completada", Mensaje: "¿Marcar esta reserva como completada (check-out)?", TextoConfirmar: "Marcar completada", Variante: "primario" as const }
      : ConfirmacionReserva?.accion === "no_show"
        ? { Titulo: "Marcar como no-show", Mensaje: "¿Marcar esta reserva como no-show?", TextoConfirmar: "Marcar no-show", Variante: "primario" as const }
        : ConfirmacionReserva?.accion === "cancelar"
          ? { Titulo: "Cancelar reserva", Mensaje: "¿Estás seguro de cancelar esta reserva?", TextoConfirmar: "Cancelar reserva", Variante: "peligro" as const }
          : null;

  const Hoy = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
        Todas las Reservas
      </h1>
      {!Cargando && Reservas.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-[#e5e0d8] bg-[#f6f2ec] p-4">
          <label htmlFor="reservas-busqueda" className="sr-only">
            Buscar por código, usuario, habitación o fechas
          </label>
          <input
            id="reservas-busqueda"
            type="search"
            placeholder="Buscar por código, usuario, habitación, fechas…"
            value={TextoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
            className="min-w-[200px] flex-1 rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
          />
          <select
            aria-label="Filtrar por estado"
            value={FiltroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
          >
            <option value="">Todos los estados</option>
            {ESTADOS_RESERVA.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          {(TextoBusqueda || FiltroEstado) && (
            <button
              type="button"
              onClick={() => {
                setTextoBusqueda("");
                setFiltroEstado("");
              }}
              className="rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#5b564d] hover:bg-[#f6f2ec]"
            >
              Limpiar filtros
            </button>
          )}
          <span className="text-sm text-[#5b564d]">
            {ReservasFiltradas.length} de {Reservas.length}
          </span>
        </div>
      )}
      {Cargando ? (
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
        </div>
      ) : Reservas.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-12 text-center text-[#5b564d]">
          No hay reservas registradas.
        </div>
      ) : ReservasFiltradas.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-12 text-center text-[#5b564d]">
          No hay resultados con los filtros aplicados.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e5e0d8] bg-[#f6f2ec]">
              <tr>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">ID</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Código</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Usuario</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Habitación</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Fechas</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Huéspedes</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Precio Total</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Estado</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-[#5b564d]">
              {ReservasFiltradas.map((r) => {
                const PuedeNoShow =
                  r.estado === "confirmada" && r.fecha_entrada < Hoy;
                return (
                  <tr key={r.id} className="border-b border-[#e5e0d8]">
                    <td className="px-4 py-3">{r.id}</td>
                    <td className="px-4 py-3 font-medium">
                      {r.codigo_reserva ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.nombre_usuario ?? r.usuario_id}
                    </td>
                    <td className="px-4 py-3">
                      {r.numero_habitacion ?? r.habitacion_id}
                    </td>
                    <td className="px-4 py-3">
                      {r.fecha_entrada} — {r.fecha_salida}
                    </td>
                    <td className="px-4 py-3">{r.numero_huespedes}</td>
                    <td className="px-4 py-3">
                      {FormatearMontoConMoneda(
                        ObtenerPrecioTotalNumerico(r.precio_total),
                        r.moneda ?? "USD"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {BadgeEstadoReserva(r.estado)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => VerDetalle(r.id)}
                          className="rounded bg-[#1c1a16] px-2 py-1 text-xs text-white hover:bg-[#2d2a26]"
                        >
                          Ver
                        </button>
                        {PuedeActualizarEstado && r.estado === "confirmada" && (
                          <button
                            type="button"
                            onClick={() => SolicitarCheckout(r.id)}
                            className="rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700"
                          >
                            Check-out
                          </button>
                        )}
                        {PuedeActualizarEstado && PuedeNoShow && (
                          <button
                            type="button"
                            onClick={() => SolicitarNoShow(r.id)}
                            className="rounded bg-amber-600 px-2 py-1 text-xs text-white hover:bg-amber-700"
                          >
                            No-show
                          </button>
                        )}
                        {PuedeCancelar && r.estado !== "cancelada" && (
                          <button
                            type="button"
                            onClick={() => SolicitarCancelar(r.id)}
                            className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {ModalReserva && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
              Detalle de Reserva
            </h2>
            <div className="mt-4 space-y-2 text-sm text-[#5b564d]">
              <p>
                <strong>Código:</strong> {ModalReserva.codigo_reserva ?? "—"} (ID:{" "}
                {ModalReserva.id})
              </p>
              <p>
                <strong>Usuario:</strong>{" "}
                {ModalReserva.nombre_usuario ?? ModalReserva.usuario_id}
              </p>
              <p>
                <strong>Habitación:</strong>{" "}
                {ModalReserva.numero_habitacion ?? ModalReserva.habitacion_id}
              </p>
              <p>
                <strong>Fechas:</strong> {ModalReserva.fecha_entrada} —{" "}
                {ModalReserva.fecha_salida}
              </p>
              <p>
                <strong>Huéspedes:</strong> {ModalReserva.numero_huespedes}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                {BadgeEstadoReserva(ModalReserva.estado)}
              </p>
              <p>
                <strong>Precio total:</strong>{" "}
                {FormatearMontoConMoneda(
                  ObtenerPrecioTotalNumerico(ModalReserva.precio_total),
                  ModalReserva.moneda ?? "USD"
                )}
              </p>
              {ModalReserva.notas ? (
                <p>
                  <strong>Notas:</strong> {ModalReserva.notas}
                </p>
              ) : null}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setModalReserva(null)}
                className="rounded-lg border border-[#6a645a] bg-white px-4 py-2 text-sm text-[#5b564d] hover:bg-[#f6f2ec]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {ConfigConfirmacion && (
        <ModalConfirmacion
          Abierto={!!ConfirmacionReserva}
          Titulo={ConfigConfirmacion.Titulo}
          Mensaje={ConfigConfirmacion.Mensaje}
          TextoConfirmar={ConfigConfirmacion.TextoConfirmar}
          Variante={ConfigConfirmacion.Variante}
          AlConfirmar={ConfirmarAccionReserva}
          AlCancelar={() => setConfirmacionReserva(null)}
        />
      )}
    </div>
  );
}
