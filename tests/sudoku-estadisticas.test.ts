import assert from "node:assert/strict";
import test from "node:test";

import {
  crearSudokuEstadisticasPredeterminadas,
  registrarVictoriaSudoku,
} from "@/src/services/sudoku-estadisticas";
import { obtenerClaveDiaLocal } from "@/src/utils/sudoku";

test("construye la clave diaria con la fecha local y no con UTC", () => {
  const fechaLocal = new Date(2026, 0, 2, 23, 45, 0);
  assert.equal(obtenerClaveDiaLocal(fechaLocal), "2026-01-02");
});

test("registrar una victoria es idempotente por id de partida", () => {
  const iniciales = crearSudokuEstadisticasPredeterminadas();
  const datos = {
    dificultad: "medio" as const,
    duracionSegundos: 420,
    id: "partida-1",
  };
  const primera = registrarVictoriaSudoku(iniciales, datos);
  const repetida = registrarVictoriaSudoku(primera, datos);

  assert.equal(primera.partidasGanadas, 1);
  assert.equal(repetida.partidasGanadas, 1);
  assert.equal(repetida.historialTiempos.length, 1);
  assert.deepEqual(repetida, primera);
});
