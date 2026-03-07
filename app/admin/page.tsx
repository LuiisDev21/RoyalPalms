"use client";

import { useEffect, useState } from "react";
import { obtenerHabitaciones } from "@/services/api";

export default function AdminPage() {
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState("Cargando...");

  useEffect(() => {
    async function cargarHabitaciones() {
      try {
        const data = await obtenerHabitaciones();
        console.log("Datos recibidos:", data);
        setHabitaciones(data);
        setMensaje("Datos cargados correctamente");
      } catch (error) {
        console.error("Error cargando habitaciones:", error);
        setMensaje("Error al cargar habitaciones");
      }
    }

    cargarHabitaciones();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.35em] text-[#121212]/60">
          ROYAL PALM
        </p>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#121212] mt-2">
          Panel Administrador
        </h1>

        <div className="mt-4 h-[2px] w-16 bg-[#B8964A] rounded-full" />
      </div>

      <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-black/10 shadow-sm p-10 text-center">
        <p className="text-[#121212]/60 text-lg">
          Bienvenido al panel interno de Royal Palm.
        </p>

        <p className="text-[#121212]/50 mt-3">
          Desde aquí podrás administrar habitaciones, reservas, pagos,
          usuarios y configuraciones del sistema.
        </p>

        <p className="mt-6 text-sm font-medium text-blue-600">
          {mensaje}
        </p>

        <p className="mt-2 text-[#121212]/70">
          Habitaciones registradas: {habitaciones.length}
        </p>
      </div>
    </div>
  );
}