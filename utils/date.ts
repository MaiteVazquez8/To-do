import type { Task } from '@/types/task';

const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const MONTHS_FULL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const WEEKDAYS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const WEEKDAYS_FULL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** Local date to `YYYY-MM-DD` (timezone safe). */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function todayKey(now = new Date()): string {
  return toDateKey(now);
}

export function addDaysKey(days: number, now = new Date()): string {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  return toDateKey(date);
}

/** `2026-09-05` → `{ day: 5, month: 9, year: 2026 }` */
export function splitDateKey(key: string): { day: number; month: number; year: number } {
  const [year, month, day] = key.split('-').map(Number);
  return { day, month, year };
}

/** `2026-09-05` → `5 sep` */
export function formatShortDate(key: string): string {
  const { day, month } = splitDateKey(key);
  return `${day} ${MONTHS_SHORT[month - 1]}`;
}

/** `2026-09-05` → `sábado, 5 de septiembre de 2026` */
export function formatFullDate(key: string): string {
  const { day, month, year } = splitDateKey(key);
  const weekday = WEEKDAYS_FULL[new Date(year, month - 1, day).getDay()];
  return `${weekday}, ${day} de ${MONTHS_FULL[month - 1]} de ${year}`;
}

export function todayLiteral(now = new Date()): string {
  const { day, month, year } = splitDateKey(toDateKey(now));
  const weekday = WEEKDAYS_FULL[now.getDay()];
  return `${weekday}, ${day} de ${MONTHS_FULL[month - 1]} de ${year}`;
}

export type DueKind = 'none' | 'overdue' | 'today' | 'tomorrow' | 'upcoming';

export interface DueInfo {
  kind: DueKind;
  label: string;
}

/**
 * Friendly human label for a due date:
 *  - overdue (not completed): `Vencida · 5 sep`
 *  - today: `Hoy`
 *  - tomorrow: `Mañana`
 *  - otherwise: `12 sep`
 */
export function getDueInfo(task: Pick<Task, 'dueDate' | 'completed'>): DueInfo {
  if (!task.dueDate) {
    return { kind: 'none', label: 'Sin fecha' };
  }
  const today = todayKey();
  if (task.dueDate < today) {
    return { kind: 'overdue', label: `Vencida · ${formatShortDate(task.dueDate)}` };
  }
  if (task.dueDate === today) {
    return { kind: 'today', label: 'Hoy' };
  }
  if (task.dueDate === addDaysKey(1)) {
    return { kind: 'tomorrow', label: 'Mañana' };
  }
  return { kind: 'upcoming', label: formatShortDate(task.dueDate) };
}

export function compareKeys(a: string | null, b: string | null): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a < b ? -1 : 1;
}