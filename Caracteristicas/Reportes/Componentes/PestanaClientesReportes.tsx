"use client";

import { BotonExportarReportes } from "@/Componentes/Base/BotonExportarReportes";
import type {
  ClienteRankingItem,
  FormatoExportacion,
} from "@/Servicios/PanelApiServicio";
import { FormatearMoneda } from "@/Utilidades/FormatosReportes";

interface PestanaClientesReportesProps {
  Clientes: ClienteRankingItem[];
  OrdenClientes: "gastado" | "reservas";
  AlCambiarOrdenClientes: (Orden: "gastado" | "reservas") => void;
  AlExportar: (Formato: FormatoExportacion) => Promise<void>;
}

export function PestanaClientesReportes({
  Clientes,
  OrdenClientes,
  AlCambiarOrdenClientes,
  AlExportar,
}: PestanaClientesReportesProps) {
  return (
    <div className="mt-6 space-y-8 text-[#5b564d]">
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6a645a]">
            Mejores clientes
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm">
              <span className="mr-2">Ordenar por:</span>
              <select
                value={OrdenClientes}
                onChange={(e) => AlCambiarOrdenClientes(e.target.value as "gastado" | "reservas")}
                className="rounded border border-[#6a645a]/40 px-2 py-1 text-[#1c1a16]"
              >
                <option value="gastado">Total gastado</option>
                <option value="reservas">Número de reservas</option>
              </select>
            </label>
            <BotonExportarReportes AlExportar={AlExportar} />
          </div>
        </div>
        {Clientes.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
            <table className="w-full text-sm">
              <thead className="border-b bg-[#f6f2ec]">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Nombre</th>
                  <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Email</th>
                  <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Reservas</th>
                  <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Última reserva</th>
                  <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Promedio por reserva</th>
                  <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">Total gastado</th>
                </tr>
              </thead>
              <tbody>
                {Clientes.map((Cliente) => (
                  <tr key={Cliente.usuario_id} className="border-b border-[#e5e0d8]">
                    <td className="px-4 py-2">{Cliente.nombre}</td>
                    <td className="px-4 py-2">{Cliente.email}</td>
                    <td className="px-4 py-2">{Cliente.total_reservas}</td>
                    <td className="px-4 py-2">
                      {Cliente.ultima_reserva ? new Date(Cliente.ultima_reserva).toLocaleString() : "N/A"}
                    </td>
                    <td className="px-4 py-2">{FormatearMoneda(Cliente.promedio_por_reserva ?? null)}</td>
                    <td className="px-4 py-2">{FormatearMoneda(Cliente.total_gastado)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-[#e5e0d8] bg-white p-6 text-center text-sm">Sin datos de clientes.</p>
        )}
      </section>
    </div>
  );
}
