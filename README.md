# RZ Base App

Plantilla base para proyectos `Expo + React Native + TypeScript` con:

- `Expo Router`
- `Firebase Auth + Firestore`
- persistencia de sesion
- `Expo Notifications`
- `NativeWind`
- formularios con `React Hook Form + Zod`
- estructura inspirada en `C:\passio`
- documentacion viva en [`contexto-ia`](./contexto-ia)

## Inicio rapido

1. Instala dependencias:

```bash
npm install
```

2. Crea tu entorno local:

```bash
copy .env.example .env
```

3. Completa las variables de Firebase y, si corresponde:

- Google login
- EAS project id para push
- RevenueCat
- Mercado Pago

4. Ejecuta la app:

```bash
npm run start
```

## Estructura

- `app/`: rutas con `Expo Router`
- `src/components`: UI base reutilizable
- `src/config`: lectura y validacion de entorno
- `src/constants`: constantes y contratos base
- `src/contexts`: sesion global
- `src/features`: validaciones y logica por feature
- `src/i18n`: textos centralizados
- `src/providers`: providers operativos
- `src/services`: Firebase, auth, notificaciones, suscripciones, planes, analytics, RevenueCat, Mercado Pago
- `src/types`: tipos compartidos
- `src/utils`: helpers
- `contexto-ia/`: contexto funcional y decisiones de arquitectura

## Notas

- La app usa **espanol ASCII** en nombres internos.
- `Firebase Analytics` queda abstraido y seguro: en esta base solo se activa en `web` con el SDK JS.
- `RevenueCat` queda como esqueleto no-op para que no rompa apps que aun no lo usan.
- `Mercado Pago` queda como placeholder de arquitectura para web; no incluye backend ni webhooks.
- Existe un helper listo para sincronizar la coleccion `planes` de Firestore: [src/services/planes.ts](/c:/rz-base-app/src/services/planes.ts).
