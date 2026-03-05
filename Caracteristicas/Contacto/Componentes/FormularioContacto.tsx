"use client";

import { FormEvent, useState } from "react";

type EstadoEnvio = "Inactivo" | "Enviando" | "Enviado" | "Error";

export function FormularioContacto() {
  const [Estado, PonerEstado] = useState<EstadoEnvio>("Inactivo");

  function AlEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (Estado === "Enviando") return;
    PonerEstado("Enviando");

    window.setTimeout(() => {
      PonerEstado("Enviado");
      window.setTimeout(() => {
        PonerEstado("Inactivo");
        (evento.target as HTMLFormElement).reset();
      }, 2200);
    }, 1200);
  }

  const EsEnviando = Estado === "Enviando";
  const EsEnviado = Estado === "Enviado";

  return (
    <section
      className="bg-[#f6f2ec] px-6 pb-16 pt-0 md:pb-20"
      aria-label="Formulario de contacto"
    >
      <div className="mx-auto max-w-6xl md:pt-6">
        <div className="rounded-3xl border border-[#e0d7c7] bg-[#ffffff] p-6 shadow-sm md:p-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs tracking-[0.35em] text-[#b88f3a]">
              FORMULARIO DE CONTACTO
            </p>
            <h2 className="FuenteTitulo mt-3 text-2xl leading-tight text-[#1c1a16] md:text-3xl">
              Comparte tus planes con nosotros
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#5b564d] md:text-base">
              Dinos cómo podemos ayudarte y uno de nuestros especialistas se
              pondrá en contacto contigo para acompañarte en cada detalle de tu
              experiencia Royal Palm.
            </p>
          </div>

          <form
            className="grid gap-6 md:grid-cols-2"
            onSubmit={AlEnviar}
            noValidate
          >
            <div className="space-y-1 md:col-span-1">
              <label
                htmlFor="Nombre"
                className="text-xs font-medium tracking-[0.18em] text-[#6a645a]"
              >
                NOMBRE
              </label>
              <input
                id="Nombre"
                name="Nombre"
                type="text"
                required
                autoComplete="given-name"
                className="w-full rounded-xl border border-[#e0d7c7] bg-[#faf6ef] px-3 py-2 text-sm text-[#1c1a16] outline-none transition-colors placeholder:text-[#b3aa9b] focus:border-[#b88f3a] focus:bg-white focus:ring-1 focus:ring-[#b88f3a]"
                placeholder="Nombre"
              />
            </div>

            <div className="space-y-1 md:col-span-1">
              <label
                htmlFor="Apellidos"
                className="text-xs font-medium tracking-[0.18em] text-[#6a645a]"
              >
                APELLIDOS
              </label>
              <input
                id="Apellidos"
                name="Apellidos"
                type="text"
                autoComplete="family-name"
                className="w-full rounded-xl border border-[#e0d7c7] bg-[#faf6ef] px-3 py-2 text-sm text-[#1c1a16] outline-none transition-colors placeholder:text-[#b3aa9b] focus:border-[#b88f3a] focus:bg-white focus:ring-1 focus:ring-[#b88f3a]"
                placeholder="Apellidos"
              />
            </div>

            <div className="space-y-1 md:col-span-1">
              <label
                htmlFor="Correo"
                className="text-xs font-medium tracking-[0.18em] text-[#6a645a]"
              >
                CORREO ELECTRÓNICO
              </label>
              <input
                id="Correo"
                name="Correo"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-[#e0d7c7] bg-[#faf6ef] px-3 py-2 text-sm text-[#1c1a16] outline-none transition-colors placeholder:text-[#b3aa9b] focus:border-[#b88f3a] focus:bg-white focus:ring-1 focus:ring-[#b88f3a]"
                placeholder="nombre@correo.com"
              />
            </div>

            <div className="space-y-1 md:col-span-1">
              <label
                htmlFor="Telefono"
                className="text-xs font-medium tracking-[0.18em] text-[#6a645a]"
              >
                TELÉFONO
              </label>
              <input
                id="Telefono"
                name="Telefono"
                type="tel"
                autoComplete="tel"
                className="w-full rounded-xl border border-[#e0d7c7] bg-[#faf6ef] px-3 py-2 text-sm text-[#1c1a16] outline-none transition-colors placeholder:text-[#b3aa9b] focus:border-[#b88f3a] focus:bg-white focus:ring-1 focus:ring-[#b88f3a]"
                placeholder="+1 ..."
              />
            </div>

            <div className="space-y-1 md:col-span-1">
              <label
                htmlFor="TipoConsulta"
                className="text-xs font-medium tracking-[0.18em] text-[#6a645a]"
              >
                TIPO DE CONSULTA
              </label>
              <select
                id="TipoConsulta"
                name="TipoConsulta"
                className="w-full rounded-xl border border-[#e0d7c7] bg-[#faf6ef] px-3 py-2 text-sm text-[#1c1a16] outline-none transition-colors focus:border-[#b88f3a] focus:bg-white focus:ring-1 focus:ring-[#b88f3a]"
                defaultValue="Estadia"
              >
                <option value="Estadia">Estadía y reservas</option>
                <option value="Evento">Eventos y celebraciones</option>
                <option value="Corporativo">Reservas corporativas</option>
                <option value="Otro">Otra consulta</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label
                htmlFor="Mensaje"
                className="text-xs font-medium tracking-[0.18em] text-[#6a645a]"
              >
                MENSAJE
              </label>
              <textarea
                id="Mensaje"
                name="Mensaje"
                required
                rows={4}
                className="w-full rounded-xl border border-[#e0d7c7] bg-[#faf6ef] px-3 py-2 text-sm text-[#1c1a16] outline-none transition-colors placeholder:text-[#b3aa9b] focus:border-[#b88f3a] focus:bg-white focus:ring-1 focus:ring-[#b88f3a]"
                placeholder="Cuéntanos más sobre lo que necesitas…"
              />
            </div>

            <div className="md:col-span-2 md:flex md:items-center md:justify-between md:gap-4">
              <p className="mb-4 text-xs text-[#8b8372] md:mb-0">
                Al enviar este formulario, aceptas ser contactado por nuestro
                equipo para dar seguimiento a tu solicitud.
              </p>

              <button
                type="submit"
                disabled={EsEnviando}
                className="inline-flex items-center justify-center rounded-full bg-[#b88f3a]/90 px-7 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#c59a42]/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] disabled:cursor-not-allowed disabled:bg-[#c7b07a]"
              >
                {EsEnviando
                  ? "Enviando…"
                  : EsEnviado
                  ? "Enviado"
                  : "Enviar mensaje"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

