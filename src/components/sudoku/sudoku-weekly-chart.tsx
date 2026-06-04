import { Text, View } from "react-native";

import { SudokuPanel } from "@/src/components/sudoku/sudoku-panel";
import { branding } from "@/src/config/branding";

interface SudokuWeeklyChartProps {
  datos: {
    etiqueta: string;
    intentos: number;
    resueltos: number;
  }[];
  etiquetaIntentos: string;
  etiquetaResueltos: string;
}

export function SudokuWeeklyChart({
  datos,
  etiquetaIntentos,
  etiquetaResueltos,
}: SudokuWeeklyChartProps) {
  const maximo = Math.max(1, ...datos.flatMap((item) => [item.intentos, item.resueltos]));

  return (
    <SudokuPanel>
      <View className="mb-6 flex-row items-center justify-end gap-5">
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: branding.colores.primario }}
          />
          <Text style={{ color: branding.colores.textoSecundario, fontFamily: branding.tipografia.cuerpo }}>
            {etiquetaResueltos}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: branding.colores.secundario }}
          />
          <Text style={{ color: branding.colores.textoSecundario, fontFamily: branding.tipografia.cuerpo }}>
            {etiquetaIntentos}
          </Text>
        </View>
      </View>

      <View className="h-56 flex-row items-end justify-between gap-3">
        {datos.map((item) => (
          <View key={item.etiqueta} className="flex-1 items-center justify-end">
            <View className="h-40 w-full flex-row items-end justify-center gap-2">
              <View
                className="w-4 rounded-t-full"
                style={{
                  backgroundColor: branding.colores.primario,
                  height: `${(item.resueltos / maximo) * 100}%`,
                  minHeight: item.resueltos > 0 ? 10 : 0,
                }}
              />
              <View
                className="w-4 rounded-t-full"
                style={{
                  backgroundColor: branding.colores.secundario,
                  height: `${(item.intentos / maximo) * 100}%`,
                  minHeight: item.intentos > 0 ? 10 : 0,
                }}
              />
            </View>
            <Text
              className="mt-4 text-sm"
              style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
            >
              {item.etiqueta}
            </Text>
          </View>
        ))}
      </View>
    </SudokuPanel>
  );
}
