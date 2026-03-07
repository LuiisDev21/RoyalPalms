"use client";

import { useEffect, useMemo, useState } from "react";

type EstadoReserva = "pendiente" | "confirmada" | "cancelada" | string;

type Reserva = {
  id: number;
  codigo?: string;
  usuario_nombre?: string;
  usuario_email?: string;
  habitacion_numero?: string;
  habitacion_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  huespedes?: number;
  precio_total?: number;
  estado?: EstadoReserva;
};

function money(n?: number) {
  const v = typeof n === "number" ? n : 0;
  return `$${v.toFixed(2)}`;
}

export default function ReservasPage() {
  const [data, setData] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<"todas" | string>("todas");

  async function loadReservas() {
    try {
      setLoading(true);
      setError(null);

      const base = process.env.NEXT_PUBLIC_API_URL;
      if (!base) throw new Error("Falta NEXT_PUBLIC_API_URL en tu .env");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "No hay token. Inicia sesión en el admin para ver reservas reales."
        );
      }

      // Intentamos /todas primero (admin). Si da 403, caemos a /reservas (mis reservas).
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };

      let res = await fetch(`${base}/reservas/todas`, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (res.status === 403) {
        res = await fetch(`${base}/reservas`, {
          method: "GET",
          headers,
          cache: "no-store",
        });
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error cargando reservas: HTTP ${res.status} ${txt}`);
      }

      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando reservas");
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservas();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return data.filter((r) => {
      const codigo = (r.codigo ?? "").toLowerCase();
      const usuario = (r.usuario_nombre ?? r.usuario_email ?? "").toLowerCase();
      const hab = (r.habitacion_numero ?? String(r.habitacion_id ?? "")).toLowerCase();
      const est = (r.estado ?? "").toLowerCase();

      const matchQ = s === "" || codigo.includes(s) || usuario.includes(s) || hab.includes(s);
      const matchEstado = estado === "todas" ? true : est === estado.toLowerCase();

      return matchQ && matchEstado;
    });
  }, [data, q, estado]);

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="bg-white border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Todas las Reservas</h1>

          <button
            onClick={loadReservas}
            className="h-10 px-4 bg-gray-900 text-white text-sm font-semibold hover:bg-black transition"
          >
            Recargar
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <label className="text-xs text-gray-600">BUSCAR</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por código, usuario o habitación..."
              className="mt-2 w-full h-10 border border-gray-300 px-3 outline-none focus:border-gray-600 text-gray-900"
            />
          </div>

          <div className="md:col-span-4">
            <label className="text-xs text-gray-600">ESTADO</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="mt-2 w-full h-10 border border-gray-300 px-3 outline-none focus:border-gray-600 bg-white text-gray-900"
            >
              <option value="todas">Todas</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-600">Cargando reservas...</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-left text-gray-900">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-700 border-b border-gray-200">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Código</th>
                  <th className="py-4 px-6">Usuario</th>
                  <th className="py-4 px-6">Habitación</th>
                  <th className="py-4 px-6">Fechas</th>
                  <th className="py-4 px-6">Huéspedes</th>
                  <th className="py-4 px-6">Precio Total</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 px-6 text-center text-gray-600">
                      No hay reservas para mostrar.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="border-b border-gray-200 last:border-0">
                      <td className="py-4 px-6">{r.id}</td>
                      <td className="py-4 px-6 font-semibold">
                        {r.codigo ?? `RES-${r.id}`}
                      </td>
                      <td className="py-4 px-6">
                        {r.usuario_nombre ?? r.usuario_email ?? "—"}
                      </td>
                      <td className="py-4 px-6">
                        {r.habitacion_numero ?? (r.habitacion_id ?? "—")}
                      </td>
                      <td className="py-4 px-6">
                        {(r.fecha_inicio ?? "—")} - {(r.fecha_fin ?? "—")}
                      </td>
                      <td className="py-4 px-6">{r.huespedes ?? "—"}</td>
                      <td className="py-4 px-6">{money(r.precio_total)}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 text-xs border border-gray-300 text-gray-700 bg-gray-100 rounded">
                          {r.estado ?? "—"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => alert(`Ver reserva: ${r.codigo ?? r.id}`)}
                          className="px-4 py-2 bg-gray-900 text-white text-xs hover:bg-black"
                        >
                          VER
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}