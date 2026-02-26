"use client";

import {
  ListarPagosPanel,
  ProcesarPagoPanel,
  ReembolsarPagoPanel,
  type TransaccionPagoResponse,
} from "@/Servicios/PanelApiServicio";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import { useEffect, useState } from "react";

function BadgeEstado(Estado: string) {
  const clases: Record<string, string> = {
    pendiente: "bg-amber-100 text-amber-800",
    completado: "bg-emerald-100 text-emerald-800",
    rechazado: "bg-red-100 text-red-800",
    reembolsado: "bg-sky-100 text-sky-800",
    en_proceso: "bg-amber-100 text-amber-800",
    disputado: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${clases[Estado] ?? "bg-gray-100 text-gray-800"}`}>
      {Estado}
    </span>
  );
}

const ESTADOS_PAGO = ["pendiente", "completado", "rechazado", "reembolsado", "en_proceso", "disputado"] as const;

export default function PaginaPagosAdmin() {
  const [Pagos, setPagos] = useState<TransaccionPagoResponse[]>([]);
  const [Cargando, setCargando] = useState(true);
  const [TextoBusqueda, setTextoBusqueda] = useState("");
  const [FiltroEstado, setFiltroEstado] = useState<string>("");
  const [FiltroMetodo, setFiltroMetodo] = useState<string>("");

  const PagosFiltrados = Pagos.filter((p) => {
    const Texto = TextoBusqueda.trim().toLowerCase();
    if (Texto) {
      const CoincideId = p.id.toString().includes(Texto);
      const CoincideReserva = p.reserva_id.toString().includes(Texto);
      const CoincideMonto = p.monto.toLowerCase().includes(Texto);
      const CoincideTrans = (p.numero_transaccion ?? "").toLowerCase().includes(Texto);
      if (!CoincideId && !CoincideReserva && !CoincideMonto && !CoincideTrans) return false;
    }
    if (FiltroEstado && p.estado !== FiltroEstado) return false;
    if (FiltroMetodo && p.metodo_pago !== FiltroMetodo) return false;
    return true;
  });

  const MetodosUnicos = Array.from(new Set(Pagos.map((p) => p.metodo_pago))).sort();

  async function Cargar() {
    setCargando(true);
    try {
      const r = await ListarPagosPanel();
      setPagos(r);
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al cargar pagos");
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    Cargar();
  }, []);

  async function Procesar(Id: number) {
    if (!confirm("¿Procesar este pago?")) return;
    try {
      await ProcesarPagoPanel(Id);
      Notificaciones.Exito("Pago procesado correctamente");
      await Cargar();
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al procesar");
      Notificaciones.Error(Titulo, Descripcion);
    }
  }

  async function Reembolsar(Id: number) {
    if (!confirm("¿Estás seguro de reembolsar este pago? La reserva asociada será cancelada.")) return;
    try {
      await ReembolsarPagoPanel(Id);
      Notificaciones.Exito("Reembolso realizado", "La reserva ha sido cancelada.");
      await Cargar();
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al reembolsar");
      Notificaciones.Error(Titulo, Descripcion);
    }
  }

  return (
    <div>
      <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
        Todos los Pagos
      </h1>
      {!Cargando && Pagos.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-[#e5e0d8] bg-[#f6f2ec] p-4">
          <label htmlFor="pagos-busqueda" className="sr-only">
            Buscar por ID, reserva, monto o número de transacción
          </label>
          <input
            id="pagos-busqueda"
            type="search"
            placeholder="Buscar por ID, reserva, monto, transacción…"
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
            {ESTADOS_PAGO.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <select
            aria-label="Filtrar por método de pago"
            value={FiltroMetodo}
            onChange={(e) => setFiltroMetodo(e.target.value)}
            className="rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
          >
            <option value="">Todos los métodos</option>
            {MetodosUnicos.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {(TextoBusqueda || FiltroEstado || FiltroMetodo) && (
            <button
              type="button"
              onClick={() => {
                setTextoBusqueda("");
                setFiltroEstado("");
                setFiltroMetodo("");
              }}
              className="rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#5b564d] hover:bg-[#f6f2ec]"
            >
              Limpiar filtros
            </button>
          )}
          <span className="text-sm text-[#5b564d]">
            {PagosFiltrados.length} de {Pagos.length}
          </span>
        </div>
      )}
      {Cargando ? (
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
        </div>
      ) : Pagos.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-12 text-center text-[#5b564d]">
          No hay pagos registrados.
        </div>
      ) : PagosFiltrados.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-12 text-center text-[#5b564d]">
          No hay resultados con los filtros aplicados.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e5e0d8] bg-[#f6f2ec]">
              <tr>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">ID</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Reserva ID</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Monto</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Tipo</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Método</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Estado</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Nº Trans.</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Fecha Pago</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-[#5b564d]">
              {PagosFiltrados.map((p) => (
                <tr key={p.id} className="border-b border-[#e5e0d8]">
                  <td className="px-4 py-3">{p.id}</td>
                  <td className="px-4 py-3">{p.reserva_id}</td>
                  <td className="px-4 py-3">${parseFloat(p.monto).toFixed(2)}</td>
                  <td className="px-4 py-3">{p.tipo ?? "cargo"}</td>
                  <td className="px-4 py-3">{p.metodo_pago}</td>
                  <td className="px-4 py-3">{BadgeEstado(p.estado)}</td>
                  <td className="px-4 py-3">{p.numero_transaccion ?? "N/A"}</td>
                  <td className="px-4 py-3">
                    {p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {p.estado === "pendiente" && (
                        <button
                          type="button"
                          onClick={() => Procesar(p.id)}
                          className="rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700"
                        >
                          Procesar
                        </button>
                      )}
                      {p.estado === "completado" &&
                        p.tipo !== "reembolso" && (
                          <button
                            type="button"
                            onClick={() => Reembolsar(p.id)}
                            className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                          >
                            Reembolsar
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
