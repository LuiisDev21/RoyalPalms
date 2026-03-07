import type { TokenResponse, UsuarioAlmacenado } from "@/Tipos/Auth";
import { ExtraerMensajeDeDetalle } from "@/Utilidades/MensajeDeError";

const ClaveToken = "token";
const ClaveRefreshToken = "refresh_token";
const ClaveTokenExpira = "token_expires_at";
const ClaveUsuario = "usuario";

export function ObtenerBaseUrl(): string {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "";
}

export function ObtenerToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ClaveToken);
}

export function ObtenerRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ClaveRefreshToken);
}

export function GuardarToken(payload: TokenResponse): void {
  if (typeof window === "undefined") return;
  if (payload.access_token) localStorage.setItem(ClaveToken, payload.access_token);
  if (payload.refresh_token) localStorage.setItem(ClaveRefreshToken, payload.refresh_token);
  if (payload.expires_in != null) {
    const Expira = Date.now() + payload.expires_in * 1000;
    localStorage.setItem(ClaveTokenExpira, String(Expira));
  }
}

export function EliminarSesion(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ClaveToken);
  localStorage.removeItem(ClaveRefreshToken);
  localStorage.removeItem(ClaveTokenExpira);
  localStorage.removeItem(ClaveUsuario);
}

export function GuardarUsuario(usuario: UsuarioAlmacenado): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ClaveUsuario, JSON.stringify(usuario));
}

export function ObtenerUsuarioAlmacenado(): UsuarioAlmacenado | null {
  if (typeof window === "undefined") return null;
  const s = localStorage.getItem(ClaveUsuario);
  if (!s) return null;
  try {
    return JSON.parse(s) as UsuarioAlmacenado;
  } catch {
    return null;
  }
}

async function RefrescarToken(): Promise<TokenResponse> {
  const refresh = ObtenerRefreshToken();
  if (!refresh) throw new Error("Sesión expirada. Inicia sesión de nuevo.");
  const base = ObtenerBaseUrl();
  if (!base) throw new Error("NEXT_PUBLIC_API_URL no está configurada.");
  const res = await fetch(`${base}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(ExtraerMensajeDeDetalle(data.detail) || "Refresh fallido");
  GuardarToken(data);
  return data;
}

export async function HacerRequest<T>(
  endpoint: string,
  opciones: RequestInit = {},
  reintentar401 = true
): Promise<T> {
  const base = ObtenerBaseUrl();
  if (!base) throw new Error("NEXT_PUBLIC_API_URL no está configurada.");
  const url = `${base}${endpoint}`;
  const token = ObtenerToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...opciones.headers,
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...opciones, headers });
  const data: { detail?: unknown } = await res.json().catch(() => ({}));

  if (res.status === 401 && reintentar401 && ObtenerRefreshToken()) {
    try {
      await RefrescarToken();
      return HacerRequest<T>(endpoint, opciones, false);
    } catch {
      EliminarSesion();
      if (typeof window !== "undefined" && window.location) window.location.href = "/login";
      throw new Error("Sesión expirada. Inicia sesión de nuevo.");
    }
  }

  if (!res.ok) throw new Error(ExtraerMensajeDeDetalle(data.detail));
  return data as T;
}

export async function HacerRequestFormData<T>(
  endpoint: string,
  formData: FormData,
  metodo: "POST" | "PUT" = "POST"
): Promise<T> {
  const base = ObtenerBaseUrl();
  if (!base) throw new Error("NEXT_PUBLIC_API_URL no está configurada.");
  const url = `${base}${endpoint}`;
  const token = ObtenerToken();
  const headers: HeadersInit = {};
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { method: metodo, headers, body: formData });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && ObtenerRefreshToken()) {
    try {
      await RefrescarToken();
      return HacerRequestFormData(endpoint, formData, metodo);
    } catch {
      EliminarSesion();
      if (typeof window !== "undefined" && window.location) window.location.href = "/login";
      throw new Error("Sesión expirada. Inicia sesión de nuevo.");
    }
  }

  if (!res.ok) throw new Error(ExtraerMensajeDeDetalle(data.detail));
  return data as T;
}
