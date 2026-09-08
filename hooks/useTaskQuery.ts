import { useMemo } from 'react';

import { useCategoryStore } from '@/store/categoryStore';
import { useTaskStore } from '@/store/taskStore';
import type { Filter } from '@/types/filter';
import type { SortKey } from '@/types/sort';
import { sortTasks } from '@/utils/sortTasks';

/** `'all'` shows every category, `'uncategorized'` shows only the uncategorized ones,
 * any other string is treated as a category id. */
export type CategoryFilter = 'all' | 'uncategorized' | string;

export const UNCATEGORIZED = 'uncategorized';

/**
 * Single source of truth for the home list: applies status + category filters,
 * matches the search query against title/description/category name and returns
 * the tasks in the selected order.
 */
export function useTaskQuery(options: {
  status: Filter;
  categoryFilter: CategoryFilter;
  search: string;
  sortBy: SortKey;
  date: string | null;
}) {
  const { status, categoryFilter, search, sortBy, date } = options;
  const tasks = useTaskStore((state) => state.tasks);
  const order = useTaskStore((state) => state.order);
  const categories = useCategoryStore((state) => state.categories);

  return useMemo(() => {
    const query = search.trim().toLowerCase();
    const categoryNames = new Map(
      categories.map((category) => [category.id, category.name.toLowerCase()])
    );

    const filtered = tasks.filter((task) => {
      if (status === 'active' && task.completed) return false;
      if (status === 'completed' && !task.completed) return false;

      if (date !== null && task.dueDate !== date) return false;

      if (categoryFilter === UNCATEGORIZED) {
        if (task.categoryId !== null) return false;
      } else if (categoryFilter !== 'all') {
        if (task.categoryId !== categoryFilter) return false;
      }

      if (query.length > 0) {
        const inTitle = task.title.toLowerCase().includes(query);
        const inDescription = task.description.toLowerCase().includes(query);
        const inCategory = task.categoryId
          ? (categoryNames.get(task.categoryId) ?? '').includes(query)
          : false;
        if (!inTitle && !inDescription && !inCategory) return false;
      }

      return true;
    });

    return { tasks: sortTasks(filtered, sortBy, order), total: tasks.length };
  }, [tasks, order, categories, status, categoryFilter, search, sortBy, date]);
}