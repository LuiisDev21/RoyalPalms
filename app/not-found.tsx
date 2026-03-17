import { VistaNoEncontrada } from "@/Componentes/Comunes/VistaNoEncontrada";

export default function NotFound() {
  return (
    <VistaNoEncontrada
      Titulo="Página no encontrada"
      Descripcion="La ruta que intentas abrir no existe o fue movida."
      HrefBoton="/"
      TextoBoton="Volver al inicio"
    />
  );
}
