import type { TokenResponse, UsuarioAlmacenado } from "@/Tipos/Auth";
import {
  EliminarSesion,
  GuardarToken,
  GuardarUsuario,
  HacerRequest,
  ObtenerBaseUrl,
  ObtenerRefreshToken,
} from "./ApiCliente";

export interface DatosLogin {
  email: string;
  password: string;
}

export interface DatosRegistro {
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  telefono?: string | null;
}

export async function IniciarSesion(datos: DatosLogin): Promise<TokenResponse> {
  const resp = await HacerRequest<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  return resp;
}

export async function RegistrarUsuario(datos: DatosRegistro): Promise<UsuarioAlmacenado> {
  const resp = await HacerRequest<UsuarioAlmacenado>("/auth/register", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  return resp;
}

export async function ObtenerUsuarioActual(): Promise<UsuarioAlmacenado> {
  return HacerRequest<UsuarioAlmacenado>("/auth/me");
}

export interface DatosActualizarPerfil {
  nombre?: string;
  apellido?: string;
  telefono?: string | null;
}

export async function ActualizarPerfilUsuario(
  Datos: DatosActualizarPerfil
): Promise<UsuarioAlmacenado> {
  return HacerRequest<UsuarioAlmacenado>("/auth/me", {
    method: "PUT",
    body: JSON.stringify(Datos),
  });
}

export async function ComprobarPermisoUsuarios(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const base = ObtenerBaseUrl();
  if (!base) return false;
  const token = (await import("./ApiCliente")).ObtenerToken();
  const res = await fetch(`${base}/auth/usuarios?Saltar=0&Limite=1`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.ok;
}

export async function CerrarSesion(): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      const base = ObtenerBaseUrl();
      const refresh = ObtenerRefreshToken();
      if (base && refresh) {
        await fetch(`${base}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refresh }),
        });
      }
    }
  } catch {
    // Ignorar errores del endpoint de logout; igual se limpiará la sesión local
  } finally {
    EliminarSesion();
  }
}

export function PersistirSesion(tokenData: TokenResponse, usuario: UsuarioAlmacenado): void {
  GuardarToken(tokenData);
  GuardarUsuario(usuario);
}
