"use client";

import type { UsuarioPanelResponse } from "@/Servicios/PanelApiServicio";
import type { RolResponse } from "@/Servicios/PanelApiServicio";

interface ModalRolesUsuarioProps {
  Usuario: UsuarioPanelResponse;
  ListaRoles: RolResponse[];
  CargandoRoles: boolean;
  RolIdSeleccionado: number | null;
  setRolIdSeleccionado: (id: number | null) => void;
  Guardando: boolean;
  onGuardar: () => void;
  onCancelar: () => void;
}

export function ModalRolesUsuario({
  Usuario,
  ListaRoles,
  CargandoRoles,
  RolIdSeleccionado,
  setRolIdSeleccionado,
  Guardando,
  onGuardar,
  onCancelar,
}: ModalRolesUsuarioProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-roles-titulo"
      onClick={onCancelar}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-[#e5e0d8] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-[#e5e0d8] p-4">
          <h2 id="modal-roles-titulo" className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
            Asignar roles
          </h2>
          <p className="mt-1 text-sm text-[#5b564d]">
            {Usuario.nombre} {Usuario.apellido} — {Usuario.email}
          </p>
        </div>
        <div className="p-4">
          {CargandoRoles ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
            </div>
          ) : ListaRoles.length === 0 ? (
            <p className="py-4 text-sm text-[#5b564d]">No hay roles disponibles.</p>
          ) : (
            <ul className="space-y-2" role="radiogroup" aria-labelledby="modal-roles-titulo">
              {ListaRoles.map((rol) => (
                <li key={rol.id} className="flex items-center gap-3">
                  <input
                    id={`rol-${rol.id}`}
                    type="radio"
                    name="rol-usuario"
                    value={rol.id}
                    checked={RolIdSeleccionado === rol.id}
                    onChange={() => setRolIdSeleccionado(rol.id)}
                    className="h-4 w-4 border-[#6a645a]/40 text-[#b88f3a] focus:ring-[#b88f3a]"
                  />
                  <label
                    htmlFor={`rol-${rol.id}`}
                    className="cursor-pointer text-sm font-medium text-[#1c1a16]"
                  >
                    {rol.nombre}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-[#e5e0d8] p-4">
          <button
            type="button"
            onClick={onCancelar}
            disabled={Guardando}
            className="rounded-lg border border-[#e5e0d8] bg-white px-4 py-2 text-sm font-medium text-[#5b564d] transition-colors hover:bg-[#f6f2ec] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onGuardar}
            disabled={Guardando || CargandoRoles}
            className="rounded-lg bg-[#1c1a16] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d2a26] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
          >
            {Guardando ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
