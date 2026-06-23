import type { Order, Product, User } from "./types";

export const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Bouillie Maïs Nature",
    description:
      "Bouillie traditionnelle à base de maïs, douce et nourrissante. Parfaite pour le petit-déjeuner.",
    price: 4.99,
    image:
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=400&fit=crop",
    stock: 45,
    category: "Classique",
  },
  {
    id: "prod-2",
    name: "Bouillie Mil Sucrée",
    description:
      "Bouillie de mil enrichie au lait et sucre de canne. Saveur authentique du Sahel.",
    price: 5.99,
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    stock: 32,
    category: "Sucrée",
  },
  {
    id: "prod-3",
    name: "Bouillie Sorgho Épicée",
    description:
      "Mélange de sorgho et épices locales pour les amateurs de saveurs intenses.",
    price: 5.49,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
    stock: 18,
    category: "Épicée",
  },
  {
    id: "prod-4",
    name: "Bouillie Riz Coco",
    description:
      "Riz crémeux au lait de coco, une touche tropicale pour vos matinées.",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop",
    stock: 27,
    category: "Premium",
  },
  {
    id: "prod-5",
    name: "Bouillie Avoine Miel",
    description:
      "Avoine complète avec miel local et fruits secs. Riche en fibres.",
    price: 6.49,
    image:
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=400&fit=crop",
    stock: 40,
    category: "Premium",
  },
  {
    id: "prod-6",
    name: "Bouillie Fonio Bio",
    description:
      "Fonio biologique, céréale ancestrale africaine, légère et digeste.",
    price: 7.99,
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    stock: 15,
    category: "Bio",
  },
];

export const SEED_ADMIN: User = {
  id: "user-admin",
  name: "Admin",
  email: "admin@bouillie.com",
  password: "admin123",
  role: "admin",
  createdAt: new Date("2025-01-01").toISOString(),
};

export const SEED_CLIENTS: User[] = [
  {
    id: "user-1",
    name: "Fatou Diallo",
    email: "fatou@email.com",
    password: "client123",
    role: "client",
    createdAt: new Date("2026-03-15").toISOString(),
  },
  {
    id: "user-2",
    name: "Moussa Koné",
    email: "moussa@email.com",
    password: "client123",
    role: "client",
    createdAt: new Date("2026-04-02").toISOString(),
  },
  {
    id: "user-3",
    name: "Aïcha Traoré",
    email: "aicha@email.com",
    password: "client123",
    role: "client",
    createdAt: new Date("2026-05-10").toISOString(),
  },
];

export const SEED_ORDERS: Order[] = [
  {
    id: "CMD-00128",
    userId: "user-1",
    userName: "Fatou Diallo",
    items: [
      {
        productId: "prod-1",
        name: "Bouillie Maïs Nature",
        price: 4.99,
        quantity: 2,
        image: SEED_PRODUCTS[0].image,
      },
    ],
    total: 9.98,
    status: "delivered",
    createdAt: new Date("2026-06-20T10:30:00").toISOString(),
  },
  {
    id: "CMD-00127",
    userId: "user-2",
    userName: "Moussa Koné",
    items: [
      {
        productId: "prod-2",
        name: "Bouillie Mil Sucrée",
        price: 5.99,
        quantity: 1,
        image: SEED_PRODUCTS[1].image,
      },
      {
        productId: "prod-4",
        name: "Bouillie Riz Coco",
        price: 6.99,
        quantity: 1,
        image: SEED_PRODUCTS[3].image,
      },
    ],
    total: 12.98,
    status: "preparing",
    createdAt: new Date("2026-06-21T14:15:00").toISOString(),
  },
  {
    id: "CMD-00126",
    userId: "user-3",
    userName: "Aïcha Traoré",
    items: [
      {
        productId: "prod-3",
        name: "Bouillie Sorgho Épicée",
        price: 5.49,
        quantity: 3,
        image: SEED_PRODUCTS[2].image,
      },
    ],
    total: 16.47,
    status: "delivering",
    createdAt: new Date("2026-06-21T16:45:00").toISOString(),
  },
  {
    id: "CMD-00125",
    userId: "user-1",
    userName: "Fatou Diallo",
    items: [
      {
        productId: "prod-5",
        name: "Bouillie Avoine Miel",
        price: 6.49,
        quantity: 1,
        image: SEED_PRODUCTS[4].image,
      },
    ],
    total: 6.49,
    status: "cancelled",
    createdAt: new Date("2026-06-19T09:00:00").toISOString(),
  },
];
