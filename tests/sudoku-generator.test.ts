import assert from "node:assert/strict";
import test from "node:test";

import {
  SUDOKU_DIFICULTADES,
  SUDOKU_ORDEN_DIFICULTADES,
} from "@/src/constants/sudoku";
import { generarPuzzleSudoku } from "@/src/services/sudoku-generator";
import {
  contarSolucionesSudoku,
  esSudokuResuelto,
  resolverSudoku,
} from "@/src/services/sudoku-solver";

for (const dificultad of SUDOKU_ORDEN_DIFICULTADES) {
  test(`genera puzzles ${dificultad} validos y unicos`, () => {
    const configuracion = SUDOKU_DIFICULTADES[dificultad];

    for (let intento = 0; intento < 4; intento += 1) {
      const puzzle = generarPuzzleSudoku(dificultad);
      const pistasVisibles = puzzle.pistas.filter((valor) => valor !== null).length;
      const resuelto = resolverSudoku(puzzle.pistas);

      assert.ok(pistasVisibles >= configuracion.pistasMinimas);
      assert.ok(pistasVisibles <= configuracion.pistasMaximas);
      assert.equal(contarSolucionesSudoku(puzzle.pistas), 1);
      assert.ok(resuelto);
      assert.equal(esSudokuResuelto(resuelto, puzzle.solucion), true);
    }
  });
}
