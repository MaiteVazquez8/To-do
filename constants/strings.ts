/**
 * All user-facing copy, in Spanish. Keeping the strings centralized here
 * guarantees there is no hardcoded UI text scattered across components and
 * makes it trivial to review or extend the copy.
 */

export const strings = {
  appName: 'Tareas',

  greeting: {
    morning: 'Buenos días',
    afternoon: 'Buenas tardes',
    evening: 'Buenas noches',
  },

  screenTitles: {
    newTask: 'Nueva tarea',
    editTask: 'Editar tarea',
  },

  home: {
    title: 'Mis tareas',
    pendingCount: (count: number) =>
      count === 1 ? 'Tenés 1 tarea pendiente' : `Tenés ${count} tareas pendientes`,
    allClear: 'No tenés tareas pendientes',
    addTaskLabel: 'Agregar una nueva tarea',
    manageCategoriesLabel: 'Administrar categorías',
    clearCompleted: 'Eliminar completadas',
    loadingTasks: 'Cargando tus tareas…',
    calendarToggle: 'Calendario',
    calendarAccessibility: 'Mostrar u ocultar el calendario',
    dateFilterAccessibility: 'Quitar el filtro por fecha',
    progressTitle: 'Tu progreso',
  },

  stats: {
    title: 'Resumen',
    total: (count: number) => (count === 1 ? '1 tarea' : `${count} tareas`),
    pending: (count: number) => (count === 1 ? '1 pendiente' : `${count} pendientes`),
    completed: (count: number) =>
      count === 1 ? '1 completada' : `${count} completadas`,
    progress: (percent: number) => `${percent}% completadas`,
    tasksLabel: (count: number) => (count === 1 ? 'tarea' : 'tareas'),
    pendingLabel: (count: number) => (count === 1 ? 'pendiente' : 'pendientes'),
    completedLabel: (count: number) => (count === 1 ? 'completada' : 'completadas'),
  },

  search: {
    placeholder: 'Buscar tareas…',
    accessibilityLabel: 'Buscar por título, descripción o categoría',
    clear: 'Limpiar búsqueda',
    emptyTitle: 'No encontramos tareas que coincidan con tu búsqueda',
    emptySubtitle: 'Probá con otras palabras o limpiá la búsqueda.',
  },

  sort: {
    label: 'Ordenar por',
    optionsLabel: 'Cambiar ordenamiento',
  },

  categories: {
    all: 'Todas',
    uncategorized: 'Sin categoría',
    filterLabel: 'Filtrar por categoría',
    manageTitle: 'Administrar categorías',
    new: 'Nueva categoría',
    edit: 'Editar',
    delete: 'Eliminar',
    empty: 'No hay categorías todavía',
    emptySubtitle: 'Creá una categoría para organizar tus tareas.',
    nameLabel: 'Nombre',
    namePlaceholder: 'Ej.: Trabajo',
    nameEmptyError: 'Ingresá un nombre para la categoría.',
    colorLabel: 'Color',
    save: 'Guardar',
    cancel: 'Cancelar',
    deleteTitle: (name: string) => `¿Eliminar categoría "${name}"?`,
    deleteMessage: 'Las tareas asociadas no se eliminarán. Solo quedarán sin categoría.',
    count: (count: number) => (count === 1 ? '1 tarea' : `${count} tareas`),
  },

  priority: {
    label: 'Prioridad',
  },

  dueDate: {
    label: 'Fecha de vencimiento',
    none: 'Sin fecha',
    today: 'Hoy',
    tomorrow: 'Mañana',
    overdue: (date: string) => `Vencida · ${date}`,
    quickToday: 'Hoy',
    quickTomorrow: 'Mañana',
    quickInWeek: 'En 7 días',
    quickNone: 'Sin fecha',
  },

  sections: {
    overdue: 'Vencidas',
    today: 'Hoy',
    tomorrow: 'Mañana',
    upcoming: 'Próximamente',
    noDate: 'Sin fecha',
    completed: 'Completadas',
  },

  detail: {
    title: 'Detalles de la tarea',
    descriptionLabel: 'Descripción',
    noDescription: 'Sin descripción',
    statusLabel: 'Estado',
    statusPending: 'Pendiente',
    statusCompleted: 'Completada',
    dueLabel: 'Vencimiento',
    categoryLabel: 'Categoría',
    createdLabel: 'Creada',
    complete: 'Completar',
    markPending: 'Marcar pendiente',
    edit: 'Editar',
    delete: 'Eliminar',
  },

  confirm: {
    cancel: 'Cancelar',
    cancelDialogLabel: 'Cerrar el diálogo',
    delete: 'Eliminar',
    deleteTaskTitle: (title: string) => `¿Eliminar "${title}"?`,
    deleteTaskMessage: 'Esta acción no se puede deshacer.',
    clearCompletedTitle: '¿Eliminar tareas completadas?',
    clearCompletedMessage: 'Esta acción no se puede deshacer.',
  },

  toast: {
    taskCreated: 'Tarea creada',
    taskUpdated: 'Tarea actualizada',
    taskDeleted: 'Tarea eliminada',
    taskCompleted: '¡Tarea completada!',
    taskReopened: 'Tarea marcada como pendiente',
    clearedCompleted: 'Tareas completadas eliminadas',
    categoryCreated: 'Categoría creada',
    categoryUpdated: 'Categoría actualizada',
    categoryDeleted: 'Categoría eliminada',
  },

  taskItem: {
    complete: (title: string) => `Completar "${title}"`,
    markActive: (title: string) => `Marcar "${title}" como pendiente`,
    edit: (title: string) => `Editar "${title}"`,
    delete: (title: string) => `Eliminar "${title}"`,
    open: (title: string) => `Ver detalles de "${title}"`,
    reorder: 'Arrastrar para reordenar',
  },

  filters: {
    accessibilityLabel: 'Filtrar por estado',
  },

  form: {
    titleLabel: 'Título',
    titlePlaceholder: '¿Qué necesitás hacer?',
    titleAccessibilityLabel: 'Título de la tarea',
    emptyError: 'Ingresá un título para la tarea.',
    descriptionLabel: 'Descripción (opcional)',
    descriptionPlaceholder: 'Agregá un detalle optativo…',
    descriptionAccessibilityLabel: 'Descripción de la tarea',
    categoryLabel: 'Categoría',
    priorityLabel: 'Prioridad',
    dueDateLabel: 'Fecha de vencimiento',
    newTaskSubmit: 'Agregar tarea',
    editTaskSubmit: 'Guardar cambios',
    counter: (count: number, max: number) => `${count}/${max}`,
  },

  empty: {
    all: {
      icon: 'checkbox-outline' as const,
      title: 'No hay tareas todavía',
      subtitle: 'Agregá una tarea para comenzar.',
    },
    active: {
      icon: 'ellipse-outline' as const,
      title: 'No tenés tareas pendientes',
      subtitle: '¡Todo está al día!',
    },
    completed: {
      icon: 'checkmark-done-outline' as const,
      title: 'No hay tareas completadas todavía',
      subtitle: 'Las tareas que completes van a aparecer acá.',
    },
    uncategorized: {
      icon: 'pricetag-outline' as const,
      title: 'No hay tareas sin categoría',
      subtitle: 'Las tareas de esta vista van a aparecer acá.',
    },
    search: {
      icon: 'search-outline' as const,
      title: 'No encontramos tareas que coincidan con tu búsqueda',
      subtitle: 'Probá con otras palabras o limpiá la búsqueda.',
    },
    date: {
      icon: 'calendar-outline' as const,
      title: 'Sin tareas para esta fecha',
      subtitle: 'Elegí otro día en el calendario o quitá el filtro.',
    },
  },
};