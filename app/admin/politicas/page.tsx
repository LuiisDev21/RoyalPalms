"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ListarPoliticasCancelacionPanel } from "@/Servicios/PanelApiServicio";
import { ClavesQueryPanel } from "@/Utilidades/QueryKeysPanel";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";

export default function PaginaPoliticasAdmin() {
  const { data: Politicas = [], isLoading: Cargando, isError, error } = useQuery({
    queryKey: ClavesQueryPanel.PoliticasCancelacion,
    queryFn: () => ListarPoliticasCancelacionPanel(false),
  });

  useEffect(() => {
    if (!isError || !error) return;
    const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(error, "Error al cargar políticas");
    Notificaciones.Error(Titulo, Descripcion);
  }, [isError, error]);

  return (
    <div>
      <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
        Políticas de cancelación
      </h1>
      {Cargando ? (
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
        </div>
      ) : Politicas.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-12 text-center text-[#5b564d]">
          No hay políticas de cancelación.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e5e0d8] bg-[#f6f2ec]">
              <tr>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">ID</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Nombre</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Descripción</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Horas anticipación</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">% Penalización</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Activa</th>
              </tr>
            </thead>
            <tbody className="text-[#5b564d]">
              {Politicas.map((p) => (
                <tr key={p.id} className="border-b border-[#e5e0d8]">
                  <td className="px-4 py-3">{p.id}</td>
                  <td className="px-4 py-3">{p.nombre}</td>
                  <td className="px-4 py-3">{p.descripcion ?? "—"}</td>
                  <td className="px-4 py-3">{p.horas_anticipacion}</td>
                  <td className="px-4 py-3">
                    {parseFloat(p.porcentaje_penalizacion ?? "0").toFixed(2)}%
                  </td>
                  <td className="px-4 py-3">{p.activa ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
