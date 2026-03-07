"use client";

import type { PagoTarjetaSimulado } from "@/Tipos/Pagos";
import { ObtenerMarcaTarjeta } from "../Utilidades/ReservaUtil";

interface FormularioPagoTarjetaProps {
  PagoTarjeta: PagoTarjetaSimulado;
  setPagoTarjeta: (v: PagoTarjetaSimulado) => void;
}

export function FormularioPagoTarjeta({ PagoTarjeta, setPagoTarjeta }: FormularioPagoTarjetaProps) {
  return (
    <div className="mt-4 space-y-3">
      <div>
        <label
          htmlFor="pago-tarjeta-numero"
          className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
        >
          Número de tarjeta
        </label>
        <div className="relative mt-1.5">
          <input
            id="pago-tarjeta-numero"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="•••• •••• •••• ••••"
            value={PagoTarjeta.Numero}
            onChange={(e) => {
              const SoloDigitos = e.target.value.replace(/\D/g, "");
              const MarcaLocal = ObtenerMarcaTarjeta(SoloDigitos);
              const Max = MarcaLocal === "amex" || MarcaLocal === "discover" ? 15 : 16;
              const Recortado = SoloDigitos.slice(0, Max);
              setPagoTarjeta({ ...PagoTarjeta, Numero: Recortado });
            }}
            className="w-full rounded-lg border border-[#6a645a]/40 px-3 py-2 pr-10 text-sm text-[#1c1a16] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
          />
          {(() => {
            const Marca = ObtenerMarcaTarjeta(PagoTarjeta.Numero);
            let Icono = "";
            if (Marca === "visa") Icono = "fa-cc-visa";
            else if (Marca === "mastercard") Icono = "fa-cc-mastercard";
            else if (Marca === "amex") Icono = "fa-cc-amex";
            else if (Marca === "discover") Icono = "fa-cc-discover";
            if (!Icono) return null;
            return (
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#6a645a]">
                <i className={`fa-brands ${Icono} text-lg`} aria-hidden="true" />
              </span>
            );
          })()}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="pago-tarjeta-expiracion"
            className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
          >
            Fecha de expiración
          </label>
          <input
            id="pago-tarjeta-expiracion"
            type="text"
            inputMode="numeric"
            placeholder="MM/AA"
            value={PagoTarjeta.Expiracion}
            onChange={(e) =>
              setPagoTarjeta({ ...PagoTarjeta, Expiracion: e.target.value })
            }
            className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 px-3 py-2 text-sm text-[#1c1a16] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
          />
        </div>
        <div>
          <label
            htmlFor="pago-tarjeta-cvv"
            className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
          >
            CVV
          </label>
          <input
            id="pago-tarjeta-cvv"
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={PagoTarjeta.Cvv}
            onChange={(e) => setPagoTarjeta({ ...PagoTarjeta, Cvv: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 px-3 py-2 text-sm text-[#1c1a16] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
          />
        </div>
      </div>
      <p className="text-xs text-[#6a645a]">
        Esta sección es un pago simulado; los datos no se envían a un procesador real.
      </p>
    </div>
  );
}
