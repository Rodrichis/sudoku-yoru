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

