# Firebase Auth Sesiones

## Motivo

Este archivo deja documentado lo revisado sobre persistencia de sesion, multiples sesiones y cierre de sesiones en Firebase Authentication, para no volver a discutirlo desde cero en futuros chats.

## Contexto en esta plantilla

La plantilla base usa Firebase Auth con persistencia de sesion:

- En `web`, Firebase usa persistencia `local` por defecto
- En `mobile`, la plantilla usa `AsyncStorage` con `getReactNativePersistence`

Archivo relevante:

- `src/services/firebaseConfig.ts`

## Que significa esto en la practica

- La sesion persiste aunque se cierre la app o el navegador, hasta que el usuario cierre sesion de forma explicita o la sesion sea invalidada
- Un usuario puede tener varias sesiones abiertas al mismo tiempo en distintos dispositivos o navegadores
- En web, varias pestanias del mismo origen pueden compartir o sincronizar el estado segun el tipo de persistencia usado

## Como maneja Firebase las sesiones

Firebase trabaja con:

- `ID token`: dura aproximadamente 1 hora
- `refresh token`: dura mucho mas y sirve para renovar el `ID token`

Los `refresh tokens` dejan de ser validos cuando ocurre una de estas situaciones:

- el usuario es eliminado
- el usuario es deshabilitado
- ocurre un cambio importante de cuenta, por ejemplo cambio de `password` o `email`

## Cambiar password y cierre de sesiones

Conclusion importante:

- cambiar `password` sirve para cortar sesiones activas del usuario
- `password reset` tambien revoca sesiones existentes
- Firebase maneja automaticamente esa revocacion en ese caso

Matiz importante:

- el cierre no siempre es instantaneo al segundo
- un `ID token` ya emitido puede seguir vivo hasta su expiracion
- el corte fuerte ocurre cuando el cliente intenta refrescar token o cuando un backend verifica revocacion

## Cerrar sesiones manualmente desde backend

Firebase Admin SDK permite:

- `revokeRefreshTokens(uid)`

Eso revoca las sesiones del usuario a nivel global.

Uso recomendado:

- dispositivo robado o perdido
- sospecha de robo de token
- compromiso general de seguridad

## Lo que Firebase no resuelve de forma nativa en este caso

No se encontro una API nativa de Firebase Auth puro para:

- listar sesiones por dispositivo de forma completa
- cerrar solo una sesion especifica del usuario, por ejemplo solo el celular robado

Por lo tanto:

- `signOut()` en un cliente cierra solo esa sesion local
- `revokeRefreshTokens(uid)` revoca sesiones del usuario completo
- cerrar solo un dispositivo requiere logica propia

## Si alguna app futura necesita cierre por dispositivo

La forma correcta seria agregar una capa propia sobre la base actual:

- seguir usando `usuarios/{uid}/dispositivos/{deviceId}`
- mostrar dispositivos activos en la web
- marcar un dispositivo como revocado
- hacer que cada app valide el estado de su `deviceId` y cierre sesion si fue revocado

Esto no viene dado por Firebase Auth solo; es una funcionalidad de negocio adicional.

## Decision tomada para esta plantilla

- dejar la persistencia de sesion como esta
- aceptar el comportamiento nativo de Firebase para multiples sesiones
- considerar suficiente el cierre global por cambio de `password` o revocacion global
- no implementar cierre por dispositivo en la plantilla base

Razon:

- la plantilla debe seguir simple
- el cierre por dispositivo agrega complejidad y ya entra en terreno de logica especifica de app

## Fuentes revisadas

- Firebase Auth state persistence:
  - https://firebase.google.com/docs/auth/web/auth-state-persistence
- Firebase manage user sessions:
  - https://firebase.google.com/docs/auth/admin/manage-sessions
- Firebase verify ID tokens:
  - https://firebase.google.com/docs/auth/admin/verify-id-tokens
