import { env } from "@/src/config/env";

export function mercadoPagoConfigurado() {
  return env.EXPO_PUBLIC_MERCADO_PAGO_PUBLIC_KEY.trim().length > 0;
}

export function obtenerMercadoPagoPublicKey() {
  return env.EXPO_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;
}

export async function iniciarCheckoutSuscripcionWeb() {
  if (!mercadoPagoConfigurado()) {
    throw new Error("Mercado Pago no esta configurado en el entorno actual.");
  }

  throw new Error(
    "El checkout web de Mercado Pago requiere backend/webhooks y queda solo como placeholder en esta plantilla."
  );
}
