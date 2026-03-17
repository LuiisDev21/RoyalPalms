"use client";

import { useState } from "react";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import type { FormatoExportacion } from "@/Servicios/PanelApiServicio";

interface BotonExportarReportesProps {
  AlExportar: (Formato: FormatoExportacion) => Promise<void>;
}

export function BotonExportarReportes({ AlExportar }: BotonExportarReportesProps) {
  const [Exportando, setExportando] = useState<FormatoExportacion | null>(null);

  async function Exportar(Formato: FormatoExportacion) {
    if (Exportando) return;
    setExportando(Formato);
    try {
      await AlExportar(Formato);
      Notificaciones.Exito("Exportación completada", `Se descargó el archivo ${Formato.toUpperCase()}.`);
    } catch (ErrorExportacion) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
        ErrorExportacion,
        "No se pudo exportar el reporte"
      );
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      setExportando(null);
    }
  }

  const Opciones: FormatoExportacion[] = ["csv", "xlsx", "pdf"];

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-[#5b564d]">Exportar</span>
      <div className="inline-flex items-center gap-2">
        {Opciones.map((Formato) => (
          <button
            key={Formato}
            type="button"
            onClick={() => Exportar(Formato)}
            disabled={Boolean(Exportando)}
            className="rounded-md border border-[#6a645a]/40 bg-white px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-[#1c1a16] transition-colors hover:bg-[#f6f2ec] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {Exportando === Formato ? "Descargando..." : Formato.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
