import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { ReactNode } from "react";
import type { TextStyle, ViewStyle } from "react-native";

import { branding } from "@/src/config/branding";
import { useTema } from "@/src/hooks/use-tema";

type VarianteBoton = "primario" | "secundario" | "ghost";

interface BotonProps {
  cargando?: boolean;
  deshabilitado?: boolean;
  etiqueta: string;
  icono?: ReactNode;
  onPress?: () => void | Promise<void>;
  variante?: VarianteBoton;
}

function obtenerEstilosVariante(variante: VarianteBoton): ViewStyle {
  if (variante === "ghost") {
    return {
      backgroundColor: branding.colores.fondoElevado,
      borderColor: branding.colores.bordeSuave,
      borderWidth: 1,
    };
  }

  if (variante === "secundario") {
    return {
      backgroundColor: branding.colores.secundario,
    };
  }

  return {
    backgroundColor: branding.colores.primario,
  };
}

function obtenerTextoVariante(variante: VarianteBoton): TextStyle {
  if (variante === "ghost") {
    return {
      color: branding.colores.textoPrimario,
      fontFamily: branding.tipografia.cuerpoSemi,
    };
  }

  return {
    color: branding.colores.textoInvertido,
    fontFamily: branding.tipografia.cuerpoSemi,
  };
}

function obtenerColorIndicador(variante: VarianteBoton) {
  return variante === "ghost" ? branding.colores.textoPrimario : branding.colores.textoInvertido;
}

export function Boton({
  cargando = false,
  deshabilitado = false,
  etiqueta,
  icono,
  onPress,
  variante = "primario",
}: BotonProps) {
  useTema();

  return (
    <Pressable
      disabled={deshabilitado || cargando}
      onPress={onPress}
      style={[
        {
          alignItems: "center",
          borderRadius: 999,
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 16,
          minHeight: 54,
          paddingHorizontal: 20,
        },
        obtenerEstilosVariante(variante),
        deshabilitado || cargando ? { opacity: 0.6 } : null,
      ]}
    >
      <View style={{ alignItems: "center", flexDirection: "row" }}>
        {cargando ? <ActivityIndicator color={obtenerColorIndicador(variante)} /> : icono}
        <Text
          style={{
            ...obtenerTextoVariante(variante),
            fontSize: 14,
            letterSpacing: 1.8,
            marginLeft: icono || cargando ? 8 : 0,
          }}
        >
          {etiqueta}
        </Text>
      </View>
    </Pressable>
  );
}
