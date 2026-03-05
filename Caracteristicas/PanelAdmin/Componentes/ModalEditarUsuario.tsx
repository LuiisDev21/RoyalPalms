"use client";

import type { UsuarioPanelResponse } from "@/Servicios/PanelApiServicio";
import type { UsuarioAlmacenado } from "@/Tipos/Auth";

interface ModalEditarUsuarioProps {
  Usuario: UsuarioPanelResponse;
  UsuarioLogueado: UsuarioAlmacenado | null;
  Nombre: string;
  setNombre: (v: string) => void;
  Apellido: string;
  setApellido: (v: string) => void;
  Activo: boolean;
  setActivo: (v: boolean) => void;
  Guardando: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancelar: () => void;
}

export function ModalEditarUsuario({
  Usuario,
  UsuarioLogueado,
  Nombre,
  setNombre,
  Apellido,
  setApellido,
  Activo,
  setActivo,
  Guardando,
  onSubmit,
  onCancelar,
}: ModalEditarUsuarioProps) {
  const EsPropioUsuario = UsuarioLogueado?.id === Usuario.id;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-editar-usuario-titulo"
      onClick={onCancelar}
    >
      <div
        className="w-full max-w-md rounded-xl border border-[#e5e0d8] bg-white shadow-xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="border-b border-[#e5e0d8] p-4">
          <h2
            id="modal-editar-usuario-titulo"
            className="FuenteTitulo text-lg font-semibold text-[#1c1a16]"
          >
            Editar usuario
          </h2>
          <p className="mt-1 text-sm text-[#5b564d]">{Usuario.email}</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 p-4">
          <div>
            <label htmlFor="editar-nombre" className="block text-sm font-medium text-[#5b564d]">
              Nombre
            </label>
            <input
              id="editar-nombre"
              type="text"
              value={Nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
              autoComplete="given-name"
            />
          </div>
          <div>
            <label htmlFor="editar-apellido" className="block text-sm font-medium text-[#5b564d]">
              Apellido
            </label>
            <input
              id="editar-apellido"
              type="text"
              value={Apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
              autoComplete="family-name"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#5b564d]">Estado</span>
            <button
              type="button"
              role="switch"
              aria-checked={Activo}
              aria-label={Activo ? "Usuario activo" : "Usuario inactivo"}
              onClick={() => setActivo(!Activo)}
              disabled={EsPropioUsuario}
              title={EsPropioUsuario ? "No puedes desactivar tu propia cuenta" : undefined}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] disabled:cursor-not-allowed disabled:opacity-60 ${
                Activo ? "bg-emerald-600" : "bg-[#6a645a]/40"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                  Activo ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-[#5b564d]">{Activo ? "Activo" : "Inactivo"}</span>
          </div>
          {EsPropioUsuario && (
            <p className="text-xs text-[#6a645a]">No puedes desactivar tu propia cuenta.</p>
          )}
          <div className="flex justify-end gap-2 border-t border-[#e5e0d8] pt-4">
            <button
              type="button"
              onClick={onCancelar}
              disabled={Guardando}
              className="rounded-lg border border-[#e5e0d8] bg-white px-4 py-2 text-sm font-medium text-[#5b564d] hover:bg-[#f6f2ec] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={Guardando}
              className="rounded-lg bg-[#1c1a16] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d2a26] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
            >
              {Guardando ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
