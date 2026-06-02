import { obtenerTextos } from "@/src/i18n";
import { useSesion } from "@/src/hooks/use-sesion";

export function useTextos() {
  const { idioma } = useSesion();
  return obtenerTextos(idioma);
}
