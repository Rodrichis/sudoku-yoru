# Sudoku Yoru

Sudoku clasico 9x9 para `Expo + React Native + TypeScript`, con una experiencia
sobria, calmada y completamente jugable offline.

- `Expo Router`
- modo invitado persistente
- login opcional con `Firebase Auth + Firestore`
- generador y solver local con solucion unica
- partida, notas, ajustes y estadisticas en `AsyncStorage`
- tema claro y oscuro global
- notificaciones preparadas para development builds
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

3. Completa las variables del proyecto:

- URL HTTPS de politica de privacidad
- identificador de proyecto EAS
- Firebase
- Google login
- RevenueCat y anuncios cuando se activen

4. Ejecuta la app:

```bash
npm run start
```

## Verificacion

```bash
npm run typecheck
npm run lint
npm test
npx expo-doctor
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
- `src/services`: motor Sudoku, storage, Firebase, auth, notificaciones y servicios opcionales
- `src/types`: tipos compartidos
- `src/utils`: helpers
- `contexto-ia/`: contexto funcional y decisiones de arquitectura

## Publicacion

- Define `ios.bundleIdentifier` y `android.package` en `app.json`.
- Configura `EXPO_PUBLIC_PRIVACY_POLICY_URL` con una URL HTTPS publica.
- Configura el proyecto EAS y Firebase antes de validar auth, Google y push.
- Los anuncios, RevenueCat y el desafio diario permanecen fuera del alcance V1 acordado.
- Usa un development build para probar push remoto; Expo Go no lo soporta.
