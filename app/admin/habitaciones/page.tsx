"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ModalConfirmacion } from "@/Componentes/Base/ModalConfirmacion";
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
import { ClavesQueryPanel } from "@/Utilidades/QueryKeysPanel";
import {
  ListarHabitacionesPanel,
  ObtenerHabitacionPanel,
  CrearHabitacionPanel,
  ActualizarHabitacionPanel,
  EliminarHabitacionPanel,
  ListarTiposHabitacionPanel,
  ListarPoliticasCancelacionPanel,
} from "@/Servicios/PanelApiServicio";

export default function PaginaHabitacionesAdmin() {
  const { Roles } = UseAuth();
  const queryClient = useQueryClient();
  const PuedeCrear = PuedeCrearHabitacion(Roles);
  const PuedeEditar = PuedeEditarHabitacion(Roles);
  const PuedeEliminar = PuedeEliminarHabitacion(Roles);

  const [CargandoEditar, setCargandoEditar] = useState<number | null>(null);
  const [ModalAbierto, setModalAbierto] = useState<"nueva" | "editar" | null>(null);
  const [HabitacionEditando, setHabitacionEditando] = useState<HabitacionResponse | null>(null);
  const [ErrorGuardado, setErrorGuardado] = useState<string | null>(null);
  const [ConfirmacionEliminar, setConfirmacionEliminar] = useState<number | null>(null);

  const { data: Habitaciones = [], isLoading: Cargando, isError, error } = useQuery({
    queryKey: ClavesQueryPanel.Habitaciones,
    queryFn: () => ListarHabitacionesPanel(),
  });
  const { data: Tipos = [] } = useQuery({
    queryKey: ClavesQueryPanel.TiposHabitacion,
    queryFn: () => ListarTiposHabitacionPanel(true),
  });
  const { data: Politicas = [] } = useQuery({
    queryKey: ClavesQueryPanel.PoliticasCancelacion,
    queryFn: () => ListarPoliticasCancelacionPanel(false),
  });

  const MutacionGuardar = useMutation({
    mutationFn: async ({
      EsEdicion,
      Id,
      Datos,
      Archivo,
    }: {
      EsEdicion: boolean;
      Id?: number;
      Datos: ValoresFormularioHabitacion;
      Archivo: File | null;
    }) => {
      const tipoId = parseInt(Datos.tipo_habitacion_id, 10);
      const politicaId = Datos.politica_cancelacion_id ? parseInt(Datos.politica_cancelacion_id, 10) : null;
      const capacidad = parseInt(Datos.capacidad, 10);
      const precio = parseFloat(Datos.precio_por_noche);
      if (EsEdicion && Id != null) {
        await ActualizarHabitacionPanel(
          Id,
          {
            tipo_habitacion_id: tipoId,
            politica_cancelacion_id: politicaId,
            descripcion: Datos.descripcion || null,
            capacidad,
            precio_por_noche: precio,
            estado: Datos.estado,
          },
          Archivo
        );
      } else {
        await CrearHabitacionPanel(
          {
            numero: Datos.numero,
            tipo_habitacion_id: tipoId,
            politica_cancelacion_id: politicaId,
            descripcion: Datos.descripcion || null,
            capacidad,
            precio_por_noche: precio,
            estado: Datos.estado,
          },
          Archivo
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ClavesQueryPanel.Habitaciones });
      CerrarModal();
      Notificaciones.Exito(variables.EsEdicion ? "Habitación actualizada correctamente" : "Habitación creada correctamente");
    },
    onError: (e) => {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al guardar");
      setErrorGuardado(Descripcion || Titulo);
    },
  });

  const MutacionEliminar = useMutation({
    mutationFn: EliminarHabitacionPanel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClavesQueryPanel.Habitaciones });
      Notificaciones.Exito("Habitación eliminada correctamente");
    },
    onError: (e) => {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al eliminar");
      Notificaciones.Error(Titulo, Descripcion);
    },
  });

  useEffect(() => {
    if (!isError || !error) return;
    const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(error, "Error al cargar datos");
    Notificaciones.Error(Titulo, Descripcion);
  }, [isError, error]);

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
    setErrorGuardado(null);
  }

  function Guardar(datos: ValoresFormularioHabitacion, archivo: File | null) {
    setErrorGuardado(null);
    const EsEdicion = !!HabitacionEditando;
    MutacionGuardar.mutate({
      EsEdicion,
      Id: HabitacionEditando?.id,
      Datos: datos,
      Archivo: archivo,
    });
  }

  function SolicitarEliminar(Id: number) {
    setConfirmacionEliminar(Id);
  }

  function ConfirmarEliminar() {
    if (ConfirmacionEliminar != null) {
      MutacionEliminar.mutate(ConfirmacionEliminar);
      setConfirmacionEliminar(null);
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
              CargandoEliminar={MutacionEliminar.isPending && MutacionEliminar.variables === h.id}
              AlEditar={() => AbrirEditar(h.id)}
              AlEliminar={() => SolicitarEliminar(h.id)}
            />
          ))}
        </div>
      )}

      <ModalConfirmacion
        Abierto={ConfirmacionEliminar !== null}
        Titulo="Eliminar habitación"
        Mensaje="¿Estás seguro de eliminar esta habitación? Esta acción no se puede deshacer."
        TextoConfirmar="Eliminar"
        Variante="peligro"
        AlConfirmar={ConfirmarEliminar}
        AlCancelar={() => setConfirmacionEliminar(null)}
      />
      {ModalAbierto && (
        <FormularioHabitacionModal
          Habitacion={HabitacionEditando}
          Tipos={Tipos}
          Politicas={Politicas}
          Guardando={MutacionGuardar.isPending}
          ErrorGuardado={ErrorGuardado}
          EnGuardar={Guardar}
          EnCancelar={CerrarModal}
        />
      )}
    </div>
  );
}
