export const STORAGE_EVENTS = {
  products: "products-updated",
  orders: "orders-updated",
  users: "users-updated",
} as const;

export function dispatchStorageEvent(event: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(event));
}
