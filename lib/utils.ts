import { type ClassValue, clsx } from 'clsx';
import { useSyncExternalStore } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const subscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
