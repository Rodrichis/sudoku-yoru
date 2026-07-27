import { SUDOKU_CELDAS_TOTALES } from "@/src/constants/sudoku";
import { sudokuNumeros, type SudokuNumero, type SudokuValor } from "@/src/types/sudoku";
import { barajar, obtenerBloqueSudoku } from "@/src/utils/sudoku";

const MASCARA_NUMEROS = 0b1111111110;

interface SudokuEstadoResolucion {
  bloques: number[];
  columnas: number[];
  filas: number[];
  tablero: SudokuValor[];
}

function crearEstadoResolucion(tablero: SudokuValor[]): SudokuEstadoResolucion | null {
  if (tablero.length !== SUDOKU_CELDAS_TOTALES) {
    return null;
  }

  const estado: SudokuEstadoResolucion = {
    bloques: Array(9).fill(0),
    columnas: Array(9).fill(0),
    filas: Array(9).fill(0),
    tablero,
  };

  for (let indice = 0; indice < tablero.length; indice += 1) {
    const valor = tablero[indice];

    if (valor === null) {
      continue;
    }

    if (!sudokuNumeros.includes(valor)) {
      return null;
    }

    const fila = Math.floor(indice / 9);
    const columna = indice % 9;
    const bloque = obtenerBloqueSudoku(indice);
    const mascara = 1 << valor;

    if (
      (estado.filas[fila] & mascara) !== 0 ||
      (estado.columnas[columna] & mascara) !== 0 ||
      (estado.bloques[bloque] & mascara) !== 0
    ) {
      return null;
    }

    estado.filas[fila] |= mascara;
    estado.columnas[columna] |= mascara;
    estado.bloques[bloque] |= mascara;
  }

  return estado;
}

export function esTableroSudokuValido(tablero: SudokuValor[]) {
  return crearEstadoResolucion(tablero) !== null;
}

function obtenerMascaraCandidatos(estado: SudokuEstadoResolucion, indice: number) {
  const fila = Math.floor(indice / 9);
  const columna = indice % 9;
  const bloque = obtenerBloqueSudoku(indice);
  const ocupados =
    estado.filas[fila] | estado.columnas[columna] | estado.bloques[bloque];

  return MASCARA_NUMEROS & ~ocupados;
}

function contarBits(mascara: number) {
  let total = 0;
  let restante = mascara;

  while (restante !== 0) {
    restante &= restante - 1;
    total += 1;
  }

  return total;
}

function obtenerSiguienteCelda(estado: SudokuEstadoResolucion) {
  let mejorIndice = -1;
  let mejorMascara = 0;
  let menorCantidad = 10;

  for (let indice = 0; indice < SUDOKU_CELDAS_TOTALES; indice += 1) {
    if (estado.tablero[indice] !== null) {
      continue;
    }

    const mascara = obtenerMascaraCandidatos(estado, indice);
    const cantidad = contarBits(mascara);

    if (cantidad === 0) {
      return { indice, mascara };
    }

    if (cantidad < menorCantidad) {
      mejorIndice = indice;
      mejorMascara = mascara;
      menorCantidad = cantidad;

      if (cantidad === 1) {
        break;
      }
    }
  }

  return { indice: mejorIndice, mascara: mejorMascara };
}

function obtenerNumerosMascara(mascara: number) {
  return sudokuNumeros.filter((numero) => (mascara & (1 << numero)) !== 0);
}

function colocarNumero(
  estado: SudokuEstadoResolucion,
  indice: number,
  numero: SudokuNumero
) {
  const fila = Math.floor(indice / 9);
  const columna = indice % 9;
  const bloque = obtenerBloqueSudoku(indice);
  const mascara = 1 << numero;

  estado.tablero[indice] = numero;
  estado.filas[fila] |= mascara;
  estado.columnas[columna] |= mascara;
  estado.bloques[bloque] |= mascara;
}

function quitarNumero(
  estado: SudokuEstadoResolucion,
  indice: number,
  numero: SudokuNumero
) {
  const fila = Math.floor(indice / 9);
  const columna = indice % 9;
  const bloque = obtenerBloqueSudoku(indice);
  const mascaraInversa = ~(1 << numero);

  estado.tablero[indice] = null;
  estado.filas[fila] &= mascaraInversa;
  estado.columnas[columna] &= mascaraInversa;
  estado.bloques[bloque] &= mascaraInversa;
}

function resolverInterno(estado: SudokuEstadoResolucion, aleatorio: boolean): boolean {
  const { indice, mascara } = obtenerSiguienteCelda(estado);

  if (indice === -1) {
    return true;
  }

  const candidatos = obtenerNumerosMascara(mascara);
  const numeros = aleatorio ? barajar(candidatos) : candidatos;

  for (const numero of numeros) {
    colocarNumero(estado, indice, numero);

    if (resolverInterno(estado, aleatorio)) {
      return true;
    }

    quitarNumero(estado, indice, numero);
  }

  return false;
}

function contarInterno(
  estado: SudokuEstadoResolucion,
  limite: number,
  totalActual: { total: number }
) {
  if (totalActual.total >= limite) {
    return;
  }

  const { indice, mascara } = obtenerSiguienteCelda(estado);

  if (indice === -1) {
    totalActual.total += 1;
    return;
  }

  for (const numero of obtenerNumerosMascara(mascara)) {
    colocarNumero(estado, indice, numero);
    contarInterno(estado, limite, totalActual);
    quitarNumero(estado, indice, numero);

    if (totalActual.total >= limite) {
      break;
    }
  }
}

export function generarSolucionSudoku() {
  const tablero = Array<SudokuValor>(SUDOKU_CELDAS_TOTALES).fill(null);
  const estado = crearEstadoResolucion(tablero);

  if (!estado || !resolverInterno(estado, true)) {
    throw new Error("No fue posible generar una solucion Sudoku valida.");
  }

  return tablero as SudokuNumero[];
}

export function resolverSudoku(tablero: SudokuValor[]) {
  const copia = [...tablero];
  const estado = crearEstadoResolucion(copia);

  if (!estado) {
    return null;
  }

  const resuelto = resolverInterno(estado, false);
  return resuelto ? (copia as SudokuNumero[]) : null;
}

export function contarSolucionesSudoku(tablero: SudokuValor[], limite = 2) {
  if (limite < 1) {
    return 0;
  }

  const copia = [...tablero];
  const estado = crearEstadoResolucion(copia);

  if (!estado) {
    return 0;
  }

  const totalActual = { total: 0 };
  contarInterno(estado, limite, totalActual);
  return totalActual.total;
}

export function esSudokuResuelto(tablero: SudokuValor[], solucion: SudokuNumero[]) {
  return (
    tablero.length === SUDOKU_CELDAS_TOTALES &&
    solucion.length === SUDOKU_CELDAS_TOTALES &&
    esTableroSudokuValido(tablero) &&
    tablero.every((valor, indice) => valor !== null && valor === solucion[indice])
  );
}
