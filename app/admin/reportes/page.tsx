"use client";

import {
  ObtenerDashboardReportePanel,
  ObtenerEstadisticasReservasPanel,
  ObtenerIngresosReportePanel,
  ObtenerOcupacionReportePanel,
  ObtenerAuditoriaReportePanel,
  ObtenerClientesRankingPanel,
} from "@/Servicios/PanelApiServicio";
import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import { PuedeVerReportesAuditoria } from "@/Utilidades/PermisosPanel";
import { useEffect, useState } from "react";

export default function PaginaReportesAdmin() {
  const { Roles } = UseAuth();
  const PuedeAuditoria = PuedeVerReportesAuditoria(Roles);

  const [FechaInicio, setFechaInicio] = useState("");
  const [FechaFin, setFechaFin] = useState("");
  const [SubReporte, setSubReporte] = useState<
    "dashboard" | "estadisticas" | "ingresos" | "ocupacion" | "auditoria" | "clientes"
  >("dashboard");
  const [AgruparOcupacion, setAgruparOcupacion] = useState<"habitacion" | "tipo">("habitacion");
  const [OrdenClientes, setOrdenClientes] = useState<"gastado" | "reservas">("gastado");
  const [Cargando, setCargando] = useState(false);
  const [Dashboard, setDashboard] = useState<Awaited<ReturnType<typeof ObtenerDashboardReportePanel>> | null>(null);
  const [Estadisticas, setEstadisticas] = useState<Awaited<ReturnType<typeof ObtenerEstadisticasReservasPanel>> | null>(null);
  const [Ingresos, setIngresos] = useState<Awaited<ReturnType<typeof ObtenerIngresosReportePanel>> | null>(null);
  const [Ocupacion, setOcupacion] = useState<Awaited<ReturnType<typeof ObtenerOcupacionReportePanel>> | null>(null);
  const [Auditoria, setAuditoria] = useState<Awaited<ReturnType<typeof ObtenerAuditoriaReportePanel>>>([]);
  const [Clientes, setClientes] = useState<Awaited<ReturnType<typeof ObtenerClientesRankingPanel>>>([]);

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    if (!FechaInicio) setFechaInicio(start.toISOString().slice(0, 10));
    if (!FechaFin) setFechaFin(end.toISOString().slice(0, 10));
  }, []);

  async function Cargar() {
    setCargando(true);
    try {
      const fi = FechaInicio || null;
      const ff = FechaFin || null;
      switch (SubReporte) {
        case "dashboard": {
          const d = await ObtenerDashboardReportePanel(fi, ff);
          setDashboard(d);
          break;
        }
        case "estadisticas": {
          const s = await ObtenerEstadisticasReservasPanel(fi, ff);
          setEstadisticas(s);
          break;
        }
        case "ingresos": {
          const i = await ObtenerIngresosReportePanel(fi, ff);
          setIngresos(i);
          break;
        }
        case "ocupacion":
          if (fi && ff) {
            const o = await ObtenerOcupacionReportePanel(fi, ff, AgruparOcupacion);
            setOcupacion(o);
          }
          break;
        case "auditoria": {
          const a = await ObtenerAuditoriaReportePanel({
            fechaDesde: fi,
            fechaHasta: ff,
            Saltar: 0,
            Limite: 100,
          });
          setAuditoria(a);
          break;
        }
        case "clientes": {
          const c = await ObtenerClientesRankingPanel(fi, ff, OrdenClientes, 50);
          setClientes(c);
          break;
        }
      }
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al cargar reporte");
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if (SubReporte === "ocupacion" && (!FechaInicio || !FechaFin)) return;
    Cargar();
  }, [SubReporte, FechaInicio, FechaFin, AgruparOcupacion, OrdenClientes]);

  const Tabs = [
    { id: "dashboard" as const, label: "Dashboard" },
    { id: "estadisticas" as const, label: "Estadísticas reservas" },
    { id: "ingresos" as const, label: "Ingresos" },
    { id: "ocupacion" as const, label: "Ocupación" },
    ...(PuedeAuditoria ? [{ id: "auditoria" as const, label: "Auditoría" }] : []),
    { id: "clientes" as const, label: "Clientes" },
  ];

  return (
    <div>
      <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
        Reportes
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-[#5b564d]">
          Desde:
          <input
            type="date"
            value={FechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="rounded border border-[#6a645a]/40 px-2 py-1 text-[#1c1a16]"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-[#5b564d]">
          Hasta:
          <input
            type="date"
            value={FechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="rounded border border-[#6a645a]/40 px-2 py-1 text-[#1c1a16]"
          />
        </label>
        <button
          type="button"
          onClick={() => Cargar()}
          className="rounded-lg bg-[#1c1a16] px-4 py-2 text-sm text-white hover:bg-[#2d2a26]"
        >
          Aplicar
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {Tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubReporte(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              SubReporte === t.id
                ? "bg-[#b88f3a] text-white"
                : "bg-[#e5e0d8] text-[#5b564d] hover:bg-[#d4cfc4]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {Cargando ? (
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
        </div>
      ) : (
        <div className="mt-6 text-[#5b564d]">
          {SubReporte === "dashboard" && Dashboard && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                  ${Number(Dashboard.total_ingresos).toFixed(2)}
                </span>
                <p className="text-sm">Ingresos</p>
              </div>
            </div>
          )}

          {SubReporte === "estadisticas" && Estadisticas && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            </div>
          )}

          {SubReporte === "ingresos" && Ingresos && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">${Number(Ingresos.total_ingresos).toFixed(2)}</span>
                <p className="text-sm">Total ingresos</p>
              </div>
              {Ingresos.por_metodo_pago?.length ? (
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
              ) : null}
            </div>
          )}

          {SubReporte === "ocupacion" && (
            <>
              <div className="mb-4">
                <label className="mr-2 text-sm">Agrupar por:</label>
                <select
                  value={AgruparOcupacion}
                  onChange={(e) => setAgruparOcupacion(e.target.value as "habitacion" | "tipo")}
                  className="rounded border border-[#6a645a]/40 px-2 py-1 text-[#1c1a16]"
                >
                  <option value="habitacion">Habitación</option>
                  <option value="tipo">Tipo de habitación</option>
                </select>
              </div>
              {Ocupacion?.items?.length ? (
                <div className="overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-[#f6f2ec]">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Nombre</th>
                        <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Noches ocupadas</th>
                        <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Ingresos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Ocupacion.items.map((i) => (
                        <tr key={i.identificador} className="border-b border-[#e5e0d8]">
                          <td className="px-4 py-2">{i.nombre}</td>
                          <td className="px-4 py-2">{i.noches_ocupadas}</td>
                          <td className="px-4 py-2">${Number(i.ingresos).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="rounded-xl border border-[#e5e0d8] bg-white p-6 text-center text-sm">
                  Sin datos en el período. Selecciona fechas y aplica.
                </p>
              )}
            </>
          )}

          {SubReporte === "auditoria" && (
            Auditoria.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
                <table className="w-full text-sm">
                  <thead className="border-b bg-[#f6f2ec]">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Fecha</th>
                      <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Usuario</th>
                      <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Tabla</th>
                      <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Acción</th>
                      <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Registro ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Auditoria.map((a) => (
                      <tr key={a.id} className="border-b border-[#e5e0d8]">
                        <td className="px-4 py-2">{new Date(a.fecha_accion).toLocaleString()}</td>
                        <td className="px-4 py-2">{a.usuario_nombre ?? a.usuario_id ?? "N/A"}</td>
                        <td className="px-4 py-2">{a.tabla_afectada}</td>
                        <td className="px-4 py-2">{a.accion}</td>
                        <td className="px-4 py-2">{a.registro_id ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-xl border border-[#e5e0d8] bg-white p-6 text-center text-sm">
                Sin registros de auditoría.
              </p>
            )
          )}

          {SubReporte === "clientes" && (
            <>
              <div className="mb-4">
                <label className="mr-2 text-sm">Ordenar por:</label>
                <select
                  value={OrdenClientes}
                  onChange={(e) => setOrdenClientes(e.target.value as "gastado" | "reservas")}
                  className="rounded border border-[#6a645a]/40 px-2 py-1 text-[#1c1a16]"
                >
                  <option value="gastado">Total gastado</option>
                  <option value="reservas">Número de reservas</option>
                </select>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
