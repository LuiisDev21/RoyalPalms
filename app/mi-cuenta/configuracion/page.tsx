"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";

export default function PaginaConfiguracionMiCuenta() {
  const { Usuario, ActualizarPerfil } = UseAuth();
  const [Nombre, setNombre] = useState("");
  const [Apellido, setApellido] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (Usuario) {
      setNombre(Usuario.nombre ?? "");
      setApellido(Usuario.apellido ?? "");
      setTelefono(Usuario.telefono ?? "");
    }
  }, [Usuario]);

  async function Enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!Usuario) return;
    setGuardando(true);
    try {
      const Datos: { nombre?: string; apellido?: string; telefono?: string | null } = {};
      if (Nombre.trim() !== (Usuario.nombre ?? "")) Datos.nombre = Nombre.trim();
      if (Apellido.trim() !== (Usuario.apellido ?? "")) Datos.apellido = Apellido.trim();
      if (Telefono.trim() !== (Usuario.telefono ?? "")) Datos.telefono = Telefono.trim() || null;
      if (Object.keys(Datos).length === 0) {
        Notificaciones.Info("Sin cambios", "No has modificado ningún campo.");
        setGuardando(false);
        return;
      }
      await ActualizarPerfil(Datos);
      Notificaciones.Exito("Perfil actualizado", "Tus datos se han guardado correctamente.");
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al actualizar el perfil");
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      setGuardando(false);
    }
  }

  if (!Usuario) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/mi-cuenta/reservas"
          className="text-sm text-[#5b564d] transition-colors hover:text-[#1c1a16]"
        >
          ← Mi cuenta
        </Link>
      </div>
      <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
        Configuración
      </h1>
      <p className="mt-1 text-sm text-[#5b564d]">
        Edita tu nombre, apellido y teléfono. El email no se puede modificar desde aquí.
      </p>

      <form onSubmit={Enviar} className="mt-8 max-w-md space-y-5">
        <div>
          <label
            htmlFor="config-email"
            className="block text-sm font-medium text-[#5b564d]"
          >
            Email
          </label>
          <input
            id="config-email"
            type="email"
            value={Usuario.email ?? ""}
            readOnly
            className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 bg-[#f6f2ec]/60 px-3 py-2 text-sm text-[#5b564d] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
            aria-readonly="true"
          />
          <p className="mt-1 text-xs text-[#6a645a]">No editable</p>
        </div>

        <div>
          <label
            htmlFor="config-nombre"
            className="block text-sm font-medium text-[#5b564d]"
          >
            Nombre
          </label>
          <input
            id="config-nombre"
            type="text"
            value={Nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
            autoComplete="given-name"
          />
        </div>

        <div>
          <label
            htmlFor="config-apellido"
            className="block text-sm font-medium text-[#5b564d]"
          >
            Apellido
          </label>
          <input
            id="config-apellido"
            type="text"
            value={Apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
            autoComplete="family-name"
          />
        </div>

        <div>
          <label
            htmlFor="config-telefono"
            className="block text-sm font-medium text-[#5b564d]"
          >
            Teléfono
          </label>
          <input
            id="config-telefono"
            type="tel"
            value={Telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[#6a645a]/40 bg-white px-3 py-2 text-sm text-[#1c1a16] focus:border-[#b88f3a] focus:outline-none focus:ring-1 focus:ring-[#b88f3a]"
            autoComplete="tel"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={Guardando}
            className="rounded-lg bg-[#1c1a16] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d2a26] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
          >
            {Guardando ? "Guardando…" : "Guardar cambios"}
          </button>
          <Link
            href="/mi-cuenta/reservas"
            className="rounded-lg border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm font-medium text-[#5b564d] transition-colors hover:bg-[#f6f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
