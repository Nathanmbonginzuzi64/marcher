"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { getStorageCache, setStorageCache, STORAGE_CACHE_KEYS } from "@/lib/storageCache";
import { STORAGE_EVENTS } from "@/lib/storageEvents";

const CACHE_EVENT_MAP: Record<string, string> = {
  [STORAGE_CACHE_KEYS.products]: STORAGE_EVENTS.products,
  [STORAGE_CACHE_KEYS.orders]: STORAGE_EVENTS.orders,
  [STORAGE_CACHE_KEYS.users]: STORAGE_EVENTS.users,
};

export function useStorageState<T>(
  loader: () => T,
  fallback: T,
  cacheKey: string
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const cached = getStorageCache<T>(cacheKey);
    if (cached !== undefined) {
      setValue(cached);
    } else {
      const data = loader();
      setStorageCache(cacheKey, data);
      setValue(data);
    }
    setReady(true);
  }, [cacheKey]);

  useEffect(() => {
    const event = CACHE_EVENT_MAP[cacheKey];
    if (!event) return;

    const refresh = () => {
      const data = loader();
      setStorageCache(cacheKey, data);
      setValue(data);
    };

    window.addEventListener(event, refresh);
    return () => window.removeEventListener(event, refresh);
  }, [cacheKey, loader]);

  const updateValue: Dispatch<SetStateAction<T>> = (next) => {
    setValue((prev) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
      setStorageCache(cacheKey, resolved);
      return resolved;
    });
  };

  return [value, updateValue, ready];
}
