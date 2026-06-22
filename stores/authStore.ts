"use client";

import { create } from "zustand";
import {
  generateId,
  getSession,
  getUsers,
  initializeStorage,
  saveSession,
  saveUsers,
} from "@/lib/storage";
import type { User, UserRole } from "@/lib/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  initialized: boolean;
  init: () => void;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (
    name: string,
    email: string,
    password: string
  ) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  initialized: false,

  init: () => {
    initializeStorage();
    const session = getSession();
    if (session) {
      const users = getUsers();
      const user = users.find((u) => u.id === session.userId) ?? null;
      set({ user, initialized: true });
    } else {
      set({ initialized: true });
    }
  },

  login: (email, password) => {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      return { success: false, error: "Email ou mot de passe incorrect" };
    }
    saveSession({ userId: user.id });
    set({ user });
    return { success: true };
  },

  register: (name, email, password) => {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Cet email est déjà utilisé" };
    }
    const role: UserRole = users.length === 0 ? "admin" : "client";
    const newUser: User = {
      id: generateId("user"),
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    saveSession({ userId: newUser.id });
    set({ user: newUser });
    return { success: true };
  },

  logout: () => {
    saveSession(null);
    set({ user: null });
  },
}));
