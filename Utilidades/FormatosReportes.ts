export function FormatearMoneda(Valor?: number | string | null): string {
  const Numero = Number(Valor ?? 0);
  return `$${Numero.toFixed(2)}`;
}

export function FormatearPorcentaje(Valor?: number | null): string {
  if (Valor == null || Number.isNaN(Number(Valor))) return "N/A";
  return `${Number(Valor).toFixed(2)}%`;
}

export function ObtenerEntradasEscalares(Datos: Record<string, unknown>): Array<[string, string | number]> {
  return Object.entries(Datos).filter(
    ([, Valor]) => typeof Valor === "string" || typeof Valor === "number"
  ) as Array<[string, string | number]>;
}
