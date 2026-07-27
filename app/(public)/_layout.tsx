import { Redirect, Stack } from "expo-router";

import { PantallaCarga } from "@/src/components/ui/pantalla-carga";
import { useSesion } from "@/src/hooks/use-sesion";
import { useTema } from "@/src/hooks/use-tema";
import { useTextos } from "@/src/hooks/use-textos";

export default function PublicLayout() {
  const { cargando, tieneSesionActiva } = useSesion();
  const { colores } = useTema();
  const textos = useTextos();

  if (cargando) {
    return <PantallaCarga texto={textos.general.cargando} />;
  }

  if (tieneSesionActiva) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        animation: "none",
        contentStyle: { backgroundColor: colores.fondoApp },
        headerShown: false,
      }}
    />
  );
}
