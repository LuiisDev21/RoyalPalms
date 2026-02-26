import { FormularioIniciarSesion } from "@/Caracteristicas/Autenticacion/Componentes/FormularioIniciarSesion";
import { PanelPromocionalLogin } from "@/Caracteristicas/Autenticacion/Componentes/PanelPromocionalLogin";

export default function PaginaLogin() {
  return (
    <div className="flex min-h-screen">
      <PanelPromocionalLogin />
      <FormularioIniciarSesion />
    </div>
  );
}
