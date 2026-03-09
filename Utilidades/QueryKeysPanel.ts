export const ClavesQueryPanel = {
  Habitaciones: ["admin", "habitaciones"] as const,
  TiposHabitacion: ["admin", "tipos-habitacion"] as const,
  PoliticasCancelacion: ["admin", "politicas-cancelacion"] as const,
  Reservas: ["admin", "reservas"] as const,
  Pagos: ["admin", "pagos"] as const,
  Usuarios: ["admin", "usuarios"] as const,
  Roles: ["admin", "roles"] as const,
  Configuracion: ["admin", "configuracion"] as const,
  Auditoria: (
    FechaDesde: string | null,
    FechaHasta: string | null,
    Accion?: string | null,
    TablaAfectada?: string | null
  ) => ["admin", "auditoria", FechaDesde, FechaHasta, Accion ?? "", TablaAfectada ?? ""] as const,
  Reportes: (FechaInicio: string, FechaFin: string, OrdenClientes: string) =>
    ["admin", "reportes", FechaInicio, FechaFin, OrdenClientes] as const,
};
