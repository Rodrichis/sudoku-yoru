# Plantilla Base App

## Objetivo

Crear una plantilla reusable para proyectos nuevos sin tener que rehacer login, sesion, roles, suscripciones base, notificaciones push ni configuracion comun.

## Alcance de esta plantilla

- Resolver solo la base comun reutilizable
- Mantener la plantilla simple y arrancable
- No intentar cubrir desde aqui toda la logica de negocio de futuras apps
- Cada app nueva debe agregar sus propias pantallas, colecciones y reglas especificas

## Stack acordado

- React Native + Expo
- TypeScript
- Expo Router
- Firebase Authentication
- Firestore
- Persistencia de sesion con Firebase Auth
- Expo Notifications montado desde el inicio
- NativeWind como capa visual base
- React Hook Form + Zod para formularios
- RevenueCat desacoplado y seguro

## Convenciones de idioma

- Interno en espanol ASCII
- Sin tildes
- Sin la letra n con tilde
- Sin espacios en identifiers
- Terminos tecnicos aceptados en ingles: `email`, `password`, `uid`, `pushToken`

## Estructura inspirada en Passio

- `app/`: rutas y layouts de Expo Router
- `src/components`: componentes base reutilizables
- `src/config`: variables de entorno
- `src/constants`: contratos y enums
- `src/contexts`: sesion global
- `src/features`: validaciones y logica acotada por feature
- `src/i18n`: textos centralizados
- `src/providers`: providers operativos
- `src/services`: Firebase, auth, suscripciones, notificaciones, planes, analytics, RevenueCat, Mercado Pago
- `src/types`: tipos compartidos
- `src/utils`: helpers

## Rutas base

- `app/_layout.tsx`: providers globales
- `app/index.tsx`: entrada y redireccion segun sesion
- `app/(public)`: flujo de auth publico
- `app/(public)/sign-in.tsx`
- `app/(public)/sign-up.tsx`
- `app/(public)/forgot-password.tsx`
- `app/(app)`: area autenticada base
- `app/(app)/index.tsx`: home privada temporal de la plantilla

## Branding base

- La ruta oficial para paleta, tonos y decisiones visuales globales es `src/config/branding.ts`
- Las pantallas y componentes base deben leer colores desde ese archivo
- No hardcodear colores en pantallas nuevas si ya existe un token semantico
- Cada app nueva debe personalizar primero `branding.ts` antes de rehacer UI

## Firestore base definido

Solo queda fijo el modelo relacionado a acceso y suscripciones. El resto sera dependiente de cada app.

### Coleccion `usuarios`

Documento base `usuarios/{uid}`:

- `uid`
- `email`
- `nombre`
- `role`
- `esAdmin`
- `idiomaPreferido`
- `planId`
- `estadoSuscripcion`
- `expiraEl`
- `proveedorPago`
- `authProviders`
- `creadoEl`
- `actualizadoEl`

Subdocumento `usuarios/{uid}/uso/actual`:

- `mesReferencia`
- `notificacionesMes`
- `correosMes`
- `actualizadoEl`

Subcoleccion `usuarios/{uid}/dispositivos/{dispositivoId}`:

- `expoPushToken`
- `plataforma`
- `modelo`
- `fabricante`
- `notificacionesHabilitadas`
- `actualizadoEl`

### Coleccion `planes`

Se dejan definidos en constantes los ids base:

- `trial`
- `free`
- `pro`

Estados de suscripcion:

- `prueba`
- `activa`
- `caducada`
- `cancelada`

Existe un helper listo para sincronizar estos planes base en Firestore:

- `src/services/planes.ts`

## Billing

- iOS/Android: arquitectura pensada para RevenueCat
- Web: arquitectura prevista para Mercado Pago
- Fuente comun de verdad: Firestore
- Webhooks: no implementados en esta plantilla, pero considerados en el modelo
- Placeholder web disponible en `src/services/mercadoPago.ts`

## Notificaciones

- `Expo Notifications` montado desde provider
- registro automatico cuando existe sesion
- guarda dispositivo en Firestore
- no rompe web
- no rompe simulador: devuelve mensaje controlado

## Sesion y revocacion

- La plantilla usa persistencia de sesion de Firebase tanto en web como en mobile
- Multiples sesiones simultaneas en distintos dispositivos son compatibles con el comportamiento normal de Firebase
- Cambio de `password`, `password reset` o revocacion global pueden cortar sesiones existentes
- El detalle de esta decision quedo documentado en `contexto-ia/firebase-auth-sesiones.md`

## Analytics

- wrapper seguro
- solo usa Firebase Analytics en `web` con JS SDK
- si una app necesita analytics nativo, debe integrarlo aparte

## RevenueCat

- wrapper no-op seguro
- pensado para que la plantilla no falle si la app aun no usa suscripciones reales

## Variables de entorno

Referencias tomadas de `Passio`, pero unificadas en `EXPO_PUBLIC_*`:

- Firebase
- Google login
- EAS project id
- RevenueCat
- Mercado Pago
- dias de trial por defecto

## Estado actual de la plantilla

- auth email/password listo
- Google login preparado
- sesion persistente
- pantalla privada base
- flujo forgot password
- base de planes y estados
- push notifications montado
- helper para sincronizar `planes`
- placeholder para Mercado Pago web
- contexto vivo documentado en esta carpeta

## Guia para otra IA

Existe una guia operativa para arrancar una nueva app real sobre esta base:

- `contexto-ia/guia-codex-nueva-app.md`
