import type { SudokuAjustes, SudokuDificultad } from "@/src/types/sudoku";

export const SUDOKU_DIMENSION = 9;
export const SUDOKU_CELDAS_TOTALES = SUDOKU_DIMENSION * SUDOKU_DIMENSION;
export const SUDOKU_BLOQUE = 3;
export const SUDOKU_PISTAS_POR_PARTIDA = 3;
export const SUDOKU_HISTORIAL_MAXIMO = 60;
export const SUDOKU_TIEMPOS_MAXIMOS = 30;
export const SUDOKU_ACTIVIDAD_MAXIMA = 45;

export const SUDOKU_AJUSTES_PREDETERMINADOS: SudokuAjustes = {
  modoOscuro: false,
  mostrarErrores: true,
  sonidos: true,
  vibracion: false,
};

export const SUDOKU_DIFICULTADES: Record<
  SudokuDificultad,
  {
    descripcionCorta: string;
    objetivoMinutos: number;
    pistasMaximas: number;
    pistasMinimas: number;
    titulo: string;
  }
> = {
  dificil: {
    descripcionCorta: "Para concentracion profunda",
    objetivoMinutos: 14,
    pistasMaximas: 31,
    pistasMinimas: 26,
    titulo: "Dificil",
  },
  experto: {
    descripcionCorta: "Solo para mentes pacientes",
    objetivoMinutos: 18,
    pistasMaximas: 25,
    pistasMinimas: 22,
    titulo: "Experto",
  },
  facil: {
    descripcionCorta: "Ideal para relajarte",
    objetivoMinutos: 7,
    pistasMaximas: 45,
    pistasMinimas: 38,
    titulo: "Facil",
  },
  medio: {
    descripcionCorta: "Un reto equilibrado",
    objetivoMinutos: 10,
    pistasMaximas: 37,
    pistasMinimas: 32,
    titulo: "Medio",
  },
};

export const SUDOKU_ORDEN_DIFICULTADES: SudokuDificultad[] = [
  "facil",
  "medio",
  "dificil",
  "experto",
];
