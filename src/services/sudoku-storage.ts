import {
  SUDOKU_ACTIVIDAD_MAXIMA,
  SUDOKU_AJUSTES_PREDETERMINADOS,
  SUDOKU_CELDAS_TOTALES,
  SUDOKU_HISTORIAL_MAXIMO,
  SUDOKU_ORDEN_DIFICULTADES,
  SUDOKU_PISTAS_POR_PARTIDA,
  SUDOKU_TIEMPOS_MAXIMOS,
} from "@/src/constants/sudoku";
import type {
  SudokuAjustes,
  SudokuCelda,
  SudokuDificultad,
  SudokuEstadisticas,
  SudokuHistorialPaso,
  SudokuNumero,
  SudokuPartida,
  SudokuResumenPartida,
  SudokuTiempoRegistro,
} from "@/src/types/sudoku";
import { sudokuNumeros } from "@/src/types/sudoku";
import {
  crearSudokuEstadisticasPredeterminadas,
  registrarVictoriaSudoku,
} from "@/src/services/sudoku-estadisticas";
import { esSudokuResuelto } from "@/src/services/sudoku-solver";
import {
  eliminarStorage,
  guardarJsonStorage,
  leerJsonStorage,
} from "@/src/services/storage";

const SUDOKU_AJUSTES_KEY = "@sudoku-yoru/ajustes";

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function esEnteroNoNegativo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor >= 0;
}

function esNumeroSudoku(valor: unknown): valor is SudokuNumero {
  return typeof valor === "number" && sudokuNumeros.includes(valor as SudokuNumero);
}

function esDificultadSudoku(valor: unknown): valor is SudokuDificultad {
  return SUDOKU_ORDEN_DIFICULTADES.includes(valor as SudokuDificultad);
}

function esCeldaSudoku(valor: unknown): valor is SudokuCelda {
  return (
    esObjeto(valor) &&
    typeof valor.fija === "boolean" &&
    (valor.valor === null || esNumeroSudoku(valor.valor)) &&
    Array.isArray(valor.notas) &&
    valor.notas.every(esNumeroSudoku)
  );
}

function esInstantaneaSudoku(valor: unknown): valor is SudokuHistorialPaso {
  return (
    esObjeto(valor) &&
    typeof valor.notasActivas === "boolean" &&
    esEnteroNoNegativo(valor.pistasRestantes) &&
    valor.pistasRestantes <= SUDOKU_PISTAS_POR_PARTIDA &&
    Array.isArray(valor.celdas) &&
    valor.celdas.length === SUDOKU_CELDAS_TOTALES &&
    valor.celdas.every(
      (celda) =>
        esObjeto(celda) &&
        (celda.valor === null || esNumeroSudoku(celda.valor)) &&
        Array.isArray(celda.notas) &&
        celda.notas.every(esNumeroSudoku)
    )
  );
}

function esPartidaSudoku(valor: unknown): valor is SudokuPartida {
  if (
    !esObjeto(valor) ||
    typeof valor.actualizadaEl !== "string" ||
    !(valor.celdaSeleccionada === null || esEnteroNoNegativo(valor.celdaSeleccionada)) ||
    (typeof valor.celdaSeleccionada === "number" &&
      valor.celdaSeleccionada >= SUDOKU_CELDAS_TOTALES) ||
    !Array.isArray(valor.celdas) ||
    valor.celdas.length !== SUDOKU_CELDAS_TOTALES ||
    !valor.celdas.every(esCeldaSudoku) ||
    !esDificultadSudoku(valor.dificultad) ||
    typeof valor.finalizada !== "boolean" ||
    typeof valor.id !== "string" ||
    valor.id.length === 0 ||
    typeof valor.iniciadaEl !== "string" ||
    !Array.isArray(valor.historial) ||
    !valor.historial.every(esInstantaneaSudoku) ||
    typeof valor.notasActivas !== "boolean" ||
    typeof valor.pausada !== "boolean" ||
    !esEnteroNoNegativo(valor.pistasRestantes) ||
    valor.pistasRestantes > SUDOKU_PISTAS_POR_PARTIDA ||
    !esEnteroNoNegativo(valor.segundosTranscurridos) ||
    !Array.isArray(valor.solucion) ||
    valor.solucion.length !== SUDOKU_CELDAS_TOTALES ||
    !valor.solucion.every(esNumeroSudoku)
  ) {
    return false;
  }

  const solucion = valor.solucion as SudokuNumero[];

  if (!esSudokuResuelto(solucion, solucion)) {
    return false;
  }

  return valor.celdas.every(
    (celda, indice) => !celda.fija || celda.valor === solucion[indice]
  );
}

function normalizarAjustes(valor: unknown): SudokuAjustes {
  if (!esObjeto(valor)) {
    return { ...SUDOKU_AJUSTES_PREDETERMINADOS };
  }

  return {
    modoOscuro:
      typeof valor.modoOscuro === "boolean"
        ? valor.modoOscuro
        : SUDOKU_AJUSTES_PREDETERMINADOS.modoOscuro,
    mostrarErrores:
      typeof valor.mostrarErrores === "boolean"
        ? valor.mostrarErrores
        : SUDOKU_AJUSTES_PREDETERMINADOS.mostrarErrores,
    sonidos:
      typeof valor.sonidos === "boolean"
        ? valor.sonidos
        : SUDOKU_AJUSTES_PREDETERMINADOS.sonidos,
    vibracion:
      typeof valor.vibracion === "boolean"
        ? valor.vibracion
        : SUDOKU_AJUSTES_PREDETERMINADOS.vibracion,
  };
}

function normalizarEntero(valor: unknown, predeterminado = 0) {
  return esEnteroNoNegativo(valor) ? valor : predeterminado;
}

function esTiempoRegistro(valor: unknown): valor is SudokuTiempoRegistro {
  return (
    esObjeto(valor) &&
    esDificultadSudoku(valor.dificultad) &&
    esEnteroNoNegativo(valor.duracionSegundos) &&
    typeof valor.fecha === "string" &&
    !Number.isNaN(new Date(valor.fecha).getTime()) &&
    typeof valor.id === "string" &&
    valor.id.length > 0
  );
}

function normalizarEstadisticas(valor: unknown): SudokuEstadisticas {
  const predeterminadas = crearSudokuEstadisticasPredeterminadas();

  if (!esObjeto(valor)) {
    return predeterminadas;
  }

  const actividadDiaria = Array.isArray(valor.actividadDiaria)
    ? valor.actividadDiaria
        .filter(
          (item) =>
            esObjeto(item) &&
            typeof item.fecha === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(item.fecha) &&
            esEnteroNoNegativo(item.intentos) &&
            esEnteroNoNegativo(item.resueltos)
        )
        .slice(-SUDOKU_ACTIVIDAD_MAXIMA)
        .map((item) => ({
          fecha: item.fecha as string,
          intentos: item.intentos as number,
          resueltos: item.resueltos as number,
        }))
    : [];
  const historialTiempos = Array.isArray(valor.historialTiempos)
    ? valor.historialTiempos.filter(esTiempoRegistro).slice(-SUDOKU_TIEMPOS_MAXIMOS)
    : [];
  const partidasGanadas = normalizarEntero(valor.partidasGanadas);
  const partidasJugadas = Math.max(
    partidasGanadas,
    normalizarEntero(valor.partidasJugadas)
  );
  const rachaActual = normalizarEntero(valor.rachaActual);

  return {
    actividadDiaria,
    mejorTiempoSegundos:
      valor.mejorTiempoSegundos === null
        ? null
        : esEnteroNoNegativo(valor.mejorTiempoSegundos)
          ? valor.mejorTiempoSegundos
          : predeterminadas.mejorTiempoSegundos,
    historialTiempos,
    partidasGanadas,
    partidasJugadas,
    rachaActual,
    rachaMaxima: Math.max(rachaActual, normalizarEntero(valor.rachaMaxima)),
    totalTiempoGanadoSegundos: normalizarEntero(valor.totalTiempoGanadoSegundos),
  };
}

function obtenerPartidaKey(perfilId: string) {
  return `@sudoku-yoru/partida/${perfilId}`;
}

function obtenerEstadisticasKey(perfilId: string) {
  return `@sudoku-yoru/estadisticas/${perfilId}`;
}

export async function cargarSudokuAjustes() {
  const ajustes = await leerJsonStorage<unknown>(SUDOKU_AJUSTES_KEY);
  return normalizarAjustes(ajustes);
}

export async function guardarSudokuAjustes(ajustes: SudokuAjustes) {
  await guardarJsonStorage(SUDOKU_AJUSTES_KEY, ajustes);
}

export async function cargarSudokuPartida(perfilId: string) {
  const clave = obtenerPartidaKey(perfilId);
  const partida = await leerJsonStorage<unknown>(clave);

  if (!esPartidaSudoku(partida)) {
    if (partida !== null) {
      await eliminarStorage(clave);
    }

    return null;
  }

  return {
    ...partida,
    historial: partida.historial.slice(-SUDOKU_HISTORIAL_MAXIMO),
  };
}

export async function guardarSudokuPartida(perfilId: string, partida: SudokuPartida) {
  await guardarJsonStorage(obtenerPartidaKey(perfilId), partida);
}

export async function eliminarSudokuPartida(perfilId: string) {
  await eliminarStorage(obtenerPartidaKey(perfilId));
}

export async function cargarSudokuResumenPartida(perfilId: string): Promise<SudokuResumenPartida> {
  const partida = await cargarSudokuPartida(perfilId);

  if (!partida) {
    return {
      dificultad: "facil",
      existe: false,
      finalizada: false,
      id: null,
      segundosTranscurridos: 0,
    };
  }

  return {
    dificultad: partida.dificultad,
    existe: true,
    finalizada: partida.finalizada,
    id: partida.id,
    segundosTranscurridos: partida.segundosTranscurridos,
  };
}

export async function cargarSudokuEstadisticas(perfilId: string) {
  const estadisticas = await leerJsonStorage<unknown>(obtenerEstadisticasKey(perfilId));
  return normalizarEstadisticas(estadisticas);
}

export async function guardarSudokuEstadisticas(perfilId: string, estadisticas: SudokuEstadisticas) {
  await guardarJsonStorage(obtenerEstadisticasKey(perfilId), estadisticas);
}

export async function reconciliarSudokuVictoriaPendiente(perfilId: string) {
  const partida = await cargarSudokuPartida(perfilId);

  if (!partida?.finalizada) {
    return false;
  }

  const estadisticas = await cargarSudokuEstadisticas(perfilId);
  const siguientes = registrarVictoriaSudoku(estadisticas, {
    dificultad: partida.dificultad,
    duracionSegundos: partida.segundosTranscurridos,
    id: partida.id,
  });

  await guardarSudokuEstadisticas(perfilId, siguientes);
  await eliminarSudokuPartida(perfilId);
  return true;
}
