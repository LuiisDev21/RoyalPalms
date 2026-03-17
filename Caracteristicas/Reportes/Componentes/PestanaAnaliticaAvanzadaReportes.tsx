"use client";

import type {
  ComparativaReporteResponse,
  DashboardCompletoReporteResponse,
  ReembolsosDisputasReporteResponse,
  TendenciaItemResponse,
} from "@/Servicios/PanelApiServicio";
import { FormatearMoneda, ObtenerEntradasEscalares } from "@/Utilidades/FormatosReportes";

interface PestanaAnaliticaAvanzadaReportesProps {
  Comparativa: ComparativaReporteResponse;
  Tendencias: TendenciaItemResponse[];
  ReembolsosDisputas: ReembolsosDisputasReporteResponse;
  DashboardCompleto: DashboardCompletoReporteResponse;
  TipoTendencia: "ingresos" | "reservas";
  AgruparTendencia: "dia" | "semana";
  AlCambiarTipoTendencia: (Valor: "ingresos" | "reservas") => void;
  AlCambiarAgruparTendencia: (Valor: "dia" | "semana") => void;
}

export function PestanaAnaliticaAvanzadaReportes({
  Comparativa,
  Tendencias,
  ReembolsosDisputas,
  DashboardCompleto,
  TipoTendencia,
  AgruparTendencia,
  AlCambiarTipoTendencia,
  AlCambiarAgruparTendencia,
}: PestanaAnaliticaAvanzadaReportesProps) {
  const EntradasComparativa = ObtenerEntradasEscalares(Comparativa as Record<string, unknown>);
  const EntradasDashboardCompleto = ObtenerEntradasEscalares(
    DashboardCompleto as Record<string, unknown>
  );

  return (
    <div className="mt-6 space-y-4 text-[#5b564d]">
      <details open className="rounded-xl border border-[#e5e0d8] bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
          Comparativa
        </summary>
        <div className="border-t border-[#e5e0d8] p-4">
          {EntradasComparativa.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {EntradasComparativa.map(([Clave, Valor]) => (
                <div key={Clave} className="rounded-xl border border-[#e5e0d8] bg-[#fdfcfa] p-4">
                  <span className="text-xs uppercase tracking-wide text-[#5b564d]">{Clave.replaceAll("_", " ")}</span>
                  <p className="mt-2 text-lg font-semibold text-[#1c1a16]">{String(Valor)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm">Sin datos de comparativa.</p>
          )}
        </div>
      </details>

      <details open className="rounded-xl border border-[#e5e0d8] bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
          Tendencias
        </summary>
        <div className="space-y-4 border-t border-[#e5e0d8] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm">
              <span className="mr-2">Tipo:</span>
              <select
                value={TipoTendencia}
                onChange={(e) => AlCambiarTipoTendencia(e.target.value as "ingresos" | "reservas")}
                className="rounded border border-[#6a645a]/40 px-2 py-1 text-[#1c1a16]"
              >
                <option value="ingresos">Ingresos</option>
                <option value="reservas">Reservas</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mr-2">Agrupar por:</span>
              <select
                value={AgruparTendencia}
                onChange={(e) => AlCambiarAgruparTendencia(e.target.value as "dia" | "semana")}
                className="rounded border border-[#6a645a]/40 px-2 py-1 text-[#1c1a16]"
              >
                <option value="dia">Día</option>
                <option value="semana">Semana</option>
              </select>
            </label>
          </div>
          {Tendencias.length ? (
            <div className="overflow-x-auto rounded-xl border border-[#e5e0d8]">
              <table className="w-full text-sm">
                <thead className="border-b bg-[#f6f2ec]">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Período</th>
                    <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {Tendencias.map((Item, Indice) => {
                    const Valor = Item.valor ?? Item.ingresos ?? Item.reservas ?? 0;
                    return (
                      <tr key={`${Item.fecha ?? Item.periodo ?? "periodo"}-${Indice}`} className="border-b border-[#e5e0d8]">
                        <td className="px-4 py-2">{Item.periodo ?? Item.fecha ?? "N/A"}</td>
                        <td className="px-4 py-2">
                          {TipoTendencia === "ingresos" ? FormatearMoneda(Valor) : String(Valor)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm">Sin datos de tendencias.</p>
          )}
        </div>
      </details>

      <details className="rounded-xl border border-[#e5e0d8] bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
          Reembolsos y disputas
        </summary>
        <div className="border-t border-[#e5e0d8] p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#e5e0d8] bg-[#fdfcfa] p-4">
              <span className="text-xl font-semibold text-[#1c1a16]">{ReembolsosDisputas.total_reembolsos ?? 0}</span>
              <p className="text-sm">Total reembolsos</p>
            </div>
            <div className="rounded-xl border border-[#e5e0d8] bg-[#fdfcfa] p-4">
              <span className="text-xl font-semibold text-[#1c1a16]">{ReembolsosDisputas.total_disputas ?? 0}</span>
              <p className="text-sm">Total disputas</p>
            </div>
            <div className="rounded-xl border border-[#e5e0d8] bg-[#fdfcfa] p-4">
              <span className="text-xl font-semibold text-[#1c1a16]">{FormatearMoneda(ReembolsosDisputas.monto_reembolsado)}</span>
              <p className="text-sm">Monto reembolsado</p>
            </div>
            <div className="rounded-xl border border-[#e5e0d8] bg-[#fdfcfa] p-4">
              <span className="text-xl font-semibold text-[#1c1a16]">{FormatearMoneda(ReembolsosDisputas.monto_disputado)}</span>
              <p className="text-sm">Monto disputado</p>
            </div>
          </div>
        </div>
      </details>

      <details className="rounded-xl border border-[#e5e0d8] bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
          Dashboard completo
        </summary>
        <div className="border-t border-[#e5e0d8] p-4">
          {EntradasDashboardCompleto.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {EntradasDashboardCompleto.map(([Clave, Valor]) => (
                <div key={Clave} className="rounded-xl border border-[#e5e0d8] bg-[#fdfcfa] p-4">
                  <span className="text-xs uppercase tracking-wide text-[#5b564d]">{Clave.replaceAll("_", " ")}</span>
                  <p className="mt-2 text-lg font-semibold text-[#1c1a16]">{String(Valor)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm">Sin datos de dashboard completo.</p>
          )}
        </div>
      </details>
    </div>
  );
}
