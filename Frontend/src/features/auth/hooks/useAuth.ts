/**
 * useAuth hook.
 * Provides auth state and login/logout actions.
 * @see US-001
 */
import { useAuthStore } from '../../../store/authStore';
import { useNotificationStore } from '../../../store/notificationStore';
import { login as loginApi, logout as logoutApi } from '../../../services/authService';
import type { LoginRequest } from '../types/auth.types';
import { getErrorMessage } from '../../../utils/errorUtils';

export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const login = async (request: LoginRequest): Promise<boolean> => {
    try {
      const response = await loginApi(request);
      setAuth({
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
      });
      return true;
    } catch (error) {
      addNotification('error', getErrorMessage(error));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutApi();
    } finally {
      clearAuth();
    }
  };

  return { user, isAuthenticated, login, logout };
}
