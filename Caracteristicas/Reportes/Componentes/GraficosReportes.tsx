"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  EstadisticasReservasResponse,
  IngresosReporteResponse,
  OcupacionReporteResponse,
} from "@/Servicios/PanelApiServicio";

export function GraficoBarrasReservas({
  Datos,
}: {
  Datos: EstadisticasReservasResponse;
}) {
  const Informacion = [
    {
      Clave: "Pendientes",
      Valor: Datos.reservas_pendientes,
    },
    {
      Clave: "Confirmadas",
      Valor: Datos.reservas_confirmadas,
    },
    {
      Clave: "Canceladas",
      Valor: Datos.reservas_canceladas,
    },
    {
      Clave: "Completadas",
      Valor: Datos.reservas_completadas,
    },
  ];

  return (
    <div className="h-64 w-full rounded-xl border border-[#e5e0d8] bg-white p-4">
      <h3 className="mb-2 text-sm font-medium text-[#1c1a16]">
        Reservas por estado
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={Informacion}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d8" />
          <XAxis dataKey="Clave" tick={{ fill: "#5b564d", fontSize: 12 }} />
          <YAxis tick={{ fill: "#5b564d", fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              borderColor: "#e5e0d8",
            }}
          />
          <Legend />
          <Bar dataKey="Valor" name="Reservas" fill="#b88f3a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoPastelMetodosPago({
  Datos,
}: {
  Datos: IngresosReporteResponse;
}) {
  const Informacion = (Datos.por_metodo_pago ?? []).map((m) => ({
    Clave: m.metodo_pago,
    Valor: m.monto,
  }));

  if (!Informacion.length) return null;

  return (
    <div className="h-64 w-full rounded-xl border border-[#e5e0d8] bg-white p-4">
      <h3 className="mb-2 text-sm font-medium text-[#1c1a16]">
        Ingresos por método de pago
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            formatter={(valor?: number) =>
              typeof valor === "number" ? `$${Number(valor).toFixed(2)}` : ""
            }
            contentStyle={{
              borderRadius: 8,
              borderColor: "#e5e0d8",
            }}
          />
          <Legend />
          <Pie
            data={Informacion}
            dataKey="Valor"
            nameKey="Clave"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#b88f3a"
            label={({ name }) => name}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoBarrasOcupacion({
  Datos,
}: {
  Datos: OcupacionReporteResponse;
}) {
  if (!Datos.items.length) return null;

  const Informacion = Datos.items.map((i) => ({
    Clave: i.nombre,
    Noches: i.noches_ocupadas,
    Ingresos: i.ingresos,
  }));

  return (
    <div className="h-72 w-full rounded-xl border border-[#e5e0d8] bg-white p-4">
      <h3 className="mb-2 text-sm font-medium text-[#1c1a16]">
        Ocupación por elemento
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={Informacion}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d8" />
          <XAxis
            dataKey="Clave"
            tick={{ fill: "#5b564d", fontSize: 11 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fill: "#5b564d", fontSize: 12 }} />
          <Tooltip
            formatter={(valor?: number, clave?: string) =>
              clave === "Ingresos" && typeof valor === "number"
                ? `$${Number(valor).toFixed(2)}`
                : `${valor ?? 0} noche${valor === 1 ? "" : "s"}`
            }
            contentStyle={{
              borderRadius: 8,
              borderColor: "#e5e0d8",
            }}
          />
          <Legend />
          <Bar
            dataKey="Noches"
            name="Noches ocupadas"
            fill="#b88f3a"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Ingresos"
            name="Ingresos"
            fill="#6a645a"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

