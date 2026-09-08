import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/storage';
import type { Priority, Task, TaskInput, TaskUpdates } from '@/types/task';
import { createId } from '@/utils/id';
import { nowISO } from '@/utils/time';

const EMPTY_TIME = new Date(0).toISOString();
const PRIORITIES: Priority[] = ['none', 'low', 'medium', 'high'];

interface TaskState {
  tasks: Task[];
  /** Manual ordering: a list of task ids. Genesis order = stored order. */
  order: string[];
  addTask: (input: TaskInput) => Task;
  updateTask: (id: string, updates: TaskUpdates) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearCompleted: () => void;
  unassignCategory: (categoryId: string) => void;
  reorderTasks: (fromIndex: number, toIndex: number) => void;
}

type TaskPersistedState = Pick<TaskState, 'tasks' | 'order'>;

interface LegacyTask {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  completed?: unknown;
  categoryId?: unknown;
  priority?: unknown;
  dueDate?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
}

function normalizeTask(raw: LegacyTask, index: number): Task {
  return {
    id: typeof raw.id === 'string' ? raw.id : `migrated-${index}-${Date.now()}`,
    title: typeof raw.title === 'string' ? raw.title : '',
    description: typeof raw.description === 'string' ? raw.description : '',
    completed: Boolean(raw.completed),
    categoryId: typeof raw.categoryId === 'string' ? raw.categoryId : null,
    priority:
      typeof raw.priority === 'string' && PRIORITIES.includes(raw.priority as Priority)
        ? (raw.priority as Priority)
        : 'none',
    dueDate:
      typeof raw.dueDate === 'string' && raw.dueDate.length > 0 ? raw.dueDate : null,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : EMPTY_TIME,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : EMPTY_TIME,
  };
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      order: [],

      addTask: (input) => {
        const trimmed = input.title.trim();
        if (trimmed.length === 0) {
          throw new Error('El título de la tarea no puede estar vacío.');
        }
        const timestamp = nowISO();
        const task: Task = {
          id: createId(),
          title: trimmed,
          description: input.description?.trim() ?? '',
          completed: false,
          categoryId: input.categoryId ?? null,
          priority: input.priority ?? 'none',
          dueDate: input.dueDate ?? null,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({
          tasks: [task, ...state.tasks],
          order: [task.id, ...state.order],
        }));
        return task;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates, updatedAt: nowISO() } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          order: state.order.filter((taskId) => taskId !== id),
        }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: nowISO() }
              : task
          ),
        }));
      },

      clearCompleted: () => {
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
          order: state.order.filter((id) => {
            const task = state.tasks.find((t) => t.id === id);
            return task ? !task.completed : true;
          }),
        }));
      },

      unassignCategory: (categoryId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.categoryId === categoryId ? { ...task, categoryId: null } : task
          ),
        }));
      },

      reorderTasks: (fromIndex, toIndex) => {
        const { order } = get();
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
        if (fromIndex >= order.length || toIndex >= order.length) return;
        const next = [...order];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        set({ order: next });
      },
    }),
    {
      name: STORAGE_KEYS.tasks,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): TaskPersistedState => ({ tasks: state.tasks, order: state.order }),
      version: 2,
      migrate: (persisted) => {
        const base = (persisted ?? {}) as { tasks?: LegacyTask[] };
        const legacy = Array.isArray(base.tasks) ? base.tasks : [];
        const tasks = legacy.map(normalizeTask);
        return { tasks, order: tasks.map((task) => task.id) };
      },
    }
  )
);

export type { TaskPersistedState };