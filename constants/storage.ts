export const STORAGE_KEYS = {
  // Keep the same storage key for tasks: the zustand version bump below
  // triggers the migration instead of silently dropping existing data.
  tasks: 'tasks-storage-v1',
  categories: 'categories-storage-v1',
  settings: 'settings-storage-v1',
} as const;