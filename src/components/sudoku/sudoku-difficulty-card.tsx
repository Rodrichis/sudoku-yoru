import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { branding } from "@/src/config/branding";
import type { SudokuDificultad } from "@/src/types/sudoku";

interface SudokuDifficultyCardProps {
  descripcion: string;
  dificultad: SudokuDificultad;
  objetivoMinutos: number;
  onPress: (dificultad: SudokuDificultad) => void;
  seleccionada?: boolean;
  titulo: string;
}

export function SudokuDifficultyCard({
  descripcion,
  dificultad,
  objetivoMinutos,
  onPress,
  seleccionada = false,
  titulo,
}: SudokuDifficultyCardProps) {
  const iconos: Record<SudokuDificultad, keyof typeof Ionicons.glyphMap> = {
    dificil: "filter-outline",
    experto: "flash-outline",
    facil: "remove-circle-outline",
    medio: "ellipse-outline",
  };

  return (
    <Pressable
      className="mb-3 flex-row items-center gap-4 px-5 py-5"
      onPress={() => onPress(dificultad)}
      style={{
        backgroundColor: seleccionada ? branding.colores.superficie : branding.colores.fondoElevado,
        borderColor: seleccionada ? branding.colores.primario : branding.colores.bordeSuave,
        borderRadius: branding.layout.radioTarjeta,
        borderWidth: 0.8,
        transform: [{ translateY: seleccionada ? -2 : 0 }],
      }}
    >
      <Ionicons
        color={seleccionada ? branding.colores.primario : branding.colores.textoSuave}
        name={iconos[dificultad]}
        size={28}
      />
      <View className="flex-1">
        <Text
          className="text-[23px]"
          style={{
            color: branding.colores.textoPrimario,
            fontFamily: branding.tipografia.tituloMedio,
          }}
        >
          {titulo}
        </Text>
        <Text
          className="mt-1 text-[15px]"
          style={{
            color: branding.colores.textoSecundario,
            fontFamily: branding.tipografia.cuerpo,
          }}
        >
          {descripcion}
        </Text>
      </View>
      <Text
        className="text-[11px] uppercase tracking-[1.8px]"
        style={{
          color: branding.colores.textoSuave,
          fontFamily: branding.tipografia.cuerpoSemi,
        }}
      >
        {objetivoMinutos} min
      </Text>
    </Pressable>
  );
}
