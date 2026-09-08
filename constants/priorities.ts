import type { Priority } from '@/types/task';

export interface PriorityOption {
  key: Priority;
  label: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { key: 'none', label: 'Sin prioridad' },
  { key: 'low', label: 'Baja' },
  { key: 'medium', label: 'Media' },
  { key: 'high', label: 'Alta' },
];

/** Higher rank wins when ordering by priority. */
export const PRIORITY_RANK: Record<Priority, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
};