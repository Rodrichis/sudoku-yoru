import { useContext } from "react";

import { TemaContexto } from "@/src/contexts/tema-contexto";

export function useTema() {
  const contexto = useContext(TemaContexto);

  if (!contexto) {
    throw new Error("useTema debe usarse dentro de TemaProvider.");
  }

  return contexto;
}
