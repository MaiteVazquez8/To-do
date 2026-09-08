import type { Task } from '@/types/task';
import { addDaysKey, todayKey } from './date';

export type SectionKey =
  | 'overdue'
  | 'today'
  | 'tomorrow'
  | 'upcoming'
  | 'noDate'
  | 'completed';

export interface TaskSection {
  key: SectionKey;
  title: string;
  count: number;
  tasks: Task[];
}

/**
 * Splits a task list into date-based visual sections. Every task lands in
 * exactly one section so nothing is ever duplicated.
 */
export function buildSections(
  tasks: Task[],
  titles: Record<SectionKey, string>
): TaskSection[] {
  const today = todayKey();
  const tomorrow = addDaysKey(1);
  const buckets: Record<SectionKey, Task[]> = {
    overdue: [],
    today: [],
    tomorrow: [],
    upcoming: [],
    noDate: [],
    completed: [],
  };

  for (const task of tasks) {
    if (task.completed) {
      buckets.completed.push(task);
    } else if (!task.dueDate) {
      buckets.noDate.push(task);
    } else if (task.dueDate < today) {
      buckets.overdue.push(task);
    } else if (task.dueDate === today) {
      buckets.today.push(task);
    } else if (task.dueDate === tomorrow) {
      buckets.tomorrow.push(task);
    } else {
      buckets.upcoming.push(task);
    }
  }

  const order: SectionKey[] = ['overdue', 'today', 'tomorrow', 'upcoming', 'noDate', 'completed'];
  return order
    .map((key) => ({
      key,
      title: titles[key],
      count: buckets[key].length,
      tasks: buckets[key],
    }))
    .filter((section) => section.count > 0);
}