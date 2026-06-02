import { Platform } from "react-native";

import { revenueCatConfigurado } from "@/src/config/env";

export function isRevenueCatDisponible() {
  return Platform.OS !== "web" && revenueCatConfigurado;
}

export async function configurarRevenueCat(_uid?: string | null) {
  return isRevenueCatDisponible();
}

export async function sincronizarUsuarioRevenueCat(_uid?: string | null) {
  return isRevenueCatDisponible();
}
