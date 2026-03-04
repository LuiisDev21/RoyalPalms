"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ListarUsuariosPanel,
  ListarRolesPanel,
  ActualizarRolesUsuarioPanel,
  type UsuarioPanelResponse,
} from "@/Servicios/PanelApiServicio";
import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { PuedeVerSeccionUsuarios } from "@/Utilidades/PermisosPanel";
import { ClavesQueryPanel } from "@/Utilidades/QueryKeysPanel";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";

export default function PaginaUsuariosAdmin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { Roles } = UseAuth();
  const PuedeGestionarUsuarios = PuedeVerSeccionUsuarios(Roles);

  const [TextoBusqueda, setTextoBusqueda] = useState("");
  const [FiltroRol, setFiltroRol] = useState<string>("");
  const [FiltroActivo, setFiltroActivo] = useState<string>("");
  const [UsuarioParaRoles, setUsuarioParaRoles] = useState<UsuarioPanelResponse | null>(null);
  const [RolIdSeleccionado, setRolIdSeleccionado] = useState<number | null>(null);

  const { data: Usuarios = [], isLoading: Cargando, isError, error } = useQuery({
    queryKey: ClavesQueryPanel.Usuarios,
    queryFn: () => ListarUsuariosPanel(),
    enabled: PuedeGestionarUsuarios,
  });

  const { data: ListaRoles = [], isLoading: CargandoRoles } = useQuery({
    queryKey: ClavesQueryPanel.Roles,
    queryFn: () => ListarRolesPanel(),
    enabled: !!UsuarioParaRoles,
  });

  const MutacionRoles = useMutation({
    mutationFn: ({ UsuarioId, RolIds }: { UsuarioId: number; RolIds: number[] }) =>
      ActualizarRolesUsuarioPanel(UsuarioId, RolIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClavesQueryPanel.Usuarios });
      setUsuarioParaRoles(null);
      Notificaciones.Exito("Roles actualizados", "Los roles del usuario se han guardado correctamente.");
    },
    onError: (e: Error) => {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
        e,
        "Error al actualizar roles"
      );
      Notificaciones.Error(Titulo, Descripcion ?? e.message);
    },
  });

  useEffect(() => {
    if (!PuedeGestionarUsuarios) {
      router.replace("/admin");
      return;
    }
  }, [PuedeGestionarUsuarios, router]);

  useEffect(() => {
    if (UsuarioParaRoles) {
      const PrimerRol = UsuarioParaRoles.roles?.[0];
      setRolIdSeleccionado(PrimerRol != null ? PrimerRol.id : null);
    }
  }, [UsuarioParaRoles]);

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

  function AbrirEditarRoles(u: UsuarioPanelResponse) {
    setUsuarioParaRoles(u);
  }

  function CerrarModalRoles() {
    if (!MutacionRoles.isPending) setUsuarioParaRoles(null);
  }

  function GuardarRoles() {
    if (!UsuarioParaRoles) return;
    const RolIds =
      RolIdSeleccionado != null && ListaRoles.some((r) => r.id === RolIdSeleccionado)
        ? [RolIdSeleccionado]
        : [];
    MutacionRoles.mutate({ UsuarioId: UsuarioParaRoles.id, RolIds });
  }

  if (!PuedeGestionarUsuarios) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
      </div>
    );
  }

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
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Roles</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Estado</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Fecha Creación</th>
                <th className="px-4 py-3 font-medium text-[#1c1a16]">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-[#5b564d]">
              {UsuariosFiltrados.map((u) => (
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
                      onClick={() => AbrirEditarRoles(u)}
                      className="rounded-lg border border-[#b88f3a]/50 bg-[#b88f3a]/10 px-3 py-1.5 text-sm font-medium text-[#8b6914] transition-colors hover:bg-[#b88f3a]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
                    >
                      Editar roles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {UsuarioParaRoles && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-roles-titulo"
          onClick={CerrarModalRoles}
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
                {UsuarioParaRoles.nombre} {UsuarioParaRoles.apellido} — {UsuarioParaRoles.email}
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
                onClick={CerrarModalRoles}
                disabled={MutacionRoles.isPending}
                className="rounded-lg border border-[#e5e0d8] bg-white px-4 py-2 text-sm font-medium text-[#5b564d] transition-colors hover:bg-[#f6f2ec] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={GuardarRoles}
                disabled={MutacionRoles.isPending || CargandoRoles}
                className="rounded-lg bg-[#1c1a16] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d2a26] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
              >
                {MutacionRoles.isPending ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
