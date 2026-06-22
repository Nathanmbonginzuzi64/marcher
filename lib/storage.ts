import {
  SEED_ADMIN,
  SEED_CLIENTS,
  SEED_ORDERS,
  SEED_PRODUCTS,
} from "./seed";
import type {
  CartItem,
  Order,
  Product,
  Session,
  User,
} from "./types";

const DATA_VERSION = "2-usd";

const KEYS = {
  users: "bouillie_users",
  products: "bouillie_products",
  orders: "bouillie_orders",
  session: "bouillie_session",
  initialized: "bouillie_initialized",
  dataVersion: "bouillie_data_version",
  cart: (userId: string) => `bouillie_cart_${userId}`,
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function addOrder(order: Order): boolean {
  try {
    saveOrders([order, ...getOrders()]);
    if (isBrowser()) {
      window.dispatchEvent(new Event("orders-updated"));
    }
    return true;
  } catch {
    return false;
  }
}

export function initializeStorage(): void {
  if (!isBrowser()) return;

  const currentVersion = localStorage.getItem(KEYS.dataVersion);
  if (currentVersion !== DATA_VERSION) {
    saveUsers([SEED_ADMIN, ...SEED_CLIENTS]);
    saveProducts(SEED_PRODUCTS);
    saveOrders(SEED_ORDERS);
    localStorage.setItem(KEYS.initialized, "true");
    localStorage.setItem(KEYS.dataVersion, DATA_VERSION);
    return;
  }

  if (localStorage.getItem(KEYS.initialized)) return;

  saveUsers([SEED_ADMIN, ...SEED_CLIENTS]);
  saveProducts(SEED_PRODUCTS);
  saveOrders(SEED_ORDERS);
  localStorage.setItem(KEYS.initialized, "true");
  localStorage.setItem(KEYS.dataVersion, DATA_VERSION);
}

export function getUsers(): User[] {
  return read<User[]>(KEYS.users, []);
}

export function saveUsers(users: User[]): void {
  write(KEYS.users, users);
}

export function getProducts(): Product[] {
  return read<Product[]>(KEYS.products, []);
}

export function saveProducts(products: Product[]): void {
  write(KEYS.products, products);
}

export function getOrders(): Order[] {
  return read<Order[]>(KEYS.orders, []);
}

export function saveOrders(orders: Order[]): void {
  write(KEYS.orders, orders);
}

export function getSession(): Session | null {
  return read<Session | null>(KEYS.session, null);
}

export function saveSession(session: Session | null): void {
  if (session) {
    write(KEYS.session, session);
  } else if (isBrowser()) {
    localStorage.removeItem(KEYS.session);
  }
}

export function getCartKey(userId?: string | null): string {
  return KEYS.cart(userId ?? "guest");
}

export function getCart(userId?: string | null): CartItem[] {
  return read<CartItem[]>(getCartKey(userId), []);
}

export function saveCart(cart: CartItem[], userId?: string | null): void {
  write(getCartKey(userId), cart);
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
