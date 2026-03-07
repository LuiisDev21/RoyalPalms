import Link from "next/link";
import type { ReactNode } from "react";

const navLinks = [

  { href: "/admin/habitaciones", label: "Habitaciones" },
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/pagos", label: "Pagos" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/configuraciones", label: "Configuraciones" },
  { href: "/admin/reportes", label: "Reportes" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F4EF] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-black/70 backdrop-blur-xl text-white p-6 border-r border-[#B8964A]/20 shadow-xl">
        <div className="mb-10">
          <p className="text-xs tracking-[0.25em] text-white/60">ROYAL PALM</p>
          <h2 className="text-2xl font-semibold mt-2 leading-tight">
            Panel Administrador
          </h2>
          <div className="mt-4 h-[2px] w-14 bg-[#B8964A] rounded-full" />
        </div>

        <nav className="space-y-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-xl px-4 py-2 text-white/85 hover:text-white hover:bg-white/5 transition"
            >
              <span className="inline-block mr-2 text-[#B8964A]">•</span>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="text-xs text-white/60 tracking-wider">Hotel</p>
          <p className="text-sm text-white/70 mt-1">
           Royal • Palm
          </p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}