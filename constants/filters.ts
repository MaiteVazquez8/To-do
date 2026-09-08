import type { Filter } from '@/types/filter';

export interface FilterOption {
  key: Filter;
  label: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'Todas' },
  { key: 'active', label: 'Pendientes' },
  { key: 'completed', label: 'Completadas' },
];