import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarraNavegacion } from "@/Componentes/Comunes/BarraNavegacion";
import { PiePagina } from "@/Componentes/Comunes/PiePagina";
import { SeccionGenerarCotizacion } from "@/Caracteristicas/Habitaciones/Componentes/SeccionGenerarCotizacion";
import { ObtenerHabitacion } from "@/Servicios/HabitacionesServicio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const Id = parseInt(id, 10);
  if (Number.isNaN(Id)) return { title: "Habitación | Royal Palm" };
  const Habitacion = await ObtenerHabitacion(Id);
  const Titulo = Habitacion
    ? `Habitación ${Habitacion.numero} | Royal Palm`
    : "Habitación | Royal Palm";
  return { title: Titulo };
}

export default async function PaginaDetalleHabitacion({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const Parametros = await searchParams;
  const Id = parseInt(id, 10);
  if (Number.isNaN(Id)) notFound();

  const Habitacion = await ObtenerHabitacion(Id);
  if (!Habitacion) notFound();

  const Entrada = typeof Parametros.entrada === "string" ? Parametros.entrada : null;
  const Salida = typeof Parametros.salida === "string" ? Parametros.salida : null;

  const Precio = parseFloat(Habitacion.precio_por_noche);
  const PrecioFormato = Number.isNaN(Precio) ? "—" : `$${Precio.toFixed(0)}`;
  const EstaDisponible = Habitacion.estado === "disponible";

  return (
    <main
      className="min-h-screen bg-white"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, #bf9a4f 0%, #bf9a4f 100px, transparent 100px),
          radial-gradient(circle at center, rgba(106, 100, 90, 0.2) 1.5px, transparent 1.5px)
        `,
        backgroundSize: "100% 100%, 20px 20px",
      }}
    >
      <BarraNavegacion />
      <article className="mx-auto max-w-4xl px-4 pt-32 pb-16 sm:px-6 md:pt-40">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
          <div className="relative aspect-[16/9] bg-[#f6f2ec]">
            {Habitacion.imagen_url ? (
              <Image
                src={Habitacion.imagen_url}
                alt={`Habitación ${Habitacion.numero}`}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[#6a645a]/50">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-8 md:p-10">
            <h1 className="FuenteTitulo text-3xl text-[#1c1a16] md:text-4xl">
              Habitación {Habitacion.numero}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {Habitacion.tipo_nombre && (
                <span className="rounded-full border border-[#b88f3a]/20 bg-[#b88f3a]/12 px-3 py-1 text-sm font-medium text-[#b88f3a]">
                  {Habitacion.tipo_nombre}
                </span>
              )}
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  Habitacion.estado === "disponible"
                    ? "bg-[#2d5a3d]/12 text-[#2d5a3d]"
                    : "bg-[#6a645a]/12 text-[#5b564d]"
                }`}
              >
                {Habitacion.estado === "disponible"
                  ? "Disponible"
                  : Habitacion.estado.charAt(0).toUpperCase() +
                    Habitacion.estado.slice(1).replace(/_/g, " ")}
              </span>
            </div>
            {Habitacion.descripcion && (
              <p className="mt-6 leading-relaxed text-[#5b564d]">
                {Habitacion.descripcion}
              </p>
            )}
            <ul className="mt-8 flex flex-wrap gap-4 text-sm text-[#5b564d]">
              <li>Capacidad: {Habitacion.capacidad} huésped{Habitacion.capacidad !== 1 ? "es" : ""}</li>
              {Habitacion.politica_nombre && (
                <li>Política de cancelación: {Habitacion.politica_nombre}</li>
              )}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <p className="FuenteTitulo text-2xl text-[#b88f3a]">
                {PrecioFormato}/noche
              </p>
              {EstaDisponible ? (
                <Link
                  href="/#Reservar"
                  className="inline-flex items-center justify-center rounded-lg bg-[#b88f3a] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#a67c32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
                >
                  Reservar ahora
                </Link>
              ) : (
                <span
                  className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-[#6a645a]/30 bg-[#6a645a]/10 px-6 py-3 text-sm font-medium text-[#5b564d]"
                  aria-disabled="true"
                >
                  No disponible para reservar
                </span>
              )}
              <Link
                href="/habitaciones"
                className="inline-flex items-center justify-center rounded-lg border border-[#6a645a]/30 bg-white px-6 py-3 text-sm font-medium text-[#5b564d] transition-colors hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
              >
                Ver más habitaciones
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <SeccionGenerarCotizacion
          Habitacion={Habitacion}
          FechaEntradaInicial={Entrada}
          FechaSalidaInicial={Salida}
          Deshabilitado={!EstaDisponible}
          />
        </div>
      </article>
      <PiePagina />
    </main>
  );
}
