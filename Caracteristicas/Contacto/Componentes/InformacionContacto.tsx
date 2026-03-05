const ClaseTituloSeccion =
  "text-xs tracking-[0.35em] text-[#b88f3a] uppercase";

const ClaseTituloPrincipal =
  "FuenteTitulo mt-3 text-2xl leading-tight text-[#1c1a16] md:text-3xl";

const ClaseTexto =
  "mt-4 text-sm leading-relaxed text-[#5b564d] md:text-base";

export function InformacionContacto() {
  return (
    <section
      className="bg-[#ffffff] px-6 py-16 md:py-20"
      aria-label="Información de contacto"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
        <div>
          <p className={ClaseTituloSeccion}>ESTAMOS PARA TI</p>
          <h2 className={ClaseTituloPrincipal}>Conversemos sobre tu próxima estancia</h2>
          <p className={ClaseTexto}>
            Ya sea que estés planificando una escapada, un evento especial o
            simplemente desees obtener más información sobre Royal Palm, nuestro
            equipo de hospitalidad está listo para atenderte con dedicación y
            calidez.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.25em] text-[#b88f3a]">
                UBICACIÓN
              </p>
              <p className="text-sm text-[#1c1a16] md:text-base">
                Royal Palms Resort and Spa
              </p>
              <p className="text-sm text-[#5b564d] md:text-base">
                5200 E Camelback Rd,
                <br />
                Phoenix, AZ 85018, Estados Unidos.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.25em] text-[#b88f3a]">
                RESERVAS
              </p>
              <p className="text-sm text-[#1c1a16] md:text-base">
                Teléfono
              </p>
              <p className="text-sm text-[#5b564d] md:text-base">
                +1 (602) 840-3610
              </p>
              <p className="mt-2 text-sm text-[#1c1a16] md:text-base">
                Correo
              </p>
              <p className="text-sm text-[#5b564d] md:text-base">
                reservas@royalpalm.com
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.25em] text-[#b88f3a]">
                ATENCIÓN
              </p>
              <p className="text-sm text-[#1c1a16] md:text-base">
                Horario de atención
              </p>
              <p className="text-sm text-[#5b564d] md:text-base">
                Lunes a domingo, 24 horas.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.25em] text-[#b88f3a]">
                CANALES DIRECTOS
              </p>
              <p className="text-sm text-[#1c1a16] md:text-base">
                Consultas generales
              </p>
              <p className="text-sm text-[#5b564d] md:text-base">
                contacto@royalpalm.com
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e0d7c7] bg-[#f6f2ec] p-6 shadow-sm md:p-8">
          <p className="text-xs tracking-[0.35em] text-[#b88f3a]">
            EXPERIENCIA PERSONALIZADA
          </p>
          <h3 className="FuenteTitulo mt-3 text-xl text-[#1c1a16] md:text-2xl">
            Diseñamos tu estadía a medida
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-[#5b564d] md:text-base">
            Cuéntanos qué tipo de experiencia buscas: una escapada romántica,
            un retiro de bienestar, unas vacaciones en familia o un evento
            corporativo. Nuestro equipo se encargará de cuidar cada detalle.
          </p>
        </div>
      </div>
    </section>
  );
}

