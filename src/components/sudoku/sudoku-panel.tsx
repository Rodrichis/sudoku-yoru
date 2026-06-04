import { View } from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

import { branding } from "@/src/config/branding";

interface SudokuPanelProps extends PropsWithChildren {
  estilo?: ViewStyle;
}

export function SudokuPanel({ children, estilo }: SudokuPanelProps) {
  return (
    <View
      className="px-5 py-5"
      style={[
        {
          backgroundColor: branding.colores.fondoElevado,
          borderColor: branding.colores.bordeSuave,
          borderRadius: branding.layout.radioTarjeta,
          borderWidth: 0.7,
        },
        estilo,
      ]}
    >
      {children}
    </View>
  );
}
