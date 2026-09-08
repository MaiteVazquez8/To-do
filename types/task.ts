/**
 * Core task model. New fields were added without breaking persisted data:
 * the task store ships a migration that fills sensible defaults for tasks
 * created before description/category/priority/dueDate existed.
 */
export type Priority = 'none' | 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  categoryId: string | null;
  priority: Priority;
  /** Local date as `YYYY-MM-DD`, or null when there is no due date. */
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  categoryId?: string | null;
  priority?: Priority;
  dueDate?: string | null;
}

export type TaskUpdates = Partial<
  Pick<Task, 'title' | 'description' | 'completed' | 'categoryId' | 'priority' | 'dueDate'>
>;