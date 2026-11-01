import { useCallback, useState } from 'react';
import axios from '../../services/apiClient';
import { useAuthStore } from '../../store/authStore';

/**
 * useAuth
 * Custom hook for authentication logic.
 * @related US-001
 */
export const useAuth = () => {
    const { setAuthState } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const login = useCallback(async (username: string, password: string) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/v1/auth/login', {
                username,
                password,
            });
            setAuthState({
                user: response.data.user,
                role: response.data.role,
                isAuthenticated: true,
            });
        } finally {
            setLoading(false);
        }
    }, [setAuthState]);

    const logout = useCallback(() => {
        setAuthState({ user: null, role: null, isAuthenticated: false });
    }, [setAuthState]);

    return { login, logout, loading };
};