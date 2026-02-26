"use client";

import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { EsHuesped, ObtenerRolesUsuario, PuedeAccederAlPanel } from "@/Tipos/Auth";
import { LogoMarca } from "@/Componentes/Comunes/LogoMarca";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function UnirClases(...Clases: Array<string | undefined | false | null>) {
  return Clases.filter(Boolean).join(" ");
}

export function FormularioIniciarSesion() {
  const router = useRouter();
  const { IniciarSesion, RegistrarUsuario } = UseAuth();
  const [PestañaActiva, PonerPestañaActiva] = useState<"login" | "registro">("login");
  const [Email, PonerEmail] = useState("");
  const [Contraseña, PonerContraseña] = useState("");
  const [RegistroEmail, PonerRegistroEmail] = useState("");
  const [RegistroNombre, PonerRegistroNombre] = useState("");
  const [RegistroApellido, PonerRegistroApellido] = useState("");
  const [RegistroTelefono, PonerRegistroTelefono] = useState("");
  const [RegistroContraseña, PonerRegistroContraseña] = useState("");
  const [Enviando, PonerEnviando] = useState(false);

  async function EnviarLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!Email.trim() || !Contraseña) {
      Notificaciones.Error("Ingresa email y contraseña.");
      return;
    }
    PonerEnviando(true);
    try {
      await IniciarSesion({ email: Email.trim(), password: Contraseña });
      Notificaciones.Exito("Sesión iniciada", "Redirigiendo…");
      const { ObtenerUsuarioAlmacenado } = await import("@/Servicios/ApiCliente");
      const u = ObtenerUsuarioAlmacenado();
      const roles = ObtenerRolesUsuario(u);
      if (PuedeAccederAlPanel(roles)) router.push("/admin");
      else if (EsHuesped(roles)) router.push("/mi-cuenta");
      else router.push("/");
    } catch (err) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(err, "Error al iniciar sesión");
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      PonerEnviando(false);
    }
  }

  async function EnviarRegistro(e: React.FormEvent) {
    e.preventDefault();
    if (!RegistroEmail.trim() || !RegistroNombre.trim() || !RegistroApellido.trim() || !RegistroContraseña) {
      Notificaciones.Error("Completa los campos obligatorios.");
      return;
    }
    PonerEnviando(true);
    try {
      await RegistrarUsuario({
        email: RegistroEmail.trim(),
        nombre: RegistroNombre.trim(),
        apellido: RegistroApellido.trim(),
        password: RegistroContraseña,
        telefono: RegistroTelefono.trim() || null,
      });
      await IniciarSesion({
        email: RegistroEmail.trim(),
        password: RegistroContraseña,
      });
      Notificaciones.Exito("Cuenta creada", "Redirigiendo…");
      const { ObtenerUsuarioAlmacenado } = await import("@/Servicios/ApiCliente");
      const u = ObtenerUsuarioAlmacenado();
      const roles = ObtenerRolesUsuario(u);
      if (PuedeAccederAlPanel(roles)) router.push("/admin");
      else if (EsHuesped(roles)) router.push("/mi-cuenta");
      else router.push("/");
    } catch (err) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(err, "Error al registrarse");
      Notificaciones.Error(Titulo, Descripcion);
    } finally {
      PonerEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#f6f2ec]">
      <div className="px-6 py-6">
        <Link
          href="/"
          className="text-sm text-[#5b564d] transition-colors hover:text-[#1c1a16]"
        >
          Volver al inicio
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-[400px]">
          <div className="flex justify-center">
            <span className="text-[#b88f3a]" aria-hidden="true">
              <LogoMarca ClaseAdicional="h-12 w-12" />
            </span>
          </div>
          <h1 className="FuenteTitulo mt-6 text-center text-2xl text-[#1c1a16] md:text-3xl">
            {PestañaActiva === "login"
              ? "Bienvenido de nuevo"
              : "Tu próxima estancia empieza aquí."}
          </h1>
          <p className="mt-2 text-center text-sm text-[#5b564d]">
            {PestañaActiva === "login"
              ? "Ingresa tus datos para acceder a tu cuenta personal."
              : "Crea tu cuenta en un momento y reserva con ventajas."}
          </p>

          <div className="mt-8 flex border-b border-[#6a645a]/20">
            <button
              type="button"
              onClick={() => PonerPestañaActiva("login")}
              className={UnirClases(
                "flex-1 pb-4 text-xs font-medium uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]",
                PestañaActiva === "login"
                  ? "border-b-2 border-[#b88f3a] text-[#1c1a16]"
                  : "text-[#6a645a] hover:text-[#5b564d]"
              )}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => PonerPestañaActiva("registro")}
              className={UnirClases(
                "flex-1 pb-4 text-xs font-medium uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]",
                PestañaActiva === "registro"
                  ? "border-b-2 border-[#b88f3a] text-[#1c1a16]"
                  : "text-[#6a645a] hover:text-[#5b564d]"
              )}
            >
              Registrarse
            </button>
          </div>

          {PestañaActiva === "login" ? (
            <form
              className="mt-8"
              onSubmit={EnviarLogin}
              noValidate
            >
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
                >
                  Email
                </label>
                <div className="mt-2 flex items-center gap-2 border-b border-[#6a645a]/40 pb-2 focus-within:border-[#b88f3a]">
                  <span className="text-[#6a645a]" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    value={Email}
                    onChange={(e) => PonerEmail(e.target.value)}
                    placeholder="nombre@ejemplo.com"
                    autoComplete="email"
                    className="flex-1 bg-transparent text-sm text-[#1c1a16] placeholder:text-[#6a645a]/70 outline-none"
                  />
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
                  >
                    Contraseña
                  </label>
                  <Link
                    href="/recuperar-contrasena"
                    className="text-xs text-[#b88f3a] transition-colors hover:text-[#a67c32]"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="mt-2 flex items-center gap-2 border-b border-[#6a645a]/40 pb-2 focus-within:border-[#b88f3a]">
                  <span className="text-[#6a645a]" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    value={Contraseña}
                    onChange={(e) => PonerContraseña(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="flex-1 bg-transparent text-sm text-[#1c1a16] placeholder:text-[#6a645a]/70 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={Enviando}
                className="mt-8 w-full rounded-lg bg-[#1c1a16] px-6 py-3.5 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#2d2a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] disabled:opacity-60"
              >
                {Enviando ? "Entrando…" : "Entrar"}
              </button>
            </form>
          ) : (
            <form
              className="mt-8"
              onSubmit={EnviarRegistro}
              noValidate
            >
              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
                >
                  Email
                </label>
                <div className="mt-2 flex items-center gap-2 border-b border-[#6a645a]/40 pb-2 focus-within:border-[#b88f3a]">
                  <span className="text-[#6a645a]" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    value={RegistroEmail}
                    onChange={(e) => PonerRegistroEmail(e.target.value)}
                    placeholder="nombre@ejemplo.com"
                    autoComplete="email"
                    className="flex-1 bg-transparent text-sm text-[#1c1a16] placeholder:text-[#6a645a]/70 outline-none"
                  />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-nombre"
                    className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
                  >
                    Nombre
                  </label>
                  <div className="mt-2 flex items-center gap-2 border-b border-[#6a645a]/40 pb-2 focus-within:border-[#b88f3a]">
                    <span className="text-[#6a645a]" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="reg-nombre"
                      type="text"
                      value={RegistroNombre}
                      onChange={(e) => PonerRegistroNombre(e.target.value)}
                      placeholder="Tu nombre"
                      autoComplete="given-name"
                      className="flex-1 min-w-0 bg-transparent text-sm text-[#1c1a16] placeholder:text-[#6a645a]/70 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="reg-apellido"
                    className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
                  >
                    Apellido
                  </label>
                  <div className="mt-2 flex items-center gap-2 border-b border-[#6a645a]/40 pb-2 focus-within:border-[#b88f3a]">
                    <span className="text-[#6a645a]" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="reg-apellido"
                      type="text"
                      value={RegistroApellido}
                      onChange={(e) => PonerRegistroApellido(e.target.value)}
                      placeholder="Tu apellido"
                      autoComplete="family-name"
                      className="flex-1 min-w-0 bg-transparent text-sm text-[#1c1a16] placeholder:text-[#6a645a]/70 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label
                  htmlFor="reg-telefono"
                  className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
                >
                  Teléfono
                </label>
                <div className="mt-2 flex items-center gap-2 border-b border-[#6a645a]/40 pb-2 focus-within:border-[#b88f3a]">
                  <span className="text-[#6a645a]" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <input
                    id="reg-telefono"
                    type="tel"
                    value={RegistroTelefono}
                    onChange={(e) => PonerRegistroTelefono(e.target.value)}
                    placeholder="Opcional"
                    autoComplete="tel"
                    className="flex-1 bg-transparent text-sm text-[#1c1a16] placeholder:text-[#6a645a]/70 outline-none"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-medium uppercase tracking-wider text-[#5b564d]"
                >
                  Contraseña
                </label>
                <div className="mt-2 flex items-center gap-2 border-b border-[#6a645a]/40 pb-2 focus-within:border-[#b88f3a]">
                  <span className="text-[#6a645a]" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="reg-password"
                    type="password"
                    value={RegistroContraseña}
                    onChange={(e) => PonerRegistroContraseña(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="flex-1 bg-transparent text-sm text-[#1c1a16] placeholder:text-[#6a645a]/70 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={Enviando}
                className="mt-8 w-full rounded-lg bg-[#1c1a16] px-6 py-3.5 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#2d2a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a] disabled:opacity-60"
              >
                {Enviando ? "Registrando…" : "Registrarse"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-[#5b564d]">
            Al continuar, aceptas nuestros{" "}
            <Link href="/politica-privacidad" className="text-[#1c1a16] underline decoration-[#6a645a]/40 underline-offset-2 hover:decoration-[#b88f3a]">
              Términos
            </Link>{" "}
            y{" "}
            <Link href="/politica-privacidad" className="text-[#1c1a16] underline decoration-[#6a645a]/40 underline-offset-2 hover:decoration-[#b88f3a]">
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
