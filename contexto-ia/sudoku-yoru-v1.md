# Sudoku Yoru V1

## Decisiones de implementacion

- Se mantuvo la plantilla base y se extendio solo donde la app lo necesitaba.
- Se agrego modo invitado persistente sin rehacer auth Firebase.
- `app/(app)` sigue siendo el area privada de la app, pero ahora acepta sesion Firebase o sesion invitado.
- La navegacion principal del producto se resolvio dentro de `app/(app)` con rutas de Expo Router y una barra inferior propia del modulo Sudoku.
- La persistencia del juego, ajustes y estadisticas se hace localmente con AsyncStorage.
- El motor Sudoku es completamente local: generacion, solver y verificacion de solucion unica.
- `RevenueCat` y publicidad quedaron desacoplados: solo placeholders visuales en V1.
- El desafio diario queda fuera de esta iteracion.
- Los sonidos de feedback se resolvieron con dos assets locales generados en `assets/audio/`.

## Estructura agregada

- `src/components/sudoku`
- `src/constants/sudoku.ts`
- `src/hooks/use-sudoku-*`
- `src/services/sudoku-*`
- `src/types/sudoku.ts`
- `src/utils/sudoku.ts`
- `app/(app)/juego.tsx`
- `app/(app)/nueva-partida.tsx`
- `app/(app)/estadisticas.tsx`
- `app/(app)/ajustes.tsx`

## Alcance V1

- Home
- Nueva partida
- Juego completo
- Estadisticas locales
- Ajustes locales
- Modo invitado
- Sonido basico

## Endurecimiento previo a produccion

- El solver valida tableros parciales y completos antes de resolver o contar soluciones.
- La generacion usa mascaras de bits y reintentos acotados para respetar los rangos de pistas sin bloquear la interfaz.
- AsyncStorage serializa operaciones por clave y descarta partidas corruptas de forma segura.
- Las victorias son idempotentes por id y se reconcilian si una escritura queda incompleta.
- Las estadisticas diarias usan fecha local en vez de UTC.
- El juego se pausa y persiste cuando la app pasa a segundo plano.
- Iniciar otra partida activa requiere confirmacion.
- Expo SDK 54 queda alineado y `expo-audio` no solicita permiso de microfono.
- Se agregaron pruebas del solver, generador y estadisticas.
- `eas.json` define perfiles development, preview y production.

## Bloqueos externos para publicar

- Definir `ios.bundleIdentifier` y `android.package`.
- Configurar el proyecto EAS y `EXPO_PUBLIC_EAS_PROJECT_ID`.
- Configurar Firebase y credenciales Google si el login con cuenta entra en la primera publicacion.
- Publicar una politica de privacidad HTTPS y completar `EXPO_PUBLIC_PRIVACY_POLICY_URL`.
- Validar en Android fisico o emulador y realizar al menos un development build.
