import Image from "next/image";

export function HeroContacto() {
  return (
    <section className="relative h-[50vh] min-h-[320px] overflow-hidden">
      <Image
        src="/HotelHero.jpg"
        alt="Royal Palm"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <p className="text-xs tracking-[0.35em] text-white/70">
          CONTACTO
        </p>
        <h1 className="FuenteTitulo mt-4 text-4xl leading-none text-white md:text-6xl">
          Hablemos
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/80 md:text-base">
          Estamos aquí para ayudarte a planificar tu próxima estancia, evento
          o experiencia en Royal Palm.
        </p>
      </div>
    </section>
  );
}

