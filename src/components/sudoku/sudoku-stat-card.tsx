import { Text, View } from "react-native";

import { branding } from "@/src/config/branding";

interface SudokuStatCardProps {
  etiqueta: string;
  nota?: string;
  valor: string;
}

export function SudokuStatCard({ etiqueta, nota, valor }: SudokuStatCardProps) {
  return (
    <View
      className="aspect-square flex-1 px-5 py-5"
      style={{
        backgroundColor: branding.colores.fondoElevado,
        borderColor: branding.colores.bordeSuave,
        borderRadius: branding.layout.radioTarjeta,
        borderWidth: 0.8,
      }}
    >
      <Text
        className="text-xs uppercase tracking-[2px]"
        style={{
          color: branding.colores.textoSuave,
          fontFamily: branding.tipografia.cuerpo,
        }}
      >
        {etiqueta}
      </Text>
      <View className="flex-1 justify-end">
        <Text
          className="text-[44px]"
          style={{
            color: branding.colores.primario,
            fontFamily: branding.tipografia.titulo,
          }}
        >
          {valor}
        </Text>
      </View>
      {nota ? (
        <Text
          className="mt-1 text-[12px]"
          style={{
            color: branding.colores.textoSuave,
            fontFamily: branding.tipografia.cuerpo,
          }}
        >
          {nota}
        </Text>
      ) : null}
    </View>
  );
}
