"use client";

import { TarjetaHabitacionAdmin } from "@/Caracteristicas/PanelAdmin/Componentes/TarjetaHabitacionAdmin";
import { FormularioHabitacionModal } from "@/Caracteristicas/PanelAdmin/Componentes/FormularioHabitacionModal";
import type { ValoresFormularioHabitacion } from "@/Caracteristicas/PanelAdmin/Componentes/FormularioHabitacionModal";
import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import {
  PuedeCrearHabitacion,
  PuedeEditarHabitacion,
  PuedeEliminarHabitacion,
} from "@/Utilidades/PermisosPanel";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import {
  ListarHabitacionesPanel,
  ObtenerHabitacionPanel,
  CrearHabitacionPanel,
  ActualizarHabitacionPanel,
  EliminarHabitacionPanel,
  ListarTiposHabitacionPanel,
  ListarPoliticasCancelacionPanel,
} from "@/Servicios/PanelApiServicio";
import { useEffect, useState } from "react";

export default function PaginaHabitacionesAdmin() {
  const { Roles } = UseAuth();
  const PuedeCrear = PuedeCrearHabitacion(Roles);
  const PuedeEditar = PuedeEditarHabitacion(Roles);
  const PuedeEliminar = PuedeEliminarHabitacion(Roles);

  const [Habitaciones, setHabitaciones] = useState<HabitacionResponse[]>([]);
  const [Tipos, setTipos] = useState<Awaited<ReturnType<typeof ListarTiposHabitacionPanel>>>([]);
  const [Politicas, setPoliticas] = useState<Awaited<ReturnType<typeof ListarPoliticasCancelacionPanel>>>([]);
  const [Cargando, setCargando] = useState(true);
  const [Guardando, setGuardando] = useState(false);
  const [CargandoEditar, setCargandoEditar] = useState<number | null>(null);
  const [EliminandoId, setEliminandoId] = useState<number | null>(null);
  const [ModalAbierto, setModalAbierto] = useState<"nueva" | "editar" | null>(null);
  const [HabitacionEditando, setHabitacionEditando] = useState<HabitacionResponse | null>(null);

  async function CargarDatos() {
    setCargando(true);
    try {
      const [hab, tipos, politicas] = await Promise.all([
        ListarHabitacionesPanel(),
        ListarTiposHabitacionPanel(true),
        ListarPoliticasCancelacionPanel(false),
      ]);
      setHabitaciones(hab);
      setTipos(tipos);
      setPoliticas(politicas);
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al cargar datos");
        Notificaciones.Error(Titulo, Descripcion);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    CargarDatos();
  }, []);

  function AbrirNueva() {
    setHabitacionEditando(null);
    setModalAbierto("nueva");
  }

  async function AbrirEditar(Id: number) {
    setCargandoEditar(Id);
    try {
      const h = await ObtenerHabitacionPanel(Id);
      setHabitacionEditando(h);
      setModalAbierto("editar");
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al cargar la habitación");
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      setCargandoEditar(null);
    }
  }

  function CerrarModal() {
    setModalAbierto(null);
    setHabitacionEditando(null);
  }

  async function Guardar(datos: ValoresFormularioHabitacion, archivo: File | null) {
    setGuardando(true);
    try {
      const tipoId = parseInt(datos.tipo_habitacion_id, 10);
      const politicaId = datos.politica_cancelacion_id ? parseInt(datos.politica_cancelacion_id, 10) : null;
      const capacidad = parseInt(datos.capacidad, 10);
      const precio = parseFloat(datos.precio_por_noche);

      if (HabitacionEditando) {
        await ActualizarHabitacionPanel(
          HabitacionEditando.id,
          {
            tipo_habitacion_id: tipoId,
            politica_cancelacion_id: politicaId,
            descripcion: datos.descripcion || null,
            capacidad,
            precio_por_noche: precio,
            estado: datos.estado,
          },
          archivo
        );
        Notificaciones.Exito("Habitación actualizada correctamente");
      } else {
        await CrearHabitacionPanel(
          {
            numero: datos.numero,
            tipo_habitacion_id: tipoId,
            politica_cancelacion_id: politicaId,
            descripcion: datos.descripcion || null,
            capacidad,
            precio_por_noche: precio,
            estado: datos.estado,
          },
          archivo
        );
        Notificaciones.Exito("Habitación creada correctamente");
      }
      CerrarModal();
      await CargarDatos();
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al guardar");
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      setGuardando(false);
    }
  }

  async function Eliminar(Id: number) {
    if (!confirm("¿Estás seguro de eliminar esta habitación?")) return;
    setEliminandoId(Id);
    try {
      await EliminarHabitacionPanel(Id);
      Notificaciones.Exito("Habitación eliminada correctamente");
      await CargarDatos();
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al eliminar");
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      setEliminandoId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
          Gestión de Habitaciones
        </h1>
        {PuedeCrear && (
          <button
            type="button"
            onClick={AbrirNueva}
            disabled={Cargando}
            className="rounded-lg bg-[#1c1a16] px-4 py-2.5 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#2d2a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            + Nueva Habitación
          </button>
        )}
      </div>

      {Cargando ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
          <p className="text-sm text-[#6a645a]">Cargando habitaciones…</p>
        </div>
      ) : Habitaciones.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#e5e0d8] bg-white p-12 text-center text-[#5b564d]">
          No hay habitaciones registradas.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Habitaciones.map((h) => (
            <TarjetaHabitacionAdmin
              key={h.id}
              Habitacion={h}
              PuedeEditar={PuedeEditar}
              PuedeEliminar={PuedeEliminar}
              CargandoEditar={CargandoEditar === h.id}
              CargandoEliminar={EliminandoId === h.id}
              AlEditar={() => AbrirEditar(h.id)}
              AlEliminar={() => Eliminar(h.id)}
            />
          ))}
        </div>
      )}

      {ModalAbierto && (
        <FormularioHabitacionModal
          Habitacion={HabitacionEditando}
          Tipos={Tipos}
          Politicas={Politicas}
          Guardando={Guardando}
          EnGuardar={Guardar}
          EnCancelar={CerrarModal}
        />
      )}
    </div>
  );
}
