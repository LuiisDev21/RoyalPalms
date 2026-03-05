"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DesglosePrecios, TieneDesgloseCompleto } from "@/Componentes/Base/DesglosePrecios";
import { FormatearMontoConMoneda } from "@/Utilidades/FormatearMoneda";
import type { ReservaClienteResponse } from "@/Servicios/ClienteApiServicio";

interface VistaReservaConfirmadaProps {
  Reserva: ReservaClienteResponse;
}

export function VistaReservaConfirmada({ Reserva }: VistaReservaConfirmadaProps) {
  const router = useRouter();
  const Moneda = Reserva.moneda ?? "USD";
  const PrecioTotalNum =
    typeof Reserva.precio_total === "number"
      ? Reserva.precio_total
      : parseFloat(String(Reserva.precio_total));
  const PrecioTexto = FormatearMontoConMoneda(PrecioTotalNum, Moneda);

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/mi-cuenta/reservas"
          className="text-sm text-[#5b564d] transition-colors hover:text-[#1c1a16]"
        >
          ← Mis reservas
        </Link>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
          Reserva confirmada
        </h1>
        <p className="mt-2 text-sm text-[#5b564d]">
          Tu reserva #{Reserva.id}
          {Reserva.codigo_reserva ? ` (${Reserva.codigo_reserva})` : ""} se ha creado
          correctamente. Total: {PrecioTexto}
        </p>
        {TieneDesgloseCompleto(Reserva) && (
          <div className="mt-6 rounded-lg border border-[#e5e0d8] bg-white p-4">
            <DesglosePrecios
              moneda={Reserva.moneda!}
              subtotal={Reserva.subtotal!}
              impuestos={Reserva.impuestos!}
              descuentos={Reserva.descuentos!}
              otros_cargos={Reserva.otros_cargos!}
              precio_total={PrecioTotalNum}
            />
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.push(`/mi-cuenta/reservas/${Reserva.id}`)}
            className="rounded-lg bg-[#1c1a16] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d2a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
          >
            Ver detalle y pagos
          </button>
          <button
            type="button"
            onClick={() => router.push("/mi-cuenta/reservas")}
            className="rounded-lg border border-[#6a645a] bg-white px-4 py-2.5 text-sm font-medium text-[#5b564d] transition-colors hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
          >
            Mis reservas
          </button>
        </div>
      </div>
    </div>
  );
}
