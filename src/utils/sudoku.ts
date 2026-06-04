import {
  SUDOKU_BLOQUE,
  SUDOKU_CELDAS_TOTALES,
  SUDOKU_DIMENSION,
  SUDOKU_HISTORIAL_MAXIMO,
} from "@/src/constants/sudoku";
import type {
  SudokuActividadDiaria,
  SudokuCelda,
  SudokuHistorialPaso,
  SudokuNumero,
  SudokuTiempoRegistro,
} from "@/src/types/sudoku";

export function crearIdSudoku() {
  return `sdk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function barajar<T>(valores: readonly T[]) {
  const copia = [...valores];

  for (let indice = copia.length - 1; indice > 0; indice -= 1) {
    const otroIndice = Math.floor(Math.random() * (indice + 1));
    [copia[indice], copia[otroIndice]] = [copia[otroIndice], copia[indice]];
  }

  return copia;
}

export function obtenerIndiceSudoku(fila: number, columna: number) {
  return fila * SUDOKU_DIMENSION + columna;
}

export function obtenerFilaSudoku(indice: number) {
  return Math.floor(indice / SUDOKU_DIMENSION);
}

export function obtenerColumnaSudoku(indice: number) {
  return indice % SUDOKU_DIMENSION;
}

export function obtenerBloqueSudoku(indice: number) {
  const fila = obtenerFilaSudoku(indice);
  const columna = obtenerColumnaSudoku(indice);

  return (
    Math.floor(fila / SUDOKU_BLOQUE) * SUDOKU_BLOQUE +
    Math.floor(columna / SUDOKU_BLOQUE)
  );
}

export function obtenerIndicesRelacionadosSudoku(indice: number) {
  const fila = obtenerFilaSudoku(indice);
  const columna = obtenerColumnaSudoku(indice);
  const filaBase = Math.floor(fila / SUDOKU_BLOQUE) * SUDOKU_BLOQUE;
  const columnaBase = Math.floor(columna / SUDOKU_BLOQUE) * SUDOKU_BLOQUE;
  const indices = new Set<number>();

  for (let cursor = 0; cursor < SUDOKU_DIMENSION; cursor += 1) {
    indices.add(obtenerIndiceSudoku(fila, cursor));
    indices.add(obtenerIndiceSudoku(cursor, columna));
  }

  for (let filaBloque = filaBase; filaBloque < filaBase + SUDOKU_BLOQUE; filaBloque += 1) {
    for (
      let columnaBloque = columnaBase;
      columnaBloque < columnaBase + SUDOKU_BLOQUE;
      columnaBloque += 1
    ) {
      indices.add(obtenerIndiceSudoku(filaBloque, columnaBloque));
    }
  }

  return [...indices].sort((a, b) => a - b);
}

export function formatearDuracion(segundos: number) {
  const minutos = Math.floor(segundos / 60)
    .toString()
    .padStart(2, "0");
  const segundosRestantes = (segundos % 60).toString().padStart(2, "0");

  return `${minutos}:${segundosRestantes}`;
}

export function crearInstantaneaSudoku(
  celdas: SudokuCelda[],
  pistasRestantes: number,
  notasActivas: boolean
): SudokuHistorialPaso {
  return {
    celdas: celdas.map((celda) => ({
      notas: [...celda.notas],
      valor: celda.valor,
    })),
    notasActivas,
    pistasRestantes,
  };
}

export function aplicarInstantaneaSudoku(
  celdasActuales: SudokuCelda[],
  instantanea: SudokuHistorialPaso
) {
  return celdasActuales.map((celda, indice) => ({
    ...celda,
    notas: [...instantanea.celdas[indice].notas],
    valor: instantanea.celdas[indice].valor,
  }));
}

export function limitarHistorialSudoku(historial: SudokuHistorialPaso[]) {
  return historial.slice(-SUDOKU_HISTORIAL_MAXIMO);
}

export function normalizarNotasSudoku(notas: SudokuNumero[]) {
  return [...new Set(notas)].sort((a, b) => a - b) as SudokuNumero[];
}

export function obtenerHoyIso() {
  return new Date().toISOString();
}

export function obtenerClaveDiaActual() {
  return obtenerHoyIso().slice(0, 10);
}

export function construirActividadSemanal(
  actividadDiaria: SudokuActividadDiaria[],
  historialTiempos: SudokuTiempoRegistro[]
) {
  const mapaActividad = new Map(actividadDiaria.map((item) => [item.fecha, item]));
  const mapaTiempos = new Map(historialTiempos.map((item) => [item.fecha.slice(0, 10), item]));
  const dias = ["D", "L", "M", "X", "J", "V", "S"];

  return Array.from({ length: 7 }, (_, indice) => {
    const fecha = new Date();
    fecha.setHours(0, 0, 0, 0);
    fecha.setDate(fecha.getDate() - (6 - indice));
    const clave = fecha.toISOString().slice(0, 10);
    const actividad = mapaActividad.get(clave);

    return {
      etiqueta: dias[fecha.getDay()],
      intentos: actividad?.intentos ?? 0,
      mejorTiempo: mapaTiempos.get(clave)?.duracionSegundos ?? null,
      resueltos: actividad?.resueltos ?? 0,
    };
  });
}

export function esIndiceSudokuValido(indice: number | null): indice is number {
  return typeof indice === "number" && indice >= 0 && indice < SUDOKU_CELDAS_TOTALES;
}
