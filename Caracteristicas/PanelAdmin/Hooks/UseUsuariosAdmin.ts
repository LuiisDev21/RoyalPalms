"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import {
  ListarUsuariosPanel,
  ListarRolesPanel,
  ActualizarRolesUsuarioPanel,
  ActualizarUsuarioPanel,
  type UsuarioPanelResponse,
} from "@/Servicios/PanelApiServicio";
import { ClavesQueryPanel } from "@/Utilidades/QueryKeysPanel";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";

export function UseUsuariosAdmin(Habilitado: boolean) {
  const queryClient = useQueryClient();
  const [TextoBusqueda, setTextoBusqueda] = useState("");
  const [FiltroRol, setFiltroRol] = useState("");
  const [FiltroActivo, setFiltroActivo] = useState("");
  const [UsuarioMenuAbierto, setUsuarioMenuAbierto] = useState<UsuarioPanelResponse | null>(null);
  const [UsuarioParaRoles, setUsuarioParaRoles] = useState<UsuarioPanelResponse | null>(null);
  const [UsuarioParaEditar, setUsuarioParaEditar] = useState<UsuarioPanelResponse | null>(null);
  const [NombreEditar, setNombreEditar] = useState("");
  const [ApellidoEditar, setApellidoEditar] = useState("");
  const [ActivoEditar, setActivoEditar] = useState(true);
  const [RolIdSeleccionado, setRolIdSeleccionado] = useState<number | null>(null);

  const { data: Usuarios = [], isLoading: Cargando, isError, error } = useQuery({
    queryKey: ClavesQueryPanel.Usuarios,
    queryFn: () => ListarUsuariosPanel(),
    enabled: Habilitado,
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
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al actualizar roles");
      Notificaciones.Error(Titulo, Descripcion ?? e.message);
    },
  });

  const MutacionEditarUsuario = useMutation({
    mutationFn: ({
      UsuarioId,
      Nombre,
      Apellido,
      Activo,
    }: {
      UsuarioId: number;
      Nombre: string;
      Apellido: string;
      Activo: boolean;
    }) =>
      ActualizarUsuarioPanel(UsuarioId, { nombre: Nombre, apellido: Apellido, activo: Activo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClavesQueryPanel.Usuarios });
      setUsuarioParaEditar(null);
      Notificaciones.Exito("Usuario actualizado", "Los datos del usuario se han guardado.");
    },
    onError: (e: Error) => {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al actualizar usuario");
      Notificaciones.Error(Titulo, Descripcion ?? e.message);
    },
  });

  useEffect(() => {
    if (UsuarioParaRoles) {
      const PrimerRol = UsuarioParaRoles.roles?.[0];
      setRolIdSeleccionado(PrimerRol != null ? PrimerRol.id : null);
    }
  }, [UsuarioParaRoles]);

  useEffect(() => {
    if (UsuarioParaEditar) {
      setNombreEditar(UsuarioParaEditar.nombre ?? "");
      setApellidoEditar(UsuarioParaEditar.apellido ?? "");
      setActivoEditar(UsuarioParaEditar.activo ?? true);
    }
  }, [UsuarioParaEditar]);

  const UsuariosFiltrados = useMemo(
    () =>
      Usuarios.filter((u) => {
        const Texto = TextoBusqueda.trim().toLowerCase();
        if (Texto) {
          const CoincideId = u.id.toString().includes(Texto);
          const CoincideEmail = u.email.toLowerCase().includes(Texto);
          const CoincideNombre = (u.nombre ?? "").toLowerCase().includes(Texto);
          const CoincideApellido = (u.apellido ?? "").toLowerCase().includes(Texto);
          const CoincideTelefono = (u.telefono ?? "").toLowerCase().includes(Texto);
          const CoincideRol = u.roles?.some((r) => r.nombre.toLowerCase().includes(Texto));
          if (
            !CoincideId &&
            !CoincideEmail &&
            !CoincideNombre &&
            !CoincideApellido &&
            !CoincideTelefono &&
            !CoincideRol
          )
            return false;
        }
        if (FiltroRol && !u.roles?.some((r) => r.nombre === FiltroRol)) return false;
        if (FiltroActivo === "activo" && !u.activo) return false;
        if (FiltroActivo === "inactivo" && u.activo) return false;
        return true;
      }),
    [Usuarios, TextoBusqueda, FiltroRol, FiltroActivo]
  );

  const RolesUnicos = useMemo(
    () =>
      Array.from(new Set(Usuarios.flatMap((u) => u.roles?.map((r) => r.nombre) ?? [])))
        .filter(Boolean)
        .sort() as string[],
    [Usuarios]
  );

  function AbrirEditarRoles(u: UsuarioPanelResponse) {
    setUsuarioMenuAbierto(null);
    setUsuarioParaRoles(u);
  }

  function AbrirEditarUsuario(u: UsuarioPanelResponse) {
    setUsuarioMenuAbierto(null);
    setUsuarioParaEditar(u);
  }

  function CerrarModalEditarUsuario() {
    if (!MutacionEditarUsuario.isPending) setUsuarioParaEditar(null);
  }

  function GuardarEditarUsuario(e: React.FormEvent) {
    e.preventDefault();
    if (!UsuarioParaEditar) return;
    MutacionEditarUsuario.mutate({
      UsuarioId: UsuarioParaEditar.id,
      Nombre: NombreEditar.trim(),
      Apellido: ApellidoEditar.trim(),
      Activo: ActivoEditar,
    });
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

  function LimpiarFiltros() {
    setTextoBusqueda("");
    setFiltroRol("");
    setFiltroActivo("");
  }

  return {
    Usuarios,
    UsuariosFiltrados,
    Cargando,
    isError,
    error,
    TextoBusqueda,
    setTextoBusqueda,
    FiltroRol,
    setFiltroRol,
    FiltroActivo,
    setFiltroActivo,
    RolesUnicos,
    UsuarioMenuAbierto,
    setUsuarioMenuAbierto,
    UsuarioParaRoles,
    UsuarioParaEditar,
    ListaRoles,
    CargandoRoles,
    NombreEditar,
    setNombreEditar,
    ApellidoEditar,
    setApellidoEditar,
    ActivoEditar,
    setActivoEditar,
    RolIdSeleccionado,
    setRolIdSeleccionado,
    MutacionRoles,
    MutacionEditarUsuario,
    AbrirEditarRoles,
    AbrirEditarUsuario,
    CerrarModalEditarUsuario,
    GuardarEditarUsuario,
    CerrarModalRoles,
    GuardarRoles,
    LimpiarFiltros,
  };
}
