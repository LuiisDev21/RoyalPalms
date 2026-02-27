"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ListarUsuariosPanel, type UsuarioPanelResponse } from "@/Servicios/PanelApiServicio";
import { ClavesQueryPanel } from "@/Utilidades/QueryKeysPanel";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";

export default function PaginaUsuariosAdmin() {
  const [TextoBusqueda, setTextoBusqueda] = useState("");
  const [FiltroRol, setFiltroRol] = useState<string>("");
  const [FiltroActivo, setFiltroActivo] = useState<string>("");

  const { data: Usuarios = [], isLoading: Cargando, isError, error } = useQuery({
    queryKey: ClavesQueryPanel.Usuarios,
    queryFn: () => ListarUsuariosPanel(),
  });

  useEffect(() => {
    if (!isError || !error) return;
    const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(error, "Error al cargar usuarios");
    Notificaciones.Error(Titulo, Descripcion);
  }, [isError, error]);

  const UsuariosFiltrados = Usuarios.filter((u) => {
    const Texto = TextoBusqueda.trim().toLowerCase();
    if (Texto) {
      const CoincideId = u.id.toString().includes(Texto);
      const CoincideEmail = u.email.toLowerCase().includes(Texto);
      const CoincideNombre = (u.nombre ?? "").toLowerCase().includes(Texto);
      const CoincideApellido = (u.apellido ?? "").toLowerCase().includes(Texto);
      const CoincideTelefono = (u.telefono ?? "").toLowerCase().includes(Texto);
      const CoincideRol = u.roles?.some((r) => r.nombre.toLowerCase().includes(Texto));
      if (!CoincideId && !CoincideEmail && !CoincideNombre && !CoincideApellido && !CoincideTelefono && !CoincideRol) return false;
    }
    if (FiltroRol && !u.roles?.some((r) => r.nombre === FiltroRol)) return false;
    if (FiltroActivo === "activo" && !u.activo) return false;
    if (FiltroActivo === "inactivo" && u.activo) return false;
    return true;
  });

  const RolesUnicos = Array.from(
    new Set(Usuarios.flatMap((u) => u.roles?.map((r) => r.nombre) ?? []))
  ).filter(Boolean).sort();

  return (
    <div>
      <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
        Usuarios Registrados
      </h1>
      {!Cargando && Usuarios.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-[#e5e0d8] bg-[#f6f2ec] p-4">
          <label htmlFor="usuarios-busqueda" className="sr-only">
            Buscar por email, nombre, apellido o rol
          </label>
          <input
            id="usuarios-busqueda"
            type="search"
            placeholder="Buscar por email, nombre, apellido, teléfono, rol…"
            value={TextoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
            className="min-w-[200px] flex-1 rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
          />
          <select
            aria-label="Filtrar por rol"
            value={FiltroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
          >
            <option value="">Todos los roles</option>
            {RolesUnicos.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            aria-label="Filtrar por estado activo/inactivo"
            value={FiltroActivo}
            onChange={(e) => setFiltroActivo(e.target.value)}
            className="rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
          >
            <option value="">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
          {(TextoBusqueda || FiltroRol || FiltroActivo) && (
            <button
              type="button"
              onClick={() => {
                setTextoBusqueda("");
                setFiltroRol("");
                setFiltroActivo("");
              }}
              className="rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#5b564d] hover:bg-[#f6f2ec]"
            >
              Limpiar filtros
            </button>
          )}
          <span className="text-sm text-[#5b564d]">
            {UsuariosFiltrados.length} de {Usuarios.length}
          </span>
        </div>
      )}
      {Cargando ? (
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
        </div>
      ) : Usuarios.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-12 text-center text-[#5b564d]">
          No hay usuarios registrados.
        </div>
      ) : UsuariosFiltrados.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-12 text-center text-[#5b564d]">
          No hay resultados con los filtros aplicados.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e5e0d8] bg-[#f6f2ec]">
              <tr>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">ID</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Email</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Nombre</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Apellido</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Teléfono</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Rol</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Estado</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Fecha Creación</th>
              </tr>
            </thead>
            <tbody className="text-[#5b564d]">
              {UsuariosFiltrados.map((u) => (
                <tr key={u.id} className="border-b border-[#e5e0d8]">
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.nombre}</td>
                  <td className="px-4 py-3">{u.apellido}</td>
                  <td className="px-4 py-3">{u.telefono ?? "N/A"}</td>
                  <td className="px-4 py-3">
                    {u.roles?.length ? u.roles.map((r) => r.nombre).join(", ") : "—"}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
