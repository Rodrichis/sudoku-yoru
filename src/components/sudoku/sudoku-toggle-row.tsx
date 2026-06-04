import { Pressable, Text, View } from "react-native";
import type { ReactNode } from "react";

import { branding } from "@/src/config/branding";

interface SudokuToggleRowProps {
  activo: boolean;
  descripcion?: string;
  icono: ReactNode;
  onPress: () => void;
  titulo: string;
}

export function SudokuToggleRow({
  activo,
  descripcion,
  icono,
  onPress,
  titulo,
}: SudokuToggleRowProps) {
  return (
    <Pressable
      className="flex-row items-center justify-between px-5 py-4"
      onPress={onPress}
      style={{
        borderBottomColor: branding.colores.bordeSuave,
        borderBottomWidth: 0.5,
      }}
    >
      <View className="flex-1 flex-row items-center gap-4 pr-4">
        {icono}
        <View className="flex-1">
          <Text
            className="text-[17px]"
            style={{
              color: branding.colores.textoPrimario,
              fontFamily: branding.tipografia.cuerpo,
            }}
          >
            {titulo}
          </Text>
          {descripcion ? (
            <Text
              className="mt-1 text-sm"
              style={{
                color: branding.colores.textoSuave,
                fontFamily: branding.tipografia.cuerpo,
              }}
            >
              {descripcion}
            </Text>
          ) : null}
        </View>
      </View>

      <View
        className="h-8 w-14 justify-center rounded-full px-1"
        style={{ backgroundColor: activo ? branding.colores.primario : branding.colores.superficieOscura }}
      >
        <View
          className="h-6 w-6 rounded-full"
          style={{
            alignSelf: activo ? "flex-end" : "flex-start",
            backgroundColor: branding.colores.textoInvertido,
          }}
        />
      </View>
    </Pressable>
  );
}
