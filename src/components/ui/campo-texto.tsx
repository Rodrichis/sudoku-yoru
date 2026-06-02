import { Text, TextInput, View } from "react-native";
import type { ReactNode } from "react";
import type { TextInputProps } from "react-native";

import { branding } from "@/src/config/branding";

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
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold" style={{ color: branding.colores.textoSecundario }}>
        {label}
      </Text>

      <View
        className="min-h-14 flex-row items-center px-4"
        style={{
          backgroundColor: branding.colores.superficie,
          borderColor: error ? branding.colores.error : branding.colores.bordeSuave,
          borderRadius: branding.layout.radioControl,
          borderWidth: 1,
        }}
      >
        <TextInput
          className="flex-1 py-3 text-base"
          placeholderTextColor={branding.colores.textoSuave}
          style={{ color: branding.colores.textoPrimario }}
          {...props}
        />
        {rightAccessory}
      </View>

      {error ? (
        <Text className="text-sm font-medium" style={{ color: branding.colores.error }}>
          {error}
        </Text>
      ) : null}
      {!error && descripcion ? (
        <Text className="text-sm leading-5" style={{ color: branding.colores.textoSuave }}>
          {descripcion}
        </Text>
      ) : null}
    </View>
  );
}
