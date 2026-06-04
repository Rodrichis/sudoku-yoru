import { Pressable, Text, View } from "react-native";

import { branding } from "@/src/config/branding";
import type { SudokuCelda } from "@/src/types/sudoku";

interface SudokuBoardProps {
  celdas: SudokuCelda[];
  deshabilitado?: boolean;
  indicesErroneos: number[];
  indicesMismoValor: number[];
  indicesRelacionados: number[];
  indiceSeleccionado: number | null;
  onPressCelda: (indice: number) => void;
}

function SudokuNotas({ notas }: { notas: number[] }) {
  return (
    <View className="flex-row flex-wrap">
      {Array.from({ length: 9 }, (_, indice) => indice + 1).map((numero) => (
        <View key={numero} className="w-1/3 items-center justify-center">
          <Text
            className="text-[10px]"
            style={{
              color: branding.colores.textoSuave,
              fontFamily: branding.tipografia.cuerpo,
            }}
          >
            {notas.includes(numero as never) ? numero : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function SudokuBoard({
  celdas,
  deshabilitado = false,
  indicesErroneos,
  indicesMismoValor,
  indicesRelacionados,
  indiceSeleccionado,
  onPressCelda,
}: SudokuBoardProps) {
  return (
    <View
      className="w-full overflow-hidden"
      style={{
        aspectRatio: 1,
        borderColor: branding.colores.primario,
        borderRadius: 18,
        borderWidth: branding.layout.bordeGruesoSudoku,
      }}
    >
      <View className="flex-1 flex-row flex-wrap">
        {celdas.map((celda, indice) => {
          const fila = Math.floor(indice / 9);
          const columna = indice % 9;
          const esSeleccionada = indiceSeleccionado === indice;
          const esRelacionada = indicesRelacionados.includes(indice);
          const esMismoValor = indicesMismoValor.includes(indice);
          const esErronea = indicesErroneos.includes(indice);
          let fondo: string = branding.colores.fondoElevado;

          if (esRelacionada || esMismoValor) {
            fondo = branding.colores.resalteGrupo;
          }

          if (esSeleccionada) {
            fondo = branding.colores.resalteCelda;
          }

          return (
            <Pressable
              key={indice}
              className="items-center justify-center"
              disabled={deshabilitado}
              onPress={() => onPressCelda(indice)}
              style={{
                backgroundColor: fondo,
                borderBottomColor: branding.colores.bordeSuave,
                borderBottomWidth: fila === 8 ? 0 : fila === 2 || fila === 5 ? branding.layout.bordeGruesoSudoku : branding.layout.bordeSuaveSudoku,
                borderRightColor: branding.colores.bordeSuave,
                borderRightWidth: columna === 8 ? 0 : columna === 2 || columna === 5 ? branding.layout.bordeGruesoSudoku : branding.layout.bordeSuaveSudoku,
                height: "11.111%",
                opacity: deshabilitado ? 0.55 : 1,
                width: "11.111%",
              }}
            >
              {celda.valor !== null ? (
                <Text
                  className="text-[23px]"
                  style={{
                    color: celda.fija
                      ? branding.colores.textoPrimario
                      : esErronea
                        ? branding.colores.error
                        : branding.colores.primario,
                    fontFamily: branding.tipografia.numeros,
                    fontWeight: celda.fija ? "600" : "500",
                  }}
                >
                  {celda.valor}
                </Text>
              ) : (
                <SudokuNotas notas={celda.notas} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
