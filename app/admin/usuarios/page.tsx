"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { PuedeVerSeccionUsuarios } from "@/Utilidades/PermisosPanel";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { UseUsuariosAdmin } from "@/Caracteristicas/PanelAdmin/Hooks/UseUsuariosAdmin";
import { FiltrosUsuariosAdmin } from "@/Caracteristicas/PanelAdmin/Componentes/FiltrosUsuariosAdmin";
import { TablaUsuariosAdmin } from "@/Caracteristicas/PanelAdmin/Componentes/TablaUsuariosAdmin";
import { ModalMenuUsuario } from "@/Caracteristicas/PanelAdmin/Componentes/ModalMenuUsuario";
import { ModalEditarUsuario } from "@/Caracteristicas/PanelAdmin/Componentes/ModalEditarUsuario";
import { ModalRolesUsuario } from "@/Caracteristicas/PanelAdmin/Componentes/ModalRolesUsuario";

export default function PaginaUsuariosAdmin() {
  const router = useRouter();
  const { Roles, Usuario: UsuarioLogueado } = UseAuth();
  const PuedeGestionarUsuarios = PuedeVerSeccionUsuarios(Roles);

  const {
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
  } = UseUsuariosAdmin(PuedeGestionarUsuarios);

  useEffect(() => {
    if (!PuedeGestionarUsuarios) {
      router.replace("/admin");
    }
  }, [PuedeGestionarUsuarios, router]);

  useEffect(() => {
    if (!isError || !error) return;
    const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
      error,
      "Error al cargar usuarios"
    );
    Notificaciones.Error(Titulo, Descripcion);
  }, [isError, error]);

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
        <FiltrosUsuariosAdmin
          TextoBusqueda={TextoBusqueda}
          setTextoBusqueda={setTextoBusqueda}
          FiltroRol={FiltroRol}
          setFiltroRol={setFiltroRol}
          FiltroActivo={FiltroActivo}
          setFiltroActivo={setFiltroActivo}
          RolesUnicos={RolesUnicos}
          TotalFiltrado={UsuariosFiltrados.length}
          Total={Usuarios.length}
          LimpiarFiltros={LimpiarFiltros}
        />
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
        <TablaUsuariosAdmin
          Usuarios={UsuariosFiltrados}
          onAbrirMenu={setUsuarioMenuAbierto}
        />
      )}

      {UsuarioMenuAbierto && (
        <ModalMenuUsuario
          Usuario={UsuarioMenuAbierto}
          onEditarUsuario={AbrirEditarUsuario}
          onEditarRoles={AbrirEditarRoles}
          onCerrar={() => setUsuarioMenuAbierto(null)}
        />
      )}

      {UsuarioParaEditar && (
        <ModalEditarUsuario
          Usuario={UsuarioParaEditar}
          UsuarioLogueado={UsuarioLogueado}
          Nombre={NombreEditar}
          setNombre={setNombreEditar}
          Apellido={ApellidoEditar}
          setApellido={setApellidoEditar}
          Activo={ActivoEditar}
          setActivo={setActivoEditar}
          Guardando={MutacionEditarUsuario.isPending}
          onSubmit={GuardarEditarUsuario}
          onCancelar={CerrarModalEditarUsuario}
        />
      )}

      {UsuarioParaRoles && (
        <ModalRolesUsuario
          Usuario={UsuarioParaRoles}
          ListaRoles={ListaRoles}
          CargandoRoles={CargandoRoles}
          RolIdSeleccionado={RolIdSeleccionado}
          setRolIdSeleccionado={setRolIdSeleccionado}
          Guardando={MutacionRoles.isPending}
          onGuardar={GuardarRoles}
          onCancelar={CerrarModalRoles}
        />
      )}
    </div>
  );
}
