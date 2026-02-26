"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BuscarHabitacionesDisponiblesCliente,
  CrearReservaCliente,
  ListarTiposHabitacionCliente,
} from "@/Servicios/ClienteApiServicio";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import type { TipoHabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import {
  FormularioBusquedaHabitaciones,
  type DatosBusquedaHabitaciones,
} from "@/Caracteristicas/Habitaciones/Componentes/FormularioBusquedaHabitaciones";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import { useRouter } from "next/navigation";

function CalcularNoches(Entrada: string, Salida: string): number {
  const A = new Date(Entrada).getTime();
  const B = new Date(Salida).getTime();
  if (A >= B) return 0;
  return Math.floor((B - A) / (24 * 60 * 60 * 1000));
}

export default function PaginaNuevaReserva() {
  const router = useRouter();
  const [Tipos, setTipos] = useState<TipoHabitacionResponse[]>([]);
  const [FechaEntrada, setFechaEntrada] = useState("");
  const [FechaSalida, setFechaSalida] = useState("");
  const [NumeroHuespedes, setNumeroHuespedes] = useState(1);
  const [Notas, setNotas] = useState("");
  const [Buscando, setBuscando] = useState(false);
  const [Habitaciones, setHabitaciones] = useState<HabitacionResponse[]>([]);
  const [ReservandoId, setReservandoId] = useState<number | null>(null);

  useEffect(() => {
    ListarTiposHabitacionCliente()
      .then(setTipos)
      .catch(() => {});
  }, []);

  async function AlBuscarConDatos(datos: DatosBusquedaHabitaciones) {
    if (!datos.FechaEntrada || !datos.FechaSalida) {
      Notificaciones.Error("Fechas requeridas", "Indica fecha de entrada y salida.");
      return;
    }
    if (new Date(datos.FechaEntrada) >= new Date(datos.FechaSalida)) {
      Notificaciones.Error("Fechas inválidas", "La salida debe ser posterior a la entrada.");
      return;
    }
    setFechaEntrada(datos.FechaEntrada);
    setFechaSalida(datos.FechaSalida);
    setNumeroHuespedes(parseInt(datos.Huespedes, 10) || 1);
    setBuscando(true);
    setHabitaciones([]);
    try {
      const CapacidadNum = parseInt(datos.Huespedes, 10);
      const Capacidad = Number.isNaN(CapacidadNum) || CapacidadNum <= 0 ? undefined : CapacidadNum;
      const TipoNum = datos.TipoId ? parseInt(datos.TipoId, 10) : undefined;
      const Lista = await BuscarHabitacionesDisponiblesCliente(
        datos.FechaEntrada,
        datos.FechaSalida,
        Capacidad,
        TipoNum && !Number.isNaN(TipoNum) ? TipoNum : undefined
      );
      setHabitaciones(Lista);
      if (Lista.length === 0) {
        Notificaciones.Advertencia(
          "Sin disponibilidad",
          "No hay habitaciones disponibles para esas fechas. Prueba otras."
        );
      }
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
        e,
        "Error al buscar habitaciones"
      );
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      setBuscando(false);
    }
  }

  async function Reservar(H: HabitacionResponse) {
    if (!FechaEntrada || !FechaSalida) return;
    setReservandoId(H.id);
    try {
      await CrearReservaCliente({
        habitacion_id: H.id,
        fecha_entrada: FechaEntrada,
        fecha_salida: FechaSalida,
        numero_huespedes: NumeroHuespedes,
        notas: Notas.trim() || null,
      });
      Notificaciones.Exito("Reserva creada", "Serás redirigido a tus reservas.");
      router.push("/mi-cuenta/reservas");
    } catch (e) {
      setReservandoId(null);
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
        e,
        "Error al crear la reserva"
      );
      Notificaciones.Error(Titulo, Descripcion);
    }
  }

  const Noches = FechaEntrada && FechaSalida ? CalcularNoches(FechaEntrada, FechaSalida) : 0;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/mi-cuenta/reservas"
          className="text-sm text-[#5b564d] transition-colors hover:text-[#1c1a16]"
        >
          ← Mis reservas
        </Link>
      </div>
      <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
        Nueva reserva
      </h1>
      <p className="mt-1 text-sm text-[#5b564d]">
        Indica fechas y huéspedes para ver habitaciones disponibles.
      </p>

      <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-6">
        <FormularioBusquedaHabitaciones
          Tipos={Tipos}
          AlBuscarConDatos={AlBuscarConDatos}
          Deshabilitado={Buscando}
        />
        <div className="mt-4">
          <label htmlFor="nueva-notas" className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]">
            Notas (opcional)
          </label>
          <textarea
            id="nueva-notas"
            rows={2}
            value={Notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Peticiones especiales..."
            className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 px-3 py-2 text-sm text-[#1c1a16] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
          />
        </div>
      </div>

      {Habitaciones.length > 0 && (
        <div className="mt-10">
          <h2 className="FuenteTitulo text-xl font-semibold text-[#1c1a16]">
            Habitaciones disponibles
          </h2>
          <p className="mt-1 text-sm text-[#5b564d]">
            {Noches} noche{Noches !== 1 ? "s" : ""} · Elige una para reservar
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Habitaciones.map((H) => {
              const PrecioNoche = parseFloat(H.precio_por_noche);
              const Total =
                Number.isNaN(PrecioNoche) ? 0 : PrecioNoche * Noches;
              const EstaReservando = ReservandoId === H.id;
              return (
                <article
                  key={H.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-[#e5e0d8] bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3] bg-[#f6f2ec]">
                    {H.imagen_url ? (
                      <Image
                        src={H.imagen_url}
                        alt={`Habitación ${H.numero}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#6a645a]/50">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="FuenteTitulo text-lg font-semibold text-[#1c1a16]">
                      Habitación {H.numero}
                    </h3>
                    {H.tipo_nombre && (
                      <p className="mt-0.5 text-sm text-[#5b564d]">{H.tipo_nombre}</p>
                    )}
                    <p className="mt-2 text-sm font-medium text-[#1c1a16]">
                      ${PrecioNoche.toFixed(0)}/noche · Total: ${Total.toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => Reservar(H)}
                      disabled={ReservandoId !== null}
                      className="mt-4 w-full rounded-lg bg-[#b88f3a] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#a67c32] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
                    >
                      {EstaReservando ? "Reservando…" : "Reservar esta habitación"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
