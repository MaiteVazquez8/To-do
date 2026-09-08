import { useEffect, useState } from 'react';

import { useTaskStore } from '@/store/taskStore';

/**
 * Returns true once the persisted task state has been read from AsyncStorage.
 * The UI should gate list rendering on this so it never flashes a wrong
 * empty state before hydration completes.
 */
export function useTaskStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useTaskStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useTaskStore.persist.onFinishHydration(() => setHydrated(true));
    return unsubscribe;
  }, []);

  return hydrated;
}