import { getProducts } from "./storage";

export const DEFAULT_CATEGORIES = [
  "Classique",
  "Sucrée",
  "Épicée",
  "Premium",
  "Bio",
];

export function getCategories(): string[] {
  const fromProducts = getProducts()
    .map((p) => p.category.trim())
    .filter(Boolean);

  const unique = new Set([...DEFAULT_CATEGORIES, ...fromProducts]);
  return Array.from(unique).sort((a, b) => a.localeCompare(b, "fr"));
}
