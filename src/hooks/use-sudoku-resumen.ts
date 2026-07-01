import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import { cargarSudokuResumenPartida } from "@/src/services/sudoku-storage";
import type { SudokuResumenPartida } from "@/src/types/sudoku";

const resumenVacio: SudokuResumenPartida = {
  dificultad: "facil",
  existe: false,
  finalizada: false,
  id: null,
  segundosTranscurridos: 0,
};

export function useSudokuResumen(perfilId: string | null) {
  const [cargando, setCargando] = useState(true);
  const [resumen, setResumen] = useState<SudokuResumenPartida>(resumenVacio);

  const refrescar = useCallback(async () => {
    if (!perfilId) {
      setResumen(resumenVacio);
      setCargando(false);
      return;
    }

    setCargando(true);
    const siguiente = await cargarSudokuResumenPartida(perfilId);
    setResumen(siguiente);
    setCargando(false);
  }, [perfilId]);

  useFocusEffect(
    useCallback(() => {
      void refrescar();
    }, [refrescar])
  );

  return {
    cargando,
    refrescar,
    resumen,
  };
}
