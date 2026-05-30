'use client';
import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and the very first client render, then `true`
 * after hydration. Uses `useSyncExternalStore` (server snapshot `false`,
 * client snapshot `true`) so it gates client-only UI without the
 * `set-state-in-effect` cascade that a `useState` + `useEffect` pair triggers.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
