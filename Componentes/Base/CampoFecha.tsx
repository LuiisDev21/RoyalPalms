"use client";

import { format, isValid, parse } from "date-fns";
import { es as esDateFns } from "date-fns/locale";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import type { Matcher } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";

const FormatoVisual = "dd/MM/yyyy";
const FormatoValor = "yyyy-MM-dd";

function parsearFecha(valor: string): Date | undefined {
  if (!valor) return undefined;
  const d = parse(valor, FormatoValor, new Date());
  return isValid(d) ? d : undefined;
}

export function CampoFecha({
  Id,
  Etiqueta,
  Min,
  Max,
  Valor,
  AlCambiar,
  Deshabilitado = false,
  ClaseContenedor,
}: {
  Id: string;
  Etiqueta: string;
  Min?: string;
  Max?: string;
  Valor: string;
  AlCambiar: (valor: string) => void;
  Deshabilitado?: boolean;
  ClaseContenedor?: string;
}) {
  const IdPopover = useId();
  const ContenedorRef = useRef<HTMLDivElement>(null);
  const BotonRef = useRef<HTMLButtonElement>(null);
  const [Abierto, PonerAbierto] = useState(false);
  const [Posicion, PonerPosicion] = useState({ top: 0, left: 0, width: 0 });
  const FechaSeleccionada = parsearFecha(Valor);
  const TextoInput = Valor
    ? (() => {
        const d = parsearFecha(Valor);
        return d ? format(d, FormatoVisual, { locale: esDateFns }) : "";
      })()
    : "";

  const DeshabilitarMatchers = useCallback((): Matcher[] => {
    const Lista: Matcher[] = [];
    if (Min) {
      const FechaMin = parse(Min, FormatoValor, new Date());
      if (isValid(FechaMin)) Lista.push({ before: FechaMin });
    }
    if (Max) {
      const FechaMax = parse(Max, FormatoValor, new Date());
      if (isValid(FechaMax)) Lista.push({ after: FechaMax });
    }
    return Lista;
  }, [Min, Max]);

  const AlSeleccionar = useCallback(
    (fecha: Date | undefined) => {
      if (!fecha) {
        AlCambiar("");
      } else {
        AlCambiar(format(fecha, FormatoValor));
      }
      PonerAbierto(false);
    },
    [AlCambiar]
  );

  useLayoutEffect(() => {
    if (!Abierto || !BotonRef.current) return;
    const Actualizar = () => {
      if (BotonRef.current) {
        const rect = BotonRef.current.getBoundingClientRect();
        PonerPosicion({ top: rect.bottom + 8, left: rect.left, width: rect.width });
      }
    };
    Actualizar();
    window.addEventListener("scroll", Actualizar, true);
    window.addEventListener("resize", Actualizar);
    return () => {
      window.removeEventListener("scroll", Actualizar, true);
      window.removeEventListener("resize", Actualizar);
    };
  }, [Abierto]);

  useEffect(() => {
    if (!Abierto) return;
    const AlClickExterior = (e: MouseEvent) => {
      const popover = document.getElementById(IdPopover);
      if (
        ContenedorRef.current &&
        !ContenedorRef.current.contains(e.target as Node) &&
        popover &&
        !popover.contains(e.target as Node)
      ) {
        PonerAbierto(false);
      }
    };
    document.addEventListener("mousedown", AlClickExterior);
    return () => document.removeEventListener("mousedown", AlClickExterior);
  }, [Abierto, IdPopover]);

  return (
    <div
      className={`relative ${ClaseContenedor ?? "min-w-[140px] w-full flex-shrink-0"}`}
      ref={ContenedorRef}
    >
      <label
        htmlFor={Id}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
      >
        {Etiqueta}
      </label>
      <button
        ref={BotonRef}
        type="button"
        id={Id}
        disabled={Deshabilitado}
        onClick={() => !Deshabilitado && PonerAbierto((a) => !a)}
        aria-expanded={Abierto}
        aria-haspopup="dialog"
        aria-controls={IdPopover}
        aria-label={`${Etiqueta}. ${TextoInput || "Seleccionar fecha"}`}
        className="flex w-full items-center gap-2 rounded-xl border border-[#6a645a]/25 bg-[#f6f2ec]/80 py-2.5 pl-3 pr-10 text-left text-sm text-[#1c1a16] outline-none transition-[border-color,box-shadow] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:ring-2 focus:ring-[#b88f3a]/25 focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className={TextoInput ? "" : "text-[#6a645a]/60"}>
          {TextoInput || "Elegir fecha"}
        </span>
        <span className="pointer-events-none absolute right-3 text-[#6a645a]/70" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
      </button>
      {Abierto &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id={IdPopover}
            role="dialog"
            aria-modal="true"
            aria-label="Calendario"
            className="fixed z-[9999] rounded-xl border border-[#6a645a]/20 bg-white p-3 text-[#1c1a16] shadow-xl"
            style={{
              top: Posicion.top,
              left: Posicion.left,
              ["--rdp-accent-color" as string]: "#b88f3a",
              ["--rdp-accent-background-color" as string]: "rgba(184, 143, 58, 0.15)",
              ["--rdp-today-color" as string]: "#b88f3a",
            }}
          >
            <DayPicker
              mode="single"
              locale={es}
              selected={FechaSeleccionada}
              onSelect={AlSeleccionar}
              disabled={DeshabilitarMatchers().length > 0 ? DeshabilitarMatchers() : undefined}
              defaultMonth={FechaSeleccionada ?? (Min ? parse(Min, FormatoValor, new Date()) : new Date())}
              animate
              className="rdp-root"
            />
          </div>,
          document.body
        )}
    </div>
  );
}
