import {
  SUDOKU_ACTIVIDAD_MAXIMA,
  SUDOKU_TIEMPOS_MAXIMOS,
} from "@/src/constants/sudoku";
import type {
  SudokuDificultad,
  SudokuEstadisticas,
  SudokuTiempoRegistro,
} from "@/src/types/sudoku";
import { obtenerClaveDiaActual, obtenerHoyIso } from "@/src/utils/sudoku";

export function crearSudokuEstadisticasPredeterminadas(): SudokuEstadisticas {
  return {
    actividadDiaria: [],
    mejorTiempoSegundos: null,
    historialTiempos: [],
    partidasGanadas: 0,
    partidasJugadas: 0,
    rachaActual: 0,
    rachaMaxima: 0,
    totalTiempoGanadoSegundos: 0,
  };
}

function actualizarActividad(
  estadisticas: SudokuEstadisticas,
  actualizador: (item: { fecha: string; intentos: number; resueltos: number }) => {
    fecha: string;
    intentos: number;
    resueltos: number;
  }
) {
  const fecha = obtenerClaveDiaActual();
  const indice = estadisticas.actividadDiaria.findIndex((item) => item.fecha === fecha);
  const actual = indice >= 0 ? estadisticas.actividadDiaria[indice] : { fecha, intentos: 0, resueltos: 0 };
  const siguiente = actualizador(actual);
  const actividadDiaria = [...estadisticas.actividadDiaria];

  if (indice >= 0) {
    actividadDiaria[indice] = siguiente;
  } else {
    actividadDiaria.push(siguiente);
  }

  actividadDiaria.sort((a, b) => a.fecha.localeCompare(b.fecha));

  return actividadDiaria.slice(-SUDOKU_ACTIVIDAD_MAXIMA);
}

export function registrarIntentoSudoku(estadisticas: SudokuEstadisticas) {
  return {
    ...estadisticas,
    actividadDiaria: actualizarActividad(estadisticas, (item) => ({
      ...item,
      intentos: item.intentos + 1,
    })),
    partidasJugadas: estadisticas.partidasJugadas + 1,
  };
}

export function registrarAbandonoSudoku(estadisticas: SudokuEstadisticas) {
  return {
    ...estadisticas,
    rachaActual: 0,
  };
}

export function registrarVictoriaSudoku(
  estadisticas: SudokuEstadisticas,
  datos: {
    dificultad: SudokuDificultad;
    duracionSegundos: number;
    id: string;
  }
) {
  const historialItem: SudokuTiempoRegistro = {
    dificultad: datos.dificultad,
    duracionSegundos: datos.duracionSegundos,
    fecha: obtenerHoyIso(),
    id: datos.id,
  };
  const mejorTiempo =
    estadisticas.mejorTiempoSegundos === null
      ? datos.duracionSegundos
      : Math.min(estadisticas.mejorTiempoSegundos, datos.duracionSegundos);
  const rachaActual = estadisticas.rachaActual + 1;

  return {
    ...estadisticas,
    actividadDiaria: actualizarActividad(estadisticas, (item) => ({
      ...item,
      resueltos: item.resueltos + 1,
    })),
    mejorTiempoSegundos: mejorTiempo,
    historialTiempos: [...estadisticas.historialTiempos, historialItem].slice(-SUDOKU_TIEMPOS_MAXIMOS),
    partidasGanadas: estadisticas.partidasGanadas + 1,
    rachaActual,
    rachaMaxima: Math.max(estadisticas.rachaMaxima, rachaActual),
    totalTiempoGanadoSegundos: estadisticas.totalTiempoGanadoSegundos + datos.duracionSegundos,
  };
}

export function obtenerTiempoPromedioSudoku(estadisticas: SudokuEstadisticas) {
  if (estadisticas.partidasGanadas === 0) {
    return null;
  }

  return Math.round(estadisticas.totalTiempoGanadoSegundos / estadisticas.partidasGanadas);
}
