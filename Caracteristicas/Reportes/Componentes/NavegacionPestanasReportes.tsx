"use client";

export type TipoPestanaReporte =
  | "resumen"
  | "ingresos"
  | "ocupacion"
  | "clientes"
  | "analitica";

interface PestanaItem {
  Valor: TipoPestanaReporte;
  Etiqueta: string;
}

const Pestanas: PestanaItem[] = [
  { Valor: "resumen", Etiqueta: "Resumen" },
  { Valor: "ingresos", Etiqueta: "Ingresos" },
  { Valor: "ocupacion", Etiqueta: "Ocupación" },
  { Valor: "clientes", Etiqueta: "Clientes" },
  { Valor: "analitica", Etiqueta: "Analítica avanzada" },
];

interface NavegacionPestanasReportesProps {
  PestanaActiva: TipoPestanaReporte;
  AlCambiarPestana: (Pestana: TipoPestanaReporte) => void;
}

export function NavegacionPestanasReportes({
  PestanaActiva,
  AlCambiarPestana,
}: NavegacionPestanasReportesProps) {
  return (
    <div className="mt-6 border-b border-[#e5e0d8]">
      <div className="flex flex-wrap gap-2">
        {Pestanas.map((Pestana) => (
          <button
            key={Pestana.Valor}
            type="button"
            onClick={() => AlCambiarPestana(Pestana.Valor)}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              PestanaActiva === Pestana.Valor
                ? "bg-white text-[#1c1a16] border border-[#e5e0d8] border-b-white"
                : "text-[#5b564d] hover:text-[#1c1a16]"
            }`}
          >
            {Pestana.Etiqueta}
          </button>
        ))}
      </div>
    </div>
  );
}
