import { Text, View } from "react-native";
import type { PropsWithChildren } from "react";

import { branding } from "@/src/config/branding";

interface TarjetaAuthProps extends PropsWithChildren {
  descripcion: string;
  subtitulo: string;
  titulo: string;
}

export function TarjetaAuth({
  children,
  descripcion,
  subtitulo,
  titulo,
}: TarjetaAuthProps) {
  return (
    <View
      className="w-full px-6 py-6 shadow-sm"
      style={{
        backgroundColor: branding.colores.superficie,
        borderColor: branding.colores.bordeSuave,
        borderRadius: branding.layout.radioTarjeta,
        borderWidth: 1,
        maxWidth: branding.layout.anchoTarjetaAuth,
      }}
    >
      <View className="mb-6">
        <Text
          className="text-xs font-semibold uppercase tracking-[1.8px]"
          style={{ color: branding.colores.textoSuave }}
        >
          {subtitulo}
        </Text>
        <Text
          className="mt-2 text-3xl font-extrabold leading-9"
          style={{ color: branding.colores.textoPrimario }}
        >
          {titulo}
        </Text>
        <Text className="mt-3 text-base leading-6" style={{ color: branding.colores.textoSecundario }}>
          {descripcion}
        </Text>
      </View>

      <View className="gap-4">{children}</View>
    </View>
  );
}
