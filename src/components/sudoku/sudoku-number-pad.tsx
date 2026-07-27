import { Pressable, Text, View } from "react-native";

import { branding } from "@/src/config/branding";
import { sudokuNumeros, type SudokuNumero } from "@/src/types/sudoku";

interface SudokuNumberPadProps {
  deshabilitado?: boolean;
  onPressNumero: (numero: SudokuNumero) => void;
}

export function SudokuNumberPad({
  deshabilitado = false,
  onPressNumero,
}: SudokuNumberPadProps) {
  return (
    <View className="flex-row gap-1">
      {sudokuNumeros.map((numero) => (
        <Pressable
          key={numero}
          accessibilityLabel={`Ingresar ${numero}`}
          accessibilityRole="button"
          className="h-14 flex-1 items-center justify-center rounded-xl"
          disabled={deshabilitado}
          onPress={() => onPressNumero(numero)}
          style={{
            backgroundColor: branding.colores.superficie,
            borderColor: branding.colores.bordeSuave,
            borderWidth: 0.8,
            opacity: deshabilitado ? 0.5 : 1,
          }}
        >
          <Text
            className="text-[20px]"
            style={{
              color: branding.colores.primario,
              fontFamily: branding.tipografia.numeros,
            }}
          >
            {numero}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
