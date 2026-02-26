export type NombreRol = "huesped" | "recepcionista" | "gerente" | "administrador";

export interface RolResponse {
  id: number;
  nombre: string;
}

export interface UsuarioResponse {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  activo: boolean;
  fecha_creacion: string;
  roles?: RolResponse[];
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
  refresh_token?: string | null;
  expires_in?: number | null;
}

export interface UsuarioAlmacenado extends UsuarioResponse {
  roles?: RolResponse[];
}

export function NormalizarNombreRol(nombre: string): NombreRol {
  const n = nombre.toLowerCase().trim();
  if (n === "administrador" || n === "admin") return "administrador";
  if (n === "gerente") return "gerente";
  if (n === "recepcionista") return "recepcionista";
  return "huesped";
}

export function ObtenerRolesUsuario(usuario: UsuarioAlmacenado | null): NombreRol[] {
  if (!usuario?.roles?.length) return ["huesped"];
  return usuario.roles.map((r) => NormalizarNombreRol(r.nombre));
}

export function EsHuesped(roles: NombreRol[]): boolean {
  return roles.length === 1 && roles[0] === "huesped";
}

export function PuedeAccederAlPanel(roles: NombreRol[]): boolean {
  return !EsHuesped(roles);
}
