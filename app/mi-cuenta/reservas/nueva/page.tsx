"use client";

import Link from "next/link";
import { UseNuevaReserva } from "@/Caracteristicas/Reservas/Hooks/UseNuevaReserva";
import { FormularioBusquedaHabitaciones } from "@/Caracteristicas/Habitaciones/Componentes/FormularioBusquedaHabitaciones";
import { VistaReservaConfirmada } from "@/Caracteristicas/Reservas/Componentes/VistaReservaConfirmada";
import { VistaConfirmacionReserva } from "@/Caracteristicas/Reservas/Componentes/VistaConfirmacionReserva";
import { ListadoHabitacionesDisponibles } from "@/Caracteristicas/Reservas/Componentes/ListadoHabitacionesDisponibles";

export default function PaginaNuevaReserva() {
  const {
    Tipos,
    FechaEntrada,
    FechaSalida,
    NumeroHuespedes,
    Notas,
    setNotas,
    Buscando,
    Habitaciones,
    ReservandoId,
    ReservaCreada,
    HabitacionSeleccionada,
    MetodoPago,
    setMetodoPago,
    Paso,
    PagoTarjeta,
    setPagoTarjeta,
    PrevisualizacionPrecio,
    CargandoPrevisualizacion,
    ErrorPrevisualizacion,
    ErrorPrevisualizacionObjeto,
    MutacionReservar,
    MutacionPagoInicial,
    Noches,
    AlBuscarConDatos,
    IrAConfirmacion,
    VolverABusqueda,
    ConfirmarReservaSeleccionada,
  } = UseNuevaReserva();

  if (ReservaCreada) {
    return <VistaReservaConfirmada Reserva={ReservaCreada} />;
  }

  if (Paso === "confirmacion" && HabitacionSeleccionada) {
    const ProcesandoReserva =
      ReservandoId !== null || MutacionReservar.isPending || MutacionPagoInicial.isPending;
    const PuedeConfirmar =
      !!PrevisualizacionPrecio && !CargandoPrevisualizacion && !ErrorPrevisualizacion;

    return (
      <VistaConfirmacionReserva
        Habitacion={HabitacionSeleccionada}
        PrevisualizacionPrecio={PrevisualizacionPrecio}
        CargandoPrevisualizacion={CargandoPrevisualizacion}
        ErrorPrevisualizacion={ErrorPrevisualizacion}
        ErrorPrevisualizacionObjeto={ErrorPrevisualizacionObjeto}
        Noches={Noches}
        FechaEntrada={FechaEntrada}
        FechaSalida={FechaSalida}
        NumeroHuespedes={NumeroHuespedes}
        Notas={Notas}
        MetodoPago={MetodoPago}
        setMetodoPago={setMetodoPago}
        PagoTarjeta={PagoTarjeta}
        setPagoTarjeta={setPagoTarjeta}
        PuedeConfirmar={PuedeConfirmar}
        ProcesandoReserva={ProcesandoReserva}
        onVolver={VolverABusqueda}
        onConfirmar={ConfirmarReservaSeleccionada}
      />
    );
  }

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
          <label
            htmlFor="nueva-notas"
            className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
          >
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
            {Noches} noche{Noches !== 1 ? "s" : ""} · Elige una para avanzar al resumen y confirmar
            el pago y la reserva.
          </p>
          <ListadoHabitacionesDisponibles
            Habitaciones={Habitaciones}
            Noches={Noches}
            ReservandoId={ReservandoId}
            onReservar={IrAConfirmacion}
          />
        </div>
      )}
    </div>
  );
}
