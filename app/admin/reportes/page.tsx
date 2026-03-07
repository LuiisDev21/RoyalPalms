"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ObtenerDashboardReportePanel,
  ObtenerEstadisticasReservasPanel,
  ObtenerIngresosReportePanel,
  ObtenerClientesRankingPanel,
} from "@/Servicios/PanelApiServicio";
import { CampoFecha } from "@/Componentes/Base/CampoFecha";
import {
  GraficoBarrasReservas,
  GraficoPastelMetodosPago,
} from "@/Caracteristicas/Reportes/Componentes/GraficosReportes";
import { ClavesQueryPanel } from "@/Utilidades/QueryKeysPanel";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";

function FechaInicioPorDefecto(): string {
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return start.toISOString().slice(0, 10);
}

function FechaFinPorDefecto(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function PaginaReportesAdmin() {
  const [FechaInicio, setFechaInicio] = useState(FechaInicioPorDefecto);
  const [FechaFin, setFechaFin] = useState(FechaFinPorDefecto);
  const [OrdenClientes, setOrdenClientes] = useState<"gastado" | "reservas">("gastado");

  const {
    data,
    isLoading: Cargando,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ClavesQueryPanel.Reportes(FechaInicio, FechaFin, OrdenClientes),
    queryFn: async () => {
      const fi = FechaInicio || null;
      const ff = FechaFin || null;
      const [d, s, i, c] = await Promise.all([
        ObtenerDashboardReportePanel(fi, ff),
        ObtenerEstadisticasReservasPanel(fi, ff),
        ObtenerIngresosReportePanel(fi, ff),
        ObtenerClientesRankingPanel(fi, ff, OrdenClientes, 50),
      ]);
      return { Dashboard: d, Estadisticas: s, Ingresos: i, Clientes: c };
    },
    enabled: !!FechaInicio && !!FechaFin,
  });

  const Dashboard = data?.Dashboard ?? null;
  const Estadisticas = data?.Estadisticas ?? null;
  const Ingresos = data?.Ingresos ?? null;
  const Clientes = data?.Clientes ?? [];

  useEffect(() => {
    if (!isError || !error) return;
    const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(error, "Error al cargar reporte");
    Notificaciones.Error(Titulo, Descripcion);
  }, [isError, error]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
            Reportes
          </h1>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-end gap-4">
        <CampoFecha
          Id="reportes-desde"
          Etiqueta="Desde"
          Valor={FechaInicio}
          AlCambiar={setFechaInicio}
          ClaseContenedor="min-w-[150px] w-[180px] flex-shrink-0"
        />
        <CampoFecha
          Id="reportes-hasta"
          Etiqueta="Hasta"
          Min={FechaInicio || undefined}
          Valor={FechaFin}
          AlCambiar={setFechaFin}
          ClaseContenedor="min-w-[150px] w-[180px] flex-shrink-0"
        />
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg bg-[#1c1a16] px-4 py-2 text-sm text-white hover:bg-[#2d2a26]"
        >
          Aplicar
        </button>
      </div>
      <div>
        {Cargando ? (
          <div className="mt-8 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
          </div>
        ) : (
          <div className="mt-6 space-y-8 text-[#5b564d]">
            {Dashboard && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
                  Resumen de reservas e ingresos
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-2xl font-semibold text-[#1c1a16]">
                  {Dashboard.estadisticas_reservas.total_reservas}
                </span>
                <p className="text-sm">Total reservas</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-2xl font-semibold text-[#1c1a16]">
                  {Dashboard.estadisticas_reservas.reservas_pendientes}
                </span>
                <p className="text-sm">Pendientes</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-2xl font-semibold text-[#1c1a16]">
                  {Dashboard.estadisticas_reservas.reservas_confirmadas}
                </span>
                <p className="text-sm">Confirmadas</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-2xl font-semibold text-[#1c1a16]">
                  {Dashboard.estadisticas_reservas.reservas_canceladas}
                </span>
                <p className="text-sm">Canceladas</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-2xl font-semibold text-[#1c1a16]">
                  {Dashboard.estadisticas_reservas.reservas_completadas}
                </span>
                <p className="text-sm">Completadas</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-2xl font-semibold text-[#1c1a16]">
                  ${Number(Dashboard.total_ingresos).toFixed(2)}
                </span>
                <p className="text-sm">Ingresos</p>
              </div>
                </div>
              </section>
            )}

            {Estadisticas && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
                  Detalle de reservas por estado
                </h2>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">{Estadisticas.total_reservas}</span>
                <p className="text-sm">Total</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">${Number(Estadisticas.ingresos_totales).toFixed(2)}</span>
                <p className="text-sm">Ingresos</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">${Number(Estadisticas.promedio_reserva).toFixed(2)}</span>
                <p className="text-sm">Promedio reserva</p>
              </div>
              <GraficoBarrasReservas Datos={Estadisticas} />
                </div>
              </section>
            )}

            {Ingresos && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
                  Ingresos y métodos de pago
                </h2>
                <div className="space-y-4">
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">${Number(Ingresos.total_ingresos).toFixed(2)}</span>
                <p className="text-sm">Total ingresos</p>
              </div>
                  {Ingresos.por_metodo_pago?.length ? (
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                  <div className="overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-[#f6f2ec]">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Método</th>
                        <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Cantidad</th>
                        <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Ingresos.por_metodo_pago.map((m) => (
                        <tr key={m.metodo_pago} className="border-b border-[#e5e0d8]">
                          <td className="px-4 py-2">{m.metodo_pago}</td>
                          <td className="px-4 py-2">{m.cantidad}</td>
                          <td className="px-4 py-2">${Number(m.monto).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    </div>
                    <GraficoPastelMetodosPago Datos={Ingresos} />
                  </div>
                ) : null}
                </div>
              </section>
            )}

            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
                  Mejores clientes
                </h2>
                <label className="text-sm">
                  <span className="mr-2">Ordenar por:</span>
                  <select
                    value={OrdenClientes}
                    onChange={(e) => setOrdenClientes(e.target.value as "gastado" | "reservas")}
                    className="rounded border border-[#6a645a]/40 px-2 py-1 text-[#1c1a16]"
                  >
                    <option value="gastado">Total gastado</option>
                    <option value="reservas">Número de reservas</option>
                  </select>
                </label>
              </div>
              {Clientes.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-[#f6f2ec]">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Nombre</th>
                        <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Email</th>
                        <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Reservas</th>
                        <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Total gastado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Clientes.map((c) => (
                        <tr key={c.usuario_id} className="border-b border-[#e5e0d8]">
                          <td className="px-4 py-2">{c.nombre}</td>
                          <td className="px-4 py-2">{c.email}</td>
                          <td className="px-4 py-2">{c.total_reservas}</td>
                          <td className="px-4 py-2">${Number(c.total_gastado).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="rounded-xl border border-[#e5e0d8] bg-white p-6 text-center text-sm">
                  Sin datos.
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
