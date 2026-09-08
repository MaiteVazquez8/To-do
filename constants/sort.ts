import type { SortKey } from '@/types/sort';

export interface SortOption {
  key: SortKey;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { key: 'manual', label: 'Orden manual' },
  { key: 'newest', label: 'Más recientes' },
  { key: 'oldest', label: 'Más antiguas' },
  { key: 'priority', label: 'Prioridad' },
  { key: 'dueDate', label: 'Fecha de vencimiento' },
  { key: 'alphabetical', label: 'Alfabéticamente' },
  { key: 'pendingFirst', label: 'Pendientes primero' },
  { key: 'completedFirst', label: 'Completadas primero' },
];

export const SORT_LABELS: Record<SortKey, string> = SORT_OPTIONS.reduce(
  (acc, option) => ({ ...acc, [option.key]: option.label }),
  {} as Record<SortKey, string>
);