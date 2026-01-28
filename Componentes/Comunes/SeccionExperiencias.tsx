import Image from "next/image";

function TarjetaExperiencia({
  RutaIcono,
  Titulo,
  Descripcion,
}: {
  RutaIcono: string;
  Titulo: string;
  Descripcion: string;
}) {
  return (
    <article className="text-center">
      <div className="relative mx-auto h-20 w-20">
        <Image
          src={RutaIcono}
          alt=""
          aria-hidden="true"
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>
      <h3 className="FuenteTitulo mt-5 text-sm text-[#1c1a16]">{Titulo}</h3>
      <p className="mx-auto mt-3 max-w-[22ch] text-xs leading-relaxed text-[#5b564d]">
        {Descripcion}
      </p>
    </article>
  );
}

export function SeccionExperiencias() {
  return (
    <section className="bg-[#f6f2ec] px-6 py-20" aria-label="Experiencias">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs tracking-[0.35em] text-[#b88f3a]">
            EXPERIENCIAS
          </p>
          <h2 className="FuenteTitulo mt-3 text-3xl text-[#1c1a16] md:text-4xl">
            Más que un hotel
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#5b564d]">
            Descubre todo lo que Royal Palm tiene para ofrecerte
          </p>
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-4">
          <TarjetaExperiencia
            RutaIcono="/bed.svg"
            Titulo="Servicio Premium"
            Descripcion="Atención personalizada las 24 horas para hacer de tu estancia una experiencia única."
          />
          <TarjetaExperiencia
            RutaIcono="/food.svg"
            Titulo="Gastronomía Exquisita"
            Descripcion="Restaurantes de clase mundial con cocina internacional y local de primer nivel."
          />
          <TarjetaExperiencia
            RutaIcono="/spa.svg"
            Titulo="Spa & Bienestar"
            Descripcion="Centro de bienestar completo con tratamientos exclusivos y piscina infinita."
          />
          <TarjetaExperiencia
            RutaIcono="/nature.svg"
            Titulo="Sostenibilidad"
            Descripcion="Comprometidos con el medio ambiente y prácticas responsables en cada detalle."
          />
        </div>
      </div>
    </section>
  );
}
