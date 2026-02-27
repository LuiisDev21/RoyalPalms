"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ObtenerAuditoriaReportePanel } from "@/Servicios/PanelApiServicio";
import { CampoFecha } from "@/Componentes/Base/CampoFecha";
import { ClavesQueryPanel } from "@/Utilidades/QueryKeysPanel";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";

export default function PaginaAuditoriaAdmin() {
  const [FechaInicio, setFechaInicio] = useState("");
  const [FechaFin, setFechaFin] = useState("");

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    if (!FechaInicio) setFechaInicio(start.toISOString().slice(0, 10));
    if (!FechaFin) setFechaFin(end.toISOString().slice(0, 10));
  }, []);

  const { data: Auditoria = [], isLoading: Cargando, isError, error, refetch } = useQuery({
    queryKey: ClavesQueryPanel.Auditoria(FechaInicio || null, FechaFin || null),
    queryFn: () =>
      ObtenerAuditoriaReportePanel({
        fechaDesde: FechaInicio || null,
        fechaHasta: FechaFin || null,
        Saltar: 0,
        Limite: 100,
      }),
    enabled: !!FechaInicio && !!FechaFin,
  });

  useEffect(() => {
    if (!isError || !error) return;
    const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(error, "Error al cargar auditoría");
    Notificaciones.Error(Titulo, Descripcion);
  }, [isError, error]);

  return (
    <div>
      <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
        Auditoría
      </h1>
      <p className="mt-1 text-sm text-[#5b564d]">
        Registros de acciones realizadas en el sistema.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <CampoFecha
          Id="auditoria-desde"
          Etiqueta="Desde"
          Min={undefined}
          Valor={FechaInicio}
          AlCambiar={setFechaInicio}
          ClaseContenedor="min-w-[150px] w-[180px] flex-shrink-0"
        />
        <CampoFecha
          Id="auditoria-hasta"
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

      {Cargando ? (
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
        </div>
      ) : Auditoria.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-12 text-center text-sm text-[#5b564d]">
          Sin registros de auditoría en el período seleccionado.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-[#f6f2ec]">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">
                  Fecha
                </th>
                <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">
                  Usuario
                </th>
                <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">
                  Tabla
                </th>
                <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">
                  Acción
                </th>
                <th className="px-4 py-2 text-left font-medium text-[#1c1a16]">
                  Registro ID
                </th>
              </tr>
            </thead>
            <tbody className="text-[#1c1a16]">
              {Auditoria.map((a) => (
                <tr key={a.id} className="border-b border-[#e5e0d8]">
                  <td className="px-4 py-2">
                    {new Date(a.fecha_accion).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {a.usuario_nombre ?? a.usuario_id ?? "N/A"}
                  </td>
                  <td className="px-4 py-2">{a.tabla_afectada}</td>
                  <td className="px-4 py-2">{a.accion}</td>
                  <td className="px-4 py-2">{a.registro_id ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

