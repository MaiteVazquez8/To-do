import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/storage';
import type { Category, CategoryUpdates } from '@/types/category';
import { createId } from '@/utils/id';
import { nowISO } from '@/utils/time';
import { useTaskStore } from './taskStore';

interface CategoryState {
  categories: Category[];
  addCategory: (name: string, color: string) => Category;
  updateCategory: (id: string, updates: CategoryUpdates) => void;
  deleteCategory: (id: string) => void;
}

type CategoryPersistedState = Pick<CategoryState, 'categories'>;

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],

      addCategory: (name, color) => {
        const trimmed = name.trim();
        if (trimmed.length === 0) {
          throw new Error('El nombre de la categoría no puede estar vacío.');
        }
        const category: Category = {
          id: createId(),
          name: trimmed,
          color,
          createdAt: nowISO(),
        };
        set((state) => ({ categories: [...state.categories, category] }));
        return category;
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
        // Deleting a category never deletes its tasks: they are left without
        // a category instead.
        useTaskStore.getState().unassignCategory(id);
      },
    }),
    {
      name: STORAGE_KEYS.categories,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): CategoryPersistedState => ({ categories: state.categories }),
      version: 1,
    }
  )
);

export type { CategoryPersistedState };