import type { NombreRol } from "@/Tipos/Auth";

export type PermisoPanel =
  | "habitaciones"
  | "habitaciones_crear"
  | "habitaciones_editar"
  | "habitaciones_eliminar"
  | "reservas"
  | "reservas_crear"
  | "reservas_cancelar"
  | "reservas_actualizar_estado"
  | "pagos"
  | "usuarios"
  | "politicas"
  | "configuracion"
  | "reportes"
  | "reportes_auditoria";

const PermisosPorRol: Record<NombreRol, PermisoPanel[]> = {
  administrador: [
    "habitaciones",
    "habitaciones_crear",
    "habitaciones_editar",
    "habitaciones_eliminar",
    "reservas",
    "reservas_crear",
    "reservas_cancelar",
    "reservas_actualizar_estado",
    "pagos",
    "usuarios",
    "politicas",
    "configuracion",
    "reportes",
    "reportes_auditoria",
  ],
  gerente: [
    "habitaciones",
    "habitaciones_crear",
    "habitaciones_editar",
    "habitaciones_eliminar",
    "reservas",
    "pagos",
    "politicas",
    "configuracion",
    "reportes",
  ],
  recepcionista: [
    "habitaciones",
    "habitaciones_editar",
    "reservas",
    "reservas_crear",
    "reservas_cancelar",
    "reservas_actualizar_estado",
    "pagos",
    "politicas",
  ],
  huesped: [],
};

export function TienePermiso(roles: NombreRol[], permiso: PermisoPanel): boolean {
  for (const rol of roles) {
    if (PermisosPorRol[rol]?.includes(permiso)) return true;
  }
  return false;
}

export function PuedeVerSeccionUsuarios(roles: NombreRol[]): boolean {
  return TienePermiso(roles, "usuarios");
}

export function PuedeVerSeccionConfiguracion(roles: NombreRol[]): boolean {
  return TienePermiso(roles, "configuracion");
}

export function PuedeVerReportesAuditoria(roles: NombreRol[]): boolean {
  return TienePermiso(roles, "reportes_auditoria");
}

export function PuedeCrearHabitacion(roles: NombreRol[]): boolean {
  return TienePermiso(roles, "habitaciones_crear");
}

export function PuedeEditarHabitacion(roles: NombreRol[]): boolean {
  return TienePermiso(roles, "habitaciones_editar");
}

export function PuedeEliminarHabitacion(roles: NombreRol[]): boolean {
  return TienePermiso(roles, "habitaciones_eliminar");
}

export function PuedeCrearReserva(roles: NombreRol[]): boolean {
  return TienePermiso(roles, "reservas_crear");
}

export function PuedeCancelarReserva(roles: NombreRol[]): boolean {
  return TienePermiso(roles, "reservas_cancelar");
}

export function PuedeActualizarEstadoReserva(roles: NombreRol[]): boolean {
  return TienePermiso(roles, "reservas_actualizar_estado");
}
