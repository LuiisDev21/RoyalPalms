"use client";

import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import {
  ListarConfiguracionPanel,
  ActualizarConfiguracionPanel,
  type ConfiguracionHotelItem,
} from "@/Servicios/PanelApiServicio";
import { useEffect, useState } from "react";

export default function PaginaConfiguracionAdmin() {
  const [Items, setItems] = useState<ConfiguracionHotelItem[]>([]);
  const [Cargando, setCargando] = useState(true);

  async function Cargar() {
    setCargando(true);
    try {
      const r = await ListarConfiguracionPanel();
      setItems(r);
    } catch (err: unknown) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(err, "Error al cargar configuración");
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    Cargar();
  }, []);

  async function Editar(Clave: string, ValorActual: string) {
    const NuevoValor = prompt("Nuevo valor:", ValorActual);
    if (NuevoValor === null) return;
    try {
      await ActualizarConfiguracionPanel(Clave, NuevoValor);
      Notificaciones.Exito("Configuración actualizada correctamente");
      await Cargar();
    } catch (e: unknown) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al actualizar");
      Notificaciones.Error(Titulo, Descripcion);
    }
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
                        onClick={() => Editar(c.clave, c.valor)}
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
    </div>
  );
}
