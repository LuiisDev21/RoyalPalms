import type { Metadata } from "next";
import { BarraNavegacion } from "@/Componentes/Comunes/BarraNavegacion";
import { PiePagina } from "@/Componentes/Comunes/PiePagina";

export const metadata: Metadata = {
  title: "Política de Privacidad | Royal Palm",
  description:
    "Política de privacidad y protección de datos de Royal Palm.",
};

const ClaseSeccion =
  "mx-auto max-w-3xl px-6 py-16 md:py-20 first:pt-16 md:first:pt-20";

export default function PaginaPoliticaPrivacidad() {
  return (
    <main className="min-h-screen">
      <BarraNavegacion />
      <header className="bg-[#1c1a16] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.35em] text-white/70">
            INFORMACIÓN LEGAL
          </p>
          <h1 className="FuenteTitulo mt-4 text-4xl leading-none text-white md:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-sm text-white/70">
            Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </header>

      <article className="bg-[#ffffff]">
        <section className={ClaseSeccion}>
          <h2 className="FuenteTitulo text-2xl text-[#1c1a16] md:text-3xl">
            Introducción
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-[#5b564d] md:text-base">
            En Royal Palm nos comprometemos a proteger la privacidad de nuestros
            huéspedes y visitantes. Esta política describe cómo recopilamos,
            utilizamos y protegemos la información personal que nos proporcionas
            al utilizar nuestros servicios o visitar nuestro sitio web.
          </p>
        </section>

        <section className={`${ClaseSeccion} bg-[#f6f2ec]`}>
          <h2 className="FuenteTitulo text-2xl text-[#1c1a16] md:text-3xl">
            Información que recopilamos
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-[#5b564d] md:text-base">
            Podemos recopilar información personal como nombre, correo
            electrónico, número de teléfono, datos de reserva y preferencias de
            estancia cuando realizas una reserva, te suscribes a nuestra
            newsletter o nos contactas a través de nuestro sitio web.
          </p>
        </section>

        <section className={ClaseSeccion}>
          <h2 className="FuenteTitulo text-2xl text-[#1c1a16] md:text-3xl">
            Uso de la información
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-[#5b564d] md:text-base">
            Utilizamos la información recopilada para gestionar reservas,
            mejorar nuestros servicios, enviar comunicaciones relacionadas con tu
            estancia y cumplir con obligaciones legales. No vendemos ni
            compartimos tu información personal con terceros con fines
            comerciales.
          </p>
        </section>

        <section className={`${ClaseSeccion} bg-[#f6f2ec]`}>
          <h2 className="FuenteTitulo text-2xl text-[#1c1a16] md:text-3xl">
            Cookies y tecnologías similares
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-[#5b564d] md:text-base">
            Nuestro sitio web puede utilizar cookies y tecnologías similares
            para mejorar tu experiencia de navegación. Puedes configurar tu
            navegador para rechazar cookies, aunque esto puede afectar algunas
            funcionalidades del sitio.
          </p>
        </section>

        <section className={ClaseSeccion}>
          <h2 className="FuenteTitulo text-2xl text-[#1c1a16] md:text-3xl">
            Tus derechos
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-[#5b564d] md:text-base">
            Tienes derecho a acceder, rectificar, suprimir o limitar el
            tratamiento de tus datos personales. Para ejercer estos derechos o
            realizar cualquier consulta sobre nuestra política de privacidad,
            puedes contactarnos a través de los canales indicados en nuestra
            sección de contacto.
          </p>
        </section>

        <section className={`${ClaseSeccion} border-t border-[#6a645a]/20`}>
          <p className="text-sm leading-relaxed text-[#5b564d] md:text-base">
            Si tienes preguntas sobre esta política de privacidad, no dudes en
            contactarnos.
          </p>
        </section>
      </article>

      <PiePagina />
    </main>
  );
}
