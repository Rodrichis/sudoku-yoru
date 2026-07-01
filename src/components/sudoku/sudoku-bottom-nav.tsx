import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import type { Href } from "expo-router";

import { branding } from "@/src/config/branding";
import { useTema } from "@/src/hooks/use-tema";

function esRutaInicio(pathname: string) {
  return pathname === "/" || pathname === "/juego" || pathname === "/nueva-partida";
}

export function SudokuBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { colores, modoOscuro } = useTema();

  const items = [
    {
      activo: esRutaInicio(pathname),
      icono: "home-outline" as const,
      key: "home",
      ruta: "/(app)" as Href,
    },
    {
      activo: pathname === "/estadisticas",
      icono: "stats-chart-outline" as const,
      key: "stats",
      ruta: "/(app)/estadisticas" as Href,
    },
    {
      activo: pathname === "/ajustes",
      icono: "settings-outline" as const,
      key: "settings",
      ruta: "/(app)/ajustes" as Href,
    },
  ];

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: colores.fondoElevado,
        borderColor: colores.bordeSuave,
        borderRadius: 999,
        borderWidth: 0.8,
        bottom: 12,
        elevation: 24,
        flexDirection: "row",
        justifyContent: "space-around",
        left: 20,
        minHeight: branding.layout.tabBarAltura,
        paddingHorizontal: 10,
        position: "absolute",
        right: 20,
        shadowColor: modoOscuro ? "#000000" : "#9a8f86",
        shadowOffset: { height: 10, width: 0 },
        shadowOpacity: modoOscuro ? 0.36 : 0.16,
        shadowRadius: 18,
        zIndex: 30,
      }}
    >
      {items.map((item) => (
        <Pressable
          key={item.key}
          hitSlop={10}
          onPress={() => {
            if (!item.activo) {
              router.replace(item.ruta);
            }
          }}
          style={{
            alignItems: "center",
            backgroundColor: item.activo ? colores.primario : "transparent",
            borderRadius: 999,
            height: 48,
            justifyContent: "center",
            width: 76,
          }}
        >
          <Ionicons
            color={item.activo ? colores.textoInvertido : colores.textoSuave}
            name={item.icono}
            size={24}
          />
          <View
            style={{
              backgroundColor: item.activo ? colores.textoInvertido : "transparent",
              borderRadius: 999,
              height: 4,
              marginTop: 3,
              opacity: item.activo ? 0.82 : 0,
              width: 16,
            }}
          />
        </Pressable>
      ))}
    </View>
  );
}
