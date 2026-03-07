"use client";

import { useState } from "react";

type Estado = "disponible" | "ocupada" | "mantenimiento";

export default function HabitacionesPage() {
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [numero, setNumero] = useState("");
  const [tipo, setTipo] = useState("");
  const [politica, setPolitica] = useState("sin_politica");
  const [descripcion, setDescripcion] = useState("");
  const [capacidad, setCapacidad] = useState<number | "">("");
  const [precio, setPrecio] = useState<number | "">("");
  const [estado, setEstado] = useState<Estado>("disponible");
  const [imagen, setImagen] = useState<File | null>(null);

  const TIPOS = ["Standard", "Doble", "Suite", "Familiar"];
  const POLITICAS = [
    { value: "sin_politica", label: "Sin política" },
    { value: "flexible", label: "Flexible (24h)" },
    { value: "moderada", label: "Moderada (48h)" },
    { value: "estricta", label: "Estricta (no reembolso)" },
  ];

  function resetForm() {
    setNumero("");
    setTipo("");
    setPolitica("sin_politica");
    setDescripcion("");
    setCapacidad("");
    setPrecio("");
    setEstado("disponible");
    setImagen(null);
  }

  function onCancel() {
    resetForm();
    setShowForm(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Dummy: luego conectamos a tu backend/supabase
    console.log({
      numero,
      tipo,
      politica,
      descripcion,
      capacidad: capacidad === "" ? null : Number(capacidad),
      precio: precio === "" ? null : Number(precio),
      estado,
      imagen,
    });

    // Simula guardado
    setShowForm(false);
    resetForm();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-black/80">
            Gestión de Habitaciones
          </h1>
        </div>

        <button
          onClick={() => setShowForm((v) => !v)}
          className="h-10 px-4 rounded bg-black/80 text-white text-sm font-semibold hover:bg-black transition"
        >
          + NUEVA HABITACIÓN
        </button>
      </div>

      {/* Form (inline, como tu imagen) */}
      {showForm && (
        <div className="bg-white border border-black/10 shadow-sm">
          <div className="px-6 py-4 border-b border-black/10">
            <h2 className="font-semibold text-black/80">Nueva Habitación</h2>
          </div>

          <form onSubmit={onSubmit} className="px-6 py-5 space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-black/70">Número:</label>
                <input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="mt-2 w-full h-10 border border-black/15 px-3 outline-none focus:border-black/40"
                  placeholder="Ej: 101"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-black/70">Tipo:</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="mt-2 w-full h-10 border border-black/15 px-3 outline-none focus:border-black/40 bg-white"
                  required
                >
                  <option value="">Seleccione un tipo</option>
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-black/70">
                  Política de cancelación:
                </label>
                <select
                  value={politica}
                  onChange={(e) => setPolitica(e.target.value)}
                  className="mt-2 w-full h-10 border border-black/15 px-3 outline-none focus:border-black/40 bg-white"
                >
                  {POLITICAS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="text-sm text-black/70">Descripción:</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="mt-2 w-full min-h-[110px] border border-black/15 px-3 py-2 outline-none focus:border-black/40"
                placeholder="Descripción de la habitación..."
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-black/70">Capacidad:</label>
                <input
                  type="number"
                  min={1}
                  value={capacidad}
                  onChange={(e) =>
                    setCapacidad(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="mt-2 w-full h-10 border border-black/15 px-3 outline-none focus:border-black/40"
                  placeholder="Ej: 2"
                />
              </div>

              <div>
                <label className="text-sm text-black/70">Precio por Noche:</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={precio}
                  onChange={(e) =>
                    setPrecio(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="mt-2 w-full h-10 border border-black/15 px-3 outline-none focus:border-black/40"
                  placeholder="Ej: 50.00"
                />
              </div>

              <div>
                <label className="text-sm text-black/70">Estado:</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as Estado)}
                  className="mt-2 w-full h-10 border border-black/15 px-3 outline-none focus:border-black/40 bg-white"
                >
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
            </div>

            {/* Imagen */}
            <div>
              <label className="text-sm text-black/70">Imagen:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files?.[0] ?? null)}
                className="mt-2 w-full border border-black/15 px-3 py-2 bg-white"
              />
              <p className="text-xs text-black/50 mt-2">
                La imagen se subirá automáticamente al guardar la habitación.
              </p>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                className="flex-1 h-11 bg-black/80 text-white font-semibold hover:bg-black transition"
              >
                GUARDAR
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-40 h-11 border border-black/20 bg-white text-black/70 font-semibold hover:bg-black/5 transition"
              >
                CANCELAR
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Aquí luego va tu tabla/listado real */}
      <div className="bg-white border border-black/10 shadow-sm p-6 text-black/60">
        (Aquí irá el listado de habitaciones)
      </div>
    </div>
  );
}