import { getLocales } from "expo-localization";

import { textosEn } from "@/src/i18n/en";
import { textosEs } from "@/src/i18n/es";
import type { Idioma } from "@/src/types/idioma";

export function resolverIdiomaInicial(): Idioma {
  const locales = getLocales();
  const locale = locales[0]?.languageCode?.toLowerCase() ?? "es";
  return locale === "en" ? "en" : "es";
}

export function obtenerTextos(idioma: Idioma) {
  return idioma === "en" ? textosEn : textosEs;
}
