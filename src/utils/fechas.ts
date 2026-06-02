export function agregarDias(fecha: Date, dias: number) {
  const siguiente = new Date(fecha.getTime());
  siguiente.setDate(siguiente.getDate() + dias);
  return siguiente;
}

export function obtenerClaveMesActual() {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  return `${anio}-${mes}`;
}

export function convertirFechaDesdeFirestore(valor: unknown) {
  if (!valor) return null;

  if (valor instanceof Date) return valor;

  if (typeof valor === "object" && valor && "toDate" in valor) {
    const posibleFecha = valor as { toDate: () => Date };
    return posibleFecha.toDate();
  }

  if (typeof valor === "string" || typeof valor === "number") {
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? null : fecha;
  }

  return null;
}

export function formatearFecha(valor: unknown, locale = "es-CL") {
  const fecha = convertirFechaDesdeFirestore(valor);
  if (!fecha) return "-";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(fecha);
}
