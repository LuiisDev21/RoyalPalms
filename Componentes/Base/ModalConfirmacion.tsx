"use client";

import { useEffect, useRef, useState } from "react";

export interface ModalConfirmacionProps {
  Abierto: boolean;
  Titulo: string;
  Mensaje: string;
  TextoCancelar?: string;
  TextoConfirmar: string;
  Variante?: "primario" | "peligro";
  MostrarEntrada?: boolean;
  ValorEntradaInicial?: string;
  EtiquetaEntrada?: string;
  AlConfirmar: (valor?: string) => void;
  AlCancelar: () => void;
}

function ModalConfirmacionConEntrada({
  ValorEntradaInicial,
  EtiquetaEntrada,
  Titulo,
  Mensaje,
  TextoCancelar,
  TextoConfirmar,
  Variante,
  AlConfirmar,
  AlCancelar,
}: ModalConfirmacionProps & { ValorEntradaInicial: string }) {
  const [ValorEntrada, setValorEntrada] = useState(ValorEntradaInicial);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const EsPeligro = Variante === "peligro";

  function EnviarConfirmar(e: React.FormEvent) {
    e.preventDefault();
    AlConfirmar(ValorEntrada);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-confirmacion-titulo"
      aria-describedby="modal-confirmacion-mensaje"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 id="modal-confirmacion-titulo" className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
          {Titulo}
        </h2>
        <p id="modal-confirmacion-mensaje" className="mt-2 text-sm text-[#5b564d]">
          {Mensaje}
        </p>
        <form onSubmit={EnviarConfirmar} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="modal-confirmacion-input" className="block text-sm font-medium text-[#5b564d]">
              {EtiquetaEntrada}
            </label>
            <input
              ref={inputRef}
              id="modal-confirmacion-input"
              type="text"
              value={ValorEntrada}
              onChange={(e) => setValorEntrada(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={AlCancelar}
              className="rounded-lg border border-[#6a645a] bg-white px-4 py-2 text-sm font-medium text-[#5b564d] hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
            >
              {TextoCancelar}
            </button>
            <button
              type="submit"
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] ${
                EsPeligro
                  ? "bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
                  : "bg-[#1c1a16] hover:bg-[#2d2a26] focus-visible:outline-[#b88f3a]"
              }`}
            >
              {TextoConfirmar}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ModalConfirmacion({
  Abierto,
  Titulo,
  Mensaje,
  TextoCancelar = "Cancelar",
  TextoConfirmar,
  Variante = "primario",
  MostrarEntrada = false,
  ValorEntradaInicial = "",
  EtiquetaEntrada = "Valor",
  AlConfirmar,
  AlCancelar,
}: ModalConfirmacionProps) {
  if (!Abierto) return null;

  if (MostrarEntrada) {
    return (
      <ModalConfirmacionConEntrada
        key={ValorEntradaInicial}
        Abierto={Abierto}
        Titulo={Titulo}
        Mensaje={Mensaje}
        TextoCancelar={TextoCancelar}
        TextoConfirmar={TextoConfirmar}
        Variante={Variante}
        MostrarEntrada
        ValorEntradaInicial={ValorEntradaInicial}
        EtiquetaEntrada={EtiquetaEntrada}
        AlConfirmar={AlConfirmar}
        AlCancelar={AlCancelar}
      />
    );
  }

  const EsPeligro = Variante === "peligro";

  function EnviarConfirmar(e: React.FormEvent) {
    e.preventDefault();
    AlConfirmar();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-confirmacion-titulo"
      aria-describedby="modal-confirmacion-mensaje"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 id="modal-confirmacion-titulo" className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
          {Titulo}
        </h2>
        <p id="modal-confirmacion-mensaje" className="mt-2 text-sm text-[#5b564d]">
          {Mensaje}
        </p>
        <form onSubmit={EnviarConfirmar} className="mt-6 flex flex-col gap-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={AlCancelar}
              className="rounded-lg border border-[#6a645a] bg-white px-4 py-2 text-sm font-medium text-[#5b564d] hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
            >
              {TextoCancelar}
            </button>
            <button
              type="submit"
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] ${
                EsPeligro
                  ? "bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
                  : "bg-[#1c1a16] hover:bg-[#2d2a26] focus-visible:outline-[#b88f3a]"
              }`}
            >
              {TextoConfirmar}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
