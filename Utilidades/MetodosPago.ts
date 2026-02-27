export const MetodosPagoApi = [
  { Valor: "tarjeta_credito", Etiqueta: "Tarjeta de crédito" },
  { Valor: "tarjeta_debito", Etiqueta: "Tarjeta de débito" },
  { Valor: "efectivo", Etiqueta: "Efectivo" },
  { Valor: "transferencia", Etiqueta: "Transferencia" },
  { Valor: "paypal", Etiqueta: "PayPal" },
  { Valor: "cripto", Etiqueta: "Criptomoneda" },
] as const;

export type MetodoPagoApiValor = (typeof MetodosPagoApi)[number]["Valor"];

export function EtiquetaMetodoPagoApi(valor: string): string {
  const Metodo = MetodosPagoApi.find((M) => M.Valor === valor);
  return Metodo ? Metodo.Etiqueta : valor;
}

