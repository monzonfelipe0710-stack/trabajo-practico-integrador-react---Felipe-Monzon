# Biblioteca IPF - App React Native II

## Descripción
Esta es una aplicación móvil para la gestión de una biblioteca universitaria, desenvolvida con React Native y Expo. La aplicación permite a los usuarios del personal administrativo gestionar préstamos, reservas y listas de espera de libros.

## Características Principales
- **Autenticación de personal** - Acceso con credenciales admin
- **Catálogo de libros** - Búsqueda y visualización del catálogo completo
- **Sistema de préstamos** - Préstamos de 7 días con recordatorios
- **Listas de espera** - Cola FIFO para libros agotados
- **Notificaciones** - Recordatorios de devolución y disponibilidad
- **Permisos de cámara y notificaciones** - Solicitud de permisos del sistema operativo

## Estructura del Proyecto

```
src/
  app/          # Rutas y pantallas (Expo Router)
  components/   # Componentes reutilizables
  context/      # Contexto de React (BibliotecaContext)
  data/         # Datos estáticos (libros)
  hooks/        # Hooks personalizados
  lib/          # Utilidades y API simulada
  types/        # Tipos TypeScript
  constants/    # Tema y configuración
  estructuras/  # Estructuras de datos (Pila, Cola)
```

## Disponible en
- **Rama develop**: Contiene los últimos desarrollos y commits en español
- **Rama main**: Versión estable/base del proyecto

## Comandos Útiles
```bash
npx expo start          # Iniciar servidor de desarrollo
npx expo android       # Android development build
npx expo ios           # iOS development build
npx expo lint          # Linting
npx tsc --noEmit       # TypeScript type check
npm test               # Ejecutar pruebas
```

## Commits Realizados (rama develop)
1. Añadí prop estadoPrestado a TarjetaLibro y actualicé el catálogo
2. Integre el estado de disponibilidad en la pantalla de búsqueda
3. Mejoré la pantalla mostrador con información de ejemplares disponibles
4. Mejoré la pantalla de permisos con opción de reinicio
5. Añadí información detallada de disponibilidad y posición en cola en la reserva

## Estado de Branches
- **main**: Rama base/estable (arriba en la jerarquía)
- **desarrollo**: Rama con desarrollo activo (develop)