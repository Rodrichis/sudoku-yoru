import { Redirect, Stack } from "expo-router";

import { PantallaCarga } from "@/src/components/ui/pantalla-carga";
import { useSesion } from "@/src/hooks/use-sesion";
import { useTextos } from "@/src/hooks/use-textos";

export default function PublicLayout() {
  const { cargando, usuarioFirebase } = useSesion();
  const textos = useTextos();

  if (cargando) {
    return <PantallaCarga texto={textos.general.cargando} />;
  }

  if (usuarioFirebase) {
    return <Redirect href="/(app)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
