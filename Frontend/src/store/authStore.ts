/**
 * Zustand auth store.
 * Holds authenticated user state: user info, role, isAuthenticated.
 * Access token is in HttpOnly cookie (not accessible via JS per A-02).
 * @see LLD Section 7.4, Section 9
 */
import { create } from 'zustand';

export type UserRole = 'ADMIN' | 'USER' | 'GUEST';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user: AuthUser) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
