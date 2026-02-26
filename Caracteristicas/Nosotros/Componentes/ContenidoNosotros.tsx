import { EnlaceReservarAhora } from "@/Componentes/Base/EnlaceReservarAhora";
import { BloqueSeccion } from "./BloqueSeccion";

const ClaseSeccion =
  "mx-auto max-w-3xl px-6 py-16 md:py-20 first:pt-16 md:first:pt-20";

export function ContenidoNosotros() {
  return (
    <article className="bg-[#ffffff]">
      <section
        className={`${ClaseSeccion} border-b border-[#6a645a]/20`}
        aria-label="Introducción"
      >
        <blockquote className="FuenteTitulo text-xl leading-relaxed text-[#1c1a16] md:text-2xl">
          En <strong>Royal Palm</strong>, no solo abrimos las puertas a una
          habitación; abrimos las puertas a un mundo donde el tiempo
          desacelera, el confort envuelve cada instante y la naturaleza abraza
          cada experiencia. Somos más que un destino: somos un santuario creado
          para quienes entienden que el verdadero lujo reside en la tranquilidad,
          la atención personalizada y los momentos que perduran en la memoria.
        </blockquote>
        <p className="mt-8 text-sm leading-relaxed text-[#5b564d] md:text-base">
          Cada amanecer en Royal Palm es una invitación a reconectar contigo
          mismo. Cada espacio ha sido concebido no solo para alojarte, sino para
          acogerte. Aquí, el descanso no es una promesa: es una certeza.
        </p>
      </section>

      <section className={ClaseSeccion}>
        <BloqueSeccion
          Etiqueta="NUESTRA HISTORIA"
          Titulo="El Origen de un Oasis"
          IdSeccion="historia"
          Hijos={
            <>
              <p>
                Royal Palm nació de una visión clara y apasionada: crear un
                refugio donde la sofisticación contemporánea conviviera en perfecta
                armonía con la serenidad natural. Inspirados por la elegancia y
                resiliencia de las palmeras reales —símbolos universales de
                bienvenida, fortaleza y permanencia— dimos vida a un concepto que
                trasciende la hotelería tradicional.
              </p>
              <p>
                Desde nuestros inicios, hemos perseguido un ideal: redefinir el
                significado de hospitalidad. Cada decisión, cada diseño
                arquitectónico, cada textura y cada aroma han sido seleccionados
                cuidadosamente para transmitir equilibrio, calma y exclusividad.
              </p>
              <p>
                Nuestra arquitectura permite que la luz natural fluya libremente,
                creando ambientes cálidos y vivos. Las brisas atraviesan nuestros
                espacios abiertos, recordando constantemente que la naturaleza no es
                un elemento externo, sino parte integral de la experiencia Royal
                Palm.
              </p>
              <p>
                A lo largo de nuestra evolución, hemos incorporado tecnología
                moderna, estándares internacionales y nuevas experiencias, sin
                perder jamás nuestra esencia original: ser un refugio donde cada
                huésped se sienta reconocido, valorado y plenamente en paz.
              </p>
              <p>
                Royal Palm es el escenario perfecto para todos los momentos que
                definen la vida: el descanso que renueva el cuerpo, las
                celebraciones que unen corazones, los viajes que transforman la
                perspectiva, y los instantes silenciosos que devuelven el equilibrio
                interior.
              </p>
              <p>
                Aquí, cada visita no es simplemente una estadía. Es el inicio de
                un vínculo.
              </p>
            </>
          }
        />
      </section>

      <section className={`${ClaseSeccion} bg-[#f6f2ec]`}>
        <BloqueSeccion
          Etiqueta="NUESTRA FILOSOFÍA"
          Titulo="Hospitalidad con Propósito"
          IdSeccion="filosofia"
          Hijos={
            <>
              <p>
                Creemos firmemente que la hospitalidad es un arte, y que cada
                huésped merece una experiencia única, auténtica e inolvidable.
                Nuestra filosofía se basa en crear valor emocional, no solo
                funcional.
              </p>
              <p>
                No ofrecemos únicamente servicios; ofrecemos confianza. No
                proporcionamos solo comodidad; ofrecemos bienestar. No brindamos
                solo alojamiento; ofrecemos pertenencia.
              </p>
              <p>
                Royal Palm existe para convertirse en ese lugar al que siempre
                deseas regresar.
              </p>
            </>
          }
        />
      </section>

      <section className={ClaseSeccion}>
        <BloqueSeccion
          Etiqueta="NUESTRO PROPÓSITO"
          Titulo="Misión"
          IdSeccion="mision"
          Hijos={
            <>
              <p>
                Nuestra misión es transformar cada estancia en una experiencia
                extraordinaria que nutra el bienestar físico, emocional y mental de
                nuestros huéspedes. Lo logramos mediante un servicio anticipatorio,
                humano y altamente personalizado, instalaciones cuidadosamente
                diseñadas y un entorno que inspira tranquilidad, exclusividad y
                armonía.
              </p>
              <p>
                Nos comprometemos a superar expectativas no como un objetivo, sino
                como un estándar diario. Cada sonrisa, cada detalle y cada
                interacción están guiados por el deseo genuino de crear momentos
                significativos.
              </p>
            </>
          }
        />
      </section>

      <section className={ClaseSeccion}>
        <BloqueSeccion
          Titulo="Visión"
          IdSeccion="vision"
          Hijos={
            <>
              <p>
                Aspiramos a consolidarnos como el referente absoluto de
                hospitalidad, confort y excelencia en la región, siendo reconocidos
                no solo por nuestras instalaciones y servicios, sino por la
                experiencia emocional que ofrecemos.
              </p>
              <p>
                Buscamos ser un símbolo de confianza, innovación y bienestar,
                impactando positivamente en nuestros huéspedes, nuestro equipo
                humano y la comunidad que nos rodea.
              </p>
              <p>
                Nuestro objetivo es que Royal Palm no sea simplemente un hotel,
                sino un legado de hospitalidad.
              </p>
            </>
          }
        />
      </section>

      <section className={`${ClaseSeccion} bg-[#f6f2ec]`}>
        <p className="text-xs tracking-[0.35em] text-[#b88f3a]">
          LOS PILARES DE ROYAL PALM
        </p>
        <h2 className="FuenteTitulo mt-3 text-2xl leading-tight text-[#1c1a16] md:text-3xl">
          Nuestra identidad
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-[#5b564d] md:text-base">
          Nuestra identidad se sostiene sobre valores fundamentales que definen
          cada acción, cada decisión y cada experiencia:
        </p>

        <div className="mt-12 space-y-12">
          <BloqueSeccion
            Titulo="Hospitalidad Genuina y Empática"
            IdSeccion="pilar-hospitalidad"
            NivelTitulo="h3"
            Hijos={
              <>
                <p>
                  El verdadero lujo no reside en los objetos, sino en las personas.
                  Nos esforzamos por comprender profundamente las necesidades de
                  cada huésped, anticiparnos a ellas y brindar una atención
                  cálida, humana y memorable.
                </p>
                <p>
                  Cada huésped es único, y cada experiencia también debe serlo.
                </p>
              </>
            }
          />

          <BloqueSeccion
            Titulo="Excelencia en Cada Detalle"
            IdSeccion="pilar-excelencia"
            NivelTitulo="h3"
            Hijos={
              <>
                <p>
                  La excelencia no es un acto aislado, sino una cultura permanente.
                  Desde la suavidad de nuestras sábanas hasta la iluminación de
                  cada espacio, cada elemento ha sido seleccionado para crear una
                  atmósfera de armonía y perfección.
                </p>
                <p>
                  Creemos que los pequeños detalles crean las grandes experiencias.
                </p>
              </>
            }
          />

          <BloqueSeccion
            Titulo="Conexión con la Naturaleza"
            IdSeccion="pilar-naturaleza"
            NivelTitulo="h3"
            Hijos={
              <>
                <p>
                  Entendemos que la naturaleza es fuente de equilibrio, serenidad y
                  renovación. Por ello, nuestros espacios integran elementos
                  naturales que promueven el bienestar, reducen el estrés y generan
                  una sensación de paz profunda.
                </p>
                <p>
                  Royal Palm es un puente entre el confort moderno y la esencia
                  natural.
                </p>
              </>
            }
          />

          <BloqueSeccion
            Titulo="Sostenibilidad y Responsabilidad"
            IdSeccion="pilar-sostenibilidad"
            NivelTitulo="h3"
            Hijos={
              <>
                <p>
                  Nos comprometemos con prácticas responsables que protegen el
                  entorno y fortalecen la comunidad local. Implementamos estrategias
                  sostenibles en el uso de recursos, apoyamos proveedores locales y
                  promovemos un modelo de desarrollo consciente y respetuoso.
                </p>
                <p>Creemos en un lujo que respeta el futuro.</p>
              </>
            }
          />

          <BloqueSeccion
            Titulo="Innovación y Evolución Continua"
            IdSeccion="pilar-innovacion"
            NivelTitulo="h3"
            Hijos={
              <>
                <p>
                  Honramos la tradición de la hospitalidad clásica mientras
                  adoptamos la innovación tecnológica para ofrecer experiencias
                  modernas, eficientes y fluidas.
                </p>
                <p>
                  Desde sistemas de reserva inteligentes hasta servicios
                  personalizados, evolucionamos constantemente para servir mejor.
                </p>
              </>
            }
          />
        </div>
      </section>

      <section className={ClaseSeccion}>
        <p className="text-xs tracking-[0.35em] text-[#b88f3a]">
          LA EXPERIENCIA ROYAL PALM
        </p>
        <h2 className="FuenteTitulo mt-3 text-2xl leading-tight text-[#1c1a16] md:text-3xl">
          Una experiencia integral
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-[#5b564d] md:text-base">
          Hospedarse en Royal Palm es sumergirse en una experiencia integral
          diseñada para revitalizar los sentidos y elevar el bienestar.
        </p>

        <div className="mt-12 space-y-12">
          <BloqueSeccion
            Titulo="Espacios Diseñados para el Descanso"
            IdSeccion="exp-descanso"
            NivelTitulo="h3"
            Hijos={
              <p>
                Nuestras habitaciones y suites han sido concebidas como refugios
                privados de calma, donde el diseño, la iluminación y el confort
                trabajan en perfecta armonía para garantizar un descanso profundo y
                reparador.
              </p>
            }
          />

          <BloqueSeccion
            Titulo="Gastronomía que Inspira"
            IdSeccion="exp-gastronomia"
            NivelTitulo="h3"
            Hijos={
              <p>
                Nuestra propuesta culinaria combina sabores auténticos, ingredientes
                frescos y técnicas contemporáneas, ofreciendo experiencias
                gastronómicas que deleitan el paladar y enriquecen cada estancia.
                Cada platillo cuenta una historia.
              </p>
            }
          />

          <BloqueSeccion
            Titulo="Ambientes que Invitan a Permanecer"
            IdSeccion="exp-ambientes"
            NivelTitulo="h3"
            Hijos={
              <p>
                Desde áreas de descanso hasta espacios sociales cuidadosamente
                diseñados, cada rincón de Royal Palm invita a la contemplación, la
                conexión y el disfrute. Aquí, el tiempo no se mide en horas, sino
                en momentos.
              </p>
            }
          />

          <BloqueSeccion
            Titulo="Eventos que Trascienden"
            IdSeccion="exp-eventos"
            NivelTitulo="h3"
            Hijos={
              <p>
                Royal Palm es el escenario ideal para celebraciones, encuentros
                corporativos y momentos significativos. Nuestro equipo especializado
                se encarga de cada detalle para garantizar experiencias impecables
                e inolvidables.
              </p>
            }
          />
        </div>
      </section>

      <section className={`${ClaseSeccion} bg-[#f6f2ec]`}>
        <BloqueSeccion
          Etiqueta="NUESTRO EQUIPO"
          Titulo="El Alma de Royal Palm"
          IdSeccion="equipo"
          Hijos={
            <>
              <p>
                El verdadero corazón de Royal Palm no reside en su arquitectura,
                sino en las personas que lo hacen posible.
              </p>
              <p>
                Nuestro equipo está conformado por profesionales comprometidos,
                apasionados y profundamente dedicados a la excelencia. Cada miembro
                comparte una vocación común: servir con integridad, calidez y
                profesionalismo.
              </p>
              <p>
                Trabajamos en armonía, las 24 horas del día, guiados por un
                propósito claro: convertir cada estancia en una experiencia
                excepcional.
              </p>
              <p>Más que un equipo, somos guardianes de tu bienestar.</p>
            </>
          }
        />
      </section>

      <section
        className={`${ClaseSeccion} border-t border-[#6a645a]/20`}
        aria-label="Cierre"
      >
        <p className="FuenteTitulo text-xl leading-relaxed text-[#1c1a16] md:text-2xl">
          Royal Palm no es solo un lugar donde alojarse. Es un lugar donde
          descansar, reconectar y renovarse.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-[#5b564d] md:text-base">
          Es el espacio donde el confort se encuentra con la elegancia. Donde la
          tranquilidad se encuentra con la excelencia. Donde cada huésped se
          convierte en parte de nuestra historia.
        </p>
        <p className="mt-8 FuenteTitulo text-lg text-[#1c1a16] md:text-xl">
          Te invitamos a descubrir una nueva dimensión de hospitalidad. Te
          invitamos a descubrir Royal Palm.
        </p>
        <p className="mt-4 text-sm italic text-[#6a645a] md:text-base">
          Bienvenido a tu refugio. Bienvenido a tu hogar lejos de casa.
        </p>
        <div className="mt-12">
          <EnlaceReservarAhora
            className="inline-flex items-center justify-center rounded-md bg-[#b88f3a]/90 px-6 py-3 text-sm text-white transition-colors hover:bg-[#c59a42]/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
          >
            Reservar Ahora
          </EnlaceReservarAhora>
        </div>
      </section>
    </article>
  );
}
