import { PRIORITY_RANK } from '@/constants/priorities';
import type { SortKey } from '@/types/sort';
import type { Task } from '@/types/task';
import { compareKeys } from './date';

/** Applies the selected sort to a task list. Manual uses the persisted order. */
export function sortTasks(tasks: Task[], sortBy: SortKey, order: string[]): Task[] {
  const list = [...tasks];
  const orderIndex = new Map(order.map((id, index) => [id, index]));
  const byNewest = (a: Task, b: Task) => b.createdAt.localeCompare(a.createdAt);

  switch (sortBy) {
    case 'manual':
      list.sort((a, b) => {
        const ia = orderIndex.get(a.id);
        const ib = orderIndex.get(b.id);
        if (ia !== undefined && ib !== undefined) return ia - ib;
        if (ia !== undefined) return -1;
        if (ib !== undefined) return 1;
        return byNewest(a, b);
      });
      break;
    case 'newest':
      list.sort(byNewest);
      break;
    case 'oldest':
      list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      break;
    case 'priority':
      list.sort(
        (a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] || byNewest(a, b)
      );
      break;
    case 'dueDate':
      list.sort(
        (a, b) =>
          compareKeys(a.dueDate, b.dueDate) ||
          PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] ||
          byNewest(a, b)
      );
      break;
    case 'alphabetical': {
      const normalize = (value: Task) => value.title.trim().toLowerCase();
      list.sort(
        (a, b) => normalize(a).localeCompare(normalize(b), 'es') || byNewest(a, b)
      );
      break;
    }
    case 'pendingFirst':
      list.sort(
        (a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0) || byNewest(a, b)
      );
      break;
    case 'completedFirst':
      list.sort(
        (a, b) => (b.completed ? 1 : 0) - (a.completed ? 1 : 0) || byNewest(a, b)
      );
      break;
  }

  return list;
}