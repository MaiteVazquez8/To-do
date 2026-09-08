import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/storage';
import type { SortKey } from '@/types/sort';

interface SettingsState {
  sortBy: SortKey;
  setSortBy: (sortBy: SortKey) => void;
}

type SettingsPersistedState = Pick<SettingsState, 'sortBy'>;

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      sortBy: 'manual',
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): SettingsPersistedState => ({ sortBy: state.sortBy }),
      version: 1,
    }
  )
);

export type { SettingsPersistedState };