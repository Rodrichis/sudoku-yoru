export const sudokuNumeros = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type SudokuNumero = (typeof sudokuNumeros)[number];
export type SudokuValor = SudokuNumero | null;

export type SudokuDificultad = "facil" | "medio" | "dificil" | "experto";

export interface SudokuCelda {
  fija: boolean;
  notas: SudokuNumero[];
  valor: SudokuValor;
}

export interface SudokuHistorialPaso {
  celdas: Pick<SudokuCelda, "notas" | "valor">[];
  notasActivas: boolean;
  pistasRestantes: number;
}

export interface SudokuPartida {
  actualizadaEl: string;
  celdaSeleccionada: number | null;
  celdas: SudokuCelda[];
  dificultad: SudokuDificultad;
  finalizada: boolean;
  id: string;
  iniciadaEl: string;
  historial: SudokuHistorialPaso[];
  notasActivas: boolean;
  pausada: boolean;
  pistasRestantes: number;
  segundosTranscurridos: number;
  solucion: SudokuNumero[];
}

export interface SudokuResumenPartida {
  dificultad: SudokuDificultad;
  existe: boolean;
  finalizada: boolean;
  id: string | null;
  segundosTranscurridos: number;
}

export interface SudokuAjustes {
  modoOscuro: boolean;
  mostrarErrores: boolean;
  sonidos: boolean;
  vibracion: boolean;
}

export interface SudokuActividadDiaria {
  fecha: string;
  intentos: number;
  resueltos: number;
}

export interface SudokuTiempoRegistro {
  dificultad: SudokuDificultad;
  duracionSegundos: number;
  fecha: string;
  id: string;
}

export interface SudokuEstadisticas {
  actividadDiaria: SudokuActividadDiaria[];
  mejorTiempoSegundos: number | null;
  historialTiempos: SudokuTiempoRegistro[];
  partidasGanadas: number;
  partidasJugadas: number;
  rachaActual: number;
  rachaMaxima: number;
  totalTiempoGanadoSegundos: number;
}

export interface SudokuPuzzleGenerado {
  pistas: SudokuValor[];
  solucion: SudokuNumero[];
}
