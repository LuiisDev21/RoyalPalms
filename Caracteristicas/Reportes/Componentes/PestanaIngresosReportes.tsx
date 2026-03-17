"use client";

import { BotonExportarReportes } from "@/Componentes/Base/BotonExportarReportes";
import { GraficoPastelMetodosPago } from "@/Caracteristicas/Reportes/Componentes/GraficosReportes";
import type {
  FormatoExportacion,
  IngresosPorTipoItem,
  IngresosReporteResponse,
} from "@/Servicios/PanelApiServicio";
import { FormatearMoneda } from "@/Utilidades/FormatosReportes";

interface PestanaIngresosReportesProps {
  Ingresos: IngresosReporteResponse | null;
  IngresosPorTipo: IngresosPorTipoItem[];
  AlExportarIngresos: (Formato: FormatoExportacion) => Promise<void>;
  AlExportarIngresosPorTipo: (Formato: FormatoExportacion) => Promise<void>;
}

export function PestanaIngresosReportes({
  Ingresos,
  IngresosPorTipo,
  AlExportarIngresos,
  AlExportarIngresosPorTipo,
}: PestanaIngresosReportesProps) {
  return (
    <div className="mt-6 space-y-8 text-[#5b564d]">
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
            Ingresos y métodos de pago
          </h2>
          <BotonExportarReportes AlExportar={AlExportarIngresos} />
        </div>
        {Ingresos ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#e5e0d8] bg-white p-4">
              <span className="text-xl font-semibold text-[#1c1a16]">{FormatearMoneda(Ingresos.total_ingresos)}</span>
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
                      {Ingresos.por_metodo_pago.map((Metodo) => (
                        <tr key={Metodo.metodo_pago} className="border-b border-[#e5e0d8]">
                          <td className="px-4 py-2">{Metodo.metodo_pago}</td>
                          <td className="px-4 py-2">{Metodo.cantidad}</td>
                          <td className="px-4 py-2">{FormatearMoneda(Metodo.monto)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <GraficoPastelMetodosPago Datos={Ingresos} />
              </div>
            ) : null}
          </div>
        ) : (
          <p className="rounded-xl border border-[#e5e0d8] bg-white p-6 text-center text-sm">Sin datos de ingresos.</p>
        )}
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
            Ingresos por tipo
          </h2>
          <BotonExportarReportes AlExportar={AlExportarIngresosPorTipo} />
        </div>
        {IngresosPorTipo.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
            <table className="w-full text-sm">
              <thead className="border-b bg-[#f6f2ec]">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Tipo</th>
                  <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Reservas</th>
                  <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {IngresosPorTipo.map((Item, Indice) => (
                  <tr key={`${Item.tipo_habitacion ?? Item.tipo ?? Item.nombre ?? "tipo"}-${Indice}`} className="border-b border-[#e5e0d8]">
                    <td className="px-4 py-2">{Item.tipo_habitacion ?? Item.tipo ?? Item.nombre ?? "N/A"}</td>
                    <td className="px-4 py-2">{Item.cantidad_reservas ?? Item.total_reservas ?? Item.reservas ?? "N/A"}</td>
                    <td className="px-4 py-2">{FormatearMoneda(Item.total_ingresos ?? Item.ingresos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-[#e5e0d8] bg-white p-6 text-center text-sm">Sin datos de ingresos por tipo.</p>
        )}
      </section>
    </div>
  );
}
