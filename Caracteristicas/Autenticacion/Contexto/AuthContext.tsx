"use client";

import {
  type NombreRol,
  EsHuesped,
  ObtenerRolesUsuario,
  PuedeAccederAlPanel,
  type UsuarioAlmacenado,
} from "@/Tipos/Auth";
import { GuardarToken, GuardarUsuario as GuardarUsuarioStorage, ObtenerUsuarioAlmacenado } from "@/Servicios/ApiCliente";
import {
  CerrarSesion as CerrarSesionServicio,
  IniciarSesion as IniciarSesionServicio,
  ObtenerUsuarioActual,
  RegistrarUsuario as RegistrarUsuarioServicio,
  type DatosLogin,
  type DatosRegistro,
} from "@/Servicios/AutenticacionServicio";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface EstadoAuth {
  Usuario: UsuarioAlmacenado | null;
  Cargando: boolean;
  Roles: NombreRol[];
  PuedePanel: boolean;
  EsHuespedRol: boolean;
}

interface AuthContextValor extends EstadoAuth {
  IniciarSesion: (datos: DatosLogin) => Promise<void>;
  RegistrarUsuario: (datos: DatosRegistro) => Promise<void>;
  CerrarSesion: () => Promise<void>;
  RefrescarUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValor | null>(null);

function CalcularEstado(usuario: UsuarioAlmacenado | null): Pick<EstadoAuth, "Roles" | "PuedePanel" | "EsHuespedRol"> {
  const Roles = ObtenerRolesUsuario(usuario);
  return {
    Roles,
    PuedePanel: PuedeAccederAlPanel(Roles),
    EsHuespedRol: EsHuesped(Roles),
  };
}

export function ProveedorAuth({ children }: { children: React.ReactNode }) {
  const [Usuario, setUsuario] = useState<UsuarioAlmacenado | null>(null);
  const [Cargando, setCargando] = useState(true);

  const RefrescarUsuario = useCallback(async () => {
    const { ObtenerToken: GetToken } = await import("@/Servicios/ApiCliente");
    if (!GetToken()) {
      setUsuario(null);
      setCargando(false);
      return;
    }
    try {
      const u = await ObtenerUsuarioActual();
      setUsuario(u);
      GuardarUsuarioStorage(u);
    } catch {
      setUsuario(ObtenerUsuarioAlmacenado());
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const u = ObtenerUsuarioAlmacenado();
    if (u) setUsuario(u);
    setCargando(false);
  }, []);

  const IniciarSesion = useCallback(
    async (datos: DatosLogin) => {
      const tokenData = await IniciarSesionServicio(datos);
      GuardarToken(tokenData);
      const usuario = await ObtenerUsuarioActual();
      GuardarUsuarioStorage(usuario);
      setUsuario(usuario);
    },
    []
  );

  const RegistrarUsuario = useCallback(async (datos: DatosRegistro) => {
    await RegistrarUsuarioServicio(datos);
  }, []);

  const CerrarSesion = useCallback(async () => {
    await CerrarSesionServicio();
    setUsuario(null);
  }, []);

  const estado = CalcularEstado(Usuario);
  const valor: AuthContextValor = {
    ...estado,
    Usuario,
    Cargando,
    IniciarSesion,
    RegistrarUsuario,
    CerrarSesion,
    RefrescarUsuario,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function UseAuth(): AuthContextValor {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("UseAuth debe usarse dentro de ProveedorAuth");
  return ctx;
}
