export function FormatearMontoConMoneda(Monto: number, Moneda: string = "USD"): string {
  const Num = Number(Monto);
  if (Number.isNaN(Num)) return "—";
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: Moneda,
    }).format(Num);
  } catch {
    return `${Moneda} ${Num.toFixed(2)}`;
  }
}

export function ObtenerPrecioTotalNumerico(precioTotal: string | number | undefined): number {
  if (precioTotal === undefined || precioTotal === null) return 0;
  if (typeof precioTotal === "number") return precioTotal;
  const N = parseFloat(String(precioTotal));
  return Number.isNaN(N) ? 0 : N;
}
