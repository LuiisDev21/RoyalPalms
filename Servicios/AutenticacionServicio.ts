import type { TokenResponse, UsuarioAlmacenado } from "@/Tipos/Auth";
import { EliminarSesion, GuardarToken, GuardarUsuario, HacerRequest } from "./ApiCliente";

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

export async function ComprobarPermisoUsuarios(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "https://backendhotelv2.fly.dev/api/v1";
  const token = (await import("./ApiCliente")).ObtenerToken();
  const res = await fetch(`${base}/auth/usuarios?Saltar=0&Limite=1`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.ok;
}

export function CerrarSesion(): void {
  EliminarSesion();
}

export function PersistirSesion(tokenData: TokenResponse, usuario: UsuarioAlmacenado): void {
  GuardarToken(tokenData);
  GuardarUsuario(usuario);
}
