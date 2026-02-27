export const ClavesQueryMiCuenta = {
  ListaReservas: ["mi-cuenta", "reservas"] as const,
  DetalleReserva: (Id: number) => ["mi-cuenta", "reserva", Id] as const,
};
