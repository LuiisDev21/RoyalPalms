import Link from "next/link";
import type { ReactNode } from "react";

type VarianteBoton = "Dorado" | "ContornoClaro";
type TamanoBoton = "Mediano" | "Grande";

function UnirClases(...Clases: Array<string | undefined | false>) {
  return Clases.filter(Boolean).join(" ");
}

function ClasesPorVariante(Variante: VarianteBoton) {
  if (Variante === "Dorado") {
    return "bg-[#b88f3a]/90 text-white hover:bg-[#c59a42]/95 focus-visible:outline-white";
  }
  return "border border-white/70 text-white hover:bg-white/10 focus-visible:outline-white";
}

function ClasesPorTamano(Tamano: TamanoBoton) {
  if (Tamano === "Grande") {
    return "px-6 py-3 text-sm";
  }
  return "px-4 py-2 text-sm";
}

export function BotonEnlace({
  HRef,
  Texto,
  Variante = "Dorado",
  Tamano = "Mediano",
  ClaseAdicional,
}: {
  HRef: string;
  Texto: ReactNode;
  Variante?: VarianteBoton;
  Tamano?: TamanoBoton;
  ClaseAdicional?: string;
}) {
  return (
    <Link
      href={HRef}
      className={UnirClases(
        "inline-flex items-center justify-center rounded-md transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        ClasesPorVariante(Variante),
        ClasesPorTamano(Tamano),
        ClaseAdicional,
      )}
    >
      {Texto}
    </Link>
  );
}
