"use client";

import type { UsuarioPanelResponse } from "@/Servicios/PanelApiServicio";

interface ModalMenuUsuarioProps {
  Usuario: UsuarioPanelResponse;
  onEditarUsuario: (u: UsuarioPanelResponse) => void;
  onEditarRoles: (u: UsuarioPanelResponse) => void;
  onCerrar: () => void;
}

export function ModalMenuUsuario({
  Usuario,
  onEditarUsuario,
  onEditarRoles,
  onCerrar,
}: ModalMenuUsuarioProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-menu-usuario-titulo"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-xs rounded-xl border border-[#e5e0d8] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-[#e5e0d8] p-4">
          <h2
            id="modal-menu-usuario-titulo"
            className="FuenteTitulo text-lg font-semibold text-[#1c1a16]"
          >
            Acciones
          </h2>
          <p className="mt-1 truncate text-sm text-[#5b564d]">
            {Usuario.nombre} {Usuario.apellido} — {Usuario.email}
          </p>
        </div>
        <div className="flex flex-col p-2">
          <button
            type="button"
            onClick={() => onEditarUsuario(Usuario)}
            className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[#1c1a16] hover:bg-[#f6f2ec] focus:bg-[#f6f2ec] focus:outline-none"
          >
            Editar usuario
          </button>
          <button
            type="button"
            onClick={() => onEditarRoles(Usuario)}
            className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[#1c1a16] hover:bg-[#f6f2ec] focus:bg-[#f6f2ec] focus:outline-none"
          >
            Editar roles
          </button>
        </div>
        <div className="border-t border-[#e5e0d8] p-2">
          <button
            type="button"
            onClick={onCerrar}
            className="w-full rounded-lg px-4 py-2 text-sm font-medium text-[#5b564d] hover:bg-[#f6f2ec] focus:outline-none focus:ring-2 focus:ring-[#b88f3a] focus:ring-offset-2"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
