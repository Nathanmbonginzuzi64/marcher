"use client";

import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { setStorageCache, STORAGE_CACHE_KEYS } from "@/lib/storageCache";
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
  const pathname = usePathname();
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);

  const refreshFromStorage = useCallback(() => {
    const data = loaderRef.current();
    setStorageCache(cacheKey, data);
    setValue(data);
    return data;
  }, [cacheKey]);

  useLayoutEffect(() => {
    refreshFromStorage();
    setReady(true);
  }, [cacheKey, pathname, refreshFromStorage]);

  useEffect(() => {
    const event = CACHE_EVENT_MAP[cacheKey];
    if (!event) return;

    const onStorageUpdate = () => {
      refreshFromStorage();
    };

    window.addEventListener(event, onStorageUpdate);
    return () => window.removeEventListener(event, onStorageUpdate);
  }, [cacheKey, refreshFromStorage]);

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
