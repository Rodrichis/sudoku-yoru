# Guia Codex Nueva App

## Objetivo

Este archivo existe para que otra IA, en otro chat, sepa como iniciar una app real usando esta plantilla sin romper la base comun.

## Orden recomendado de trabajo

1. Leer primero `contexto-ia/plantilla-base-app.md`
2. Revisar `src/config/branding.ts`
3. Completar `.env` segun el proyecto real
4. Confirmar Firebase, auth y rutas base antes de tocar features de negocio
5. Documentar decisiones nuevas en `contexto-ia/`

## Reglas de implementacion

- Mantener espanol ASCII en codigo, Firestore y nombres internos
- No usar tildes ni la letra n con tilde en identifiers
- Se aceptan terminos tecnicos en ingles cuando ya son estandar: `email`, `password`, `uid`, `pushToken`
- No cambiar la base de auth, sesion, notificaciones y suscripciones sin una razon clara
- No renombrar `usuarios`, `planes`, `dispositivos` o `uso/actual` sin una decision deliberada y documentada
- No hardcodear colores en pantallas nuevas si el token ya existe en `src/config/branding.ts`
- Si una app necesita nueva identidad visual, ajustar primero `branding.ts` y luego los componentes base
- Mantener los textos concentrados en `src/i18n`
- Si una integracion opcional no se usa, preferir dejar su wrapper seguro antes que borrarlo
- Cualquier decision de arquitectura especifica de la app debe quedar documentada en `contexto-ia/`

## Archivos que se deben revisar primero

- `src/config/branding.ts`
- `.env`
- `.env.example`
- `src/config/env.ts`
- `src/constants/app.ts`
- `src/services/firebaseConfig.ts`
- `src/services/auth.ts`
- `src/services/notifications.ts`
- `src/constants/suscripciones.ts`
- `src/services/planes.ts`

## Estructura de rutas que conviene respetar al inicio

- `app/_layout.tsx`: providers globales
- `app/index.tsx`: punto de entrada
- `app/(public)`: auth y recuperacion
- `app/(app)`: area autenticada
- Si una app cambia esta estructura, debe dejarlo documentado en `contexto-ia/`

## Personalizacion minima para una app nueva

- Cambiar nombre de app y `scheme` en variables de entorno
- Definir paleta y tono visual en `src/config/branding.ts`
- Ajustar copys en `src/i18n`
- Reemplazar `app/(app)/index.tsx` por la home real del proyecto
- Agregar modelos de Firestore propios solo despues de respetar la base de usuarios, dispositivos y planes

## Lo que esta pensado como base comun

- `Expo Router`
- login con email/password
- login Google preparado por plataforma
- persistencia de sesion
- flujo `forgot password`
- `Expo Notifications`
- roles `usuario/admin`
- suscripciones base `trial/free/pro`
- estados `prueba/activa/caducada/cancelada`
- `RevenueCat` seguro y opcional
- placeholder para `Mercado Pago` web

## Lo que no debe asumirse como cerrado

- modelos de negocio propios de la app
- colecciones extra de Firestore
- backend o webhooks
- storage/subida de archivos
- home final y modulos funcionales

## Criterio de calidad

- Preferir componentes reutilizables sobre estilos repetidos
- Mantener la app arrancable aunque falten integraciones opcionales
- Evitar dependencias que rompan web, Expo Go o builds nativos sin configuracion
- Si agregas una convencion nueva importante, dejala escrita en `contexto-ia/`
