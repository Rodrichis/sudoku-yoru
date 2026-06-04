import { useCallback, useEffect, useState } from "react";

import { cargarSudokuEstadisticas } from "@/src/services/sudoku-storage";
import type { SudokuEstadisticas } from "@/src/types/sudoku";

export function useSudokuEstadisticas(perfilId: string | null) {
  const [cargando, setCargando] = useState(true);
  const [estadisticas, setEstadisticas] = useState<SudokuEstadisticas | null>(null);

  const refrescar = useCallback(async () => {
    if (!perfilId) {
      setEstadisticas(null);
      setCargando(false);
      return;
    }

    setCargando(true);
    const siguientes = await cargarSudokuEstadisticas(perfilId);
    setEstadisticas(siguientes);
    setCargando(false);
  }, [perfilId]);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  return {
    cargando,
    estadisticas,
    refrescar,
  };
}
