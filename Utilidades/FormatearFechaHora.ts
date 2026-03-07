export function FormatearFechaHoraParaUsuario(Iso: string): string {
  const Fecha = new Date(Iso);
  if (Number.isNaN(Fecha.getTime())) return Iso;
  return Fecha.toLocaleString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
