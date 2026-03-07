const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function obtenerHabitaciones() {
  const res = await fetch(`${API_URL}/habitaciones`);

  if (!res.ok) {
    throw new Error("Error al obtener habitaciones");
  }

  return res.json();
}