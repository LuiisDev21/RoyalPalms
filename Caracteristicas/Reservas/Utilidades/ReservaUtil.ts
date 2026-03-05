export function CalcularNoches(Entrada: string, Salida: string): number {
  const A = new Date(Entrada).getTime();
  const B = new Date(Salida).getTime();
  if (A >= B) return 0;
  return Math.floor((B - A) / (24 * 60 * 60 * 1000));
}

export function ObtenerMarcaTarjeta(
  NumeroCrudo: string
): "visa" | "mastercard" | "amex" | "discover" | null {
  const Numero = NumeroCrudo.replace(/[\s-]/g, "");
  if (!Numero) return null;
  const Inicial = Numero[0];
  if (Inicial === "4") return "visa";
  if (Inicial === "5") return "mastercard";
  if (Inicial === "3") return "amex";
  if (Inicial === "6") return "discover";
  return null;
}
