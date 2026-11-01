import create from 'zustand';

interface AuthState {
    user: null | { id: string; username: string; email: string };
    role: null | 'ADMIN' | 'USER' | 'GUEST';
    isAuthenticated: boolean;
    setAuthState: (authState: Partial<AuthState>) => void;
}

/**
 * authStore
 * Zustand store for managing authentication state.
 * @related US-001
 */
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    isAuthenticated: false,
    setAuthState: (authState) => set((state) => ({ ...state, ...authState })),
}));