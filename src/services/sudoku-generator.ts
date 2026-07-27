import { SUDOKU_DIFICULTADES } from "@/src/constants/sudoku";
import type { SudokuDificultad, SudokuPuzzleGenerado, SudokuValor } from "@/src/types/sudoku";
import { barajar } from "@/src/utils/sudoku";

import { contarSolucionesSudoku, generarSolucionSudoku } from "@/src/services/sudoku-solver";

function aleatorioEntre(minimo: number, maximo: number) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

function generarIntentoSudoku(dificultad: SudokuDificultad) {
  const solucion = generarSolucionSudoku();
  const pistas = [...solucion] as SudokuValor[];
  const configuracion = SUDOKU_DIFICULTADES[dificultad];
  const pistasObjetivo = aleatorioEntre(
    configuracion.pistasMinimas,
    configuracion.pistasMaximas
  );
  const indices = barajar(Array.from({ length: solucion.length }, (_, indice) => indice));
  let pistasActuales = solucion.length;

  for (const indice of indices) {
    if (pistasActuales <= pistasObjetivo) {
      break;
    }

    const respaldo = pistas[indice];
    pistas[indice] = null;

    if (contarSolucionesSudoku(pistas, 2) !== 1) {
      pistas[indice] = respaldo;
      continue;
    }

    pistasActuales -= 1;
  }

  return {
    pistasActuales,
    puzzle: {
      pistas,
      solucion,
    } satisfies SudokuPuzzleGenerado,
  };
}

export function generarPuzzleSudoku(dificultad: SudokuDificultad): SudokuPuzzleGenerado {
  const configuracion = SUDOKU_DIFICULTADES[dificultad];
  const intentosMaximos =
    dificultad === "experto" ? 10 : dificultad === "dificil" ? 5 : 2;
  let mejorIntento: ReturnType<typeof generarIntentoSudoku> | null = null;

  for (let intento = 0; intento < intentosMaximos; intento += 1) {
    const resultado = generarIntentoSudoku(dificultad);

    if (!mejorIntento || resultado.pistasActuales < mejorIntento.pistasActuales) {
      mejorIntento = resultado;
    }

    if (resultado.pistasActuales <= configuracion.pistasMaximas) {
      return resultado.puzzle;
    }
  }

  if (!mejorIntento) {
    throw new Error("No fue posible generar un puzzle Sudoku.");
  }

  return mejorIntento.puzzle;
}
