import { SUDOKU_AJUSTES_PREDETERMINADOS } from "@/src/constants/sudoku";
import type {
  SudokuAjustes,
  SudokuEstadisticas,
  SudokuPartida,
  SudokuResumenPartida,
} from "@/src/types/sudoku";
import { crearSudokuEstadisticasPredeterminadas } from "@/src/services/sudoku-estadisticas";
import {
  eliminarStorage,
  guardarJsonStorage,
  leerJsonStorage,
} from "@/src/services/storage";

const SUDOKU_AJUSTES_KEY = "@sudoku-yoru/ajustes";

function obtenerPartidaKey(perfilId: string) {
  return `@sudoku-yoru/partida/${perfilId}`;
}

function obtenerEstadisticasKey(perfilId: string) {
  return `@sudoku-yoru/estadisticas/${perfilId}`;
}

export async function cargarSudokuAjustes() {
  const ajustes = await leerJsonStorage<SudokuAjustes>(SUDOKU_AJUSTES_KEY);
  return ajustes ? { ...SUDOKU_AJUSTES_PREDETERMINADOS, ...ajustes } : SUDOKU_AJUSTES_PREDETERMINADOS;
}

export async function guardarSudokuAjustes(ajustes: SudokuAjustes) {
  await guardarJsonStorage(SUDOKU_AJUSTES_KEY, ajustes);
}

export async function cargarSudokuPartida(perfilId: string) {
  return leerJsonStorage<SudokuPartida>(obtenerPartidaKey(perfilId));
}

export async function guardarSudokuPartida(perfilId: string, partida: SudokuPartida) {
  await guardarJsonStorage(obtenerPartidaKey(perfilId), partida);
}

export async function eliminarSudokuPartida(perfilId: string) {
  await eliminarStorage(obtenerPartidaKey(perfilId));
}

export async function cargarSudokuResumenPartida(perfilId: string): Promise<SudokuResumenPartida> {
  const partida = await cargarSudokuPartida(perfilId);

  if (!partida) {
    return {
      dificultad: "facil",
      existe: false,
      finalizada: false,
      id: null,
      segundosTranscurridos: 0,
    };
  }

  return {
    dificultad: partida.dificultad,
    existe: true,
    finalizada: partida.finalizada,
    id: partida.id,
    segundosTranscurridos: partida.segundosTranscurridos,
  };
}

export async function cargarSudokuEstadisticas(perfilId: string) {
  const estadisticas = await leerJsonStorage<SudokuEstadisticas>(obtenerEstadisticasKey(perfilId));
  return estadisticas ?? crearSudokuEstadisticasPredeterminadas();
}

export async function guardarSudokuEstadisticas(perfilId: string, estadisticas: SudokuEstadisticas) {
  await guardarJsonStorage(obtenerEstadisticasKey(perfilId), estadisticas);
}
