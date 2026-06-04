import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import type { Href } from "expo-router";

import { branding } from "@/src/config/branding";

function esRutaInicio(pathname: string) {
  return pathname === "/" || pathname === "/juego" || pathname === "/nueva-partida";
}

export function SudokuBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

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
      className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around px-10 pb-3 pt-2"
      style={{
        backgroundColor: branding.colores.fondoApp,
        borderTopColor: branding.colores.bordeSuave,
        borderTopWidth: 0.5,
        minHeight: branding.layout.tabBarAltura,
      }}
    >
      {items.map((item) => (
        <Pressable
          key={item.key}
          className="items-center justify-center px-3 py-2"
          onPress={() => router.replace(item.ruta)}
        >
          <Ionicons
            color={item.activo ? branding.colores.primario : branding.colores.textoSuave}
            name={item.icono}
            size={24}
          />
          <View
            style={{
              backgroundColor: item.activo ? branding.colores.primario : "transparent",
              borderRadius: 999,
              height: 4,
              marginTop: 4,
              width: 4,
            }}
          />
        </Pressable>
      ))}
    </View>
  );
}
