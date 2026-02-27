"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ModalConfirmacion } from "@/Componentes/Base/ModalConfirmacion";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import { ClavesQueryPanel } from "@/Utilidades/QueryKeysPanel";
import {
  ListarConfiguracionPanel,
  ActualizarConfiguracionPanel,
} from "@/Servicios/PanelApiServicio";

export default function PaginaConfiguracionAdmin() {
  const queryClient = useQueryClient();
  const [EditarItem, setEditarItem] = useState<{ clave: string; valorActual: string } | null>(null);
  const { data: Items = [], isLoading: Cargando, isError, error } = useQuery({
    queryKey: ClavesQueryPanel.Configuracion,
    queryFn: () => ListarConfiguracionPanel(),
  });

  const MutacionActualizar = useMutation({
    mutationFn: ({ Clave, Valor }: { Clave: string; Valor: string }) =>
      ActualizarConfiguracionPanel(Clave, Valor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClavesQueryPanel.Configuracion });
      Notificaciones.Exito("Configuración actualizada correctamente");
    },
    onError: (e: unknown) => {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al actualizar");
      Notificaciones.Error(Titulo, Descripcion);
    },
  });

  useEffect(() => {
    if (!isError || !error) return;
    const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(error, "Error al cargar configuración");
    Notificaciones.Error(Titulo, Descripcion);
  }, [isError, error]);

  function SolicitarEditar(Clave: string, ValorActual: string) {
    setEditarItem({ clave: Clave, valorActual: ValorActual });
  }

  function ConfirmarEditar(NuevoValor?: string) {
    if (!EditarItem) return;
    MutacionActualizar.mutate({ Clave: EditarItem.clave, Valor: NuevoValor ?? EditarItem.valorActual });
    setEditarItem(null);
  }

  return (
    <div>
      <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
        Configuración del hotel
      </h1>
      {Cargando ? (
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
        </div>
      ) : Items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-12 text-center text-[#5b564d]">
          No hay configuración.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e5e0d8] bg-[#f6f2ec]">
              <tr>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Clave</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Valor</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Descripción</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-[#5b564d]">
              {Items.map((c) => (
                <tr key={c.clave} className="border-b border-[#e5e0d8]">
                  <td className="px-4 py-3">{c.clave}</td>
                  <td className="px-4 py-3">{c.valor}</td>
                  <td className="px-4 py-3">{c.descripcion ?? "—"}</td>
                  <td className="px-4 py-3">
                    {c.modificable !== false ? (
                      <button
                        type="button"
                        onClick={() => SolicitarEditar(c.clave, c.valor)}
                        className="rounded bg-[#1c1a16] px-2 py-1 text-xs text-white hover:bg-[#2d2a26]"
                      >
                        Editar
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ModalConfirmacion
        Abierto={EditarItem !== null}
        Titulo="Editar configuración"
        Mensaje={EditarItem ? `Nuevo valor para «${EditarItem.clave}»:` : ""}
        TextoConfirmar="Guardar"
        MostrarEntrada
        ValorEntradaInicial={EditarItem?.valorActual ?? ""}
        EtiquetaEntrada="Nuevo valor"
        AlConfirmar={ConfirmarEditar}
        AlCancelar={() => setEditarItem(null)}
      />
    </div>
  );
}
