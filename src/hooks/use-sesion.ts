import { useContext } from "react";

import { SesionContexto } from "@/src/contexts/sesion-contexto";

export function useSesion() {
  const contexto = useContext(SesionContexto);

  if (!contexto) {
    throw new Error("useSesion debe usarse dentro de SesionProvider.");
  }

  return contexto;
}
