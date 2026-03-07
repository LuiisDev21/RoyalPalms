import Image from "next/image";
import Link from "next/link";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";

function Badge({
  Hijos,
  Clase,
}: {
  Hijos: string;
  Clase: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${Clase}`}
    >
      {Hijos}
    </span>
  );
}

function EtiquetaEstado({ Estado }: { Estado: string }) {
  const Clase =
    Estado === "disponible"
      ? "bg-[#2d5a3d]/12 text-[#2d5a3d]"
      : "bg-[#6a645a]/12 text-[#5b564d]";
  const Texto =
    Estado === "disponible"
      ? "Disponible"
      : Estado.charAt(0).toUpperCase() + Estado.slice(1).replace(/_/g, " ");
  return <Badge Hijos={Texto} Clase={Clase} />;
}

export function TarjetaHabitacion({
  Habitacion,
  FechaEntrada,
  FechaSalida,
}: {
  Habitacion: HabitacionResponse;
  FechaEntrada?: string | null;
  FechaSalida?: string | null;
}) {
  const Href =
    FechaEntrada && FechaSalida
      ? `/habitaciones/${Habitacion.id}?entrada=${encodeURIComponent(FechaEntrada)}&salida=${encodeURIComponent(FechaSalida)}`
      : `/habitaciones/${Habitacion.id}`;
  const Precio = parseFloat(Habitacion.precio_por_noche);
  const PrecioFormato = Number.isNaN(Precio) ? "—" : `$${Precio.toFixed(0)}/noche`;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#6a645a]/12 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[#f6f2ec]">
        {Habitacion.imagen_url ? (
          <Image
            src={Habitacion.imagen_url}
            alt={`Habitación ${Habitacion.numero}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#6a645a]/50">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="FuenteTitulo text-xl text-[#1c1a16]">
          Habitación {Habitacion.numero}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {Habitacion.tipo_nombre && (
            <Badge
              Hijos={Habitacion.tipo_nombre}
              Clase="bg-[#b88f3a]/12 text-[#b88f3a] border border-[#b88f3a]/20"
            />
          )}
          <EtiquetaEstado Estado={Habitacion.estado} />
        </div>
        {Habitacion.descripcion && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#5b564d]">
            {Habitacion.descripcion}
          </p>
        )}
        <div className="mt-4 text-xs text-[#6a645a]">
          {Habitacion.capacidad} huésped{Habitacion.capacidad !== 1 ? "es" : ""}
        </div>
        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <p className="text-sm">
            <span className="text-[#6a645a]">Desde </span>
            <span className="FuenteTitulo text-[#b88f3a]">{PrecioFormato}</span>
          </p>
          <Link
            href={Href}
            className="shrink-0 rounded-lg border border-[#b88f3a] bg-white px-4 py-2 text-sm font-medium text-[#b88f3a] transition-colors hover:bg-[#b88f3a]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
          >
            Detalles
          </Link>
        </div>
      </div>
    </article>
  );
}
