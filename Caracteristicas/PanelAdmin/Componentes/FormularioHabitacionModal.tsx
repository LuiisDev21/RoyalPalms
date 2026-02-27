"use client";

import { IconoSpinner } from "@/Componentes/Base/IconoSpinner";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import type { PoliticaCancelacionResponse } from "@/Servicios/PanelApiServicio";
import type { TipoHabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import { useState, useRef } from "react";

export interface ValoresFormularioHabitacion {
  numero: string;
  tipo_habitacion_id: string;
  politica_cancelacion_id: string;
  descripcion: string;
  capacidad: string;
  precio_por_noche: string;
  estado: string;
}

const EstadoInicial: ValoresFormularioHabitacion = {
  numero: "",
  tipo_habitacion_id: "",
  politica_cancelacion_id: "",
  descripcion: "",
  capacidad: "1",
  precio_por_noche: "",
  estado: "disponible",
};

export function FormularioHabitacionModal({
  Habitacion,
  Tipos,
  Politicas,
  Guardando,
  ErrorGuardado,
  EnGuardar,
  EnCancelar,
}: {
  Habitacion: HabitacionResponse | null;
  Tipos: TipoHabitacionResponse[];
  Politicas: PoliticaCancelacionResponse[];
  Guardando?: boolean;
  ErrorGuardado?: string | null;
  EnGuardar: (datos: ValoresFormularioHabitacion, archivo: File | null) => void;
  EnCancelar: () => void;
}) {
  const Enviando = Guardando ?? false;
  const EsEdicion = Habitacion != null;
  const [Valores, setValores] = useState<ValoresFormularioHabitacion>(() =>
    Habitacion
      ? {
          numero: Habitacion.numero,
          tipo_habitacion_id: String(Habitacion.tipo_habitacion_id),
          politica_cancelacion_id: Habitacion.politica_cancelacion_id != null ? String(Habitacion.politica_cancelacion_id) : "",
          descripcion: Habitacion.descripcion ?? "",
          capacidad: String(Habitacion.capacidad),
          precio_por_noche: Habitacion.precio_por_noche,
          estado: Habitacion.estado ?? "disponible",
        }
      : EstadoInicial
  );
  const [Archivo, setArchivo] = useState<File | null>(null);
  const [VistaPrevia, setVistaPrevia] = useState<string | null>(Habitacion?.imagen_url ?? null);
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  function CambiarCampo(Campo: keyof ValoresFormularioHabitacion, Valor: string) {
    setValores((v) => ({ ...v, [Campo]: Valor }));
  }

  function AlCambiarArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setArchivo(f);
      const url = URL.createObjectURL(f);
      setVistaPrevia(url);
    }
  }

  function Enviar(e: React.FormEvent) {
    e.preventDefault();
    EnGuardar(Valores, Archivo);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-form-habitacion"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl"
        style={{ scrollbarGutter: "stable" }}
      >
        <div className="flex shrink-0 flex-col border-b border-[#e5e0d8] bg-[#faf8f5] px-6 py-4">
          <h2 id="titulo-form-habitacion" className="FuenteTitulo text-xl font-semibold text-[#1c1a16]">
            {EsEdicion ? "Editar Habitación" : "Nueva Habitación"}
          </h2>
          {ErrorGuardado && (
            <div
              className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {ErrorGuardado}
            </div>
          )}
        </div>
        <div className="min-h-0 overflow-y-scroll px-6 py-5">
          <form onSubmit={Enviar} className="flex flex-col gap-6" id="form-habitacion-modal">
            <fieldset className="flex flex-col gap-3 border-0 p-0">
              <legend className="text-xs font-semibold uppercase tracking-wider text-[#6a645a]">
                Identificación
              </legend>
              {!EsEdicion && (
                <div>
                  <label htmlFor="habitacion-numero" className="block text-sm font-medium text-[#5b564d]">
                    Número
                  </label>
                  <input
                    id="habitacion-numero"
                    type="text"
                    value={Valores.numero}
                    onChange={(e) => CambiarCampo("numero", e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                  />
                </div>
              )}
              <div>
                <label htmlFor="habitacion-tipo" className="block text-sm font-medium text-[#5b564d]">
                  Tipo
                </label>
                <select
                  id="habitacion-tipo"
                  value={Valores.tipo_habitacion_id}
                  onChange={(e) => CambiarCampo("tipo_habitacion_id", e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                >
                  <option value="">Seleccione un tipo</option>
                  {Tipos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="habitacion-politica" className="block text-sm font-medium text-[#5b564d]">
                  Política de cancelación
                </label>
                <select
                  id="habitacion-politica"
                  value={Valores.politica_cancelacion_id}
                  onChange={(e) => CambiarCampo("politica_cancelacion_id", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                >
                  <option value="">Sin política</option>
                  {Politicas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-3 border-0 p-0">
              <legend className="text-xs font-semibold uppercase tracking-wider text-[#6a645a]">
                Descripción
              </legend>
              <div>
                <textarea
                  id="habitacion-descripcion"
                  value={Valores.descripcion}
                  onChange={(e) => CambiarCampo("descripcion", e.target.value)}
                  rows={3}
                  aria-label="Descripción"
                  className="mt-1 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                />
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-3 border-0 p-0">
              <legend className="text-xs font-semibold uppercase tracking-wider text-[#6a645a]">
                Precio y estado
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="habitacion-capacidad" className="block text-sm font-medium text-[#5b564d]">
                    Capacidad
                  </label>
                  <input
                    id="habitacion-capacidad"
                    type="number"
                    min={1}
                    value={Valores.capacidad}
                    onChange={(e) => CambiarCampo("capacidad", e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                  />
                </div>
                <div>
                  <label htmlFor="habitacion-precio" className="block text-sm font-medium text-[#5b564d]">
                    Precio por noche
                  </label>
                  <input
                    id="habitacion-precio"
                    type="number"
                    step="0.01"
                    min={0}
                    value={Valores.precio_por_noche}
                    onChange={(e) => CambiarCampo("precio_por_noche", e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="habitacion-estado" className="block text-sm font-medium text-[#5b564d]">
                  Estado
                </label>
                <select
                  id="habitacion-estado"
                  value={Valores.estado}
                  onChange={(e) => CambiarCampo("estado", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
                >
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="limpieza">Limpieza</option>
                  <option value="bloqueada">Bloqueada</option>
                </select>
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-3 border-0 p-0">
              <legend className="text-xs font-semibold uppercase tracking-wider text-[#6a645a]">
                Imagen
              </legend>
              <div>
                <input
                  ref={inputArchivoRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={AlCambiarArchivo}
                  aria-label="Imagen"
                  className="mt-1 block w-full text-sm text-[#5b564d] file:mr-2 file:rounded-lg file:border-0 file:bg-[#1c1a16] file:px-3 file:py-1.5 file:text-sm file:text-white file:hover:bg-[#2d2a26]"
                />
                {VistaPrevia && (
                  <div className="mt-2">
                    <img
                      src={VistaPrevia}
                      alt="Vista previa"
                      className="max-h-40 rounded-lg border border-[#e5e0d8] object-cover"
                    />
                  </div>
                )}
              </div>
            </fieldset>

            <div className="flex justify-end gap-2 border-t border-[#e5e0d8] pt-4">
              <button
                type="button"
                onClick={EnCancelar}
                disabled={Enviando}
                className="rounded-lg border border-[#6a645a] bg-white px-4 py-2 text-sm font-medium text-[#5b564d] hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={Enviando}
                className="flex items-center gap-2 rounded-lg bg-[#1c1a16] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d2a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {Enviando ? <IconoSpinner /> : null}
                {Enviando ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
