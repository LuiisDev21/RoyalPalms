import React from "react";
import { BarraNavegacion } from "@/Componentes/Comunes/BarraNavegacion";

export const metadata = {
  title: "Política de Privacidad - RoyalPalms",
};

export default function PoliticaPrivacidadPage() {
  return (
    <main className="min-h-screen bg-white text-[#1c1a16]">
  {/* margen superior dorado para que la barra fija sea visible */}
  <div className="h-20 sm:h-24 bg-[#bf9a4f]" aria-hidden="true" />
      <BarraNavegacion ForzarTemaClaro />
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold mb-4">Política de Privacidad</h1>

        <p className="mb-4">
          En RoyalPalms respetamos su privacidad y nos comprometemos a proteger los
          datos personales que usted nos confía. Esta política de privacidad explica qué
          información recopilamos, con qué finalidad, cómo la usamos y qué derechos tiene
          como titular de los datos.
        </p>

        <h2 className="mt-6 font-medium">1. Responsable del tratamiento</h2>
        <p className="mb-4">
          El responsable del tratamiento de sus datos es RoyalPalms (en adelante, "el
          Hotel"). Si tiene preguntas sobre el tratamiento de sus datos, puede
          contactarnos a través de los canales oficiales disponibles en nuestra web.
        </p>

        <h2 className="mt-6 font-medium">2. Datos que recopilamos</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Datos de contacto: nombre, correo electrónico, teléfono.</li>
          <li>Datos de reserva: fechas, tipo de habitación, preferencias.</li>
          <li>
            Datos de facturación: dirección y, cuando proceda, información necesaria
            para emitir facturas.
          </li>
          <li>Información de uso: datos de navegación, cookies y preferencias en el sitio web.</li>
        </ul>

        <h2 className="mt-6 font-medium">3. Finalidades del tratamiento</h2>
        <p className="mb-4">
          Tratamos sus datos personales para las siguientes finalidades: gestionar sus
          reservas y estancias, emitir facturas, comunicarnos con usted (confirmaciones,
          cambios o comunicaciones comerciales cuando haya dado su consentimiento),
          mejorar nuestros servicios y enviarle información relevante sobre promociones
          y novedades si lo autoriza.
        </p>

        <h2 className="mt-6 font-medium">4. Legitimación</h2>
        <p className="mb-4">
          El tratamiento se basa en la ejecución del contrato de hospedaje y, cuando
          proceda, en el consentimiento del interesado para el envío de comunicaciones
          comerciales. También podremos tratar datos para el cumplimiento de obligaciones
          legales (por ejemplo, fiscalidad y seguridad).
        </p>

        <h2 className="mt-6 font-medium">5. Conservación de los datos</h2>
        <p className="mb-4">
          Conservaremos sus datos solamente durante el tiempo necesario para cumplir las
          finalidades para las que se recabaron y para cumplir con las obligaciones
          legales aplicables. Los plazos pueden variar según la naturaleza del dato y la
          finalidad (por ejemplo, obligaciones fiscales o de comprobación contable).
        </p>

        <h2 className="mt-6 font-medium">6. Cesiones y transferencias</h2>
        <p className="mb-4">
          No venderemos ni cederemos sus datos a terceros para fines comerciales sin su
          consentimiento. Podemos compartir datos con proveedores y prestadores de
          servicios que ayudan a operar el hotel (sistemas de reservas, pasarelas de
          pago, servicios de limpieza, etc.) bajo garantías de confidencialidad y
          seguridad. Si realizamos transferencias internacionales de datos, se hará
          conforme a la normativa aplicable y con las salvaguardias necesarias.
        </p>

        <h2 className="mt-6 font-medium">7. Cookies y tecnologías similares</h2>
        <p className="mb-4">
          Utilizamos cookies propias y de terceros para asegurar el correcto funcionamiento
          del sitio, analizar su uso y ofrecerle contenidos personalizados. Puede gestionar
          o rechazar las cookies mediante la configuración de su navegador o la herramienta
          de consentimiento disponible en la web.
        </p>

        <h2 className="mt-6 font-medium">8. Medidas de seguridad</h2>
        <p className="mb-4">
          Implementamos medidas técnicas y organizativas razonables para proteger sus
          datos contra pérdidas, accesos no autorizados o divulgaciones. Sin embargo,
          ningún sistema es 100% seguro; le recomendamos extremar precauciones al
          compartir información sensible.
        </p>

        <h2 className="mt-6 font-medium">9. Derechos del interesado</h2>
        <p className="mb-4">
          Usted tiene derecho a acceder, rectificar y suprimir los datos, así como a
          limitar u oponerse a su tratamiento, y a la portabilidad de los datos cuando
          proceda. Para ejercer estos derechos puede contactarnos y facilitarnos una
          copia de su documento de identidad u otro medio que acredite su identidad.
        </p>

        <h2 className="mt-6 font-medium">10. Conservación y cambios en la política</h2>
        <p className="mb-4">
          Podemos actualizar esta política de privacidad para reflejar cambios legales,
          regulatorios o de nuestros servicios. Publicaremos la versión actualizada en
          esta misma página con la fecha de última revisión.
        </p>

        <h2 className="mt-6 font-medium">11. Contacto</h2>
        <p className="mb-4">
          Para cualquier consulta sobre esta política o sobre sus datos personales,
          puede ponerse en contacto con nosotros en: <strong>reservas@royalpalms.example</strong>
          o llamando al número de atención al cliente que figura en nuestra web.
        </p>

        <p className="mt-6 italic">Última actualización: 27 de febrero de 2026</p>
      </section>
    </main>
  );
}
