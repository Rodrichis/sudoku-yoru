import { Redirect } from "expo-router";

import { PantallaCarga } from "@/src/components/ui/pantalla-carga";
import { useSesion } from "@/src/hooks/use-sesion";
import { useTextos } from "@/src/hooks/use-textos";

export default function Index() {
  const { cargando, usuarioFirebase } = useSesion();
  const textos = useTextos();

  if (cargando) {
    return <PantallaCarga texto={textos.general.cargando} />;
  }

  return <Redirect href={usuarioFirebase ? "/(app)" : "/(public)/sign-in"} />;
}
