import { SUDOKU_PISTAS_POR_PARTIDA } from "@/src/constants/sudoku";
import type {
  SudokuCelda,
  SudokuDificultad,
  SudokuPartida,
  SudokuValor,
} from "@/src/types/sudoku";
import { generarPuzzleSudoku } from "@/src/services/sudoku-generator";
import { crearIdSudoku, obtenerHoyIso } from "@/src/utils/sudoku";

function crearCeldasSudoku(pistas: SudokuValor[]): SudokuCelda[] {
  return pistas.map((valor) => ({
    fija: valor !== null,
    notas: [],
    valor,
  }));
}

export function crearSudokuPartida(dificultad: SudokuDificultad): SudokuPartida {
  const puzzle = generarPuzzleSudoku(dificultad);
  const marcaTiempo = obtenerHoyIso();

  return {
    actualizadaEl: marcaTiempo,
    celdaSeleccionada: null,
    celdas: crearCeldasSudoku(puzzle.pistas),
    dificultad,
    finalizada: false,
    historial: [],
    id: crearIdSudoku(),
    iniciadaEl: marcaTiempo,
    notasActivas: false,
    pausada: false,
    pistasRestantes: SUDOKU_PISTAS_POR_PARTIDA,
    segundosTranscurridos: 0,
    solucion: puzzle.solucion,
  };
}
