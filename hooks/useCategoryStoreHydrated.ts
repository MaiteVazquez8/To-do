import { useEffect, useState } from 'react';

import { useCategoryStore } from '@/store/categoryStore';

/**
 * Returns true once the persisted category state has been read from
 * AsyncStorage. Mirrors useTaskStoreHydrated.
 */
export function useCategoryStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useCategoryStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useCategoryStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    return unsubscribe;
  }, []);

  return hydrated;
}