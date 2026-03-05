"use client";

import type { UsuarioPanelResponse } from "@/Servicios/PanelApiServicio";

interface TablaUsuariosAdminProps {
  Usuarios: UsuarioPanelResponse[];
  onAbrirMenu: (u: UsuarioPanelResponse) => void;
}

export function TablaUsuariosAdmin({ Usuarios, onAbrirMenu }: TablaUsuariosAdminProps) {
  return (
    <div className="mt-6 overflow-x-auto overflow-y-visible rounded-xl border border-[#e5e0d8] bg-white [-webkit-overflow-scrolling:touch]">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-[#e5e0d8] bg-[#f6f2ec]">
          <tr>
            <th className="px-4 py-3 font-medium text-[#1c1a16]">ID</th>
            <th className="px-4 py-3 font-medium text-[#1c1a16]">Email</th>
            <th className="px-4 py-3 font-medium text-[#1c1a16]">Nombre</th>
            <th className="px-4 py-3 font-medium text-[#1c1a16]">Apellido</th>
            <th className="px-4 py-3 font-medium text-[#1c1a16]">Teléfono</th>
            <th className="px-4 py-3 font-medium text-[#1c1a16]">Roles</th>
            <th className="px-4 py-3 font-medium text-[#1c1a16]">Estado</th>
            <th className="px-4 py-3 font-medium text-[#1c1a16]">Fecha Creación</th>
            <th className="w-10 px-4 py-3" aria-label="Acciones" />
          </tr>
        </thead>
        <tbody className="text-[#5b564d]">
          {Usuarios.map((u) => (
            <tr key={u.id} className="border-b border-[#e5e0d8]">
              <td className="px-4 py-3">{u.id}</td>
              <td className="px-4 py-3">{u.email}</td>
              <td className="px-4 py-3">{u.nombre}</td>
              <td className="px-4 py-3">{u.apellido}</td>
              <td className="px-4 py-3">{u.telefono ?? "—"}</td>
              <td className="px-4 py-3">
                {u.roles?.length ? (
                  <span className="flex flex-wrap gap-1">
                    {u.roles.map((r) => (
                      <span
                        key={r.id}
                        className="rounded-full bg-[#b88f3a]/15 px-2 py-0.5 text-xs font-medium text-[#8b6914]"
                      >
                        {r.nombre}
                      </span>
                    ))}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    u.activo ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-4 py-3">{new Date(u.fecha_creacion).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onAbrirMenu(u)}
                  aria-haspopup="dialog"
                  aria-label="Abrir menú de acciones"
                  className="rounded p-1.5 text-[#5b564d] hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
                >
                  <span className="inline-flex items-center justify-center gap-0.5" aria-hidden="true">
                    <span className="h-1 w-1 rounded-full bg-current" />
                    <span className="h-1 w-1 rounded-full bg-current" />
                    <span className="h-1 w-1 rounded-full bg-current" />
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
