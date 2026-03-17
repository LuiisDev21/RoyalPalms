import { VistaNoEncontrada } from "@/Componentes/Comunes/VistaNoEncontrada";

export default function NotFound() {
  return (
    <VistaNoEncontrada
      Titulo="Vista no encontrada"
      Descripcion="Este módulo del panel no existe o no está disponible."
      HrefBoton="/admin"
      TextoBoton="Volver al panel"
      EnPanel
    />
  );
}
