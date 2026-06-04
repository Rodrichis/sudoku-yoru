import { useEffect, useState } from "react";

import { SUDOKU_AJUSTES_PREDETERMINADOS } from "@/src/constants/sudoku";
import { cargarSudokuAjustes, guardarSudokuAjustes } from "@/src/services/sudoku-storage";
import type { SudokuAjustes } from "@/src/types/sudoku";

export function useSudokuAjustes() {
  const [ajustes, setAjustes] = useState<SudokuAjustes>(SUDOKU_AJUSTES_PREDETERMINADOS);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activa = true;

    void cargarSudokuAjustes()
      .then((ajustesGuardados) => {
        if (!activa) {
          return;
        }

        setAjustes(ajustesGuardados);
        setCargando(false);
      })
      .catch(() => {
        if (!activa) {
          return;
        }

        setAjustes(SUDOKU_AJUSTES_PREDETERMINADOS);
        setCargando(false);
      });

    return () => {
      activa = false;
    };
  }, []);

  async function actualizarAjustes(cambios: Partial<SudokuAjustes>) {
    const siguientes = {
      ...ajustes,
      ...cambios,
    };

    setAjustes(siguientes);
    await guardarSudokuAjustes(siguientes);
  }

  return {
    actualizarAjustes,
    ajustes,
    cargando,
  };
}
