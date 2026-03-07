import type { ReactNode } from "react";

const ClaseTitulo =
  "FuenteTitulo mt-3 text-2xl leading-tight text-[#1c1a16] md:text-3xl";
const ClaseTituloSub =
  "FuenteTitulo mt-6 text-xl leading-tight text-[#1c1a16] md:text-2xl";

export function BloqueSeccion({
  Etiqueta,
  Titulo,
  IdSeccion,
  NivelTitulo = "h2",
  Hijos,
  ClaseContenedor,
}: {
  Etiqueta?: string;
  Titulo?: string;
  IdSeccion?: string;
  NivelTitulo?: "h2" | "h3";
  Hijos: ReactNode;
  ClaseContenedor?: string;
}) {
  const EtiquetaTitulo = NivelTitulo;
  const ClaseTituloFinal = NivelTitulo === "h3" ? ClaseTituloSub : ClaseTitulo;

  return (
    <section
      className={ClaseContenedor}
      aria-labelledby={Titulo && IdSeccion ? IdSeccion : undefined}
    >
      {Etiqueta && (
        <p className="text-xs tracking-[0.35em] text-[#b88f3a]">{Etiqueta}</p>
      )}
      {Titulo && (
        <EtiquetaTitulo
          id={IdSeccion}
          className={ClaseTituloFinal}
        >
          {Titulo}
        </EtiquetaTitulo>
      )}
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#5b564d] md:text-base">
        {Hijos}
      </div>
    </section>
  );
}
