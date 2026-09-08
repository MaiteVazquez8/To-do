# Tareas

Aplicación de lista de tareas (to-do) multiplataforma construida con **React Native + Expo**. Diseñada dark-first, con identidad visual negra + violeta, gestiona tareas con categorías, prioridades, fechas de vencimiento, búsqueda, filtros y varios modos de ordenamiento.

Corre en **Android, iOS y web** con el mismo código base.

## Funcionalidades

- Crear, editar y eliminar tareas.
- Marcar tareas como completadas (con línea de tachado animada).
- Categorías con color, creables y eliminables desde la app.
- Prioridades (alta / media / baja / sin prioridad).
- Fecha de vencimiento con calendario y agrupación por secciones (vencidas / hoy / mañana / próximas / sin fecha).
- Filtros por estado (todas / pendientes / completadas), categoría y fecha.
- Búsqueda por título, descripción y nombre de categoría.
- 8 modos de orden, incluida la reordenación manual con arrastre.
- Progreso general en el encabezado (porcentaje, pendientes y completadas).
- Persistencia local: los datos sobreviven al reinicio de la app.
- Tema claro/oscuro automático y atajos de teclado en web.

## Requerimientos

- **Node.js** 18 o superior (21+ recomendado).
- **npm** (incluido con Node.js).
- Un emulador o dispositivo con **Android Studio** / **Xcode** para correr en nativo, o simplemente un navegador para la web.
- **Expo Go** (opcional): instalado en el dispositivo físico para probar sin emular.

> La app no necesita cuenta de servidor ni backend: todo se guarda localmente en el dispositivo (AsyncStorage).

## Cómo correr el programa

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar Metro (dev server de Expo)
npm start
```

Desde el menú de Expo podés elegir el destino:

```bash
# Web (se abre en el navegador)
npm run web

# Android (emulador o dispositivo con Expo Go)
npm run android

# iOS (simulador o dispositivo con Expo Go)
npm run ios
```

> Al usar un dispositivo físico, escaneá el QR que imprime `npm start` con la app Expo Go.

### Verificación de calidad

```bash
# Revisar tipos TypeScript
npm run typecheck

# Lint (ESLint, config de expo)
npm run lint
```

## Tecnologías utilizadas

| Tecnología | Rol |
| --- | --- |
| **React Native 0.86** + **React 19** | UI multiplataforma (iOS / Android / web). |
| **Expo SDK 57** | Entorno de desarrollo, build y ejecución. |
| **expo-router** | Navegación por archivos (stack + modales). |
| **React Native Web** | Soporte de la misma UI en el navegador. |
| **Zustand** | Estado global (tareas, categorías, ajustes y toasts). |
| **AsyncStorage** | Persistencia local de los datos. |
| **react-native-reanimated** | Animaciones y microinteracciones. |
| **TypeScript** | Tipado estricto de todo el código. |
| **@expo/vector-icons** | Iconografía (Ionicons). |
| **react-native-safe-area-context** | Ajuste de zonas seguras. |
| **eslint-config-expo** | Lint alineado con las convenciones de Expo. |

## Estructura del proyecto

```
.
├── app/                     # Rutas de expo-router
│   ├── _layout.tsx          # Layout raíz: Stack + Toast + StatusBar
│   ├── index.tsx            # Pantalla principal (lista y encabezado)
│   └── task/
│       ├── new.tsx          # Pantalla modal: crear tarea
│       └── [id].tsx         # Pantalla modal: editar tarea
├── components/              # Componentes UI reutilizables
│   ├── TaskItem.tsx         # Tarjeta de tarea (nombre + resumen + insignias)
│   ├── TaskList.tsx         # Lista simple (scroll virtualizado)
│   ├── DraggableTaskList.tsx# Lista con reordenación por arrastre
│   ├── TaskForm.tsx         # Formulario de creación/edición
│   ├── TaskDetails.tsx      # Detalle de tarea (vista rápida)
│   ├── Calendar.tsx         # Calendario para filtrar por fecha
│   ├── CategoryFilter.tsx   # Filtro por categoría
│   ├── CategoryManager.tsx  # Gestión de categorías
│   ├── Dropdown.tsx         # Selector de orden
│   ├── SearchBar.tsx        # Búsqueda
│   ├── FilterTabs.tsx       # Filtros Todas / Pendientes / Completadas
│   ├── ProgressBar.tsx      # Barra de progreso del encabezado
│   ├── Checkbox.tsx         # Check animado
│   ├── ModalSheet.tsx, Toast.tsx, ConfirmDialog.tsx, EmptyState.tsx, …
│   └── (badges: CategoryBadge / PriorityBadge / DueDateBadge)
├── constants/               # Tokens: colores, sombras, espaciado,
│                            # animaciones, textos, prioridades y opciones
├── hooks/                   # Hooks de lógica: tema, teclado, hidratación,
│                            # interacción (hover/focus), consulta de tareas
├── store/                   # Stores de Zustand con persistencia
│   ├── taskStore.ts         # Tareas + orden manual (con migración)
│   ├── categoryStore.ts     # Categorías
│   ├── settingsStore.ts     # Preferencias (orden seleccionado)
│   └── toastStore.ts        # Notificaciones toast
├── types/                   # Tipos compartidos (task, category, filter, sort)
├── utils/                   # Lógica pura: fechas, orden, color, ids, secciones
├── assets/                  # Íconos y splash
└── app.json                 # Configuración de Expo
```

## Cómo funciona

### Flujo de datos

1. **Stores de Zustand** son la fuente de verdad. Cada store persiste su estado en AsyncStorage con `zustand/persist` (claves `tasks-storage-v1`, `categories-storage-v1`, `settings-storage-v1`).
2. **taskStore** guarda las tareas y el orden manual. Tiene una versión de persistencia con **migración**: si el dato guardado viene de una versión anterior (sin `description`, `categoryId`, `priority` o `dueDate`), se normaliza rellenando valores por defecto sin perder datos.
3. Los **hooks de hidratación** (`useTaskStoreHydrated`, `useCategoryStoreHydrated`) esperan a que el estado persistido se cargue antes de pintar, para evitar parpadeos.
4. `useTaskQuery` aplica la cadena completa: **filtro de estado → filtro por fecha → filtro de categoría → búsqueda → ordenamiento**. Es el único lugar que define qué tareas se muestran en la lista.
5. `utils/sortTasks.ts` implementa los 8 modos de orden (`manual`, `newest`, `oldest`, `priority`, `dueDate`, `alphabetical`, `pendingFirst`, `completedFirst`).

### Pantalla principal (Home)

- Encabezado con saludo según la hora, la fecha actual, **CTA "Agregar una nueva tarea"** y un indicador de progreso (porcentaje + chips de total/pendientes/completadas).
- Barra de búsqueda, filtros de estado, filtro de categorías y selector de orden (Dropdown).
- Un botón abre el **Calendario**, que resalta los días con tareas y permite filtrar por fecha; con orden por fecha, la lista se agrupa en **secciones** (vencidas, hoy, mañana, próximas, sin fecha, completadas).
- Toque sobre una tarea abre el **detalle** (vista rápida); el lápiz edita y el papelera elimina (con diálogo de confirmación).
- En modo de orden manual, la lista habilita **arrastre de ítems** para reordenar.

### Persistencia y tema

- Toda la información queda en el dispositivo. No hay backend ni API.
- El tema se resuelve con `useTheme()` siguiendo la preferencia del sistema (`userInterfaceStyle: automatic`). La paleta es dark-first: grises/negros con violeta como acento.

### Animaciones y accesibilidad

- **Reanimated** maneja microinteracciones (check, entrada/salida de ítems, tachado al completar, hover/lift en botones).
- Los controles usan `accessibilityRole`, `accessibilityLabel` y `accessibilityState`; la UI está en español y se diseñó respetando `numberOfLines` para no cortar palabras.

### Web

- El layout limita el ancho de contenido (`contentMaxWidth`) para que las tarjetas no se estiren en pantallas grandes.
- En web hay `AmbientGlow` (brillo violeta de fondo) y atajos de teclado (nueva tarea, foco en búsqueda, cerrar con Escape).