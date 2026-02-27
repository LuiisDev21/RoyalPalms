"use client";

import { FormatearMontoConMoneda } from "@/Utilidades/FormatearMoneda";

export interface DesglosePreciosProps {
  moneda: string;
  subtotal: number;
  impuestos: number;
  descuentos: number;
  otros_cargos: number;
  precio_total: number;
}

function Fila({
  Etiqueta,
  Valor,
  Moneda,
  Destacado = false,
}: {
  Etiqueta: string;
  Valor: number;
  Moneda: string;
  Destacado?: boolean;
}) {
  const Texto = FormatearMontoConMoneda(Valor, Moneda);
  return (
    <div className={`flex justify-between text-sm ${Destacado ? "font-semibold text-[#1c1a16]" : "text-[#5b564d]"}`}>
      <span>{Etiqueta}</span>
      <span>{Texto}</span>
    </div>
  );
}

export function DesglosePrecios({
  moneda,
  subtotal,
  impuestos,
  descuentos,
  otros_cargos,
  precio_total,
}: DesglosePreciosProps) {
  const Moneda = moneda || "USD";
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6a645a]">
        Desglose de precios
      </h3>
      <div className="space-y-1.5">
        <Fila Etiqueta="Subtotal" Valor={subtotal} Moneda={Moneda} />
        {impuestos !== 0 && <Fila Etiqueta="Impuestos" Valor={impuestos} Moneda={Moneda} />}
        {descuentos !== 0 && <Fila Etiqueta="Descuentos" Valor={-descuentos} Moneda={Moneda} />}
        {otros_cargos !== 0 && <Fila Etiqueta="Otros cargos" Valor={otros_cargos} Moneda={Moneda} />}
        <Fila Etiqueta="Total" Valor={precio_total} Moneda={Moneda} Destacado />
      </div>
    </div>
  );
}

export function TieneDesgloseCompleto(
  r: {
    moneda?: string;
    subtotal?: number;
    impuestos?: number;
    descuentos?: number;
    otros_cargos?: number;
    precio_total?: string | number;
  } | null
): r is { moneda: string; subtotal: number; impuestos: number; descuentos: number; otros_cargos: number; precio_total: number } {
  if (!r) return false;
  const subtotal = typeof r.subtotal === "number" ? r.subtotal : undefined;
  const impuestos = typeof r.impuestos === "number" ? r.impuestos : undefined;
  const descuentos = typeof r.descuentos === "number" ? r.descuentos : undefined;
  const otros_cargos = typeof r.otros_cargos === "number" ? r.otros_cargos : undefined;
  const total =
    typeof r.precio_total === "number"
      ? r.precio_total
      : typeof r.precio_total === "string"
        ? parseFloat(r.precio_total)
        : undefined;
  return (
    typeof subtotal === "number" &&
    typeof impuestos === "number" &&
    typeof descuentos === "number" &&
    typeof otros_cargos === "number" &&
    typeof total === "number" &&
    !Number.isNaN(total)
  );
}
