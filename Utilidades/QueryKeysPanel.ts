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
    TablaAfectada?: string | null,
    Pagina?: number,
    Limite?: number
  ) =>
    [
      "admin",
      "auditoria",
      FechaDesde,
      FechaHasta,
      Accion ?? "",
      TablaAfectada ?? "",
      Pagina ?? 1,
      Limite ?? 25,
    ] as const,
  Reportes: (
    FechaInicio: string,
    FechaFin: string,
    OrdenClientes: string,
    AgruparOcupacion: "habitacion" | "tipo",
    TipoTendencia: "ingresos" | "reservas",
    AgruparTendencia: "dia" | "semana"
  ) =>
    [
      "admin",
      "reportes",
      FechaInicio,
      FechaFin,
      OrdenClientes,
      AgruparOcupacion,
      TipoTendencia,
      AgruparTendencia,
    ] as const,
  ReportesResumen: (FechaInicio: string, FechaFin: string) =>
    ["admin", "reportes", "resumen", FechaInicio, FechaFin] as const,
  ReportesIngresos: (FechaInicio: string, FechaFin: string) =>
    ["admin", "reportes", "ingresos", FechaInicio, FechaFin] as const,
  ReportesOcupacion: (
    FechaInicio: string,
    FechaFin: string,
    AgruparOcupacion: "habitacion" | "tipo"
  ) => ["admin", "reportes", "ocupacion", FechaInicio, FechaFin, AgruparOcupacion] as const,
  ReportesClientes: (
    FechaInicio: string,
    FechaFin: string,
    OrdenClientes: "gastado" | "reservas"
  ) => ["admin", "reportes", "clientes", FechaInicio, FechaFin, OrdenClientes] as const,
  ReportesAnalitica: (
    FechaInicio: string,
    FechaFin: string,
    TipoTendencia: "ingresos" | "reservas",
    AgruparTendencia: "dia" | "semana"
  ) =>
    [
      "admin",
      "reportes",
      "analitica",
      FechaInicio,
      FechaFin,
      TipoTendencia,
      AgruparTendencia,
    ] as const,
};
