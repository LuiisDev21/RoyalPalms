"use client";

import { BotonExportarReportes } from "@/Componentes/Base/BotonExportarReportes";
import { GraficoBarrasOcupacion } from "@/Caracteristicas/Reportes/Componentes/GraficosReportes";
import type { FormatoExportacion, OcupacionReporteResponse } from "@/Servicios/PanelApiServicio";
import { FormatearMoneda, FormatearPorcentaje } from "@/Utilidades/FormatosReportes";

interface PestanaOcupacionReportesProps {
  Ocupacion: OcupacionReporteResponse | null;
  AgruparOcupacion: "habitacion" | "tipo";
  AlCambiarAgrupacion: (Valor: "habitacion" | "tipo") => void;
  AlExportar: (Formato: FormatoExportacion) => Promise<void>;
}

export function PestanaOcupacionReportes({
  Ocupacion,
  AgruparOcupacion,
  AlCambiarAgrupacion,
  AlExportar,
}: PestanaOcupacionReportesProps) {
  return (
    <div className="mt-6 space-y-8 text-[#5b564d]">
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
            Ocupación
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm">
              <span className="mr-2">Agrupar por:</span>
              <select
                value={AgruparOcupacion}
                onChange={(e) => AlCambiarAgrupacion(e.target.value as "habitacion" | "tipo")}
                className="rounded border border-[#6a645a]/40 px-2 py-1 text-[#1c1a16]"
              >
                <option value="habitacion">Habitación</option>
                <option value="tipo">Tipo</option>
              </select>
            </label>
            <BotonExportarReportes AlExportar={AlExportar} />
          </div>
        </div>
        {Ocupacion?.items?.length ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">{Ocupacion.total_noches_ocupadas ?? 0}</span>
                <p className="text-sm">Total noches ocupadas</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">{Ocupacion.total_noches_disponibles ?? 0}</span>
                <p className="text-sm">Total noches disponibles</p>
              </div>
              <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
                <span className="text-xl font-semibold text-[#1c1a16]">{FormatearPorcentaje(Ocupacion.porcentaje_ocupacion_global)}</span>
                <p className="text-sm">Ocupación global</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
              <table className="w-full text-sm">
                <thead className="border-b bg-[#f6f2ec]">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Elemento</th>
                    <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Noches ocupadas</th>
                    <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Noches disponibles</th>
                    <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">% ocupación</th>
                    <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {Ocupacion.items.map((Item) => (
                    <tr key={Item.identificador} className="border-b border-[#e5e0d8]">
                      <td className="px-4 py-2">{Item.nombre}</td>
                      <td className="px-4 py-2">{Item.noches_ocupadas}</td>
                      <td className="px-4 py-2">{Item.noches_disponibles ?? "N/A"}</td>
                      <td className="px-4 py-2">{FormatearPorcentaje(Item.porcentaje_ocupacion ?? null)}</td>
                      <td className="px-4 py-2">{FormatearMoneda(Item.ingresos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <GraficoBarrasOcupacion Datos={Ocupacion} />
          </div>
        ) : (
          <p className="rounded-xl border border-[#e5e0d8] bg-white p-6 text-center text-sm">Sin datos de ocupación.</p>
        )}
      </section>
    </div>
  );
}
