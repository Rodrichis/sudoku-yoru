import { SUDOKU_CELDAS_TOTALES } from "@/src/constants/sudoku";
import { sudokuNumeros, type SudokuNumero, type SudokuValor } from "@/src/types/sudoku";
import {
  barajar,
  obtenerBloqueSudoku,
  obtenerColumnaSudoku,
  obtenerFilaSudoku,
} from "@/src/utils/sudoku";

function obtenerCandidatos(tablero: SudokuValor[], indice: number) {
  if (tablero[indice] !== null) {
    return [] as SudokuNumero[];
  }

  const fila = obtenerFilaSudoku(indice);
  const columna = obtenerColumnaSudoku(indice);
  const bloque = obtenerBloqueSudoku(indice);

  return sudokuNumeros.filter((numero) => {
    for (let cursor = 0; cursor < SUDOKU_CELDAS_TOTALES; cursor += 1) {
      if (
        tablero[cursor] === numero &&
        (obtenerFilaSudoku(cursor) === fila ||
          obtenerColumnaSudoku(cursor) === columna ||
          obtenerBloqueSudoku(cursor) === bloque)
      ) {
        return false;
      }
    }

    return true;
  });
}

function obtenerSiguienteIndice(tablero: SudokuValor[]) {
  let mejorIndice = -1;
  let menorCantidad = Number.POSITIVE_INFINITY;

  for (let indice = 0; indice < SUDOKU_CELDAS_TOTALES; indice += 1) {
    if (tablero[indice] !== null) {
      continue;
    }

    const candidatos = obtenerCandidatos(tablero, indice);

    if (candidatos.length === 0) {
      return indice;
    }

    if (candidatos.length < menorCantidad) {
      menorCantidad = candidatos.length;
      mejorIndice = indice;
    }
  }

  return mejorIndice;
}

function resolverInterno(tablero: SudokuValor[], aleatorio: boolean): boolean {
  const indice = obtenerSiguienteIndice(tablero);

  if (indice === -1) {
    return true;
  }

  const candidatos = obtenerCandidatos(tablero, indice);
  const numeros = aleatorio ? barajar(candidatos) : candidatos;

  for (const numero of numeros) {
    tablero[indice] = numero;

    if (resolverInterno(tablero, aleatorio)) {
      return true;
    }
  }

  tablero[indice] = null;
  return false;
}

function contarInterno(tablero: SudokuValor[], limite: number, totalActual: { total: number }) {
  if (totalActual.total >= limite) {
    return;
  }

  const indice = obtenerSiguienteIndice(tablero);

  if (indice === -1) {
    totalActual.total += 1;
    return;
  }

  const candidatos = obtenerCandidatos(tablero, indice);

  for (const numero of candidatos) {
    tablero[indice] = numero;
    contarInterno(tablero, limite, totalActual);

    if (totalActual.total >= limite) {
      break;
    }
  }

  tablero[indice] = null;
}

export function generarSolucionSudoku() {
  const tablero = Array<SudokuValor>(SUDOKU_CELDAS_TOTALES).fill(null);
  resolverInterno(tablero, true);
  return tablero as SudokuNumero[];
}

export function resolverSudoku(tablero: SudokuValor[]) {
  const copia = [...tablero];
  const resuelto = resolverInterno(copia, false);
  return resuelto ? (copia as SudokuNumero[]) : null;
}

export function contarSolucionesSudoku(tablero: SudokuValor[], limite = 2) {
  const copia = [...tablero];
  const totalActual = { total: 0 };
  contarInterno(copia, limite, totalActual);
  return totalActual.total;
}

export function esSudokuResuelto(tablero: SudokuValor[], solucion: SudokuNumero[]) {
  return tablero.every((valor, indice) => valor !== null && valor === solucion[indice]);
}
