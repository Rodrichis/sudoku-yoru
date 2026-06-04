import { Text, View } from "react-native";
import type { PropsWithChildren } from "react";

import { branding } from "@/src/config/branding";
import { useTema } from "@/src/hooks/use-tema";

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
  const { colores } = useTema();

  return (
    <View
      style={{
        backgroundColor: colores.superficie,
        borderColor: colores.bordeSuave,
        borderRadius: branding.layout.radioTarjeta,
        borderWidth: 1,
        maxWidth: branding.layout.anchoTarjetaAuth,
        paddingHorizontal: 20,
        paddingVertical: 24,
        width: "100%",
      }}
    >
      <View style={{ marginBottom: 28 }}>
        <View style={{ alignItems: "center", flexDirection: "row", marginBottom: 20 }}>
          <View
            style={{
              alignItems: "center",
              backgroundColor: colores.superficieOscura,
              borderColor: colores.bordeSuave,
              borderRadius: 999,
              borderWidth: 0.8,
              height: 44,
              justifyContent: "center",
              marginRight: 12,
              width: 44,
            }}
          >
            <View
              style={{
                borderColor: colores.primario,
                borderRadius: 6,
                borderWidth: 1.2,
                height: 20,
                width: 20,
              }}
            />
          </View>

          <View>
            <Text
              style={{
                color: colores.textoSuave,
                fontFamily: branding.tipografia.cuerpoSemi,
                fontSize: 11,
                letterSpacing: 2.2,
              }}
            >
              {branding.app.nombre}
            </Text>
            <Text
              style={{
                color: colores.secundario,
                fontFamily: branding.tipografia.cuerpo,
                fontSize: 11,
                letterSpacing: 2,
                marginTop: 4,
              }}
            >
              {subtitulo}
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: colores.textoPrimario,
            fontFamily: branding.tipografia.tituloFuerte,
            fontSize: 32,
            lineHeight: 38,
          }}
        >
          {titulo}
        </Text>
        <Text
          style={{
            color: colores.textoSecundario,
            fontFamily: branding.tipografia.cuerpo,
            fontSize: 15,
            lineHeight: 24,
            marginTop: 12,
          }}
        >
          {descripcion}
        </Text>
      </View>
      <View>{children}</View>
    </View>
  );
}
