import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PropsWithChildren } from "react";

import { SudokuBottomNav } from "@/src/components/sudoku/sudoku-bottom-nav";
import { branding } from "@/src/config/branding";
import { useTema } from "@/src/hooks/use-tema";

interface SudokuPageProps extends PropsWithChildren {
  conNavegacion?: boolean;
  scroll?: boolean;
}

export function SudokuPage({
  children,
  conNavegacion = true,
  scroll = true,
}: SudokuPageProps) {
  const { colores, modoOscuro } = useTema();

  const contenido = scroll ? (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        flexGrow: 1,
        paddingBottom: conNavegacion ? branding.layout.tabBarAltura + 54 : 28,
        width: "100%",
      }}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, width: "100%" }}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={{
        alignItems: "center",
        flex: 1,
        paddingBottom: conNavegacion ? branding.layout.tabBarAltura + 42 : 16,
        width: "100%",
      }}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: colores.fondoApp, flex: 1 }}>
      <View style={{ flex: 1, position: "relative" }}>
        <View
          pointerEvents="none"
          style={{
            backgroundColor: colores.resalteGrupo,
            borderRadius: 999,
            height: 260,
            opacity: modoOscuro ? 0.08 : 0.2,
            position: "absolute",
            right: -90,
            top: -120,
            width: 260,
            zIndex: 0,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            bottom: 0,
            left: 0,
            opacity: 0.18,
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 0,
          }}
        >
          {Array.from({ length: 16 }, (_, fila) => (
            <View key={fila} className="flex-row justify-around" style={{ marginTop: fila === 0 ? 12 : 24 }}>
              {Array.from({ length: 10 }, (_, columna) => (
                <View
                  key={`${fila}-${columna}`}
                  style={{
                    backgroundColor: colores.bordeSuave,
                    borderRadius: 999,
                    height: 2,
                    width: 2,
                  }}
                />
              ))}
            </View>
          ))}
        </View>
        <View key={modoOscuro ? "oscuro" : "claro"} style={{ flex: 1, width: "100%", zIndex: 1 }}>
          {contenido}
        </View>
        {conNavegacion ? <SudokuBottomNav /> : null}
      </View>
    </SafeAreaView>
  );
}
