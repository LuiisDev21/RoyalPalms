"use client";

interface FiltrosUsuariosAdminProps {
  TextoBusqueda: string;
  setTextoBusqueda: (v: string) => void;
  FiltroRol: string;
  setFiltroRol: (v: string) => void;
  FiltroActivo: string;
  setFiltroActivo: (v: string) => void;
  RolesUnicos: string[];
  TotalFiltrado: number;
  Total: number;
  LimpiarFiltros: () => void;
}

export function FiltrosUsuariosAdmin({
  TextoBusqueda,
  setTextoBusqueda,
  FiltroRol,
  setFiltroRol,
  FiltroActivo,
  setFiltroActivo,
  RolesUnicos,
  TotalFiltrado,
  Total,
  LimpiarFiltros,
}: FiltrosUsuariosAdminProps) {
  const HayFiltros = !!TextoBusqueda || !!FiltroRol || !!FiltroActivo;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-[#e5e0d8] bg-[#f6f2ec] p-4">
      <label htmlFor="usuarios-busqueda" className="sr-only">
        Buscar por email, nombre, apellido o rol
      </label>
      <input
        id="usuarios-busqueda"
        type="search"
        placeholder="Buscar por email, nombre, apellido, teléfono, rol…"
        value={TextoBusqueda}
        onChange={(e) => setTextoBusqueda(e.target.value)}
        className="min-w-[200px] flex-1 rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] placeholder:text-[#6a645a]/60 focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
      />
      <select
        aria-label="Filtrar por rol"
        value={FiltroRol}
        onChange={(e) => setFiltroRol(e.target.value)}
        className="rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
      >
        <option value="">Todos los roles</option>
        {RolesUnicos.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <select
        aria-label="Filtrar por estado activo/inactivo"
        value={FiltroActivo}
        onChange={(e) => setFiltroActivo(e.target.value)}
        className="rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
      >
        <option value="">Todos</option>
        <option value="activo">Activos</option>
        <option value="inactivo">Inactivos</option>
      </select>
      {HayFiltros && (
        <button
          type="button"
          onClick={LimpiarFiltros}
          className="rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#5b564d] hover:bg-[#f6f2ec]"
        >
          Limpiar filtros
        </button>
      )}
      <span className="text-sm text-[#5b564d]">
        {TotalFiltrado} de {Total}
      </span>
    </div>
  );
}
