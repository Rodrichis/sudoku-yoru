import { Text, TextInput, View } from "react-native";
import type { ReactNode } from "react";
import type { TextInputProps } from "react-native";

import { branding } from "@/src/config/branding";
import { useTema } from "@/src/hooks/use-tema";

interface CampoTextoProps extends TextInputProps {
  descripcion?: string;
  error?: string;
  label: string;
  rightAccessory?: ReactNode;
}

export function CampoTexto({
  descripcion,
  error,
  label,
  rightAccessory,
  ...props
}: CampoTextoProps) {
  const { colores } = useTema();

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: colores.textoSuave,
          fontFamily: branding.tipografia.cuerpoSemi,
          fontSize: 11,
          letterSpacing: 1.8,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          alignItems: "center",
          backgroundColor: colores.fondoApp,
          borderColor: error ? colores.error : colores.bordeSuave,
          borderRadius: branding.layout.radioControl,
          borderWidth: 0.9,
          flexDirection: "row",
          minHeight: 54,
          paddingHorizontal: 16,
        }}
      >
        <TextInput
          placeholderTextColor={colores.textoSuave}
          style={{
            color: colores.textoPrimario,
            flex: 1,
            fontFamily: branding.tipografia.cuerpo,
            fontSize: 16,
            paddingVertical: 16,
          }}
          {...props}
        />
        {rightAccessory}
      </View>

      {error ? (
        <Text
          style={{
            color: colores.error,
            fontFamily: branding.tipografia.cuerpoMedio,
            fontSize: 14,
            marginTop: 8,
          }}
        >
          {error}
        </Text>
      ) : null}
      {!error && descripcion ? (
        <Text
          style={{
            color: colores.textoSuave,
            fontFamily: branding.tipografia.cuerpo,
            fontSize: 14,
            lineHeight: 20,
            marginTop: 8,
          }}
        >
          {descripcion}
        </Text>
      ) : null}
    </View>
  );
}
