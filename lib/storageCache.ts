export const STORAGE_CACHE_KEYS = {
  products: "products",
  orders: "orders",
  users: "users",
} as const;

const cache = new Map<string, unknown>();

export function getStorageCache<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

export function setStorageCache<T>(key: string, value: T): void {
  cache.set(key, value);
}

export function invalidateStorageCache(key: string): void {
  cache.delete(key);
}
