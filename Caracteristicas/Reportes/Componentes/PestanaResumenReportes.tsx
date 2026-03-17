"use client";

import type {
  DashboardReporteResponse,
  EstadisticasReservasResponse,
  FormatoExportacion,
  KpisHoyReporteResponse,
} from "@/Servicios/PanelApiServicio";
import { BotonExportarReportes } from "@/Componentes/Base/BotonExportarReportes";
import { GraficoBarrasReservas } from "@/Caracteristicas/Reportes/Componentes/GraficosReportes";
import { FormatearMoneda, FormatearPorcentaje, ObtenerEntradasEscalares } from "@/Utilidades/FormatosReportes";

interface PestanaResumenReportesProps {
  Dashboard: DashboardReporteResponse | null;
  Estadisticas: EstadisticasReservasResponse | null;
  KpisHoy: KpisHoyReporteResponse | null;
  AlExportarIngresos: (Formato: FormatoExportacion) => Promise<void>;
}

export function PestanaResumenReportes({
  Dashboard,
  Estadisticas,
  KpisHoy,
  AlExportarIngresos,
}: PestanaResumenReportesProps) {
  const EntradasKpisHoy = ObtenerEntradasEscalares((KpisHoy ?? {}) as Record<string, unknown>);

  return (
    <div className="mt-6 space-y-8 text-[#5b564d]">
      {Dashboard && (
        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
              Resumen de reservas e ingresos
            </h2>
            <BotonExportarReportes AlExportar={AlExportarIngresos} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
              <span className="text-2xl font-semibold text-[#1c1a16]">{Dashboard.estadisticas_reservas.total_reservas}</span>
              <p className="text-sm">Total reservas</p>
            </div>
            <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
              <span className="text-2xl font-semibold text-[#1c1a16]">{Dashboard.estadisticas_reservas.reservas_confirmadas}</span>
              <p className="text-sm">Confirmadas</p>
            </div>
            <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
              <span className="text-2xl font-semibold text-[#1c1a16]">{FormatearPorcentaje(Dashboard.estadisticas_reservas.tasa_cancelacion)}</span>
              <p className="text-sm">Tasa de cancelación</p>
            </div>
            <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
              <span className="text-2xl font-semibold text-[#1c1a16]">{FormatearMoneda(Dashboard.total_ingresos)}</span>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">{Estadisticas.total_reservas}</span>
                <p className="text-sm">Total</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">{FormatearMoneda(Estadisticas.promedio_reserva)}</span>
                <p className="text-sm">Promedio reserva</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">{Estadisticas.reservas_no_show ?? 0}</span>
                <p className="text-sm">No show</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">{FormatearMoneda(Estadisticas.ingresos_totales)}</span>
                <p className="text-sm">Ingresos</p>
              </div>
            </div>
            <GraficoBarrasReservas Datos={Estadisticas} />
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
          KPIs de hoy
        </h2>
        {EntradasKpisHoy.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EntradasKpisHoy.map(([Clave, Valor]) => (
              <div key={Clave} className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xs uppercase tracking-wide text-[#5b564d]">{Clave.replaceAll("_", " ")}</span>
                <p className="mt-2 text-lg font-semibold text-[#1c1a16]">{String(Valor)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-[#e5e0d8] bg-white p-6 text-center text-sm">Sin datos de KPIs hoy.</p>
        )}
      </section>
    </div>
  );
}
