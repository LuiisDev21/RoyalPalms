import Image from "next/image";
import { BotonEnlace } from "@/Componentes/Base/BotonEnlace";

function IndicadorEstadistica({
  Valor,
  Etiqueta,
}: {
  Valor: string;
  Etiqueta: string;
}) {
  return (
    <div>
      <div className="FuenteTitulo text-2xl text-[#b88f3a] md:text-3xl">
        {Valor}
      </div>
      <div className="mt-1 text-[11px] text-[#6a645a]">{Etiqueta}</div>
    </div>
  );
}

export function SeccionHistoria() {
  return (
    <section id="Nosotros" className="bg-[#ffffff] px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative mx-auto w-full max-w-xl">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <Image
              src="/1.png"
              alt="Vista del resort"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 520px, 90vw"
            />
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.35em] text-[#b88f3a]">
            NUESTRA HISTORIA
          </p>
          <h2 className="FuenteTitulo mt-3 text-3xl leading-tight text-[#1c1a16] md:text-4xl">
            Un legado de elegancia y hospitalidad
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#5b564d]">
            <p>
              Desde nuestra fundación, Royal Palm ha sido sinónimo de excelencia
              y sofisticación. Ubicado en un entorno natural privilegiado,
              nuestro hotel combina el lujo contemporáneo con la calidez de la
              hospitalidad tradicional.
            </p>
            <p>
              Cada rincón de nuestras instalaciones ha sido diseñado pensando en
              tu bienestar, desde las amplias habitaciones con vistas panorámicas
              hasta nuestros espacios de relajación y gastronomía de clase
              mundial.
            </p>
          </div>

          <div className="mt-10 flex items-center gap-10">
            <IndicadorEstadistica Valor="25+" Etiqueta="Años de experiencia" />
            <IndicadorEstadistica Valor="120" Etiqueta="Habitaciones de lujo" />
            <IndicadorEstadistica Valor="98%" Etiqueta="Huéspedes satisfechos" />
          </div>

          <div className="mt-10">
            <BotonEnlace
              HRef="/#ConocerMas"
              Texto="Conocer Más"
              Variante="Dorado"
              Tamano="Mediano"
              ClaseAdicional="rounded-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
