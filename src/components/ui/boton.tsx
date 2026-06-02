import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { ReactNode } from "react";
import type { TextStyle, ViewStyle } from "react-native";

import { branding } from "@/src/config/branding";

type VarianteBoton = "primario" | "secundario" | "ghost";

interface BotonProps {
  cargando?: boolean;
  deshabilitado?: boolean;
  etiqueta: string;
  icono?: ReactNode;
  onPress?: () => void | Promise<void>;
  variante?: VarianteBoton;
}

const estilosVariante: Record<VarianteBoton, ViewStyle> = {
  ghost: {
    backgroundColor: branding.colores.superficie,
    borderColor: branding.colores.bordeFuerte,
    borderWidth: 1,
  },
  primario: {
    backgroundColor: branding.colores.primario,
  },
  secundario: {
    backgroundColor: branding.colores.secundario,
  },
};

const estilosTexto: Record<VarianteBoton, TextStyle> = {
  ghost: {
    color: branding.colores.textoPrimario,
  },
  primario: {
    color: branding.colores.textoInvertido,
  },
  secundario: {
    color: branding.colores.textoInvertido,
  },
};

const coloresIndicador: Record<VarianteBoton, string> = {
  ghost: branding.colores.textoPrimario,
  primario: branding.colores.textoInvertido,
  secundario: branding.colores.textoInvertido,
};

export function Boton({
  cargando = false,
  deshabilitado = false,
  etiqueta,
  icono,
  onPress,
  variante = "primario",
}: BotonProps) {
  return (
    <Pressable
      className="min-h-14 flex-row items-center justify-center px-4"
      disabled={deshabilitado || cargando}
      onPress={onPress}
      style={[
        {
          borderRadius: branding.layout.radioControl,
        },
        estilosVariante[variante],
        deshabilitado || cargando ? { opacity: 0.6 } : null,
      ]}
    >
      <View className="flex-row items-center gap-2">
        {cargando ? <ActivityIndicator color={coloresIndicador[variante]} /> : icono}
        <Text className="text-base font-bold" style={estilosTexto[variante]}>
          {etiqueta}
        </Text>
      </View>
    </Pressable>
  );
}
