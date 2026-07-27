import assert from "node:assert/strict";
import test from "node:test";

import {
  contarSolucionesSudoku,
  esSudokuResuelto,
  resolverSudoku,
} from "@/src/services/sudoku-solver";
import type { SudokuNumero, SudokuValor } from "@/src/types/sudoku";

const puzzle: SudokuValor[] = [
  5, 3, null, null, 7, null, null, null, null,
  6, null, null, 1, 9, 5, null, null, null,
  null, 9, 8, null, null, null, null, 6, null,
  8, null, null, null, 6, null, null, null, 3,
  4, null, null, 8, null, 3, null, null, 1,
  7, null, null, null, 2, null, null, null, 6,
  null, 6, null, null, null, null, 2, 8, null,
  null, null, null, 4, 1, 9, null, null, 5,
  null, null, null, null, 8, null, null, 7, 9,
];

const solucion: SudokuNumero[] = [
  5, 3, 4, 6, 7, 8, 9, 1, 2,
  6, 7, 2, 1, 9, 5, 3, 4, 8,
  1, 9, 8, 3, 4, 2, 5, 6, 7,
  8, 5, 9, 7, 6, 1, 4, 2, 3,
  4, 2, 6, 8, 5, 3, 7, 9, 1,
  7, 1, 3, 9, 2, 4, 8, 5, 6,
  9, 6, 1, 5, 3, 7, 2, 8, 4,
  2, 8, 7, 4, 1, 9, 6, 3, 5,
  3, 4, 5, 2, 8, 6, 1, 7, 9,
];

test("resuelve un Sudoku valido con solucion unica", () => {
  assert.equal(contarSolucionesSudoku(puzzle), 1);
  assert.deepEqual(resolverSudoku(puzzle), solucion);
  assert.equal(esSudokuResuelto(solucion, solucion), true);
});

test("rechaza un tablero completo con numeros duplicados", () => {
  const invalido = [...solucion] as SudokuNumero[];
  invalido[0] = invalido[1];

  assert.equal(contarSolucionesSudoku(invalido), 0);
  assert.equal(resolverSudoku(invalido), null);
  assert.equal(esSudokuResuelto(invalido, invalido), false);
});

test("rechaza tableros con una cantidad de celdas incorrecta", () => {
  assert.equal(contarSolucionesSudoku(puzzle.slice(0, 80)), 0);
  assert.equal(resolverSudoku(puzzle.slice(0, 80)), null);
});
