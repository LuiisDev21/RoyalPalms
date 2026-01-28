function IconoServicioPremium() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2l1.2 4.4L18 8l-4.8 1.6L12 14l-1.2-4.4L6 8l4.8-1.6L12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M20 12l.7 2.6L23 15.4l-2.3.8L20 18l-.7-2.6L17 15.4l2.3-.8L20 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoGastronomia() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 3v8M10 3v8M7 7h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16 3v8c0 2 2 2 2 0V3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8.5 13v8M17 13v8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconoSpa() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 15c2-2 6-2 8 0s6 2 8 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M4 19c2-2 6-2 8 0s6 2 8 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M4 11c2-2 6-2 8 0s6 2 8 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconoSostenibilidad() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 4c-6 1-10 4-12 7-2.4 3.6-.6 8 3.8 9 4.2 1 8.8-1.7 8.2-6.8C19.6 10 17.4 7 12 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 15c2-1 5-3 7-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TarjetaExperiencia({
  Icono,
  Titulo,
  Descripcion,
}: {
  Icono: React.ReactNode;
  Titulo: string;
  Descripcion: string;
}) {
  return (
    <article className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d9c19a]/25 text-[#b88f3a]">
        {Icono}
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
            Icono={<IconoServicioPremium />}
            Titulo="Servicio Premium"
            Descripcion="Atención personalizada las 24 horas para hacer de tu estancia una experiencia única."
          />
          <TarjetaExperiencia
            Icono={<IconoGastronomia />}
            Titulo="Gastronomía Exquisita"
            Descripcion="Restaurantes de clase mundial con cocina internacional y local de primer nivel."
          />
          <TarjetaExperiencia
            Icono={<IconoSpa />}
            Titulo="Spa & Bienestar"
            Descripcion="Centro de bienestar completo con tratamientos exclusivos y piscina infinita."
          />
          <TarjetaExperiencia
            Icono={<IconoSostenibilidad />}
            Titulo="Sostenibilidad"
            Descripcion="Comprometidos con el medio ambiente y prácticas responsables en cada detalle."
          />
        </div>
      </div>
    </section>
  );
}
